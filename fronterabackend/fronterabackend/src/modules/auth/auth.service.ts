import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { passwordResetLink, signUpDTO } from "src/dto/users/userSIgnUp.dto";
import { ConfigService } from "src/shared/services/config/config.service";
import { QueryService } from "src/shared/services/query/query.service";
import * as bcrypt from "bcryptjs";
import { EmailService } from "src/shared/services/email/email.service";
import { resetPasswordDTO } from "src/dto/users/userSignIn.dto";
import { getManager } from "typeorm";
@Injectable()
export class AuthService {
  constructor(
    private db: QueryService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async signUpUser(data: signUpDTO, hash: string) {
    return this.db.insertUpdatDelete(
      "call sp_auth_signup_user(?)",
      [[data.name, data.email, hash]],
      true
    );
  }

  async findOne(email: string) {
    let userNameExists = await this.db.selectSingle(
      "select * from users where email=?",
      [email]
    );
    if (userNameExists) return userNameExists;
    else return false;
  }

  async returnUserWithToken(userEntity, request) {
    if (typeof userEntity == "object") {
      const token = await this.createToken(userEntity, request);
      userEntity = token;
    }
    return userEntity;
  }

  async createToken(user, request): Promise<any> {
    return {
      expiresIn: this.configService.get("JWT_EXPIRATION_TIME"),
      accessToken: await this.jwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async validateUser(userLoginDto): Promise<any> {
    let { email, password } = userLoginDto;
    const user: any = await this.findOne(email);
    if (typeof user == "string") return user;
    if (Object.values(user).every((x) => x === null)) {
      return "invalid email/password";
    }
    const isPasswordValid = await bcrypt.compareSync(password, user.password);

    if (!user || !isPasswordValid) {
      return "Invalid user email or password";
    }
    return user;
  }

  async generatePasswordLink(userEmail: string, request): Promise<any> {
    try {
        const resetUrl = this.getRandomString(20);
        let emailResult;
        userEmail = userEmail.toLowerCase();
        let userUpdated = await this.db.selectSingle("select * from users where email=?", [userEmail]);

        if (userUpdated && userUpdated.id) {
            let data: passwordResetLink = new passwordResetLink();
            data.recieverEmail = userEmail;
            data.resetUrl = resetUrl;
            data.recieverName = userUpdated.legalName;

            await this.db.insertUpdatDelete("update users set passwordResetToken=? where email=?", [resetUrl, data.recieverEmail]);
            emailResult = await this.emailService.generatePasswordLink(data);

            return { success: true, data: emailResult };
        } else {
            return { success: false, exception: "Invalid user email!", data: {} };
        }
    } catch (error) {
        console.error(error);
        return { success: false, exception: error.message, data: {} };
    }
}


  async updatePassword(formData: resetPasswordDTO, hashedPassword, req) {
    let result = await getManager().transaction(
      async (transactionalEntityManager) => {
        const userInfo = await transactionalEntityManager.query(
          "SELECT * from users where passwordResetToken=?",
          [formData.token]
        );
        if (userInfo && userInfo[0]) {
          await transactionalEntityManager.query(
            "UPDATE users SET password=? where id=?",
            [hashedPassword, userInfo[0].id]
          );
          return { message: "Password Updated Successfully" };
        } else {
          return "Incorrect token!";
        }
      }
    );
    return result;
  }

  getRandomString(length) {
    var randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }
}

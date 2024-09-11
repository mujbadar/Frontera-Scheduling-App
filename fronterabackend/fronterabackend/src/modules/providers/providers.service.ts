import { Injectable } from "@nestjs/common";
import {
  addProviderDTO,
  availabilityTimings,
} from "src/dto/provider/addProvider";
import { QueryService } from "src/shared/services/query/query.service";
import { getManager } from "typeorm";
import * as bcrypt from "bcryptjs";
import { ProviderListingFilter } from "src/dto/provider/providerListingFilter";
import { MedicalCalender } from "src/dto/medical-center/calender-details";
import * as XLSX from "xlsx";
import { passwordResetLink, signUpEmail } from "src/dto/users/userSIgnUp.dto";
import { EmailService } from "src/shared/services/email/email.service";
@Injectable()
export class ProvidersService {
  constructor(private _db: QueryService, private emailService: EmailService) {}

  async addProvider(providerInfo: addProviderDTO, req) {
    try {
      let password = "P@ssw0rd!";
      let hashedPassword = bcrypt.hashSync(password, 10);
      let result = await getManager().transaction(
        async (transactionalEntityManager) => {
          let providerExists = await transactionalEntityManager.query(
            "SELECT * FROM users where email=?",
            [providerInfo.email]
          );
          if (providerExists && providerExists.length && providerExists[0] && providerExists[0].id) {
            return "Provider with identical email already exists";
          } else {
            let provider = await transactionalEntityManager.query(
              "call sp_pro_add_provider(?)",
              [
                [
                  providerInfo.name,
                  providerInfo.email,
                  hashedPassword,
                  providerInfo.contact,
                  providerInfo.specializationID,
                  providerInfo.medicalCenterID,
                  providerInfo.preferrRoomID ? providerInfo.preferrRoomID : null,
                  null,
                ],
              ]
            );
            if (provider[0] && provider[0][0] && provider[0][0].id) {
              for (let i = 0; i < providerInfo.availability.length; i++) {
                let availability: availabilityTimings =
                  providerInfo.availability[i];
                await transactionalEntityManager.query(
                  `call sp_pro_add_availability(?)`,
                  [
                    [
                      provider[0][0].id,
                      availability.shiftType,
                      availability.shiftFromTime,
                      availability.shiftToTime,
                      false,
                    ],
                  ]
                );
              }
              // if (providerInfo.email) {
              //   let data: signUpEmail = new signUpEmail();
              //   data.recieverEmail = providerInfo.email;
              //   data.recieverName = providerInfo.name;
              //   data.password = password;
              //   await this.emailService.sendPassword(data);
              // }
              return { message: "Successfully added provider." };
            }
          }

          return "";
        }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async updateProvider(providerInfo: addProviderDTO, providerID, req) {
    let result = await getManager().transaction(
      async (transactionalEntityManager) => {
        let providerExists = await transactionalEntityManager.query(
          "SELECT * FROM users where email=? and id!=?",
          [providerInfo.email, providerID]
        );
        if (providerExists && providerExists.length && providerExists[0].id) {
          return "Provider with identical email already exists";
        } else {
          let provider = await transactionalEntityManager.query(
            "call sp_pro_add_provider(?)",
            [
              [
                providerInfo.name,
                providerInfo.email,
                null,
                providerInfo.contact,
                providerInfo.specializationID,
                providerInfo.medicalCenterID,
                providerInfo.preferrRoomID ? providerInfo.preferrRoomID:null,
                providerID,
              ],
            ]
          );
          for (let i = 0; i < providerInfo.availability.length; i++) {
            let availability: availabilityTimings =
              providerInfo.availability[i];
            await transactionalEntityManager.query(
              `call sp_pro_add_availability(?)`,
              [
                [
                  providerID,
                  availability.shiftType,
                  availability.shiftFromTime,
                  availability.shiftToTime,
                  true,
                ],
              ]
            );
          }
          return { message: "Successfully updated provider." };
        }
      }
    );

    return result;
  }

  async deleteProvider(providerID, req) {
    if (req.user.role == "ADMIN") {
      let result = await getManager().transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.query(
            "delete from  appointments where providerID=?",
            [providerID]
          );
          await transactionalEntityManager.query(
            "delete from `provider-availability` where providerID=?",
            [providerID]
          );
          await transactionalEntityManager.query(
            "delete from `users` where id=?",
            [providerID]
          );
          return true;
        }
      );
      if (result)
        return {
          message:
            "Successfully deleted provider and its associated appointments",
        };
    } else {
      return "Access denied";
    }
  }

  async getProviderListing(req, params: ProviderListingFilter) {
    let listing = await this._db.select(
      "call sp_pro_get_listing(?)",
      [[params.region, params.page, params.limit]],
      true
    );
    let listingCount = await this._db.select(
      "call sp_pro_get_listing_count(?)",
      [[params.region]],
      true
    );
    return { listing, listingCount };
  }

  async getProviderInfo(providerID, req) {
    return await this._db.select(
      "call sp_pro_get_provider_info(?)",
      [providerID],
      true
    );
  }

  async getProviderCalender(providerID,req, params: MedicalCalender) {
    return await this._db.select(
      "call sp_pro_get_provider_calender(?)",
      [[providerID, params.month]],
      true
    );
  }

  async getProviderCalenderMonthListing(
    providerID,
    req,
    params: MedicalCalender
  ) {
    return await this._db.select(
      "call sp_pro_get_provider_calender_list(?)",
      [[providerID, params.month]],
      true
    );
  }

  async getSpezializations(req) {
    return await this._db.select("SELECT * FROM `room-types`;", []);
  }

  async getMedicalCenters(req) {
    return await this._db.select("SELECT * FROM `medical-centers`;", []);
  }

  async getRooms(medicalCenterID, req) {
    return await this._db.select(
      "select * from `medical-center-rooms` where medicalCenterID=?;",
      [medicalCenterID]
    );
  }

  async roomOfMedAndSpeclization(medicalCenterID, specializationID, req) {
    return await this._db.select(
      "select * from `medical-center-rooms` where medicalCenterID=? AND roomTypeID=?;",
      [medicalCenterID, specializationID]
    );
  }

  async importCsvData(buffer) {
    let password = "P@ssw0rd!";
    let hashedPassword = bcrypt.hashSync(password, 10);
    let providerList = this.parseSheetFromBuffer(buffer, 0);
    let count = 0;
    if (providerList) {
      for (let i = 0; i < providerList.length; i++) {
        let providerInfo = providerList[i];
        await getManager().transaction(async (transactionalEntityManager) => {
          let checkIfProviderExists = await transactionalEntityManager.query(
            "SELECT * FROM users where email=?",
            [providerInfo["Email"]]
          );
          if (checkIfProviderExists && checkIfProviderExists.length == 0) {
            let medicalCenterInfo = await transactionalEntityManager.query(
              "SELECT * from  `medical-centers` where LOWER(name)=?",
              [providerInfo["Medical Center"].toLowerCase()]
            );
            if (
              medicalCenterInfo &&
              medicalCenterInfo[0] &&
              medicalCenterInfo[0].id
            ) {
              medicalCenterInfo = medicalCenterInfo[0];
              let roomTypeInfo = await transactionalEntityManager.query(
                "SELECT * FROM  `room-types` where LOWER(name)=?",
                [providerInfo["Specialization"]]
              );
              if (roomTypeInfo && roomTypeInfo.length) {
                roomTypeInfo = roomTypeInfo[0];
                let roomInfo = await transactionalEntityManager.query(
                  "SELECT * FROM  `medical-center-rooms` where medicalCenterID=? AND roomTypeID=? AND name=?",
                  [medicalCenterInfo.id, roomTypeInfo.id,providerInfo["Room Name"]]
                );
                let provider = await transactionalEntityManager.query(
                  "call sp_pro_add_provider(?);",
                  [
                    [
                      providerInfo["Provider Name"],
                      providerInfo["Email"],
                      hashedPassword,
                      providerInfo["Contact"],
                      roomTypeInfo.id,
                      medicalCenterInfo.id,
                      roomInfo && roomInfo.length ? roomInfo[0].id : null,
                      null,
                    ],
                  ]
                );
                if (provider[0] && provider[0][0] && provider[0][0].id) {
                  await transactionalEntityManager.query(
                    "call sp_pro_add_availability(?)",
                    [
                      [
                        provider[0][0].id,
                        "FULL",
                        providerInfo["Full Shift Start"],
                        providerInfo["Full Shift End"],
                        false,
                      ],
                    ]
                  );
                  await transactionalEntityManager.query(
                    "call sp_pro_add_availability(?)",
                    [
                      [
                        provider[0][0].id,
                        "MORNING",
                        providerInfo["Morning Shift Start"],
                        providerInfo["Morning Shift End"],
                        false,
                      ],
                    ]
                  );
                  await transactionalEntityManager.query(
                    "call sp_pro_add_availability(?)",
                    [
                      [
                        provider[0][0].id,
                        "AFTERNOON",
                        providerInfo["Evening Shift Start"],
                        providerInfo["Evening Shift End"],
                        false,
                      ],
                    ]
                  );
                  count++;
                }
                
              }
            }
          }
        });
      }
      return { message: `${count} Providers have been added successfully!` };
    } else {
      return null;
    }
  }

  excelTimeToHHMM(excelTime) {
    const totalMinutes = Math.floor(excelTime * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  parseSheetFromBuffer(buffer, sheetNumber = 0) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    if (sheetNumber < 0 || sheetNumber >= workbook.SheetNames.length) {
      console.error("Sheet number is out of bounds");
      return null;
    }
    const sheetName = workbook.SheetNames[sheetNumber];
    const worksheet = workbook.Sheets[sheetName];
    let json = XLSX.utils.sheet_to_json(worksheet);
    json = json.map((row) => {
      Object.keys(row).forEach((key) => {
        if (key.includes("Shift")) {
          row[key] = this.excelTimeToHHMM(row[key]);
        }
      });
      return row;
    });

    return json;
  }
}

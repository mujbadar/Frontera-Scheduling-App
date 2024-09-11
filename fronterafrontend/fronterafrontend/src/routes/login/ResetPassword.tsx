import { useMutation } from "@tanstack/react-query";
import ValidationError from "../../../components/validation-error";
import { FormEvent, useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/ui/use-toast";
import { httpAuth } from "../../helper/httpCommon";
import Message from "../../../components/toasts";

type Props = {};

function ResetPassword({}: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    passwords?: string | null;
    server?: string | null;
  } | null>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const params = useParams();
  const token = params.token;

  const { status, mutate } = useMutation({
    mutationFn: async () =>
      await httpAuth.post("auth/updatePassword", {
        token,
        password: passwords.password,
      }),
    mutationKey: ["reset-password"],
    onSuccess(data) {
      if (data?.data.success) {
        toast({
          description: (
            <Message message="Password updated successfully" type="success" />
          ),
        });
        navigate("/login");
      } else {
        setErrors({ server: data?.data.message });
      }
    },
  });

  function resetPassword(e: FormEvent) {
    e.preventDefault();
    if (passwords.confirmPassword !== passwords.password)
      return setErrors({
        passwords: "Password does not match",
      });

    mutate();
  }

  return (
    <section className="w-full h-screen bg-hms-blue-dark flex items-center justify-center">
      <form
        onSubmit={resetPassword}
        className="min-w-[350px] gap-4 flex flex-col w-[350px] rounded-lg bg-white p-4"
      >
        <h1 className="w-full font-bold text-hms-blue-dark text-4xl mb-2 text-center">
          Update Password
        </h1>
        <label
          className="flex flex-col items-start text-gray-800 gap-1 font-semibold"
          htmlFor="password"
        >
          New Password
          <div className="flex items-center border-2 border-gray-300 rounded-lg py-1 px-2 w-full text-lg">
            <input
              required={true}
              placeholder="* * * * * * * *"
              id="password"
              value={passwords.password}
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
              type={showPassword ? "text" : "password"}
              className="flex-1"
            />
            {showPassword ? (
              <IoEyeOff
                className="cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <IoEye
                onClick={() => setShowPassword(true)}
                className="cursor-pointer"
              />
            )}
          </div>
        </label>
        <label
          className="flex flex-col items-start text-gray-800 gap-1 font-semibold"
          htmlFor="confirmPassword"
        >
          Confirm Password
          <div className="flex items-center border-2 border-gray-300 rounded-lg py-1 px-2 w-full text-lg">
            <input
              required={true}
              placeholder="* * * * * * * *"
              id="confirmPassword"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              type={showConfirmPassword ? "text" : "password"}
              className="flex-1"
            />
            {showConfirmPassword ? (
              <IoEyeOff
                className="cursor-pointer"
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <IoEye
                onClick={() => setShowConfirmPassword(true)}
                className="cursor-pointer"
              />
            )}
          </div>
        </label>
        {errors?.passwords ? (
          <ValidationError message={errors.passwords} />
        ) : null}
        {errors?.server ? (
          <div className="flex w-full justify-between items-center">
            <ValidationError message={errors.server} />
            <Link
              to={"/login?regenerateLink=true"}
              className="text-hms-blue-dark underline"
            >
              Regenerate reset link
            </Link>
          </div>
        ) : null}
        <button
          disabled={status === "pending"}
          type="submit"
          className={`${
            status === "pending"
              ? "bg-gray-300"
              : "bg-hms-green-light hover:bg-hms-green-dark "
          } rounded-lg w-full text-white font-semibold p-2`}
        >
          Update Password
        </button>
      </form>
    </section>
  );
}

export default ResetPassword;

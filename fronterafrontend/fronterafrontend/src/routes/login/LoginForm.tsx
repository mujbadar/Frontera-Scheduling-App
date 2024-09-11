import React, { SetStateAction, useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { useNavigate } from "react-router-dom";
import { signInSchema } from "@/zod/schema.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ValidationError from "../../../components/validation-error.tsx";
import Loading from "../../../components/loading.tsx";
import { TUser, useAuth } from "@/providers/authProvider.tsx";
import { jwtDecode } from "jwt-decode";
import { httpAuth } from "../../helper/httpCommon.ts";
import logo from '../../assets/logo.png';

type Props = {
  setForgotPassword: React.Dispatch<SetStateAction<boolean>>;
};

function LoginForm({ setForgotPassword }: Props) {
  const [_user, setUser] = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    formState: { errors },
    register,
    handleSubmit,
    getValues,
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const { isFetching, isFetched, data, refetch } = useQuery({
    queryFn: async () => {
      return await httpAuth.post("auth/login", getValues());
    },
    queryKey: ["login"],
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (isFetched) {
      if (data?.data.success) {
        const token = data?.data.data;
        const decoded: TUser = jwtDecode(token.accessToken);
        const user: TUser = {
          name: decoded.name,
          email: decoded.email,
          id: decoded.id,
          role: decoded.role,
        };
        setError(null);

        localStorage.setItem("token", token?.accessToken);
        if (setUser) {
          setUser(user);
          navigate("/");
        }
      } else {
        setError(data?.data.message);
      }
    }
  }, [isFetching]);

  return (
    <form
    onSubmit={handleSubmit(() => refetch())}
    className="min-w-[350px] gap-4 flex flex-col w-[350px] rounded-lg bg-white p-4"
  >
    <img
    src={logo}
    alt="Logo"
      className="mx-auto mb-2" // center the logo and add margin-bottom
    />
    <h1 className="w-full font-bold text-hms-blue-dark text-4xl mb-2 text-center">
      Login
    </h1>
  
    <label
      className="flex flex-col items-start text-gray-800 gap-1 font-semibold"
      htmlFor="email"
    >
      Email
      <input
        {...register("email")}
        placeholder="example@gmail.com"
        className="border-2 border-gray-300 rounded-lg py-1 px-2 w-full text-lg"
        id="email"
        type="text"
      />
    </label>
    {errors.email && errors.email.message ? (
      <ValidationError message={errors.email.message} />
    ) : null}
    <label
      className="flex flex-col items-start text-gray-800 gap-1 font-semibold"
      htmlFor="password"
    >
      Password
      <div className="flex items-center border-2 border-gray-300 rounded-lg py-1 px-2 w-full text-lg">
        <input
          {...register("password")}
          placeholder="* * * * * * * *"
          id="password"
          type={showPassword ? "text" : "password"}
          className="flex-1 outline-none"
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
    {errors.password && errors.password.message ? (
      <ValidationError message={errors.password.message} />
    ) : null}
    <button
      disabled={isFetching}
      type={"submit"}
      className={`${
        isFetching
          ? "bg-gray-200"
          : "bg-hms-green-light hover:bg-hms-green-dark "
      } rounded-lg w-full text-white font-semibold p-2`}
    >
      {isFetching ? <Loading /> : "Login"}
    </button>
    {error ? <ValidationError message={error} /> : null}
    <p
      onClick={() => setForgotPassword(true)}
      className="text-gray-700 cursor-pointer my-1 underline"
    >
      Forgot/lost password?
    </p>
  </form>
  
  );
}

export default LoginForm;

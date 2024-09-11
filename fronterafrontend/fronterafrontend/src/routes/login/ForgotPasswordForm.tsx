import { useMutation } from "@tanstack/react-query";
import ValidationError from "../../../components/validation-error";
import { FormEvent, useState, ChangeEvent } from "react";
import Loading from "../../../components/loading";
import { httpAuth } from "../../helper/httpCommon";
import { useToast } from "../../../components/ui/use-toast";
import Message from "../../../components/toasts";

function ForgotPasswordForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState<string | null>();
  const [error, setError] = useState<{
    email?: string | null;
    server?: string | null;
  } | null>(null);

  const { status, mutate, reset } = useMutation({
    mutationKey: ["get-password-reset-link"],
    mutationFn: async () =>
      await httpAuth.post(`auth/generatePasswordLink/${email}`),
    onSuccess(data) {
      if (data?.data.success) {
        reset();
        toast({
          description: (
            <Message
              message="Reset link has been sent to your email"
              type="success"
            />
          ),
        });
      } else {
        setError({ ...error, email: data?.data.data.message });
      }
    },
  });

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();
        if (
          email &&
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
        ) {
          setError(null);
          mutate();
        } else {
          setError({ ...error, email: "Invalid email address" });
        }
      }}
      className="min-w-[350px] gap-4 flex flex-col w-[350px] rounded-lg bg-white p-4"
    >
      <h1 className="w-full font-bold text-hms-blue-dark text-4xl mb-2 text-center">
        Recover Password
      </h1>
      <label
        className="flex flex-col items-start text-gray-800 gap-1 font-semibold"
        htmlFor="email"
      >
        Email
        <input
          value={email || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder="example@gmail.com"
          className="border-2 border-gray-300 rounded-lg py-1 px-2 w-full text-lg"
          id="email"
          type="text"
        />
      </label>
      {error && error.email ? <ValidationError message={error.email} /> : null}
      {error && error.server ? (
        <ValidationError message={error.server} />
      ) : null}
      <button
        disabled={!email || status === "pending"}
        type="submit"
        className={`${
          !email || status === "pending"
            ? "bg-gray-200 hover:bg-gray-200 cursor-not-allowed"
            : "bg-hms-green-light hover:bg-hms-green-dark"
        } rounded-lg w-full text-white font-semibold p-2`}
      >
        {status === "pending" ? <Loading /> : "Get password reset link"}
      </button>
    </form>
  );
}

export default ForgotPasswordForm;

import { useEffect, useState } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import { useParams } from "react-router-dom";

function Login() {
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const params = useParams();

  useEffect(() => {
    if (params.regenerateLink && params.regenerateLink === "true")
      setForgotPassword(true);
  }, [params]);

  return (
    <main className="w-full bg-hms-blue-dark h-screen flex items-center justify-center">
      {forgotPassword ? (
        <ForgotPasswordForm />
      ) : (
        <LoginForm setForgotPassword={setForgotPassword} />
      )}
    </main>
  );
}

export default Login;

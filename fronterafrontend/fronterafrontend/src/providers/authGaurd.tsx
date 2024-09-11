import { Navigate } from "react-router-dom";
import { useAuth } from "./authProvider";
import Loading from "../../components/loading";

export default function AuthGaurd({
  children,
  route,
}: {
  route: "ADMIN" | "PROVIDER" | "ALL";
  children: React.ReactNode;
}) {
  const [user] = useAuth();

  if (!user) return <Loading message="Setting up user" />;

  return user?.role === route || route === "ALL" ? (
    <section className="w-full">{children}</section>
  ) : (
    <Navigate to={"/"} />
  );
}

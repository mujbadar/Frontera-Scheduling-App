import { Outlet } from "react-router-dom";

export default function RequestSchedulesLayout() {
  return (
    <section className={"w-full h-screen mx-auto"}>
      <Outlet />
    </section>
  );
}

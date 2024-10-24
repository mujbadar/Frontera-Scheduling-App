import { Outlet } from "react-router-dom";

export default function RequestSchedulesLayout() {
  return (
    <section className={"mx-auto flex flex-col items-center flex flex-col w-[90%] mx-auto h-full"}>
      <Outlet />
    </section>
  );
}

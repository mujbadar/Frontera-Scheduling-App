import { Outlet } from "react-router-dom";

export default function ProvidersLayout() {
  return (
    <section className="max-w-[1400px] w-full px-2 flex flex-col items-center mx-auto">
      <Outlet />
    </section>
  );
}

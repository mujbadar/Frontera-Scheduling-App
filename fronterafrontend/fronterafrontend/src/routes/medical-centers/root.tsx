import { Outlet } from "react-router-dom";

export default function MedicalCentersLayout() {
  return (
    <section className="w-[98%] max-w-[1400px] flex-1 flex flex-col items-center mx-auto">
      <Outlet />
    </section>
  );
}

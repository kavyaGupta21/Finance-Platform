import React, { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";

const Dashboardlayout = () => {
  return (
    <div className="px-5  ">
      <h1 className="text-6xl  font-bold  gradient-tilt">Dashboard</h1>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      ></Suspense>
      <DashboardPage />
    </div>
  );
};

export default Dashboardlayout;

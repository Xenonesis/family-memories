'use client';

import { DashboardBackground } from "@/components/ui/dashboard-background";

const DashboardBackgroundDemo = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <DashboardBackground
        color="rgba(200, 200, 200, 0.2)"
        darkModeColor="rgba(30, 30, 30, 0.4)"
        animation={{ scale: 50, speed: 70 }}
        noise={{ opacity: 0.5, scale: 1 }}
        sizing="fill"
      />
    </div>
  );
};

export { DashboardBackgroundDemo };

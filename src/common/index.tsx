import { lazy, Suspense } from "react";
const LazyDestopLeftNavbar = lazy(() => import("./HomeLeftNavbar"));

export const DesktopLeftNavbar = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) return null;
  return (
    <Suspense fallback={<div>Loading HTML...</div>}>
      <LazyDestopLeftNavbar />
    </Suspense>
  );
};

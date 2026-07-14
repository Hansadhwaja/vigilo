import { Outlet } from "react-router-dom";

import LeftSide from "@/components/Auth/LeftSide";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-muted/40" />

      {/* Animated Blobs */}
      <div className="animate-blob absolute top-10 left-0 h-52 w-52 rounded-full bg-primary/20 blur-3xl sm:h-72 sm:w-72" />

      <div className="animate-blob animation-delay-2000 absolute top-32 right-0 h-52 w-52 rounded-full bg-accent/30 blur-3xl sm:h-72 sm:w-72" />

      <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-primary/15 blur-3xl sm:h-72 sm:w-72" />

      {/* Decorative Shapes */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 h-40 w-40 rounded-full border border-border sm:h-64 sm:w-64" />

        <div className="absolute right-10 bottom-16 h-28 w-28 rotate-45 border border-border sm:h-48 sm:w-48" />

        <div className="absolute top-1/2 right-1/4 h-20 w-20 rotate-12 rounded-lg border border-border sm:h-32 sm:w-32" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <LeftSide />

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
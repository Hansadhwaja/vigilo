
import LeftSide from "@/components/Auth/LeftSide";
import RightSide from "@/components/Auth/RightSide";



const AuthPage = () => {
 

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="auth-bg-base absolute inset-0" />
      <div className="auth-bg-overlay absolute inset-0" />

      {/* Animated Blobs */}
      <div className="absolute top-10 left-0 h-52 w-52 sm:h-72 sm:w-72 rounded-full bg-blue-500/60 blur-3xl animate-blob" />

      <div className="absolute top-32 right-0 h-52 w-52 sm:h-72 sm:w-72 rounded-full bg-blue-900/60 blur-3xl animate-blob animation-delay-2000" />

      <div className="absolute bottom-0 left-1/3 h-52 w-52 sm:h-72 sm:w-72 rounded-full bg-sky-500/50 blur-3xl animate-blob animation-delay-4000" />

      {/* Decorative Shapes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 h-40 w-40 sm:h-64 sm:w-64 rounded-full border border-white" />

        <div className="absolute bottom-16 right-10 h-28 w-28 sm:h-48 sm:w-48 rotate-45 border border-white" />

        <div className="absolute top-1/2 right-1/4 h-20 w-20 sm:h-32 sm:w-32 rotate-12 rounded-lg border border-white" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <LeftSide />
        <RightSide />
      </div>
    </div>
  );
};

export default AuthPage;
import { authFeatures } from "@/constants";

const LeftSide = () => {
  return (
    <div className="hidden flex-1 items-center px-10 lg:flex xl:px-20">
      <div className="max-w-2xl text-foreground">
        <div className="flex items-center gap-5">
          <div className="flex size-20 items-center justify-center rounded-3xl border border-border bg-card shadow-xl">
            <img
              src="/assets/logo/logo.png"
              alt="VIGILO"
              className="size-14 object-contain"
            />
          </div>

          <div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground xl:text-6xl">
              VIGILO
            </h1>

            <p className="text-lg text-muted-foreground">
              Security Operations Platform
            </p>
          </div>
        </div>

        <p className="mt-8 text-lg leading-relaxed text-muted-foreground xl:text-xl">
          Streamline security operations with centralized incident management,
          patrol coordination, fleet tracking, and real-time response
          monitoring.
        </p>

        <div className="mt-12 grid gap-5 xl:grid-cols-2">
          {authFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-md"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <span className="font-medium text-foreground">
                  {feature.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
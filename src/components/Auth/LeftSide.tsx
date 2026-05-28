import { authFeatures } from "@/constants";

const LeftSide = () => {
    return (
        <div className="hidden lg:flex flex-1 items-center px-10 xl:px-20">
            <div className="max-w-2xl text-white">

                <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl">
                        <img
                            src="/assets/logo/logo.png"
                            alt="VIGILO"
                            className="h-14 w-14 object-contain"
                        />
                    </div>

                    <div>
                        <h1 className="text-5xl xl:text-6xl font-bold tracking-tight">
                            VIGILO
                        </h1>

                        <p className="text-lg text-blue-100">
                            Security Operations Platform
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-lg xl:text-xl leading-relaxed text-blue-50/90">
                    Streamline security operations with
                    centralized incident management,
                    patrol coordination, fleet tracking,
                    and real-time response monitoring.
                </p>

                <div className="mt-12 grid gap-5 xl:grid-cols-2">
                    {authFeatures.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="
                         flex items-center gap-4
                         rounded-2xl
                         border border-white/10
                         bg-white/5
                         p-4
                         backdrop-blur-md
                       "
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                                    <Icon className="h-5 w-5" />
                                </div>

                                <span className="font-medium">
                                    {feature.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default LeftSide
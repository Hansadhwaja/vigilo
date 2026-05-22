import { IncidentType } from '@/apis/incidentsApi';
import { customFormatDateTime } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react'

const IncidentHeroSection = ({ incident }: { incident: IncidentType }) => {
    const dateTime = customFormatDateTime(
        incident?.createdAt
    );
    return (
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 p-8 hover:shadow-lg" >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)]" />
            <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                <div className="space-y-5">
                    <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-orange-500/15 p-4 backdrop-blur">
                            <AlertTriangle className="h-8 w-8 text-orange-400" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                                {incident?.name}
                            </h1>

                            <p className="mt-2 text-lg text-slate-300">
                                Incident Investigation Dashboard
                            </p>
                        </div>
                    </div>

                    <p className="max-w-3xl text-base leading-7 text-slate-300">
                        Monitor incident reports,
                        evidence images, reporter
                        information, shift assignments,
                        and metadata in one centralized
                        security dashboard.
                    </p>
                </div>

                <div className="grid min-w-[320px] grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                        <p className="text-sm text-slate-400">
                            Reporter
                        </p>

                        <p className="mt-2 text-lg font-semibold text-white">
                            {incident?.reporter?.name || "Unknown"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                        <p className="text-sm text-slate-400">
                            Shift Type
                        </p>

                        <p className="mt-2 text-lg font-semibold capitalize text-white">
                            {incident?.shift?.type || "—"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                        <p className="text-sm text-slate-400">
                            Created Date
                        </p>

                        <p className="mt-2 text-lg font-semibold text-white">
                            {dateTime.date}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                        <p className="text-sm text-slate-400">
                            Evidence Files
                        </p>

                        <p className="mt-2 text-lg font-semibold text-white">
                            {incident?.images?.length || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IncidentHeroSection
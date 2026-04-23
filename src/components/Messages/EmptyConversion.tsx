
import { ContactRole } from '@/types'
import { Clock, MessageCircle, ShieldCheck, UserRound } from 'lucide-react'

const EmptyConversion = ({ contactFilter }: { contactFilter: ContactRole }) => {
    return (
        <div className="flex-1 flex items-center justify-center bg-linear-to-br from-emerald-50/60 via-white to-teal-50/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 text-center max-w-sm px-6">
                <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="h-24 w-24 rounded-3xl bg-white shadow-xl shadow-emerald-100 flex items-center justify-center">
                        <MessageCircle className="h-11 w-11 text-emerald-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-xl bg-emerald-500 shadow-md shadow-emerald-200 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 h-7 w-7 rounded-xl bg-teal-500 shadow-md shadow-teal-200 flex items-center justify-center">
                        <UserRound className="h-3.5 w-3.5 text-white" />
                    </div>
                </div>
                <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Start a conversation</h2>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    Select a {contactFilter === "guard" ? "guard" : "client"} from the sidebar to open a secure chat.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live presence active
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
                        <Clock size={11} />
                        Message receipts on
                    </span>
                </div>
            </div>
        </div>
    )
}

export default EmptyConversion
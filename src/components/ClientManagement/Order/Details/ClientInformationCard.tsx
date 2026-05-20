import {
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import SectionCard from "@/components/common/Card/SectionCard";

interface Props {
  client: any;
}

const ClientInformationCard = ({
  client,
}: Props) => {
  if (!client) return null;

  return (
    <SectionCard
      title="Client Information"
      icon={
        <User className="h-5 w-5" />
      }
    >
      <div className="space-y-6">
        {/* HERO */}
        <div
          className="
            relative overflow-hidden
            rounded-3xl
            border border-slate-700/60
            bg-linear-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-5
            text-white
            shadow-xl
          "
        >
          {/* Glow */}
          <div
            className="
              absolute -right-6 -top-6
              h-32 w-32
              rounded-full
              bg-sky-400/20
              blur-3xl
            "
          />

          <div
            className="
              absolute bottom-0 left-10
              h-28 w-28
              rounded-full
              bg-orange-400/20
              blur-3xl
            "
          />

          <div className="relative flex items-center gap-4">
            <div
              className="
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-white/10
                backdrop-blur
              "
            >
              <User className="h-8 w-8 text-sky-300" />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-slate-300">
                Client Profile
              </p>

              <h2
                className="
                  truncate
                  text-2xl
                  font-bold
                  tracking-tight
                "
              >
                {client.name || "—"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Active Client Information
              </p>
            </div>
          </div>
        </div>

        {/* INFO GRID */}
        <div
          className="
            grid grid-cols-1 gap-4
            md:grid-cols-2
          "
        >
          <InfoCard
            label="Email Address"
            value={client.email}
            icon={
              <Mail className="h-5 w-5" />
            }
            iconClassName="
              bg-sky-100
              text-sky-600
            "
          />

          <InfoCard
            label="Mobile Number"
            value={client.mobile}
            icon={
              <Phone className="h-5 w-5" />
            }
            iconClassName="
              bg-emerald-100
              text-emerald-600
            "
          />

          <div className="md:col-span-2">
            <InfoCard
              label="Address"
              value={client.address}
              icon={
                <MapPin className="h-5 w-5" />
              }
              iconClassName="
                bg-orange-100
                text-orange-600
              "
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ClientInformationCard;

interface InfoCardProps {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
}

const InfoCard = ({
  label,
  value,
  icon,
  iconClassName,
}: InfoCardProps) => {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-linear-to-br
        from-slate-50
        to-white
        p-5
        shadow-sm
        transition-all
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            flex h-12 w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            shadow-sm
            ${iconClassName}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-slate-500
            "
          >
            {label}
          </p>

          <p
            className="
              mt-2
              wrap-break-word
              text-sm
              font-medium
              leading-6
              text-slate-800
            "
          >
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};
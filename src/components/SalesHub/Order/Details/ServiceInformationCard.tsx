import {
  FileText,
  MapPin,
  Shield,
  Users,
  Navigation,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import SectionCard from "@/components/common/Card/SectionCard";
import InfoItem from "./InfoItem";

interface Props {
  order: any;
}

const ServiceInformationCard = ({
  order,
}: Props) => {
  return (
    <SectionCard
      title="Service Information"
      icon={
        <FileText className="h-5 w-5" />
      }
    >
      <div className="space-y-8">
        {/* HERO */}
        <div
          className="
            relative overflow-hidden
            rounded-2xl
            border border-slate-200
            bg-linear-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            p-5
            text-white
            shadow-lg
          "
        >
          {/* Glow */}
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-14 w-14 items-center justify-center
                  rounded-2xl
                  bg-white/10
                  backdrop-blur
                "
              >
                <Shield className="h-7 w-7 text-cyan-300" />
              </div>

              <div>
                <p className="text-sm text-slate-300">
                  Security Service
                </p>

                <h3
                  className="
                    mt-1 text-2xl font-bold
                    tracking-tight
                  "
                >
                  {order.serviceType
                    ?.replace(
                      /([A-Z])/g,
                      " $1"
                    )
                    .trim()}
                </h3>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                bg-white/10
                px-4 py-3
                text-center
                backdrop-blur
              "
            >
              <p className="text-sm text-slate-300">
                Guards
              </p>

              <p className="text-2xl font-bold">
                {
                  order.guardsRequired
                }
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
          <InfoItem
            label="Service Type"
            value={order.serviceType
              ?.replace(
                /([A-Z])/g,
                " $1"
              )
              .trim()}
            icon={
              <Shield className="h-4 w-4" />
            }
            direction="row"
          />

          <InfoItem
            label="Guards Required"
            value={
              order.guardsRequired
            }
            icon={
              <Users className="h-4 w-4" />
            }
            direction="row"
          />

          <div className="md:col-span-2">
            <InfoItem
              label="Location Name"
              value={
                order.locationName
              }
              icon={
                <MapPin className="h-4 w-4" />
              }
              direction="row"
            />
          </div>

          <div className="md:col-span-2">
            <InfoItem
              label="Location Address"
              value={
                order.locationAddress
              }
              icon={
                <Navigation className="h-4 w-4" />
              }
              direction="row"
            />
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* COORDINATES */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />

            <h3
              className="
                text-sm font-semibold uppercase
                tracking-[0.2em]
                text-slate-700
              "
            >
              Coordinates
            </h3>
          </div>

          <div
            className="
              grid grid-cols-1 gap-4
              sm:grid-cols-2
            "
          >
            <div
              className="
                rounded-2xl
                border border-slate-200
                bg-linear-to-br
                from-slate-50
                to-white
                p-5
                shadow-sm
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex h-12 w-12 items-center justify-center
                    rounded-xl
                    bg-cyan-100
                    text-cyan-600
                    shadow-sm
                  "
                >
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p
                    className="
                      text-sm font-semibold uppercase
                      tracking-[0.2em]
                      text-slate-500
                    "
                  >
                    Latitude
                  </p>

                  <p
                    className="
                      mt-2 font-mono
                      text-sm text-slate-800
                    "
                  >
                    {order.siteService
                      ?.coordinates?.[1] ??
                      "—"}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border border-slate-200
                bg-linear-to-br
                from-slate-50
                to-white
                p-5
                shadow-sm
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex h-12 w-12 items-center justify-center
                    rounded-xl
                    bg-violet-100
                    text-violet-600
                    shadow-sm
                  "
                >
                  <Navigation className="h-5 w-5" />
                </div>

                <div>
                  <p
                    className="
                      text-sm font-semibold uppercase
                      tracking-[0.2em]
                      text-slate-500
                    "
                  >
                    Longitude
                  </p>

                  <p
                    className="
                      mt-2 font-mono
                      text-sm text-slate-800
                    "
                  >
                    {order.siteService
                      ?.coordinates?.[0] ??
                      "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        {/* DESCRIPTION */}
        <div className="space-y-4">
          <h3
            className="
              text-sm font-semibold uppercase
              tracking-[0.2em]
              text-slate-700
            "
          >
            Description
          </h3>

          <div
            className="
              relative overflow-hidden
              rounded-2xl
              border border-slate-200
              bg-linear-to-br
              from-slate-50
              to-white
              p-6
              shadow-sm
            "
          >
            {/* Glow */}
            <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-cyan-100 blur-3xl" />

            <p
              className="
                relative text-sm leading-7
                text-slate-600
              "
            >
              {order.description ||
                "No description provided"}
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ServiceInformationCard;
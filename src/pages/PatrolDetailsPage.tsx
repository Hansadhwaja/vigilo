"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Clock,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PageProps {
  params: { id: string };
}

export default function PatrolRunDetailsPage({ params }: PageProps) {
  const [data, setData] = useState<any>(null);
  const [expandedSites, setExpandedSites] = useState<string[]>([]);

  useEffect(() => {
    fetchPatrol();
  }, []);

  const fetchPatrol = async () => {
    try {
      const res = await axios.get<any>(
        `http://localhost:9000/api/v1/patrolling/getPatrolRunById/${params.id}`
      );
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSite = (id: string) => {
    setExpandedSites((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  if (!data) return <div className="p-10">Loading...</div>;

  const { patrol, order, client, guards, sites } = data;

  const statusBadge = (status: string) => {
    const base = "px-3 py-1 text-xs rounded-full font-medium";
    if (status === "completed")
      return <span className={`${base} bg-green-100 text-green-700`}>completed</span>;
    if (status === "missed")
      return <span className={`${base} bg-red-100 text-red-700`}>missed</span>;
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>pending</span>;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-white shadow">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-semibold">
              Patrol Run Details
            </h1>
            <p className="text-sm text-gray-500">
              Comprehensive patrol monitoring and progress tracking
            </p>
          </div>
          {statusBadge(patrol.status)}
        </div>
      </div>

      {/* OVERALL PROGRESS */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-sm text-gray-500 mb-2">Overall Progress</h2>
        <div className="flex items-center gap-6">
          <div className="text-4xl font-bold text-purple-600">
            {patrol.completionPercentage}%
          </div>
          <div className="flex-1 bg-gray-200 h-3 rounded-full">
            <div
              className="bg-purple-600 h-3 rounded-full"
              style={{ width: `${patrol.completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <StatCard label="Sites" value={`${patrol.completedSites}/${patrol.totalSites}`} />
          <StatCard label="Sub-Sites" value={`${patrol.completedSubSites}/${patrol.totalSubSites}`} />
          <StatCard label="Checkpoints" value={`${patrol.completedCheckpoints}/${patrol.totalCheckpoints}`} />
          <StatCard label="Missed" value={patrol.missedCheckpoints} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="col-span-2 space-y-6">

          {/* PATROL INFO */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-4">Patrol Information</h3>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <InfoItem icon={<Calendar size={16} />} label="Start Date" value={new Date(patrol.startTime).toLocaleDateString()} />
              <InfoItem icon={<Clock size={16} />} label="Estimated Completion" value={new Date(patrol.estimatedCompletion).toLocaleTimeString()} />
              <InfoItem icon={<Shield size={16} />} label="Vehicle ID" value={patrol.vehicleId} />
              <InfoItem icon={<Calendar size={16} />} label="Created At" value={new Date(patrol.createdAt).toLocaleString()} />
            </div>
          </div>

          {/* LOCATION DETAILS */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-4">Location Details</h3>

            <p className="font-medium">{order.locationName}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin size={14} />
              {order.locationAddress}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {order.images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  className="rounded-xl h-40 object-cover w-full"
                />
              ))}
            </div>
          </div>

          {/* SITES & CHECKPOINTS */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-4">
              Sites & Checkpoints ({sites.length} sites)
            </h3>

            {sites.map((site: any, index: number) => (
              <div key={site.id} className="border rounded-xl mb-4">
                <div
                  onClick={() => toggleSite(site.id)}
                  className="flex justify-between items-center p-4 cursor-pointer"
                >
                  <div>
                    <div className="font-medium">{site.name}</div>
                    <div className="text-xs text-gray-500">{site.address}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(site.status)}
                    {expandedSites.includes(site.id) ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </div>

                {expandedSites.includes(site.id) && (
                  <div className="p-4 border-t bg-gray-50 space-y-4">

                    {/* SITE CHECKPOINTS */}
                    {site.checkpoints.map((cp: any) => (
                      <CheckpointCard key={cp.id} cp={cp} />
                    ))}

                    {/* SUB SITES */}
                    {site.subSites.map((sub: any) => (
                      <div key={sub.id} className="ml-6 border rounded-xl p-4 bg-white">
                        <div className="font-medium mb-2">{sub.name}</div>

                        {sub.checkpoints.map((scp: any) => (
                          <CheckpointCard key={scp.id} cp={scp} />
                        ))}
                      </div>
                    ))}

                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* CLIENT INFO */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-4">Client Information</h3>
            <p className="font-medium">{client.name}</p>
            <div className="flex items-center gap-2 text-sm mt-2">
              <Mail size={14} /> {client.email}
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <Phone size={14} /> {client.mobile}
            </div>
          </div>

          {/* GUARD */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-4">
              Assigned Guard ({guards.length})
            </h3>

            {guards.map((g: any) => (
              <div key={g.id} className="border rounded-xl p-4">
                <p className="font-medium">{g.name}</p>
                <p className="text-xs text-gray-500">{g.email}</p>
                <div className="mt-2">{statusBadge(g.guardStatus)}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ label, value }: any) {
  return (
    <div className="border rounded-xl p-4 text-center bg-gray-50">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function CheckpointCard({ cp }: any) {
  const statusColor =
    cp.status === "completed"
      ? "text-green-600"
      : cp.status === "missed"
      ? "text-red-600"
      : "text-yellow-600";

  return (
    <div className="border rounded-lg p-3 flex justify-between items-center bg-white">
      <div>
        <p className="text-sm font-medium">{cp.name}</p>
        <p className="text-xs text-gray-500">
          Priority: {cp.priorityLevel}
        </p>
      </div>
      <div className={`text-xs font-medium ${statusColor}`}>
        {cp.status}
      </div>
    </div>
  );
}
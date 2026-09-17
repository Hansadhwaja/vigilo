import { useNavigate, useParams } from "react-router-dom";
import { useGetStaticShiftDetailsForAdminQuery } from "@/store/apis/schedulingAPI";

import EditAssignmentModal from "@/components/Scheduling/Modal/EditAssignmentModal";
import DeleteAssignmentModal from "@/components/Scheduling/Modal/DeleteAssignmentModal";
import ShiftInformation from "@/components/Scheduling/Details/ShiftInformation";
import GuardRequests from "@/components/Scheduling/Details/GuardRequests";
import CustomHeader from "@/components/common/Header/CustomHeader";
import CustomBadge from "@/components/common/Badge/CustomBadge";

import { mapShiftToAssignment } from "@/lib/utils";

export default function SchedulingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetStaticShiftDetailsForAdminQuery(
    id ?? "",
    {
      skip: !id,
    },
  );

  const schedulingData = data?.data;

  const shift = schedulingData?.shift;
  const order = schedulingData?.order;
  const guards = schedulingData?.guards ?? [];

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading shift details...
        </p>
      </div>
    );
  }

  if (isError || !shift || !order || !schedulingData) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <div className="text-center">
          <p className="font-medium text-foreground">Shift details not found</p>

          <p className="mt-1 text-sm text-muted-foreground">
            The shift may have been deleted or is no longer available.
          </p>

          <button
            type="button"
            onClick={() => navigate("/scheduling")}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Back to scheduling
          </button>
        </div>
      </div>
    );
  }

  const assignment = mapShiftToAssignment(shift, order, guards);
  
  const timeOffRequests = guards
    .filter((guard) => guard.requestOffRequest !== null)
    .map((guard) => {
      const request = guard.requestOffRequest;

      if (!request) return null;

      return {
        id: request.id ?? "",
        guardId: guard.id,
        guardName: guard.name,
        reason: request.reason ?? "",
        status: request.status ?? "pending",
        startDate: request.startDate ?? "",
        endDate: request.endDate ?? "",
        createdAt: request.createdAt ?? "",
      };
    })
    .filter(
      (request): request is NonNullable<typeof request> => request !== null,
    );

  return (
    <section className="space-y-6">
      <CustomHeader
        previousLink="/scheduling"
        title="Shift Details"
        description="Comprehensive shift information, guard assignments and activity"
        others={
          <div className="flex items-center gap-2">
            <CustomBadge status={shift.status} />

            <EditAssignmentModal
              id={assignment.shiftId}
              assignment={assignment}
            />

            <DeleteAssignmentModal id={assignment.shiftId} />
          </div>
        }
      />

      <ShiftInformation shift={shift} order={order} guards={guards} />

      <GuardRequests
        timeOffRequests={timeOffRequests}
        shiftChangeRequests={schedulingData.shiftChangeRequests}
      />
    </section>
  );
}

import { formatDateTimeForInput } from "@/lib/utils";
import { PatrolFormValues } from "@/schemas";
import { AdminPatrolRunDetails } from "@/types/patrolling/patrolling.types";

export const mapPatrolDetailsToFormValues = (
  details: AdminPatrolRunDetails,
): PatrolFormValues => {
  const { patrol, order, guards, sites } = details;

  const siteSelections: PatrolFormValues["siteSelections"] = {};

  sites.forEach((site) => {
    siteSelections[site.id] = {
      // Checkpoints directly under the site
      checkpointIds: site.checkpoints.map((checkpoint) => checkpoint.id),

      // Sub-sites under this site
      subSites: {},
    };

    site.subSites.forEach((subSite) => {
      siteSelections[site.id].subSites[subSite.id] = {
        checkpointIds: subSite.checkpoints.map((checkpoint) => checkpoint.id),
      };
    });
  });

  return {
    // API doesn't currently provide patrolName.
    // Using patrolId temporarily.
    patrolName: patrol.patrolId,

    guardIds: guards.map((guard) => guard.id),

    vehicleIds: patrol.vehicleIds,

    orderId: order.id,

    siteIds: sites.map((site) => site.id),

    siteSelections,

    startDateTime: formatDateTimeForInput(patrol.startTime),

    estimatedCompletion: formatDateTimeForInput(patrol.estimatedCompletion),

    unitPrice: Number(patrol.unitPrice),

    notes: "",
  };
};

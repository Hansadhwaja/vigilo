import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import ReactSelect, { MultiValue } from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { useGetAllPatrolSitesQuery } from "@/store/apis/patrollingAPI";
import { Building2, MapPin } from "lucide-react";

type SelectOption = {
  value: string;
  label: string;
};
interface SiteSelection {
  subSiteIds: string[];
  checkpointIds: string[];
}

interface PatrolFormValues {
  siteIds: string[];
  siteSelections: Record<string, SiteSelection>;
}

const PatrolSiteSelectionSection = () => {
  const { control, watch, setValue } = useFormContext<PatrolFormValues>();

  const { data, isLoading: isSitesLoading } = useGetAllPatrolSitesQuery({
    page: String(1),
    limit: String(50),
  });

  const availableSites = data?.data ?? [];

  const selectedSiteIds = watch("siteIds") ?? [];
  const siteSelections = watch("siteSelections") ?? {};

  const selectedSites = availableSites.filter((site) =>
    selectedSiteIds.includes(site.id),
  );

  const handleSiteChange = (selected: MultiValue<SelectOption>) => {
    const newSiteIds = selected.map((item) => item.value);

    const currentSelections = { ...siteSelections };

    // Create selection state for newly selected sites
    newSiteIds.forEach((siteId) => {
      if (!currentSelections[siteId]) {
        currentSelections[siteId] = {
          subSiteIds: [],
          checkpointIds: [],
        };
      }
    });

    // Remove selections for sites that were unselected
    Object.keys(currentSelections).forEach((siteId) => {
      if (!newSiteIds.includes(siteId)) {
        delete currentSelections[siteId];
      }
    });

    setValue("siteIds", newSiteIds, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("siteSelections", currentSelections, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const updateSiteSelection = (
    siteId: string,
    field: keyof SiteSelection,
    value: string[],
  ) => {
    setValue(`siteSelections.${siteId}.${field}`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-primary" />

          <h3 className="font-semibold text-slate-900">Patrol Sites</h3>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Select the sites, sub-sites and checkpoints included in this patrol.
        </p>
      </div>

      {/* Site Selection */}
      <Controller
        name="siteIds"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Select Sites</FieldLabel>

            <ReactSelect
              isMulti
              isLoading={isSitesLoading}
              options={availableSites.map((site) => ({
                value: site.id,
                label: site.name,
              }))}
              value={availableSites
                .filter((site) => field.value?.includes(site.id))
                .map((site) => ({
                  value: site.id,
                  label: site.name,
                }))}
              onChange={handleSiteChange}
              placeholder="Select patrol sites..."
              className="text-sm"
              classNamePrefix="select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "42px",
                  borderRadius: "10px",
                  borderColor: "#e5e7eb",
                  boxShadow: "none",
                }),
              }}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Selected Sites */}
      {selectedSites.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800">
            Configure Selected Sites
          </p>

          {selectedSites.map((site) => {
            const selection = siteSelections[site.id] ?? {
              subSiteIds: [],
              checkpointIds: [],
            };

            const subSites = site.subSites ?? [];
            const checkpoints = site.checkpoints ?? [];

            return (
              <div
                key={site.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                {/* Site Header */}
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="size-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900">
                      {site.name}
                    </h4>

                    {site.address && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="size-3" />
                        {site.address}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Sub-sites */}
                  <div>
                    <FieldLabel>Sub-sites</FieldLabel>

                    <ReactSelect
                      isMulti
                      options={subSites.map((subSite) => ({
                        value: subSite.id,
                        label: subSite.name,
                      }))}
                      value={subSites
                        .filter((subSite) =>
                          selection.subSiteIds.includes(subSite.id),
                        )
                        .map((subSite) => ({
                          value: subSite.id,
                          label: subSite.name,
                        }))}
                      onChange={(selected) =>
                        updateSiteSelection(
                          site.id,
                          "subSiteIds",
                          selected.map((item) => item.value),
                        )
                      }
                      placeholder={
                        subSites.length
                          ? "Select sub-sites..."
                          : "No sub-sites available"
                      }
                      isDisabled={!subSites.length}
                      className="mt-2 text-sm"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "42px",
                          borderRadius: "10px",
                          borderColor: "#e5e7eb",
                          boxShadow: "none",
                        }),
                      }}
                    />
                  </div>

                  {/* Checkpoints */}
                  <div>
                    <FieldLabel>Checkpoints</FieldLabel>

                    <ReactSelect
                      isMulti
                      options={checkpoints.map((checkpoint) => ({
                        value: checkpoint.id,
                        label: checkpoint.name,
                      }))}
                      value={checkpoints
                        .filter((checkpoint) =>
                          selection.checkpointIds.includes(checkpoint.id),
                        )
                        .map((checkpoint) => ({
                          value: checkpoint.id,
                          label: checkpoint.name,
                        }))}
                      onChange={(selected) =>
                        updateSiteSelection(
                          site.id,
                          "checkpointIds",
                          selected.map((item) => item.value),
                        )
                      }
                      placeholder={
                        checkpoints.length
                          ? "Select checkpoints..."
                          : "No checkpoints available"
                      }
                      isDisabled={!checkpoints.length}
                      className="mt-2 text-sm"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "42px",
                          borderRadius: "10px",
                          borderColor: "#e5e7eb",
                          boxShadow: "none",
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatrolSiteSelectionSection;

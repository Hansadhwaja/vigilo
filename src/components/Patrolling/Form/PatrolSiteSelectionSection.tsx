import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import ReactSelect, { MultiValue, StylesConfig } from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { useGetAllPatrolSitesQuery } from "@/store/apis/patrollingAPI";
import { Building2, MapPin } from "lucide-react";
import { PatrolFormValues } from "@/schemas";

type SelectOption = {
  value: string;
  label: string;
};

const selectStyles: StylesConfig<SelectOption, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    borderRadius: "10px",
    borderColor: state.isFocused ? "hsl(var(--ring))" : "#e5e7eb",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.isFocused ? "hsl(var(--ring))" : "#d1d5db",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    minWidth: 0,
    overflow: "hidden",
    gap: "2px",
  }),

  multiValue: (base) => ({
    ...base,
    minWidth: 0,
    maxWidth: "220px",
    borderRadius: "6px",
    overflow: "hidden",
  }),

  multiValueLabel: (base) => ({
    ...base,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    paddingLeft: "8px",
    paddingRight: "4px",
  }),

  multiValueRemove: (base) => ({
    ...base,
    flexShrink: 0,
  }),

  input: (base) => ({
    ...base,
    minWidth: "60px",
  }),

  option: (base, state) => ({
    ...base,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "hsl(var(--primary) / 0.08)"
      : state.isFocused
        ? "hsl(var(--muted))"
        : "transparent",
    color: "hsl(var(--foreground))",
  }),

  menu: (base) => ({
    ...base,
    zIndex: 50,
  }),

  menuList: (base) => ({
    ...base,
    padding: "4px",
  }),
};

const getOptions = (
  items: Array<{ id: string; name: string }>,
): SelectOption[] =>
  items.map((item) => ({
    value: item.id,
    label: item.name,
  }));

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

    const currentSelections = {
      ...siteSelections,
    };

    newSiteIds.forEach((siteId) => {
      if (!currentSelections[siteId]) {
        currentSelections[siteId] = {
          checkpointIds: [],
          subSites: {},
        };
      }
    });

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

  const updateSiteCheckpoints = (siteId: string, checkpointIds: string[]) => {
    setValue(`siteSelections.${siteId}.checkpointIds`, checkpointIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const updateSubSiteCheckpoints = (
    siteId: string,
    subSiteId: string,
    checkpointIds: string[],
  ) => {
    setValue(
      `siteSelections.${siteId}.subSites.${subSiteId}.checkpointIds`,
      checkpointIds,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const handleSubSiteChange = (
    siteId: string,
    selectedSubSites: MultiValue<SelectOption>,
  ) => {
    const selectedIds = selectedSubSites.map((item) => item.value);

    const currentSubSites = siteSelections[siteId]?.subSites ?? {};

    const updatedSubSites = {
      ...currentSubSites,
    };

    selectedIds.forEach((subSiteId) => {
      if (!updatedSubSites[subSiteId]) {
        updatedSubSites[subSiteId] = {
          checkpointIds: [],
        };
      }
    });

    Object.keys(updatedSubSites).forEach((subSiteId) => {
      if (!selectedIds.includes(subSiteId)) {
        delete updatedSubSites[subSiteId];
      }
    });

    setValue(`siteSelections.${siteId}.subSites`, updatedSubSites, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="min-w-0 space-y-6">
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
              options={getOptions(availableSites)}
              value={availableSites
                .filter((site) => field.value?.includes(site.id))
                .map((site) => ({
                  value: site.id,
                  label: site.name,
                }))}
              onChange={handleSiteChange}
              placeholder="Select patrol sites..."
              className="min-w-0 text-sm"
              classNamePrefix="select"
              styles={selectStyles}
              getOptionLabel={(option) => option.label}
              formatOptionLabel={(option) => (
                <span
                  className="block max-w-full truncate"
                  title={option.label}
                >
                  {option.label}
                </span>
              )}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Selected Sites */}
      {selectedSites.length > 0 && (
        <div className="min-w-0 space-y-4">
          <p className="text-sm font-semibold text-slate-800">
            Configure Selected Sites
          </p>

          {selectedSites.map((site) => {
            const selection = siteSelections[site.id] ?? {
              checkpointIds: [],
              subSites: {},
            };

            const subSites = site.subSites ?? [];
            const checkpoints = site.checkpoints ?? [];

            const selectedSubSiteIds = Object.keys(selection.subSites ?? {});

            return (
              <div
                key={site.id}
                className="min-w-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5"
              >
                {/* Site Header */}
                <div className="mb-5 flex min-w-0 items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="size-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4
                      className="truncate font-semibold text-slate-900"
                      title={site.name}
                    >
                      {site.name}
                    </h4>

                    {site.address && (
                      <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="size-3 shrink-0" />

                        <span className="truncate" title={site.address}>
                          {site.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="min-w-0 space-y-6 overflow-y-auto">
                  {/* Site-level Checkpoints */}
                  <div className="min-w-0">
                    <FieldLabel>Site Checkpoints</FieldLabel>

                    <ReactSelect
                      isMulti
                      options={getOptions(checkpoints)}
                      value={checkpoints
                        .filter((checkpoint) =>
                          selection.checkpointIds.includes(checkpoint.id),
                        )
                        .map((checkpoint) => ({
                          value: checkpoint.id,
                          label: checkpoint.name,
                        }))}
                      onChange={(selected) =>
                        updateSiteCheckpoints(
                          site.id,
                          selected.map((item) => item.value),
                        )
                      }
                      placeholder={
                        checkpoints.length
                          ? "Select site checkpoints..."
                          : "No checkpoints available"
                      }
                      isDisabled={!checkpoints.length}
                      className="min-w-0 mt-2 text-sm"
                      classNamePrefix="select"
                      styles={selectStyles}
                      formatOptionLabel={(option) => (
                        <span
                          className="block max-w-full truncate"
                          title={option.label}
                        >
                          {option.label}
                        </span>
                      )}
                    />
                  </div>

                  {/* Sub-sites */}
                  <div className="min-w-0">
                    <FieldLabel>Sub-sites</FieldLabel>

                    <ReactSelect
                      isMulti
                      options={getOptions(subSites)}
                      value={subSites
                        .filter((subSite) =>
                          selectedSubSiteIds.includes(subSite.id),
                        )
                        .map((subSite) => ({
                          value: subSite.id,
                          label: subSite.name,
                        }))}
                      onChange={(selected) =>
                        handleSubSiteChange(site.id, selected)
                      }
                      placeholder={
                        subSites.length
                          ? "Select sub-sites..."
                          : "No sub-sites available"
                      }
                      isDisabled={!subSites.length}
                      className="min-w-0 mt-2 text-sm"
                      classNamePrefix="select"
                      styles={selectStyles}
                      formatOptionLabel={(option) => (
                        <span
                          className="block max-w-full truncate"
                          title={option.label}
                        >
                          {option.label}
                        </span>
                      )}
                    />
                  </div>

                  {/* Selected Sub-sites */}
                  {selectedSubSiteIds.length > 0 && (
                    <div className="min-w-0 space-y-4">
                      <p className="text-sm font-semibold text-slate-800">
                        Configure Sub-site Checkpoints
                      </p>

                      {subSites
                        .filter((subSite) =>
                          selectedSubSiteIds.includes(subSite.id),
                        )
                        .map((subSite) => {
                          const subSiteSelection = selection.subSites?.[
                            subSite.id
                          ] ?? {
                            checkpointIds: [],
                          };

                          const subSiteCheckpoints = subSite.checkpoints ?? [];

                          return (
                            <div
                              key={subSite.id}
                              className="min-w-0 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <div className="mb-3 min-w-0">
                                <h5
                                  className="truncate text-sm font-semibold text-slate-900"
                                  title={subSite.name}
                                >
                                  {subSite.name}
                                </h5>
                              </div>

                              <FieldLabel>Checkpoints</FieldLabel>

                              <ReactSelect
                                isMulti
                                options={getOptions(subSiteCheckpoints)}
                                value={subSiteCheckpoints
                                  .filter((checkpoint) =>
                                    subSiteSelection.checkpointIds.includes(
                                      checkpoint.id,
                                    ),
                                  )
                                  .map((checkpoint) => ({
                                    value: checkpoint.id,
                                    label: checkpoint.name,
                                  }))}
                                onChange={(selected) =>
                                  updateSubSiteCheckpoints(
                                    site.id,
                                    subSite.id,
                                    selected.map((item) => item.value),
                                  )
                                }
                                placeholder={
                                  subSiteCheckpoints.length
                                    ? "Select checkpoints..."
                                    : "No checkpoints available"
                                }
                                isDisabled={!subSiteCheckpoints.length}
                                className="min-w-0 mt-2 text-sm"
                                classNamePrefix="select"
                                styles={selectStyles}
                                formatOptionLabel={(option) => (
                                  <span
                                    className="block max-w-full truncate"
                                    title={option.label}
                                  >
                                    {option.label}
                                  </span>
                                )}
                              />
                            </div>
                          );
                        })}
                    </div>
                  )}
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

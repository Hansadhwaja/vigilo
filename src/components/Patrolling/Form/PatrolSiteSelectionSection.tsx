
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import ReactSelect from "react-select";
import { Controller, useFormContext } from 'react-hook-form'
import { useGetAllPatrolSitesQuery } from '@/apis/patrollingAPI';
import CreateSiteModal from '../Site/Modal/CreateSiteModal';
import SiteCard from '../Site/SiteCard';

const PatrolSiteSelectionSection = () => {
    const { control, watch } = useFormContext();

    const { data, isLoading: isSitesLoading } = useGetAllPatrolSitesQuery({
        page: 1,
        limit: 50,
    });

    const availableSites = data?.data ?? [];

    const selectedSiteIds = watch("siteIds");
    const selectedSites = availableSites.filter(s => selectedSiteIds.includes(s.id)) ?? [];

    return (
        <div className="rounded-2xl border bg-white p-6 space-y-5">

            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Patrol Sites
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Select sites, sub-sites and checkpoints.
                    </p>
                </div>

                <CreateSiteModal />
            </div>

            <Controller
                name="siteIds"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>
                            Select Sites
                        </FieldLabel>

                        <ReactSelect
                            isMulti
                            options={availableSites.map((site) => ({
                                value: site.id,
                                label: site.name,
                            }))}
                            value={availableSites
                                .filter((site) =>
                                    field.value.includes(site.id)
                                )
                                .map((site) => ({
                                    value: site.id,
                                    label: site.name,
                                }))}
                            onChange={(selected) => {
                                field.onChange(
                                    selected.map((item) => item.value)
                                );
                            }}
                            placeholder="Select sites"
                            className="text-sm"
                            classNamePrefix="select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderRadius: "10px",
                                    borderColor: "#e5e7eb",
                                    boxShadow: "none",
                                }),
                            }}
                        />

                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                )}
            />

            <div className="space-y-5">
                {selectedSites.map((site) => (
                    <SiteCard key={site.id} site={site} />
                ))}
            </div>
        </div>
    )
}

export default PatrolSiteSelectionSection
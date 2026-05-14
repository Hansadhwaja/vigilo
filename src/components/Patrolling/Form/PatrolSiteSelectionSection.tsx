
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import ReactSelect from "react-select";
import { Controller, useFormContext } from 'react-hook-form'
import { useGetAllPatrolSitesQuery } from '@/apis/patrollingAPI';
import { Building, Crosshair, Plus, QrCode, Target, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PatrolSiteSelectionSection = () => {
    const { control } = useFormContext();

    const { data, isLoading: isSitesLoading } = useGetAllPatrolSitesQuery({
        page: 1,
        limit: 50,
    });

    const availableSites = data?.data || [];

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

                <Button
                    type="button"
                    variant="outline"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Site
                </Button>
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

                {availableSites.map((site) => (

                    <div
                        key={site.id}
                        className="border rounded-2xl p-5 bg-gray-50/60"
                    >

                        <div className="flex items-start justify-between gap-4">

                            <div>
                                <div className="flex items-center gap-2 flex-wrap">

                                    <Building className="h-5 w-5 text-blue-600" />

                                    <h3 className="font-semibold text-gray-900">
                                        {site.name}
                                    </h3>

                                    {/* <Badge>
                                                {getTotalCheckpointsForSite(site)} CP
                                            </Badge> */}
                                </div>

                                <p className="text-sm text-gray-500 mt-1">
                                    {site.address}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">

                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                // onClick={() =>
                                //     downloadSiteQRPdf(site)
                                // }
                                >
                                    Download QR
                                </Button>

                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="text-red-500"
                                // onClick={() =>
                                //     handleDeleteSite(site.id)
                                // }
                                // disabled={deletingSite}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">

                            {(site?.subsites ?? []).map((subsite: any) => (

                                <div
                                    key={subsite.id}
                                    className="bg-white border rounded-xl p-4"
                                >

                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-2">

                                            <Target className="h-4 w-4 text-green-600" />

                                            <div>
                                                <p className="font-medium">
                                                    {subsite.name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {subsite.description}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="text-red-500"
                                        // onClick={() =>
                                        //     handleDeleteSubSite(
                                        //         subsite.id
                                        //     )
                                        // }
                                        // disabled={deletingSubSite}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Checkpoints */}

                                    <div className="mt-4 space-y-2">

                                        {subsite.checkpoints.map(
                                            (checkpoint: any) => (

                                                <div
                                                    key={checkpoint.id}
                                                    className="flex items-center justify-between border rounded-lg p-3"
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <Crosshair className="h-4 w-4 text-orange-500" />

                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                {checkpoint.name}
                                                            </p>

                                                            <div className="flex items-center gap-2 mt-1">

                                                                <Badge variant="outline">
                                                                    {checkpoint.qrCode}
                                                                </Badge>

                                                                <Badge variant="secondary">
                                                                    {checkpoint.range}m
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">

                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                        // onClick={() =>
                                                        //     handleQrIconAction(
                                                        //         checkpoint
                                                        //     )
                                                        // }
                                                        >
                                                            <QrCode className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-red-500"
                                                        // onClick={() =>
                                                        //     handleDeleteCheckpoint(
                                                        //         checkpoint.id
                                                        //     )
                                                        // }
                                                        // disabled={deletingCheckpoint}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        )}

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            className="text-blue-600"
                                        // onClick={() =>
                                        //     handleAddCheckpoint(
                                        //         site.id,
                                        //         subsite.id
                                        //     )
                                        // }
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add Checkpoint
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-green-600"
                            // onClick={() =>
                            //     handleAddSubSite(site.id)
                            // }
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Sub-Site
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PatrolSiteSelectionSection
import { PatrolSiteFull, PatrolSubSiteWithCheckpoints } from '@/apis/patrollingAPI'
import { Button } from '@/components/ui/button'
import { Badge, Building, Crosshair, Plus, QrCode, Target, Trash2 } from 'lucide-react'
import CreateSubSiteModal from './SubSite/Modal/CreateSubSiteModal'
import SubSiteCard from './SubSite/SubSiteCard'
import { useFormContext } from 'react-hook-form'

const SiteCard = ({ site }: { site: PatrolSiteFull }) => {
    const { control, watch } = useFormContext();

    const siteIds = watch("siteIds");

    const handleDeleteSite = (id: string) => {
        siteIds.filter((s: string) => s !== id)
    }

    return (
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
                        onClick={() => handleDeleteSite(site.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="mt-5 space-y-4">

                {(site?.subSites ?? []).map((subSite: PatrolSubSiteWithCheckpoints) => (

                    <SubSiteCard key={subSite.id} subSite={subSite} siteId={site.id} />
                ))}

                <CreateSubSiteModal id={site.id} />
            </div>
        </div>
    )
}

export default SiteCard
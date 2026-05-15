import { PatrolSubSiteWithCheckpoints } from '@/apis/patrollingAPI'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crosshair, Plus, QrCode, Target, Trash2 } from 'lucide-react'
import CreateCheckpointModal from './CheckPoint/Modal/CreateCheckpointModal'
import CheckPointCard from './CheckPoint/CheckPointCard'

const SubSiteCard = ({ subSite, siteId }: { siteId: string, subSite: PatrolSubSiteWithCheckpoints }) => {

    const handleDeleteSubSite = (id: string) => {

    }

    return (
        <div
            key={subSite.id}
            className="bg-white border rounded-xl p-4"
        >

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                    <Target className="h-4 w-4 text-green-600" />

                    <div>
                        <p className="font-medium">
                            {subSite.name}
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() =>
                        handleDeleteSubSite(
                            subSite.id
                        )
                    }

                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="mt-4 space-y-2">

                {subSite.checkpoints.map(
                    (checkpoint: any) => (

                        <CheckPointCard key={checkpoint.id} checkpoint={checkpoint} />
                    )
                )}

                <CreateCheckpointModal siteId={siteId} subSiteId={subSite.id} />
            </div>
        </div>
    )
}

export default SubSiteCard
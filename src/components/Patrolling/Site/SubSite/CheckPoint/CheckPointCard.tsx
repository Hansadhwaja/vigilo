import { PatrolCheckpoint } from '@/apis/patrollingAPI'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crosshair, QrCode, Trash2 } from 'lucide-react'

const CheckPointCard = ({ checkpoint }: { checkpoint: PatrolCheckpoint }) => {
    return (
        <div className="flex items-center justify-between border rounded-lg p-3" >

            <div className="flex items-center gap-3">

                <Crosshair className="h-4 w-4 text-orange-500" />

                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                            {checkpoint.name}
                        </p>
                        <Badge variant="secondary">
                            {checkpoint.verificationRange}m
                        </Badge>

                    </div>
                </div>
                {checkpoint?.qr?.qrUrl ? (
                    <img
                        src={checkpoint.qr.qrUrl}
                        alt="QR Code"
                        className="h-48 w-48 object-contain"
                    />
                ) : (
                    <p>No QR available</p>
                )}
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
}

export default CheckPointCard
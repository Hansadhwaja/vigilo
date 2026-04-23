import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React from 'react'

const GuardDetailsSheet = () => {
    return (
        <Sheet
            open={!!selectedGuard}
            onOpenChange={() => setSelectedGuard(null)}
        >
            <SheetContent className="w-96">
                <SheetHeader>
                    <SheetTitle>Guard Details</SheetTitle>
                    <SheetDescription>
                        View guard information, status, and contact details
                    </SheetDescription>
                </SheetHeader>

                {selectedGuard && (
                    <div className="mt-4 space-y-3">
                        <div className="text-lg font-semibold">
                            {selectedGuard.name}
                        </div>
                        <div className="text-sm text-gray-600">
                            {selectedGuard.status}
                        </div>
                        <div className="text-sm">Phone: {selectedGuard.phone}</div>
                        <div className="text-sm">
                            Licences: {selectedGuard.licences.join(", ")}
                        </div>

                        <div className="pt-3 border-t">
                            <button className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors">
                                Message
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default GuardDetailsSheet
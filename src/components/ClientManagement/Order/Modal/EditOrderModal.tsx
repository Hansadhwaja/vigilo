import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


const EditOrderModal = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Order</DialogTitle>
                    <DialogDescription>
                        Update order details including location, schedule, and requirements
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-serviceType">Service Type</Label>
                        <Select
                        >
                            <SelectTrigger id="edit-serviceType" className="text-lg">
                                <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="static" className="text-lg">Static</SelectItem>
                                <SelectItem value="premiumSecurity" className="text-lg">Premium Security</SelectItem>
                                <SelectItem value="standardPatrol" className="text-lg">Standard Patrol</SelectItem>
                                <SelectItem value="24/7Monitoring" className="text-lg">24/7 Monitoring</SelectItem>
                                <SelectItem value="healthcareSecurity" className="text-lg">Healthcare Security</SelectItem>
                                <SelectItem value="industrialSecurity" className="text-lg">Industrial Security</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-guardsRequired">Guards Required</Label>
                        <Input
                            id="edit-guardsRequired"
                            type="number"
                            min="1"
                            className="text-lg"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit-locationName">Location Name</Label>
                        <Textarea
                            id="edit-locationName"
                            className="text-lg font-semibold text-black leading-relaxed resize-none"
                            placeholder="e.g., Mumbai Central Office"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit-locationAddress">Location Address</Label>
                        <Textarea
                            id="edit-locationAddress"
                            className="text-lg font-semibold text-black leading-relaxed resize-none"
                            placeholder="Full address"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-latitude">Latitude</Label>
                        <Input
                            id="edit-latitude"
                            type="number"
                            step="0.000001"
                            className="text-lg"
                            placeholder="e.g., 19.0596"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-longitude">Longitude</Label>
                        <Input
                            id="edit-longitude"
                            type="number"
                            step="0.000001"
                            className="text-lg"
                            placeholder="e.g., 72.8295"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-startDate">Start Date</Label>
                        <Input
                            id="edit-startDate"
                            type="date"
                            className="text-lg"

                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-endDate">End Date</Label>
                        <Input
                            id="edit-endDate"
                            type="date"
                            className="text-lg"

                        />

                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-startTime">Start Time</Label>
                        <Input
                            id="edit-startTime"
                            type="time"
                            className="text-lg"

                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-endTime">End Time</Label>
                        <Input
                            id="edit-endTime"
                            type="time"
                            className="text-lg"

                        />

                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            className="text-lg leading-relaxed resize-none"

                            placeholder="Order description and requirements..."
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"

                    >
                        Cancel
                    </Button>
                    <Button

                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditOrderModal
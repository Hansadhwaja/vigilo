import React from 'react'

const SiteForm = () => {
    return (
        <div>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                        id="siteName"
                        value={siteFormData.name}
                        onChange={(e) => setSiteFormData({ ...siteFormData, name: e.target.value })}
                        placeholder="e.g., Airport Terminal Complex"
                    />
                </div>

                <div>
                    <Label htmlFor="siteAddress">Address</Label>
                    <Textarea
                        id="siteAddress"
                        value={siteFormData.address}
                        onChange={(e) => setSiteFormData({ ...siteFormData, address: e.target.value })}
                        placeholder="Full address of the site..."
                        rows={2}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="siteLat">Latitude</Label>
                        <Input
                            id="siteLat"
                            type="number"
                            step="any"
                            value={siteFormData.coordinates.lat}
                            onChange={(e) => setSiteFormData({
                                ...siteFormData,
                                coordinates: { ...siteFormData.coordinates, lat: e.target.value }
                            })}
                            placeholder="-37.8136"
                        />
                    </div>

                    <div>
                        <Label htmlFor="siteLng">Longitude</Label>
                        <Input
                            id="siteLng"
                            type="number"
                            step="any"
                            value={siteFormData.coordinates.lng}
                            onChange={(e) => setSiteFormData({
                                ...siteFormData,
                                coordinates: { ...siteFormData.coordinates, lng: e.target.value }
                            })}
                            placeholder="144.9631"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="siteClient">Client</Label>
                    <Select value={siteFormData.clientId} onValueChange={(value: any) => setSiteFormData({ ...siteFormData, clientId: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                            {clientsLoading && (
                                <SelectItem value="loading" disabled>
                                    Loading clients...
                                </SelectItem>
                            )}

                            {clientsError && (
                                <SelectItem value="error" disabled>
                                    Failed to load clients
                                </SelectItem>
                            )}

                            {!clientsLoading && !clientsError && clientList.length === 0 && (
                                <SelectItem value="empty" disabled>
                                    No clients found
                                </SelectItem>
                            )}

                            {!clientsLoading &&
                                !clientsError &&
                                clientList.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="siteDescription">Description</Label>
                    <Textarea
                        id="siteDescription"
                        value={siteFormData.description}
                        onChange={(e) => setSiteFormData({ ...siteFormData, description: e.target.value })}
                        placeholder="Description of the site and security requirements..."
                        rows={3}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowSiteManager(false)}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSaveSite}
                    disabled={
                        isCreatingSite ||
                        !siteFormData.name ||
                        !siteFormData.address ||
                        !siteFormData.coordinates.lat ||
                        !siteFormData.coordinates.lng ||
                        !siteFormData.clientId
                    }
                >
                    {isCreatingSite ? "Creating..." : "Create Site"}
                </Button>
            </div>
        </div>
    )
}

export default SiteForm
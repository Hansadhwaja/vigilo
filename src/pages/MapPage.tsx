import React, { useState, useEffect } from "react";
import { 
  Satellite, 
  RefreshCw, 
  Navigation, 
  Compass, 
  MapPin, 
  Settings, 
  History 
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Progress } from "../components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../components/ui/sheet";

import { sampleGuards, sampleSites, sampleVehicles, mapConfig } from "../data/sampleData";

interface MapPageProps {
  onSelectGuard: (guard: any) => void;
}

export default function MapPage({ onSelectGuard }: MapPageProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [mapLayer, setMapLayer] = useState("all");
  const [showTrails, setShowTrails] = useState(true);
  const [apiConnected, setApiConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [trackingFilters, setTrackingFilters] = useState({
    guards: true,
    vehicles: true,
    routes: true,
    geofences: true
  });

  // Simulate API connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate occasional API disconnection
      if (Math.random() < 0.05) {
        setApiConnected(false);
        setTimeout(() => setApiConnected(true), 3000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getVehicleIcon = (vehicle: any) => {
    if (vehicle.status === "Maintenance") return "🔧";
    if (vehicle.speed > 0) return "🚗";
    return "🅿️";
  };

  const getVehicleColor = (vehicle: any) => {
    switch (vehicle.status) {
      case "Active": return vehicle.speed > 0 ? "#22c55e" : "#3b82f6";
      case "Maintenance": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  return (
    <div className="space-y-4">
      {/* API Status Bar */}
      <Card className={`${apiConnected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${apiConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <div className="flex items-center gap-2">
                <Satellite className={`h-4 w-4 ${apiConnected ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-xl font-medium ${apiConnected ? 'text-green-800' : 'text-red-800'}`}>
                  Vehicle Tracking API {apiConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xl">
              <div className="flex items-center gap-1">
                <RefreshCw className={`h-4 w-4 ${apiConnected ? 'text-green-600' : 'text-red-600'} ${apiConnected ? 'animate-spin' : ''}`} />
                <span className={apiConnected ? 'text-green-700' : 'text-red-700'}>
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <Badge className={apiConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {sampleVehicles.filter(v => v.status === "Active").length} Vehicles Online
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Map */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Live Vehicle Tracking
                </CardTitle>
                <CardDescription>Real-time GPS monitoring and fleet management</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={mapLayer} onValueChange={setMapLayer}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Layers</SelectItem>
                    <SelectItem value="vehicles">Vehicles Only</SelectItem>
                    <SelectItem value="guards">Guards Only</SelectItem>
                    <SelectItem value="routes">Routes Only</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full" style={{ height: 480 }}>
              <svg viewBox={`0 0 ${mapConfig.width} ${mapConfig.height}`} className="w-full h-full rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border">
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  </pattern>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                  </marker>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Sites / geofences */}
                {(mapLayer === "all" || mapLayer === "guards") && trackingFilters.geofences && sampleSites.map((s, i) => (
                  <g key={s.id}>
                    <rect x={s.bounds.x} y={s.bounds.y} width={s.bounds.w} height={s.bounds.h} 
                          fill={i % 2 ? "#c7d2fe" : "#bfdbfe"} opacity={0.3} stroke="#6366f1" strokeWidth="2" />
                    <text x={s.bounds.x + 6} y={s.bounds.y + 16} fontSize="12" fill="#111827" fontWeight="600">{s.name}</text>
                  </g>
                ))}

                {/* Vehicle Routes/Trails */}
                {(mapLayer === "all" || mapLayer === "routes" || mapLayer === "vehicles") && showTrails && trackingFilters.routes && 
                  sampleVehicles.filter(v => v.route.length > 1).map(vehicle => {
                    const points = vehicle.route.map(point => mapConfig.project(point.lat, point.lng));
                    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
                    return (
                      <g key={`trail-${vehicle.id}`}>
                        <path d={pathData} stroke={getVehicleColor(vehicle)} strokeWidth="3" 
                              fill="none" strokeDasharray="5,5" opacity={0.6} markerEnd="url(#arrowhead)" />
                      </g>
                    );
                  })
                }

                {/* Vehicle markers */}
                {(mapLayer === "all" || mapLayer === "vehicles") && trackingFilters.vehicles && 
                  sampleVehicles.map(vehicle => {
                    const p = mapConfig.project(vehicle.lat, vehicle.lng);
                    const isMoving = vehicle.speed > 0;
                    return (
                      <g key={vehicle.id} className="cursor-pointer" onClick={() => setSelectedVehicle(vehicle)}>
                        {/* Vehicle shadow/glow for active vehicles */}
                        {isMoving && (
                          <circle cx={p.x} cy={p.y} r={15} fill={getVehicleColor(vehicle)} opacity={0.2} className="animate-pulse" />
                        )}
                        
                        {/* Main vehicle marker */}
                        <circle cx={p.x} cy={p.y} r={10} fill={getVehicleColor(vehicle)} stroke="white" strokeWidth="3" />
                        
                        {/* Direction indicator for moving vehicles */}
                        {isMoving && (
                          <polygon points={`${p.x},${p.y-12} ${p.x-5},${p.y-6} ${p.x+5},${p.y-6}`} 
                                   fill="white" transform={`rotate(${vehicle.heading} ${p.x} ${p.y})`} />
                        )}
                        
                        {/* Vehicle callsign */}
                        <text x={p.x + 15} y={p.y - 5} fontSize="11" fill="#111827" fontWeight="600">
                          {vehicle.callsign}
                        </text>
                        <text x={p.x + 15} y={p.y + 8} fontSize="10" fill="#6b7280">
                          {vehicle.speed}km/h • {vehicle.driver || "Unassigned"}
                        </text>
                      </g>
                    );
                  })
                }

                {/* Guard markers */}
                {(mapLayer === "all" || mapLayer === "guards") && trackingFilters.guards && 
                  sampleGuards.filter(g => g.status !== "Off Duty").map(g => {
                    const p = mapConfig.project(g.lat, g.lng);
                    return (
                      <g key={g.id} className="cursor-pointer" onClick={() => onSelectGuard(g)}>
                        <circle cx={p.x} cy={p.y} r={7} fill="#10b981" stroke="#064e3b" strokeWidth="2" />
                        <text x={p.x + 12} y={p.y + 4} fontSize="10" fill="#111827" fontWeight="500">{g.name}</text>
                      </g>
                    );
                  })
                }
              </svg>

              {/* Map controls overlay */}
              <div className="absolute top-4 right-4 space-y-2">
                <Button size="sm" variant="outline" className="bg-white shadow-lg">
                  <Compass className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white shadow-lg">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right sidebar controls */}
        <div className="space-y-4">
          {/* Map Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Map Layers</CardTitle>
              <CardDescription>Control what's visible on the map</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Vehicles</span>
                <Switch 
                  checked={trackingFilters.vehicles} 
                  onCheckedChange={(checked) => setTrackingFilters(prev => ({...prev, vehicles: checked}))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Guards</span>
                <Switch 
                  checked={trackingFilters.guards} 
                  onCheckedChange={(checked) => setTrackingFilters(prev => ({...prev, guards: checked}))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Route Trails</span>
                <Switch 
                  checked={showTrails} 
                  onCheckedChange={setShowTrails}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Geofences</span>
                <Switch 
                  checked={trackingFilters.geofences} 
                  onCheckedChange={(checked) => setTrackingFilters(prev => ({...prev, geofences: checked}))}
                />
              </div>
              <div className="pt-2 border-t">
                <Button variant="outline" className="w-full" onClick={() => {
                  setTrackingFilters({ guards: true, vehicles: true, routes: true, geofences: true });
                  setShowTrails(true);
                }}>
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Status */}
          <Card>
            <CardHeader>
              <CardTitle>Fleet Status</CardTitle>
              <CardDescription>Real-time vehicle monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleVehicles.map(vehicle => (
                <div key={vehicle.id} 
                     className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedVehicle?.id === vehicle.id ? 'border-blue-500 bg-blue-50' : ''}`}
                     onClick={() => setSelectedVehicle(vehicle)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${vehicle.speed > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="font-medium text-xl">{vehicle.callsign}</span>
                    </div>
                    <Badge className={`${getVehicleColor(vehicle) === '#22c55e' ? 'bg-green-100 text-green-800' : 
                                             getVehicleColor(vehicle) === '#f59e0b' ? 'bg-yellow-100 text-yellow-800' : 
                                             'bg-blue-100 text-blue-800'}`} size="sm">
                      {vehicle.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-lg text-gray-600">
                    <div>Speed: {vehicle.speed}km/h</div>
                    <div>Fuel: {vehicle.fuel}%</div>
                    <div>Driver: {vehicle.driver || "None"}</div>
                    <div>Updated: {vehicle.lastUpdate}</div>
                  </div>

                  {vehicle.destination && (
                    <div className="mt-2 text-lg">
                      <div className="font-medium">→ {vehicle.destination}</div>
                      {vehicle.eta && <div className="text-gray-500">ETA: {vehicle.eta}</div>}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* API Integration */}
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>Vehicle tracking system connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xl">
                  <span>Provider:</span>
                  <span className="font-medium">GPS Fleet Pro</span>
                </div>
                <div className="flex items-center justify-between text-xl">
                  <span>Update Rate:</span>
                  <span className="font-medium">30 seconds</span>
                </div>
                <div className="flex items-center justify-between text-xl">
                  <span>Data Points/Hour:</span>
                  <span className="font-medium">1,200</span>
                </div>
                <div className="flex items-center justify-between text-xl">
                  <span>Monthly Usage:</span>
                  <span className="font-medium">847k / 1M</span>
                </div>
              </div>
              
              <div className="pt-2 border-t space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  API Settings
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  Track History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vehicle Details Sheet */}
      <Sheet open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
        <SheetContent className="w-[500px]">
          <SheetHeader>
            <SheetTitle>Vehicle Details: {selectedVehicle?.callsign}</SheetTitle>
            <SheetDescription>
              Real-time telemetry and vehicle information
            </SheetDescription>
          </SheetHeader>
          {selectedVehicle && (
            <div className="mt-6 space-y-6">
              {/* Vehicle Status Overview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Current Status</h3>
                <div className="grid grid-cols-2 gap-4 text-xl">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <Badge className={`ml-2 ${selectedVehicle.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {selectedVehicle.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Driver:</span>
                    <span className="ml-2 font-medium">{selectedVehicle.driver || "Unassigned"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Speed:</span>
                    <span className="ml-2 font-medium">{selectedVehicle.speed} km/h</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Heading:</span>
                    <span className="ml-2 font-medium">{selectedVehicle.heading}°</span>
                  </div>
                </div>
              </div>

              {/* Live Telemetry */}
              <div>
                <h3 className="font-semibold mb-3">Live Telemetry</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xl mb-1">
                      <span>Fuel Level</span>
                      <span>{selectedVehicle.fuel}%</span>
                    </div>
                    <Progress value={selectedVehicle.fuel} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xl mb-1">
                      <span>Battery Level</span>
                      <span>{selectedVehicle.batteryLevel}%</span>
                    </div>
                    <Progress value={selectedVehicle.batteryLevel} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xl mb-1">
                      <span>Engine Temperature</span>
                      <span>{selectedVehicle.engineTemp}°C</span>
                    </div>
                    <Progress value={(selectedVehicle.engineTemp / 120) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              {/* GPS Information */}
              <div>
                <h3 className="font-semibold mb-3">GPS Information</h3>
                <div className="space-y-2 text-xl">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Latitude:</span>
                    <span className="font-mono">{selectedVehicle.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Longitude:</span>
                    <span className="font-mono">{selectedVehicle.lng.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Update:</span>
                    <span>{selectedVehicle.lastUpdate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GPS Signal:</span>
                    <Badge className="bg-green-100 text-green-800">Strong</Badge>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              {selectedVehicle.destination && (
                <div>
                  <h3 className="font-semibold mb-3">Current Route</h3>
                  <div className="space-y-2 text-xl">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Destination:</span>
                      <span className="font-medium">{selectedVehicle.destination}</span>
                    </div>
                    {selectedVehicle.eta && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ETA:</span>
                        <span className="font-medium">{selectedVehicle.eta}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Route Points:</span>
                      <span className="font-medium">{selectedVehicle.route.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
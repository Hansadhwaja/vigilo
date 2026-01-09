import React, { useState } from "react";
import { 
  Settings, 
  User, 
  Lock, 
  Webhook, 
  CreditCard, 
  Server,
  Save,
  RotateCcw,
  UserPlus,
  Eye,
  EyeOff,
  Key,
  Car,
  Plus,
  Edit,
  Trash2,
  Fuel,
  Wrench
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { classNames } from "../utils/helpers";

interface SettingsPageProps {
  usageAlarmsMTD: number;
}

export default function SettingsPage({ usageAlarmsMTD }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [users] = useState([
    { id: 1, name: "Frank Morrison", email: "frank@vigilo.com", role: "Administrator", status: "Active", lastLogin: "2 hours ago" },
    { id: 2, name: "Sarah Chen", email: "sarah@vigilo.com", role: "Supervisor", status: "Active", lastLogin: "1 day ago" },
    { id: 3, name: "Mike Rodriguez", email: "mike@vigilo.com", role: "Operator", status: "Active", lastLogin: "3 hours ago" },
    { id: 4, name: "Lisa Thompson", email: "lisa@vigilo.com", role: "Viewer", status: "Inactive", lastLogin: "1 week ago" },
  ]);
  
  const [vehicles] = useState([
    {
      id: "VEH-001",
      type: "Security Van",
      registration: "VIG-001",
      status: "Active",
      assignedPatrols: ["Patrol-001", "Patrol-003"],
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      fuelUsage: "850L/month",
      mileage: "45,250 km"
    },
    {
      id: "VEH-002", 
      type: "Response Vehicle",
      registration: "VIG-002",
      status: "Active",
      assignedPatrols: ["Patrol-002"],
      lastMaintenance: "2024-02-01",
      nextMaintenance: "2024-05-01",
      fuelUsage: "720L/month",
      mileage: "38,750 km"
    },
    {
      id: "VEH-003",
      type: "Patrol Car",
      registration: "VIG-003", 
      status: "Maintenance",
      assignedPatrols: [],
      lastMaintenance: "2024-02-20",
      nextMaintenance: "2024-05-20",
      fuelUsage: "650L/month",
      mileage: "52,100 km"
    },
    {
      id: "VEH-004",
      type: "Security Van",
      registration: "VIG-004",
      status: "Active",
      assignedPatrols: ["Patrol-004", "Patrol-005"],
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-04-08",
      fuelUsage: "890L/month",
      mileage: "41,850 km"
    }
  ]);

  const settingsTabs = [
    { id: "general", label: "General", icon: <Settings className="h-4 w-4" /> },
    { id: "vehicles", label: "Vehicles", icon: <Car className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <User className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Lock className="h-4 w-4" /> },
    { id: "integrations", label: "Integrations", icon: <Webhook className="h-4 w-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
    { id: "system", label: "System", icon: <Server className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Settings Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={classNames(
                  "flex items-center gap-2 px-4 py-3 text-xl font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email notifications</div>
                  <div className="text-xl text-gray-500">Receive alerts via email</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SMS alerts</div>
                  <div className="text-xl text-gray-500">Critical incidents only</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push notifications</div>
                  <div className="text-xl text-gray-500">Mobile app notifications</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sound alerts</div>
                  <div className="text-xl text-gray-500">Audio notifications for critical alarms</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operation Defaults</CardTitle>
              <CardDescription>Configure system behavior and automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-assign alarms</div>
                  <div className="text-xl text-gray-500">Based on proximity and availability</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-escalate overdue alarms</div>
                  <div className="text-xl text-gray-500">Escalate after SLA threshold</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Real-time tracking</div>
                  <div className="text-xl text-gray-500">GPS tracking for all guards</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <label className="text-xl font-medium">Default SLA (minutes)</label>
                <Select defaultValue="15">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure timezone, currency, and locale settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xl font-medium">Timezone</label>
                  <Select defaultValue="australia/melbourne">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="australia/melbourne">Australia/Melbourne</SelectItem>
                      <SelectItem value="australia/sydney">Australia/Sydney</SelectItem>
                      <SelectItem value="australia/perth">Australia/Perth</SelectItem>
                      <SelectItem value="pacific/auckland">Pacific/Auckland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xl font-medium">Currency</label>
                  <Select defaultValue="aud">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aud">AUD (Australian Dollar)</SelectItem>
                      <SelectItem value="nzd">NZD (New Zealand Dollar)</SelectItem>
                      <SelectItem value="usd">USD (US Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xl font-medium">Date Format</label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4 flex gap-2">
                <Button><Save className="h-4 w-4 mr-2" />Save Changes</Button>
                <Button variant="outline"><RotateCcw className="h-4 w-4 mr-2" />Reset to Defaults</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vehicle Management */}
      {activeTab === "vehicles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Vehicle Management</h2>
              <p className="text-xl text-gray-600">Manage fleet vehicles, maintenance, and assignments</p>
            </div>
            <Button onClick={() => setShowAddVehicleDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />Add Vehicle
            </Button>
          </div>

          {/* Vehicle Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Total Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicles.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Active Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {vehicles.filter(v => v.status === "Active").length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">In Maintenance</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {vehicles.filter(v => v.status === "Maintenance").length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Avg Fuel/Month</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">782L</div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle List */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Patrols</TableHead>
                    <TableHead>Next Maintenance</TableHead>
                    <TableHead>Fuel Usage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vehicle.type}</div>
                          <div className="text-xl text-gray-500">{vehicle.id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{vehicle.registration}</TableCell>
                      <TableCell>
                        <Badge variant={vehicle.status === "Active" ? "default" : 
                                      vehicle.status === "Maintenance" ? "secondary" : "outline"}>
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.assignedPatrols.length > 0 ? (
                            vehicle.assignedPatrols.map((patrol, index) => (
                              <Badge key={index} variant="outline" className="text-lg">
                                {patrol}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xl text-gray-500">Unassigned</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.nextMaintenance}</TableCell>
                      <TableCell>{vehicle.fuelUsage}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Add Vehicle Dialog */}
          {showAddVehicleDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xl font-medium">Vehicle Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="security-van">Security Van</SelectItem>
                        <SelectItem value="patrol-car">Patrol Car</SelectItem>
                        <SelectItem value="response-vehicle">Response Vehicle</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xl font-medium">Registration Number</label>
                    <Input placeholder="VIG-005" />
                  </div>
                  <div>
                    <label className="text-xl font-medium">Status</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowAddVehicleDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowAddVehicleDialog(false)}>
                    Add Vehicle
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Management */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="text-xl text-gray-600">Manage user accounts, roles, and permissions</p>
            </div>
            <Button><UserPlus className="h-4 w-4 mr-2" />Add User</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xl text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "Administrator" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Disable</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Security Settings</h2>
            <p className="text-xl text-gray-600">Configure security policies and access controls</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Security</CardTitle>
                <CardDescription>Manage API keys and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xl font-medium">API Key</label>
                  <div className="flex gap-2">
                    <Input 
                      type={showApiKey ? "text" : "password"}
                      value="vgl_sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Key className="h-4 w-4 mr-2" />Regenerate Key</Button>
                  <Button variant="outline" size="sm">Copy Key</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Rate limiting</div>
                    <div className="text-xl text-gray-500">1000 requests per hour</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Configure password requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Minimum 8 characters</div>
                    <div className="text-xl text-gray-500">Require at least 8 characters</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Require uppercase letters</div>
                    <div className="text-xl text-gray-500">At least one uppercase letter</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Require numbers</div>
                    <div className="text-xl text-gray-500">At least one numeric character</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Require special characters</div>
                    <div className="text-xl text-gray-500">At least one special character</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Billing */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Billing & Subscription</h2>
            <p className="text-xl text-gray-600">Manage your subscription and billing information</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Professional Plan - Usage-based billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-lg">Professional Plan</div>
                    <div className="text-xl text-gray-600">Unlimited users, Advanced features</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$299</div>
                    <div className="text-xl text-gray-500">per month</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xl">
                    <span>Alarms processed (MTD)</span>
                    <span>{usageAlarmsMTD} × $55 = ${usageAlarmsMTD * 55}</span>
                  </div>
                  <div className="flex justify-between text-xl">
                    <span>Base subscription</span>
                    <span>$299</span>
                  </div>
                  <div className="flex justify-between text-xl">
                    <span>SMS charges</span>
                    <span>$23.50</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Estimated total</span>
                    <span>${299 + (usageAlarmsMTD * 55) + 23.50}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Your default payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-xl text-gray-500">Expires 12/26</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Update Payment</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* System Info */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">System Information</h2>
            <p className="text-xl text-gray-600">System status, performance, and maintenance</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xl">
                    <span>CPU Usage</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xl">
                    <span>Memory Usage</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xl">
                    <span>Database Storage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Version Information</CardTitle>
                <CardDescription>Current software versions and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xl">
                  <span>VIGILO Platform</span>
                  <span>v2.4.1</span>
                </div>
                <div className="flex justify-between text-xl">
                  <span>API Version</span>
                  <span>v1.2.0</span>
                </div>
                <div className="flex justify-between text-xl">
                  <span>Database</span>
                  <span>PostgreSQL 15.2</span>
                </div>
                <div className="flex justify-between text-xl">
                  <span>Last Update</span>
                  <span>3 days ago</span>
                </div>
                <div className="pt-3 border-t">
                  <Badge className="bg-blue-100 text-blue-800">Updates Available</Badge>
                  <div className="text-lg text-gray-500 mt-1">Security update v2.4.2 available</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
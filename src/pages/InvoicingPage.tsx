import React, { useState } from "react";
import { Plus, Search, Filter, Download, Eye, Send, DollarSign, FileText, Clock, CheckCircle, Users, Bell, Route, Calculator, CreditCard, Receipt } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { sampleAlarms, availableGuards, clientList } from "../data/sampleData";

// Sample invoice data
const sampleInvoices = [
  {
    id: "INV-2024-001",
    clientName: "Metropolitan Bank Tower",
    clientId: "CLI-001",
    billingPeriod: "January 2024",
    alarmEvents: 15,
    patrolRecords: 31,
    totalAmount: 12750,
    status: "Paid",
    issueDate: "2024-02-01",
    dueDate: "2024-02-15",
    paidDate: "2024-02-12",
    services: [
      { type: "24/7 Security Monitoring", amount: 8500, quantity: 1 },
      { type: "Alarm Response", amount: 150, quantity: 15 },
      { type: "Daily Patrol Services", amount: 100, quantity: 31 },
      { type: "Monthly Report", amount: 500, quantity: 1 }
    ]
  },
  {
    id: "INV-2024-002", 
    clientName: "Westfield Shopping Center",
    clientId: "CLI-002",
    billingPeriod: "January 2024",
    alarmEvents: 8,
    patrolRecords: 62,
    totalAmount: 9450,
    status: "Outstanding",
    issueDate: "2024-02-01",
    dueDate: "2024-02-15",
    paidDate: null,
    services: [
      { type: "Standard Patrol Package", amount: 5500, quantity: 1 },
      { type: "Alarm Response", amount: 150, quantity: 8 },
      { type: "Extended Patrol Hours", amount: 75, quantity: 24 },
      { type: "Incident Reports", amount: 50, quantity: 6 }
    ]
  },
  {
    id: "INV-2024-003",
    clientName: "TechCorp Headquarters", 
    clientId: "CLI-003",
    billingPeriod: "January 2024",
    alarmEvents: 22,
    patrolRecords: 124,
    totalAmount: 22150,
    status: "Pending",
    issueDate: "2024-02-01",
    dueDate: "2024-02-15", 
    paidDate: null,
    services: [
      { type: "Premium Security Package", amount: 15000, quantity: 1 },
      { type: "Alarm Response - Priority", amount: 200, quantity: 22 },
      { type: "Executive Protection Patrol", amount: 50, quantity: 124 },
      { type: "Monthly Security Assessment", amount: 750, quantity: 1 }
    ]
  },
  {
    id: "INV-2024-004",
    clientName: "Riverside Apartment Complex",
    clientId: "CLI-004", 
    billingPeriod: "January 2024",
    alarmEvents: 5,
    patrolRecords: 28,
    totalAmount: 6250,
    status: "Overdue",
    issueDate: "2024-01-01",
    dueDate: "2024-01-15",
    paidDate: null,
    services: [
      { type: "Basic Patrol Service", amount: 4500, quantity: 1 },
      { type: "Alarm Response", amount: 150, quantity: 5 },
      { type: "Weekend Patrol Bonus", amount: 25, quantity: 8 }
    ]
  }
];

export default function InvoicingPage() {
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("client-billing");
  
  // Invoice generation state
  const [newInvoice, setNewInvoice] = useState({
    type: "client", // client or guard-payment
    clientId: "",
    clientName: "",
    billingPeriod: "",
    selectedAlarms: [] as any[],
    selectedPatrols: [] as any[],
    selectedGuards: [] as any[],
    customServices: [] as any[],
    notes: "",
    dueDate: ""
  });

  // Get completed alarms and patrols for billing
  const completedAlarms = sampleAlarms.filter(alarm => alarm.completed);
  const samplePatrols = [
    { id: "P-001", guardName: "A. Khan", site: "CBD Mall", date: "2024-09-21", duration: 8, hourlyRate: 45, total: 360, completed: true },
    { id: "P-002", guardName: "S. Singh", site: "Docklands Precinct", date: "2024-09-21", duration: 6, hourlyRate: 45, total: 270, completed: true },
    { id: "P-003", guardName: "M. Chen", site: "Tech Park Campus", date: "2024-09-21", duration: 4, hourlyRate: 50, total: 200, completed: true },
    { id: "P-004", guardName: "J. Ali", site: "Harbour View Plaza", date: "2024-09-22", duration: 12, hourlyRate: 45, total: 540, completed: true },
    { id: "P-005", guardName: "Lisa Rodriguez", site: "Corporate Tower", date: "2024-09-22", duration: 8, hourlyRate: 48, total: 384, completed: true }
  ];

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Calculate totals and metrics
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidInvoices = invoices.filter(inv => inv.status === "Paid");
  const paidRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const outstandingRevenue = invoices
    .filter(inv => ["Outstanding", "Pending", "Overdue"].includes(inv.status))
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  
  // Calculate billable items
  const billableAlarms = completedAlarms.length;
  const billablePatrols = samplePatrols.length;
  const potentialRevenue = (billableAlarms * 75) + samplePatrols.reduce((sum, p) => sum + p.total, 0);
  
  // Calculate guard payment costs
  const totalGuardCosts = samplePatrols.reduce((sum, p) => sum + p.total, 0);

  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetailsDialog(true);
  };

  const handleGenerateInvoice = () => {
    setShowGenerateDialog(true);
    setNewInvoice({
      type: "client",
      clientId: "",
      clientName: "",
      billingPeriod: new Date().toISOString().slice(0, 7), // YYYY-MM format
      selectedAlarms: [],
      selectedPatrols: [],
      selectedGuards: [],
      customServices: [],
      notes: "",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) // 14 days from now
    });
  };

  const calculateInvoiceTotal = () => {
    let total = 0;
    
    // Add alarm response costs
    total += newInvoice.selectedAlarms.reduce((sum, alarm) => sum + (alarm.unitPrice || 75), 0);
    
    // Add patrol costs  
    total += newInvoice.selectedPatrols.reduce((sum, patrol) => sum + patrol.total, 0);
    
    // Add custom services
    total += newInvoice.customServices.reduce((sum, service) => sum + (service.amount || 0), 0);
    
    return total;
  };

  const generateInvoiceId = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = String(invoices.length + 1).padStart(3, '0');
    return `INV-${year}-${month}-${sequence}`;
  };

  const handleCreateInvoice = () => {
    const invoiceId = generateInvoiceId();
    const totalAmount = calculateInvoiceTotal();
    
    const services = [
      ...newInvoice.selectedAlarms.map(alarm => ({
        type: `Alarm Response - ${alarm.type}`,
        amount: alarm.unitPrice || 75,
        quantity: 1,
        details: `Site: ${alarm.site}, ID: ${alarm.id}`
      })),
      ...newInvoice.selectedPatrols.map(patrol => ({
        type: `Patrol Service - ${patrol.duration}h`,
        amount: patrol.total,
        quantity: 1,
        details: `Guard: ${patrol.guardName}, Site: ${patrol.site}`
      })),
      ...newInvoice.customServices
    ];

    const newInvoiceData = {
      id: invoiceId,
      clientName: newInvoice.clientName,
      clientId: newInvoice.clientId,
      billingPeriod: new Date(newInvoice.billingPeriod).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      alarmEvents: newInvoice.selectedAlarms.length,
      patrolRecords: newInvoice.selectedPatrols.length,
      totalAmount: totalAmount,
      status: "Pending",
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: newInvoice.dueDate,
      paidDate: null,
      services: services,
      notes: newInvoice.notes
    };

    setInvoices(prev => [newInvoiceData, ...prev]);
    setShowGenerateDialog(false);
    
    // Show success message
    alert(`Invoice ${invoiceId} created successfully for ${newInvoice.clientName}!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Outstanding":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Outstanding":
        return <FileText className="h-4 w-4" />;
      case "Overdue":
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Invoicing & Accounts</h1>
          <p className="text-gray-600">Manage billing, payments, and financial tracking</p>
        </div>
        <Button onClick={handleGenerateInvoice} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Generate Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All invoices</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{paidInvoices.length} invoices paid</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${outstandingRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Items</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{billableAlarms + billablePatrols}</div>
            <p className="text-xs text-muted-foreground">{billableAlarms} alarms, {billablePatrols} patrols</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guard Costs</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${totalGuardCosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Invoice Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" onClick={handleGenerateInvoice} className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Bill Completed Alarms ({billableAlarms})
            </Button>
            <Button variant="outline" onClick={handleGenerateInvoice} className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Bill Completed Patrols ({billablePatrols})
            </Button>
            <Button variant="outline" onClick={() => {
              handleGenerateInvoice();
              setActiveTab("guard-payment");
            }} className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Process Guard Payments
            </Button>
            <Button variant="outline" onClick={handleGenerateInvoice} className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Custom Invoice
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Potential Revenue:</span>
              <span className="text-blue-700">${potentialRevenue.toLocaleString()}</span>
              <span className="text-gray-600">from unbilled services</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices, clients, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="outstanding">Outstanding</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Billing Period</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.clientName}</div>
                        <div className="text-sm text-gray-500">{invoice.clientId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.billingPeriod}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{invoice.alarmEvents} alarms</div>
                        <div>{invoice.patrolRecords} patrols</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${invoice.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{invoice.dueDate}</div>
                        {invoice.paidDate && (
                          <div className="text-green-600">Paid: {invoice.paidDate}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status !== "Paid" && (
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Generate Invoice Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Generate New Invoice
            </DialogTitle>
            <DialogDescription>
              Create invoices for client billing or guard payment processing
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client-billing" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Client Billing
              </TabsTrigger>
              <TabsTrigger value="guard-payment" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guard Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client-billing" className="space-y-6">
              {/* Client Billing Tab */}
              <div className="grid grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Invoice Information</h3>
                  
                  <div>
                    <Label htmlFor="clientSelect">Select Client</Label>
                    <Select value={newInvoice.clientId} onValueChange={(value: string) => {
                      const client = clientList.find(c => c.id === value);
                      setNewInvoice({
                        ...newInvoice, 
                        clientId: value,
                        clientName: client?.name || ""
                      });
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose client to bill" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientList.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-xs text-gray-500">{client.sites} sites</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="billingPeriod">Billing Period</Label>
                    <Input
                      id="billingPeriod"
                      type="month"
                      value={newInvoice.billingPeriod}
                      onChange={(e) => setNewInvoice({...newInvoice, billingPeriod: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Invoice Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Invoice Preview</h3>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <div><strong>Invoice ID:</strong> {generateInvoiceId()}</div>
                      <div><strong>Client:</strong> {newInvoice.clientName || "Select client"}</div>
                      <div><strong>Total Amount:</strong> ${calculateInvoiceTotal().toLocaleString()}</div>
                      <div><strong>Items:</strong> {newInvoice.selectedAlarms.length + newInvoice.selectedPatrols.length + newInvoice.customServices.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-6">
                {/* Completed Alarms */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Completed Alarms ({completedAlarms.length} available)
                  </h3>
                  <div className="border rounded-lg max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead>Alarm ID</TableHead>
                          <TableHead>Site</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedAlarms.map((alarm) => (
                          <TableRow key={alarm.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={newInvoice.selectedAlarms.some(a => a.id === alarm.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewInvoice({
                                      ...newInvoice,
                                      selectedAlarms: [...newInvoice.selectedAlarms, alarm]
                                    });
                                  } else {
                                    setNewInvoice({
                                      ...newInvoice,
                                      selectedAlarms: newInvoice.selectedAlarms.filter(a => a.id !== alarm.id)
                                    });
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{alarm.id}</TableCell>
                            <TableCell>{alarm.site}</TableCell>
                            <TableCell>{alarm.type}</TableCell>
                            <TableCell>{alarm.completedAt ? new Date(alarm.completedAt).toLocaleDateString() : "N/A"}</TableCell>
                            <TableCell>${alarm.unitPrice || 75}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Completed Patrols */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Completed Patrols ({samplePatrols.length} available)
                  </h3>
                  <div className="border rounded-lg max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead>Patrol ID</TableHead>
                          <TableHead>Guard</TableHead>
                          <TableHead>Site</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {samplePatrols.map((patrol) => (
                          <TableRow key={patrol.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={newInvoice.selectedPatrols.some(p => p.id === patrol.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewInvoice({
                                      ...newInvoice,
                                      selectedPatrols: [...newInvoice.selectedPatrols, patrol]
                                    });
                                  } else {
                                    setNewInvoice({
                                      ...newInvoice,
                                      selectedPatrols: newInvoice.selectedPatrols.filter(p => p.id !== patrol.id)
                                    });
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{patrol.id}</TableCell>
                            <TableCell>{patrol.guardName}</TableCell>
                            <TableCell>{patrol.site}</TableCell>
                            <TableCell>{patrol.duration}h</TableCell>
                            <TableCell>${patrol.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Custom Services */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Custom Services
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newService = { type: "", amount: 0, quantity: 1, description: "" };
                        setNewInvoice({
                          ...newInvoice,
                          customServices: [...newInvoice.customServices, newService]
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Service
                    </Button>
                  </div>
                  
                  {newInvoice.customServices.map((service, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 mb-2 p-2 border rounded">
                      <Input
                        placeholder="Service type"
                        value={service.type}
                        onChange={(e) => {
                          const updated = [...newInvoice.customServices];
                          updated[index].type = e.target.value;
                          setNewInvoice({...newInvoice, customServices: updated});
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={service.quantity}
                        onChange={(e) => {
                          const updated = [...newInvoice.customServices];
                          updated[index].quantity = parseInt(e.target.value) || 1;
                          setNewInvoice({...newInvoice, customServices: updated});
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={service.amount}
                        onChange={(e) => {
                          const updated = [...newInvoice.customServices];
                          updated[index].amount = parseFloat(e.target.value) || 0;
                          setNewInvoice({...newInvoice, customServices: updated});
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = newInvoice.customServices.filter((_, i) => i !== index);
                          setNewInvoice({...newInvoice, customServices: updated});
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes or instructions for this invoice..."
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guard-payment" className="space-y-6">
              {/* Guard Payment Tab */}
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Guard Payment Processing</h3>
                <p className="text-gray-600 mb-6">Generate payment invoices for guards based on completed work</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {availableGuards.slice(0, 3).map((guard) => (
                    <Card key={guard.id}>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="font-medium">{guard.name}</div>
                          <div className="text-sm text-gray-600">{guard.roles.join(", ")}</div>
                          <div className="mt-2">
                            <div className="text-sm text-gray-600">Hours: 24h</div>
                            <div className="font-medium text-green-600">$1,080</div>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            Generate Payment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Total Services: {newInvoice.selectedAlarms.length + newInvoice.selectedPatrols.length + newInvoice.customServices.length}
              </div>
              <div className="text-lg font-medium">
                Total: ${calculateInvoiceTotal().toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateInvoice}
                disabled={!newInvoice.clientId || calculateInvoiceTotal() === 0}
                className="flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Generate Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Details - {selectedInvoice?.id}</DialogTitle>
            <DialogDescription>
              View detailed invoice information, service breakdown, and payment status
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium mb-2">Bill To:</h3>
                  <p className="font-medium">{selectedInvoice.clientName}</p>
                  <p className="text-sm text-gray-600">Client ID: {selectedInvoice.clientId}</p>
                  <p className="text-sm text-gray-600">Period: {selectedInvoice.billingPeriod}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Invoice Details:</h3>
                  <p><span className="text-gray-600">Issue Date:</span> {selectedInvoice.issueDate}</p>
                  <p><span className="text-gray-600">Due Date:</span> {selectedInvoice.dueDate}</p>
                  {selectedInvoice.paidDate && (
                    <p><span className="text-gray-600">Paid Date:</span> {selectedInvoice.paidDate}</p>
                  )}
                  <Badge className={getStatusColor(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </div>

              {/* Service Breakdown */}
              <div>
                <h3 className="font-medium mb-3">Service Breakdown</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.services.map((service: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{service.type}</TableCell>
                        <TableCell>{service.quantity}</TableCell>
                        <TableCell>${(service.amount / service.quantity).toFixed(2)}</TableCell>
                        <TableCell>${service.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-t">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold text-lg">${selectedInvoice.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                {selectedInvoice.status !== "Paid" && (
                  <>
                    <Button variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button>
                      Mark as Paid
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
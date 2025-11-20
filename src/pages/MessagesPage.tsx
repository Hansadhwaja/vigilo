import React, { useState } from "react";
import { Send, Users, MessageSquare, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { sampleGuards, clientList } from "../data/sampleData";

// Sample shifts and projects for context-based messaging
const activeShifts = [
  { id: "shift-001", name: "Night Shift - CBD Mall", guards: ["g1", "g2"], type: "patrol", site: "CBD Mall" },
  { id: "shift-002", name: "Day Shift - Corporate Tower", guards: ["g3"], type: "static", site: "Corporate Tower" },
  { id: "shift-003", name: "Evening Shift - Tech Park", guards: ["g4", "g5"], type: "patrol", site: "Tech Park Campus" },
  { id: "shift-004", name: "Morning Shift - Shopping Center", guards: ["g6"], type: "static", site: "Westfield Shopping Center" }
];

const projects = [
  { id: "p1", name: "CBD Mall Security", client: "Harbour Group", shifts: ["shift-001"] },
  { id: "p2", name: "Corporate Tower", client: "Tech Solutions Ltd", shifts: ["shift-002"] },
  { id: "p3", name: "Tech Park Campus", client: "Innovation Hub", shifts: ["shift-003"] },
  { id: "p4", name: "Shopping Center", client: "Retail Properties", shifts: ["shift-004"] }
];

export default function MessagesPage() {
  const [messageType, setMessageType] = useState("guard");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedGuard, setSelectedGuard] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<Array<{
    id: string;
    type: string;
    recipient: string;
    message: string;
    timestamp: Date;
  }>>([]);

  // Get guards in selected shift
  const getGuardsInShift = () => {
    if (!selectedShift) return [];
    const shift = activeShifts.find(s => s.id === selectedShift);
    if (!shift) return [];
    return sampleGuards.filter(g => shift.guards.includes(g.id));
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!message.trim()) return;

    let recipients: string[] = [];
    let recipientNames: string[] = [];

    if (messageType === "guard") {
      if (selectedGuard === "all_shift") {
        // Send to all guards in selected shift
        const shift = activeShifts.find(s => s.id === selectedShift);
        if (shift) {
          recipients = shift.guards;
          recipientNames = shift.guards.map(gId => {
            const guard = sampleGuards.find(g => g.id === gId);
            return guard?.name || "Unknown";
          });
        }
      } else if (selectedGuard) {
        // Send to specific guard
        recipients = [selectedGuard];
        const guard = sampleGuards.find(g => g.id === selectedGuard);
        recipientNames = [guard?.name || "Unknown"];
      }
    } else if (messageType === "client" && selectedClient) {
      // Send to specific client
      recipients = [selectedClient];
      const client = clientList.find(c => c.id === selectedClient);
      recipientNames = [client?.name || "Unknown"];
    }

    // Create sent message records
    recipients.forEach((recipientId, index) => {
      const newMessage = {
        id: `msg_${Date.now()}_${recipientId}`,
        type: messageType,
        recipient: recipientNames[index],
        message: message,
        timestamp: new Date()
      };
      setSentMessages(prev => [newMessage, ...prev]);
    });

    // Reset form
    setMessage("");
    setSelectedGuard("");
    setSelectedClient("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Messages</h1>
        <p className="text-gray-600">Send messages to guards and clients</p>
      </div>

      {/* Main Messaging Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Messaging Box */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send Message
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              {/* Message Type Selection */}
              <div className="space-y-2">
                <Label>Message Type</Label>
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guard">Message Guards</SelectItem>
                    <SelectItem value="client">Message Clients</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Guard Messaging Options */}
              {messageType === "guard" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Project</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} - {project.client}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProject && (
                    <div className="space-y-2">
                      <Label>Shift</Label>
                      <Select value={selectedShift} onValueChange={setSelectedShift}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shift" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeShifts
                            .filter(shift => projects.find(p => p.id === selectedProject)?.shifts.includes(shift.id))
                            .map(shift => (
                              <SelectItem key={shift.id} value={shift.id}>
                                {shift.name} ({shift.type})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedShift && (
                    <div className="space-y-2">
                      <Label>Guard</Label>
                      <Select value={selectedGuard} onValueChange={setSelectedGuard}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guard or all guards in shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_shift">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              All guards in this shift
                            </div>
                          </SelectItem>
                          {getGuardsInShift().map(guard => (
                            <SelectItem key={guard.id} value={guard.id}>
                              {guard.name} - {guard.status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Client Messaging Options */}
              {messageType === "client" && (
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientList.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Message Box */}
              <div className="flex-1 flex flex-col space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 min-h-[200px] resize-none"
                />
              </div>

              {/* Send Button */}
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || (messageType === "guard" && !selectedGuard) || (messageType === "client" && !selectedClient)}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sent Messages */}
        <div>
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 h-[500px] overflow-y-auto">
                {sentMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages sent yet
                  </div>
                ) : (
                  sentMessages.map((msg) => (
                    <div key={msg.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          msg.type === "guard" ? "bg-blue-500" : "bg-green-500"
                        }`} />
                        <span className="font-medium text-sm">{msg.recipient}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{msg.message}</div>
                      <div className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
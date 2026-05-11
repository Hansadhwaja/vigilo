import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Edit, Trash2, Eye, User, Phone, Mail, MapPin, Building, Calendar, Clock, FileText, Image, CheckCircle, XCircle, Send, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCancelOrderMutation,
  useAcceptOrderMutation,
  useDeleteClientMutation,
  useEditOrderMutation,
  useGetAllClientsQuery
} from "@/apis/ordersApi";

import {
  useEditClientMutation,
  useUploadImageMutation,
} from "@/apis/usersApi";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomHeader from "@/components/common/Header/CustomHeader";
import OrderStats from "@/components/ClientManagement/Order/OrderStats";
import ClientOperationsTabs from "@/components/ClientManagement/Tabs/ClientOperationsTabs";

export default function ClientsPage() {
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editClientData, setEditClientData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    avatar: "",
  });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const [activeTab, setActiveTab] = useState("directory");
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [debouncedClientSearch, setDebouncedClientSearch] = useState("");

  const navigate = useNavigate();

  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const [editClient, { isLoading: isEditingClientMutation }] = useEditClientMutation();
  const [uploadImage] = useUploadImageMutation();

  const { data, isLoading: isLoadingClients, isError: isErrorClients } = useGetAllClientsQuery({
    search: debouncedClientSearch || undefined,
    page: 1,
    limit: 100,
  });


  const clients = data?.data;
  const clientsList = clients ? (Array.isArray(clients) ? clients : [clients]) : [];

  // Filter clients by search
  const filteredClients = useMemo(() => {
    if (!clientsList || clientsList.length === 0) return [];
    if (!debouncedClientSearch) return clientsList;

    const searchLower = debouncedClientSearch.toLowerCase();
    return clientsList.filter(client =>
      client.name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.mobile?.toLowerCase().includes(searchLower) ||
      client.address?.toLowerCase().includes(searchLower)
    );
  }, [clientsList, debouncedClientSearch]);


  const handleDeleteClient = async (clientId: string) => {
    if (!clientId) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;

    try {
      const response = await deleteClient({ id: clientId }).unwrap();
      toast.success("Client deleted successfully");
    } catch (error) {
      toast.error("Failed to delete client");
    }
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/clients/${orderId}`);
  };


  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };


  // Handler to save edited client
  const handleSaveClient = async () => {
    if (!selectedClient) return;

    try {
      await editClient({
        id: selectedClient.id,
        body: editClientData,
      }).unwrap();

      toast.success("Client updated successfully");
      setIsEditingClient(false);
      setShowClientDialog(false);
    } catch (err: any) {
      console.error("Failed to update client:", err);
      toast.error(err?.data?.message || "Failed to update client");
    }
  };

  // Handler for form changes
  const handleClientFormChange = (field: string, value: string) => {
    setEditClientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadImage(formData).unwrap();

      console.log('🎯 Upload response:', response);
      console.log('🎯 New avatar URL:', response.imageUrl);

      handleClientFormChange("avatar", response.imageUrl);

      toast.success("Avatar uploaded successfully");
      e.target.value = '';
    } catch (err: any) {
      console.error("Failed to upload avatar:", err);
      toast.error(err?.data?.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto min-w-0 min-h-0 h-full">

      <CustomHeader
        title="Order Management"
        description="Manage security service orders & contracts"
      />
      <OrderStats
        totalOrders={2}
        activeOrders={3}
        totalRevenue={4}
        avgOrderValue={1}
      />

      <ClientOperationsTabs />
    </div>
  );

}

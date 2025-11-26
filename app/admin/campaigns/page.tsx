"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Play,
  Pause,
  BarChart3,
} from "lucide-react";

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage
const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

// Define colors directly as they are defined in CSS
const chartColors = {
  chart1: "oklch(0.646 0.222 41.116)", // Warm color
  chart2: "oklch(0.6 0.118 184.704)", // Cool blue-green
  chart3: "oklch(0.398 0.07 227.392)", // Deeper blue
  chart4: "oklch(0.828 0.189 84.429)", // Bright green
  chart5: "oklch(0.769 0.188 70.08)", // Yellow-green
};

export default function CampaignsManagementPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch campaigns data
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/campaigns');
        const data = await response.json();
        
        if (data.success) {
          setCampaigns(data.campaigns);
        } else {
          throw new Error(data.error || 'Failed to fetch campaigns');
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns based on search term and status
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Prepare data for campaign performance chart
  const campaignPerformanceData = campaigns.map(campaign => ({
    name: campaign.name.length > 20 ? campaign.name.substring(0, 17) + "..." : campaign.name,
    revenue: campaign.revenueGenerated,
    usage: campaign.usageCount,
  }));

  // Handle adding a new campaign
  const handleAddCampaign = async (newCampaign: any) => {
    try {
      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCampaign),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the campaign list
        const refreshResponse = await fetch('/api/admin/campaigns');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          setCampaigns(refreshData.campaigns);
        }
        
        setIsAddModalOpen(false);
      } else {
        console.error('Failed to add campaign:', data.error);
      }
    } catch (err) {
      console.error('Error adding campaign:', err);
    }
  };

  // Handle editing a campaign
  const handleEditCampaign = async (updatedCampaign: any) => {
    try {
      const response = await fetch('/api/admin/campaigns', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCampaign),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the campaign list
        const refreshResponse = await fetch('/api/admin/campaigns');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          setCampaigns(refreshData.campaigns);
        }
        
        setIsEditModalOpen(false);
        setEditingCampaign(null);
      } else {
        console.error('Failed to update campaign:', data.error);
      }
    } catch (err) {
      console.error('Error updating campaign:', err);
    }
  };

  // Handle deleting a campaign
  const handleDeleteCampaign = async (id: string) => {
    try {
      const response = await fetch('/api/admin/campaigns', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the campaign list
        const refreshResponse = await fetch('/api/admin/campaigns');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          setCampaigns(refreshData.campaigns);
        }
      } else {
        console.error('Failed to delete campaign:', data.error);
      }
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  };

  // Toggle campaign status
  const toggleCampaignStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    
    try {
      const response = await fetch('/api/admin/campaigns', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the campaign list
        const refreshResponse = await fetch('/api/admin/campaigns');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          setCampaigns(refreshData.campaigns);
        }
      } else {
        console.error('Failed to update campaign status:', data.error);
      }
    } catch (err) {
      console.error('Error updating campaign status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading campaigns...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Campaign Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage marketing campaigns and promotions
        </p>
      </div>

      {/* Performance Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Revenue and usage metrics across all campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: chartColors.chart1,
              },
              usage: {
                label: "Usage",
                color: chartColors.chart2,
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaignPerformanceData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 50,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  className="text-xs"
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => `LKR ${value / 1000}k`}
                  className="text-xs"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  className="text-xs"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Revenue"
                  fill={chartColors.chart1}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="usage"
                  name="Usage Count"
                  fill={chartColors.chart2}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Credenza open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <CredenzaTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Campaign
                </Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <AddCampaignForm
                  onSubmit={handleAddCampaign}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </CredenzaContent>
            </Credenza>
          </div>
        </CardHeader>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns ({campaigns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {campaign.type.charAt(0).toUpperCase() +
                        campaign.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === "active"
                          ? "default"
                          : campaign.status === "scheduled"
                          ? "secondary"
                          : campaign.status === "paused"
                          ? "outline"
                          : "default"
                      }
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {campaign.discount > 0 ? `${campaign.discount}%` : "N/A"}
                  </TableCell>
                  <TableCell>{campaign.usageCount}</TableCell>
                  <TableCell>
                    {formatCurrency(campaign.revenueGenerated)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleCampaignStatus(campaign.id, campaign.status)
                        }
                      >
                        {campaign.status === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCampaign(campaign);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                      >
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
      
      {/* Edit Campaign Modal */}
      <Credenza open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <CredenzaContent>
          {editingCampaign && (
            <EditCampaignForm
              campaign={editingCampaign}
              onSubmit={handleEditCampaign}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </CredenzaContent>
      </Credenza>
    </div>
  );
}

// Add Campaign Form Component
function AddCampaignForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "discount",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    discount: "",
    targetAudience: "All Customers",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      type: "discount",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      discount: "",
      targetAudience: "All Customers",
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Add New Campaign</CredenzaTitle>
        <CredenzaDescription>
          Create a new marketing campaign or promotion
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="loyalty">Loyalty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) =>
                  setFormData({ ...formData, targetAudience: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Customers">All Customers</SelectItem>
                  <SelectItem value="Returning Customers">
                    Returning Customers
                  </SelectItem>
                  <SelectItem value="New Customers">New Customers</SelectItem>
                  <SelectItem value="Loyalty Members">
                    Loyalty Members
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          {formData.type === "discount" && (
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Percentage (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                required
              />
            </div>
          )}
        </form>
      </CredenzaBody>
      <CredenzaFooter>
        <CredenzaClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CredenzaClose>
        <Button type="submit" onClick={handleSubmit}>
          Add Campaign
        </Button>
      </CredenzaFooter>
    </>
  );
}

// Edit Campaign Form Component
function EditCampaignForm({
  campaign,
  onSubmit,
  onCancel,
}: {
  campaign: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    id: campaign.id,
    name: campaign.name || "",
    type: campaign.type || "discount",
    status: campaign.status || "draft",
    startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    discount: campaign.discount?.toString() || "",
    usageCount: campaign.usageCount?.toString() || "0",
    revenueGenerated: campaign.revenueGenerated?.toString() || "0",
    targetAudience: campaign.targetAudience || "All Customers",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      discount: parseFloat(formData.discount) || 0,
      usageCount: parseInt(formData.usageCount) || 0,
      revenueGenerated: parseFloat(formData.revenueGenerated) || 0,
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Edit Campaign</CredenzaTitle>
        <CredenzaDescription>
          Update campaign details
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Campaign Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Campaign Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="loyalty">Loyalty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-endDate">End Date</Label>
              <Input
                id="edit-endDate"
                type="date"
                value={formData.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-discount">Discount Percentage (%)</Label>
              <Input
                id="edit-discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-targetAudience">Target Audience</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) =>
                  setFormData({ ...formData, targetAudience: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Customers">All Customers</SelectItem>
                  <SelectItem value="Returning Customers">
                    Returning Customers
                  </SelectItem>
                  <SelectItem value="New Customers">New Customers</SelectItem>
                  <SelectItem value="Loyalty Members">
                    Loyalty Members
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-usageCount">Usage Count</Label>
              <Input
                id="edit-usageCount"
                type="number"
                min="0"
                value={formData.usageCount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, usageCount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-revenueGenerated">Revenue Generated (LKR)</Label>
              <Input
                id="edit-revenueGenerated"
                type="number"
                min="0"
                value={formData.revenueGenerated}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, revenueGenerated: e.target.value })
                }
              />
            </div>
          </div>
        </form>
      </CredenzaBody>
      <CredenzaFooter>
        <CredenzaClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CredenzaClose>
        <Button type="submit" onClick={handleSubmit}>
          Save Changes
        </Button>
      </CredenzaFooter>
    </>
  );
}
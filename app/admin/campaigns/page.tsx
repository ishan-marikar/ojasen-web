"use client";

import { useState } from "react";
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

// Mock data for campaigns
const mockCampaigns = [
  {
    id: "1",
    name: "Summer Wellness Special",
    type: "discount",
    status: "active",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-08-31"),
    discount: 15,
    usageCount: 42,
    revenueGenerated: 84000,
    targetAudience: "Returning Customers",
  },
  {
    id: "2",
    name: "New Year Yoga Package",
    type: "bundle",
    status: "scheduled",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-01-31"),
    discount: 20,
    usageCount: 0,
    revenueGenerated: 0,
    targetAudience: "All Customers",
  },
  {
    id: "3",
    name: "Referral Program",
    type: "referral",
    status: "active",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-12-31"),
    discount: 10,
    usageCount: 18,
    revenueGenerated: 36000,
    targetAudience: "All Customers",
  },
  {
    id: "4",
    name: "Loyalty Points Boost",
    type: "loyalty",
    status: "paused",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-05-31"),
    discount: 0,
    usageCount: 27,
    revenueGenerated: 54000,
    targetAudience: "Loyalty Members",
  },
];

// Mock data for campaign performance
const mockCampaignPerformance = [
  { name: "Summer Wellness", revenue: 84000, usage: 42 },
  { name: "New Year Yoga", revenue: 0, usage: 0 },
  { name: "Referral Program", revenue: 36000, usage: 18 },
  { name: "Loyalty Points", revenue: 54000, usage: 27 },
];

// Define colors directly as they are defined in CSS
const chartColors = {
  chart1: "oklch(0.646 0.222 41.116)", // Warm color
  chart2: "oklch(0.6 0.118 184.704)", // Cool blue-green
  chart3: "oklch(0.398 0.07 227.392)", // Deeper blue
  chart4: "oklch(0.828 0.189 84.429)", // Bright green
  chart5: "oklch(0.769 0.188 70.08)", // Yellow-green
};

export default function CampaignsManagementPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Handle adding a new campaign
  const handleAddCampaign = (newCampaign: any) => {
    const campaign = {
      ...newCampaign,
      id: (campaigns.length + 1).toString(),
      startDate: new Date(newCampaign.startDate),
      endDate: new Date(newCampaign.endDate),
      discount: parseInt(newCampaign.discount),
      usageCount: 0,
      revenueGenerated: 0,
    };
    setCampaigns([campaign, ...campaigns]);
    setIsAddModalOpen(false);
  };

  // Handle editing a campaign
  const handleEditCampaign = (updatedCampaign: any) => {
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === updatedCampaign.id
          ? { ...campaign, ...updatedCampaign }
          : campaign
      )
    );
    setIsEditModalOpen(false);
    setEditingCampaign(null);
  };

  // Handle deleting a campaign
  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
  };

  // Toggle campaign status
  const toggleCampaignStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, status: newStatus } : campaign
      )
    );
  };

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
                data={mockCampaignPerformance}
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
          <CardTitle>Campaigns</CardTitle>
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
                          : "outline"
                      }
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {campaign.startDate.toLocaleDateString()} -{" "}
                    {campaign.endDate.toLocaleDateString()}
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
    startDate: "",
    endDate: "",
    discount: "",
    targetAudience: "All Customers",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      type: "discount",
      startDate: "",
      endDate: "",
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

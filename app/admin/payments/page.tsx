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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  ChartLegendContent
} from "@/components/ui/chart";
import { Bar, BarChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Line, LineChart } from "recharts";
import { Search, Plus, Edit, Eye, Trash2, CreditCard, TrendingUp } from "lucide-react";
import { InvoiceService } from "@/lib/invoice-service";

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage
const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export default function PaymentsManagementPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load payments
      const paymentResult = await InvoiceService.getAllPayments();
      if (paymentResult.success) {
        setPayments(paymentResult.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter payments based on search term, status, and type
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.invoice?.invoiceNumber && payment.invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.purchaseOrder?.poNumber && payment.purchaseOrder.poNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.invoice?.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.purchaseOrder?.facilitator?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    const matchesType = typeFilter === "all" || 
      (typeFilter === "incoming" && payment.invoiceId) || 
      (typeFilter === "outgoing" && payment.purchaseOrderId);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle adding a new payment
  const handleAddPayment = async (newPayment: any) => {
    try {
      let result;
      if (newPayment.referenceType === "invoice") {
        result = await InvoiceService.recordInvoicePayment({
          invoiceId: newPayment.invoiceId || "placeholder-invoice-id",
          amount: parseFloat(newPayment.amount),
          paymentMethod: newPayment.paymentMethod,
          paymentDate: new Date(newPayment.paymentDate),
          referenceNumber: newPayment.referenceNumber,
          notes: newPayment.notes,
        });
      } else {
        result = await InvoiceService.recordPOPayment({
          purchaseOrderId: newPayment.purchaseOrderId || "placeholder-po-id",
          amount: parseFloat(newPayment.amount),
          paymentMethod: newPayment.paymentMethod,
          paymentDate: new Date(newPayment.paymentDate),
          referenceNumber: newPayment.referenceNumber,
          notes: newPayment.notes,
        });
      }
      
      if (result.success) {
        setPayments([result.data, ...payments]);
        setIsAddModalOpen(false);
      } else {
        console.error("Failed to create payment:", result.error);
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  // Handle editing a payment
  const handleEditPayment = (updatedPayment: any) => {
    setPayments(payments.map(payment => 
      payment.id === updatedPayment.id ? { ...payment, ...updatedPayment } : payment
    ));
    setIsEditModalOpen(false);
    setEditingPayment(null);
  };

  // Handle deleting a payment
  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  // Calculate totals
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const completedPayments = payments.filter(p => p.status === "completed").length;
  const pendingPayments = payments.filter(p => p.status === "pending").length;

  // Mock data for payment methods (in a real app, this would come from the database)
  const mockPaymentMethods = [
    { method: "Bank Transfer", count: 12, amount: 96000 },
    { method: "Credit Card", count: 8, amount: 64000 },
    { method: "Cash", count: 5, amount: 40000 },
    { method: "Check", count: 3, amount: 24000 },
  ];

  // Mock data for revenue over time (in a real app, this would come from the database)
  const mockRevenueOverTime = [
    { month: "Jan", revenue: 35000, payments: 15 },
    { month: "Feb", revenue: 42000, payments: 18 },
    { month: "Mar", revenue: 38000, payments: 16 },
    { month: "Apr", revenue: 45000, payments: 20 },
    { month: "May", revenue: 52000, payments: 22 },
    { month: "Jun", revenue: 48000, payments: 21 },
  ];

  // Define colors directly as they are defined in CSS
  const chartColors = {
    chart1: "oklch(0.646 0.222 41.116)",   // Warm color
    chart2: "oklch(0.6 0.118 184.704)",    // Cool blue-green
    chart3: "oklch(0.398 0.07 227.392)",   // Deeper blue
    chart4: "oklch(0.828 0.189 84.429)",   // Bright green
    chart5: "oklch(0.769 0.188 70.08)",    // Yellow-green
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track and manage all incoming and outgoing payments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalPayments}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalAmount)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {completedPayments}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {pendingPayments}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Payment Methods Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                amount: {
                  label: "Amount",
                  color: chartColors.chart1,
                },
              }} 
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockPaymentMethods}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="method" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    className="text-xs"
                  />
                  <YAxis 
                    tickFormatter={(value) => `LKR ${value/1000}k`}
                    className="text-xs"
                  />
                  <ChartTooltip 
                    cursor={false} 
                    content={<ChartTooltipContent />} 
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar 
                    dataKey="amount" 
                    name="Amount" 
                    fill={chartColors.chart1} 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Over Time Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue and payment count</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                revenue: {
                  label: "Revenue",
                  color: chartColors.chart1,
                },
                payments: {
                  label: "Payments",
                  color: chartColors.chart2,
                },
              }} 
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockRevenueOverTime}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                  />
                  <YAxis 
                    yAxisId="left"
                    tickFormatter={(value) => `LKR ${value/1000}k`}
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
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke={chartColors.chart1} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="payments" 
                    name="Payments" 
                    stroke={chartColors.chart2} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Credenza open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <CredenzaTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment
                </Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <AddPaymentForm 
                  onSubmit={handleAddPayment} 
                  onCancel={() => setIsAddModalOpen(false)} 
                />
              </CredenzaContent>
            </Credenza>
          </div>
        </CardHeader>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>Track all incoming and outgoing payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment #</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                  <TableCell>
                    {payment.invoice ? (
                      <div>
                        <div className="text-sm">Invoice</div>
                        <div className="text-sm font-medium">{payment.invoice.invoiceNumber}</div>
                      </div>
                    ) : payment.purchaseOrder ? (
                      <div>
                        <div className="text-sm">Purchase Order</div>
                        <div className="text-sm font-medium">{payment.purchaseOrder.poNumber}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">-</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.invoice ? (
                      <div>
                        <div>{payment.invoice.customerName}</div>
                        <div className="text-sm text-gray-500">Customer</div>
                      </div>
                    ) : payment.purchaseOrder ? (
                      <div>
                        <div>{payment.purchaseOrder.facilitator?.name || "Unknown"}</div>
                        <div className="text-sm text-gray-500">Facilitator</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">-</div>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {payment.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        payment.status === "completed" 
                          ? "default" 
                          : payment.status === "pending" 
                            ? "secondary" 
                            : "destructive"
                      }
                    >
                      {payment.status?.charAt(0).toUpperCase() + (payment.status?.slice(1) || "")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingPayment(payment);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePayment(payment.id)}
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

// Add Payment Form Component
function AddPaymentForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    referenceType: "invoice",
    invoiceId: "",
    purchaseOrderId: "",
    partyName: "",
    partyType: "customer",
    amount: "",
    paymentMethod: "Bank Transfer",
    paymentDate: new Date().toISOString().split('T')[0],
    status: "completed",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      referenceType: "invoice",
      invoiceId: "",
      purchaseOrderId: "",
      partyName: "",
      partyType: "customer",
      amount: "",
      paymentMethod: "Bank Transfer",
      paymentDate: new Date().toISOString().split('T')[0],
      status: "completed",
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Add New Payment</CredenzaTitle>
        <CredenzaDescription>
          Record a new payment transaction
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Reference Type</Label>
            <Select 
              value={formData.referenceType} 
              onValueChange={(value) => setFormData({...formData, referenceType: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="purchaseOrder">Purchase Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.referenceType === "invoice" ? (
            <div className="space-y-2">
              <Label htmlFor="invoiceId">Invoice ID</Label>
              <Input
                id="invoiceId"
                value={formData.invoiceId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, invoiceId: e.target.value})}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="purchaseOrderId">Purchase Order ID</Label>
              <Input
                id="purchaseOrderId"
                value={formData.purchaseOrderId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, purchaseOrderId: e.target.value})}
                required
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (LKR)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, paymentDate: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
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
          Add Payment
        </Button>
      </CredenzaFooter>
    </>
  );
}
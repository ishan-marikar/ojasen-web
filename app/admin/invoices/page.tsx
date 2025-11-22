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
import { Search, Plus, Edit, Eye, Trash2, FileText, Download, Send } from "lucide-react";
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

export default function InvoiceManagementPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("invoices");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load invoices
      const invoiceResult = await InvoiceService.getAllInvoices();
      if (invoiceResult.success) {
        setInvoices(invoiceResult.data || []);
      }

      // Load purchase orders
      const poResult = await InvoiceService.getAllPurchaseOrders();
      if (poResult.success) {
        setPurchaseOrders(poResult.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter purchase orders based on search term and status
  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (po.facilitator?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (po.facilitator?.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || po.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle adding a new invoice
  const handleAddInvoice = async (newInvoice: any) => {
    try {
      const result = await InvoiceService.createInvoice({
        customerName: newInvoice.customerName,
        customerEmail: newInvoice.customerEmail,
        dueDate: new Date(newInvoice.dueDate),
        subtotal: parseFloat(newInvoice.totalAmount),
        totalAmount: parseFloat(newInvoice.totalAmount),
      });
      
      if (result.success) {
        setInvoices([result.data, ...invoices]);
        setIsAddModalOpen(false);
      } else {
        console.error("Failed to create invoice:", result.error);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  // Handle adding a new purchase order
  const handleAddPurchaseOrder = async (newPO: any) => {
    try {
      // For now, we'll use a placeholder facilitator ID
      // In a real implementation, you would select from a list of facilitators
      const facilitatorId = "placeholder-facilitator-id";
      
      const result = await InvoiceService.createPurchaseOrder({
        facilitatorId: facilitatorId,
        dueDate: new Date(newPO.dueDate),
        subtotal: parseFloat(newPO.totalAmount),
        totalAmount: parseFloat(newPO.totalAmount),
      });
      
      if (result.success) {
        setPurchaseOrders([result.data, ...purchaseOrders]);
        setIsAddModalOpen(false);
      } else {
        console.error("Failed to create purchase order:", result.error);
      }
    } catch (error) {
      console.error("Error creating purchase order:", error);
    }
  };

  // Handle editing an item
  const handleEditItem = async (updatedItem: any) => {
    try {
      if (activeTab === "invoices") {
        const result = await InvoiceService.updateInvoiceStatus(updatedItem.id, updatedItem.status);
        if (result.success) {
          setInvoices(invoices.map(invoice => 
            invoice.id === updatedItem.id ? { ...invoice, ...updatedItem } : invoice
          ));
        }
      } else {
        const result = await InvoiceService.updatePOStatus(updatedItem.id, updatedItem.status);
        if (result.success) {
          setPurchaseOrders(purchaseOrders.map(po => 
            po.id === updatedItem.id ? { ...po, ...updatedItem } : po
          ));
        }
      }
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Handle deleting an item
  const handleDeleteItem = (id: string) => {
    if (activeTab === "invoices") {
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    } else {
      setPurchaseOrders(purchaseOrders.filter(po => po.id !== id));
    }
  };

  // Update item status
  const updateItemStatus = async (id: string, status: string) => {
    try {
      if (activeTab === "invoices") {
        const result = await InvoiceService.updateInvoiceStatus(id, status);
        if (result.success) {
          setInvoices(invoices.map(invoice => 
            invoice.id === id ? { ...invoice, status } : invoice
          ));
        }
      } else {
        const result = await InvoiceService.updatePOStatus(id, status);
        if (result.success) {
          setPurchaseOrders(purchaseOrders.map(po => 
            po.id === id ? { ...po, status } : po
          ));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice & Purchase Order Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage customer invoices and facilitator purchase orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {invoices.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Paid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {invoices.filter(i => i.status === "paid").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatCurrency(invoices.reduce((sum, invoice) => sum + (invoice.amountDue || 0), 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {invoices.filter(i => i.status === "overdue").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <Button 
          variant={activeTab === "invoices" ? "default" : "outline"}
          onClick={() => setActiveTab("invoices")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Invoices
        </Button>
        <Button 
          variant={activeTab === "purchase-orders" ? "default" : "outline"}
          onClick={() => setActiveTab("purchase-orders")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Purchase Orders
        </Button>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={`Search ${activeTab === "invoices" ? "invoices" : "purchase orders"}...`}
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Credenza open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <CredenzaTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add {activeTab === "invoices" ? "Invoice" : "Purchase Order"}
                </Button>
              </CredenzaTrigger>
              <CredenzaContent>
                {activeTab === "invoices" ? (
                  <AddInvoiceForm 
                    onSubmit={handleAddInvoice} 
                    onCancel={() => setIsAddModalOpen(false)} 
                  />
                ) : (
                  <AddPurchaseOrderForm 
                    onSubmit={handleAddPurchaseOrder} 
                    onCancel={() => setIsAddModalOpen(false)} 
                  />
                )}
              </CredenzaContent>
            </Credenza>
          </div>
        </CardHeader>
      </Card>

      {/* Invoices Table */}
      {activeTab === "invoices" && (
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage customer invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div>{invoice.customerName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amountPaid)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amountDue)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          invoice.status === "paid" 
                            ? "default" 
                            : invoice.status === "sent" 
                              ? "secondary" 
                              : invoice.status === "partial"
                                ? "outline"
                                : invoice.status === "overdue"
                                  ? "destructive"
                                  : "secondary"
                        }
                      >
                        {invoice.status?.charAt(0).toUpperCase() + (invoice.status?.slice(1) || "")}
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
                            setEditingItem(invoice);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteItem(invoice.id)}
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
      )}

      {/* Purchase Orders Table */}
      {activeTab === "purchase-orders" && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>Manage facilitator purchase orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO #</TableHead>
                  <TableHead>Facilitator</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div>{po.facilitator?.name || "Unknown"}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{po.facilitator?.email || ""}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(po.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(po.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(po.totalAmount)}</TableCell>
                    <TableCell>{formatCurrency(po.amountPaid)}</TableCell>
                    <TableCell>{formatCurrency(po.amountDue)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          po.status === "paid" 
                            ? "default" 
                            : po.status === "sent" 
                              ? "secondary" 
                              : "outline"
                        }
                      >
                        {po.status?.charAt(0).toUpperCase() + (po.status?.slice(1) || "")}
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
                            setEditingItem(po);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteItem(po.id)}
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
      )}
    </div>
  );
}

// Add Invoice Form Component
function AddInvoiceForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalAmount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      customerName: "",
      customerEmail: "",
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalAmount: "",
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Add New Invoice</CredenzaTitle>
        <CredenzaDescription>
          Create a new customer invoice
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, customerName: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Customer Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, customerEmail: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, issueDate: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, dueDate: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount (LKR)</Label>
            <Input
              id="totalAmount"
              type="number"
              min="0"
              value={formData.totalAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, totalAmount: e.target.value})}
              required
            />
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
          Add Invoice
        </Button>
      </CredenzaFooter>
    </>
  );
}

// Add Purchase Order Form Component
function AddPurchaseOrderForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    facilitatorName: "",
    facilitatorEmail: "",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalAmount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      facilitatorName: "",
      facilitatorEmail: "",
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalAmount: "",
    });
  };

  return (
    <>
      <CredenzaHeader>
        <CredenzaTitle>Add New Purchase Order</CredenzaTitle>
        <CredenzaDescription>
          Create a new facilitator purchase order
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facilitatorName">Facilitator Name</Label>
            <Input
              id="facilitatorName"
              value={formData.facilitatorName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, facilitatorName: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facilitatorEmail">Facilitator Email</Label>
            <Input
              id="facilitatorEmail"
              type="email"
              value={formData.facilitatorEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, facilitatorEmail: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, issueDate: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, dueDate: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount (LKR)</Label>
            <Input
              id="totalAmount"
              type="number"
              min="0"
              value={formData.totalAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, totalAmount: e.target.value})}
              required
            />
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
          Add Purchase Order
        </Button>
      </CredenzaFooter>
    </>
  );
}
// lib/invoice-service.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class InvoiceService {
  // Generate a unique invoice number
  static generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  }

  // Generate a unique purchase order number
  static generatePONumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${year}${month}${day}-${random}`;
  }

  // Generate a unique payment number
  static generatePaymentNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PAY-${year}${month}${day}-${random}`;
  }

  // Create a new invoice
  static async createInvoice(data: {
    customerId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    billingAddress?: string;
    dueDate: Date;
    subtotal: number;
    taxAmount?: number;
    totalAmount: number;
    currency?: string;
    notes?: string;
    terms?: string;
  }) {
    try {
      const invoice = await prisma.invoice.create({
        data: {
          id: crypto.randomUUID(),
          invoiceNumber: this.generateInvoiceNumber(),
          customerId: data.customerId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          billingAddress: data.billingAddress,
          dueDate: data.dueDate,
          subtotal: data.subtotal,
          taxAmount: data.taxAmount || 0,
          totalAmount: data.totalAmount,
          amountDue: data.totalAmount,
          currency: data.currency || "LKR",
          notes: data.notes,
          terms: data.terms,
        },
      });
      return { success: true, data: invoice };
    } catch (error) {
      console.error("Error creating invoice:", error);
      return { success: false, error: "Failed to create invoice" };
    }
  }

  // Create a purchase order for a facilitator
  static async createPurchaseOrder(data: {
    facilitatorId: string;
    dueDate: Date;
    subtotal: number;
    taxAmount?: number;
    totalAmount: number;
    currency?: string;
    notes?: string;
    terms?: string;
  }) {
    try {
      const facilitator = await prisma.facilitator.findUnique({
        where: { id: data.facilitatorId },
      });

      if (!facilitator) {
        return { success: false, error: "Facilitator not found" };
      }

      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          id: crypto.randomUUID(),
          poNumber: this.generatePONumber(),
          facilitatorId: data.facilitatorId,
          dueDate: data.dueDate,
          subtotal: data.subtotal,
          taxAmount: data.taxAmount || 0,
          totalAmount: data.totalAmount,
          amountDue: data.totalAmount,
          currency: data.currency || "LKR",
          notes: data.notes,
          terms: data.terms,
        },
      });
      return { success: true, data: purchaseOrder };
    } catch (error) {
      console.error("Error creating purchase order:", error);
      return { success: false, error: "Failed to create purchase order" };
    }
  }

  // Record a payment for an invoice
  static async recordInvoicePayment(data: {
    invoiceId: string;
    amount: number;
    paymentMethod: string;
    paymentDate?: Date;
    referenceNumber?: string;
    notes?: string;
  }) {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: data.invoiceId },
      });

      if (!invoice) {
        return { success: false, error: "Invoice not found" };
      }

      // Create the payment record
      const payment = await prisma.payment.create({
        data: {
          id: crypto.randomUUID(),
          paymentNumber: this.generatePaymentNumber(),
          invoiceId: data.invoiceId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          paymentDate: data.paymentDate || new Date(),
          referenceNumber: data.referenceNumber,
          notes: data.notes,
        },
      });

      // Update invoice payment status
      const amountPaid = invoice.amountPaid + data.amount;
      const amountDue = invoice.totalAmount - amountPaid;
      const status = amountDue <= 0 ? "paid" : amountPaid > 0 ? "partial" : invoice.status;

      await prisma.invoice.update({
        where: { id: data.invoiceId },
        data: {
          amountPaid,
          amountDue,
          status,
        },
      });

      return { success: true, data: payment };
    } catch (error) {
      console.error("Error recording invoice payment:", error);
      return { success: false, error: "Failed to record invoice payment" };
    }
  }

  // Record a payment for a purchase order
  static async recordPOPayment(data: {
    purchaseOrderId: string;
    amount: number;
    paymentMethod: string;
    paymentDate?: Date;
    referenceNumber?: string;
    notes?: string;
  }) {
    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id: data.purchaseOrderId },
      });

      if (!purchaseOrder) {
        return { success: false, error: "Purchase order not found" };
      }

      // Create the payment record
      const payment = await prisma.payment.create({
        data: {
          id: crypto.randomUUID(),
          paymentNumber: this.generatePaymentNumber(),
          purchaseOrderId: data.purchaseOrderId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          paymentDate: data.paymentDate || new Date(),
          referenceNumber: data.referenceNumber,
          notes: data.notes,
        },
      });

      // Update purchase order payment status
      const amountPaid = purchaseOrder.amountPaid + data.amount;
      const amountDue = purchaseOrder.totalAmount - amountPaid;
      const status = amountDue <= 0 ? "paid" : amountPaid > 0 ? "partial" : purchaseOrder.status;

      await prisma.purchaseOrder.update({
        where: { id: data.purchaseOrderId },
        data: {
          amountPaid,
          amountDue,
          status,
        },
      });

      return { success: true, data: payment };
    } catch (error) {
      console.error("Error recording purchase order payment:", error);
      return { success: false, error: "Failed to record purchase order payment" };
    }
  }

  // Get all invoices
  static async getAllInvoices() {
    try {
      const invoices = await prisma.invoice.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          payments: true,
        },
      });
      return { success: true, data: invoices };
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return { success: false, error: "Failed to fetch invoices" };
    }
  }

  // Get all purchase orders
  static async getAllPurchaseOrders() {
    try {
      const purchaseOrders = await prisma.purchaseOrder.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          facilitator: true,
          payments: true,
        },
      });
      return { success: true, data: purchaseOrders };
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      return { success: false, error: "Failed to fetch purchase orders" };
    }
  }

  // Get all payments
  static async getAllPayments() {
    try {
      const payments = await prisma.payment.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          invoice: true,
          purchaseOrder: true,
        },
      });
      return { success: true, data: payments };
    } catch (error) {
      console.error("Error fetching payments:", error);
      return { success: false, error: "Failed to fetch payments" };
    }
  }

  // Get invoice by ID
  static async getInvoiceById(id: string) {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          user: true,
          payments: true,
        },
      });
      if (!invoice) {
        return { success: false, error: "Invoice not found" };
      }
      return { success: true, data: invoice };
    } catch (error) {
      console.error("Error fetching invoice:", error);
      return { success: false, error: "Failed to fetch invoice" };
    }
  }

  // Get purchase order by ID
  static async getPurchaseOrderById(id: string) {
    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          facilitator: true,
          payments: true,
        },
      });
      if (!purchaseOrder) {
        return { success: false, error: "Purchase order not found" };
      }
      return { success: true, data: purchaseOrder };
    } catch (error) {
      console.error("Error fetching purchase order:", error);
      return { success: false, error: "Failed to fetch purchase order" };
    }
  }

  // Update invoice status
  static async updateInvoiceStatus(id: string, status: string) {
    try {
      const invoice = await prisma.invoice.update({
        where: { id },
        data: { status },
      });
      return { success: true, data: invoice };
    } catch (error) {
      console.error("Error updating invoice status:", error);
      return { success: false, error: "Failed to update invoice status" };
    }
  }

  // Update purchase order status
  static async updatePOStatus(id: string, status: string) {
    try {
      const purchaseOrder = await prisma.purchaseOrder.update({
        where: { id },
        data: { status },
      });
      return { success: true, data: purchaseOrder };
    } catch (error) {
      console.error("Error updating purchase order status:", error);
      return { success: false, error: "Failed to update purchase order status" };
    }
  }

  // Get financial summary
  static async getFinancialSummary() {
    try {
      // Get total invoices and amounts
      const invoices = await prisma.invoice.findMany({
        select: {
          totalAmount: true,
          amountPaid: true,
          status: true,
        },
      });

      // Get total purchase orders and amounts
      const purchaseOrders = await prisma.purchaseOrder.findMany({
        select: {
          totalAmount: true,
          amountPaid: true,
          status: true,
        },
      });

      // Get total payments
      const payments = await prisma.payment.findMany({
        select: {
          amount: true,
          status: true,
        },
      });

      // Calculate invoice statistics
      const totalInvoices = invoices.length;
      const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
      const totalInvoicePaid = invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0);
      const totalInvoiceDue = totalInvoiceAmount - totalInvoicePaid;
      const paidInvoices = invoices.filter(i => i.status === "paid").length;
      const overdueInvoices = invoices.filter(i => i.status === "overdue").length;

      // Calculate purchase order statistics
      const totalPurchaseOrders = purchaseOrders.length;
      const totalPOAmount = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
      const totalPOPaid = purchaseOrders.reduce((sum, po) => sum + po.amountPaid, 0);
      const totalPODue = totalPOAmount - totalPOPaid;
      const paidPurchaseOrders = purchaseOrders.filter(po => po.status === "paid").length;

      // Calculate payment statistics
      const totalPayments = payments.length;
      const totalPaymentAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const completedPayments = payments.filter(p => p.status === "completed").length;

      return {
        success: true,
        data: {
          invoices: {
            total: totalInvoices,
            totalAmount: totalInvoiceAmount,
            totalPaid: totalInvoicePaid,
            totalDue: totalInvoiceDue,
            paid: paidInvoices,
            overdue: overdueInvoices,
          },
          purchaseOrders: {
            total: totalPurchaseOrders,
            totalAmount: totalPOAmount,
            totalPaid: totalPOPaid,
            totalDue: totalPODue,
            paid: paidPurchaseOrders,
          },
          payments: {
            total: totalPayments,
            totalAmount: totalPaymentAmount,
            completed: completedPayments,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      return { success: false, error: "Failed to fetch financial summary" };
    }
  }
}
"use client";

import { AdminRoute } from "@/components/admin-route";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { name: "Dashboard", href: "/admin" },
  { name: "Bookings", href: "/admin/bookings" },
  { name: "Facilitators", href: "/admin/facilitators" },
  { name: "Customers", href: "/admin/customers" },
  { name: "Financial Reports", href: "/admin/financial-reports" },
  { name: "Invoices & POs", href: "/admin/invoices" },
  { name: "Payments", href: "/admin/payments" },
  { name: "Campaigns", href: "/admin/campaigns" },
  { name: "User Permissions", href: "/admin/permissions" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminRoute>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h2>
          </div>
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {adminNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </AdminRoute>
  );
}

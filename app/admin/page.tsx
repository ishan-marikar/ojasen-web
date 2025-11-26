// app/admin/page.tsx
"use client";

import { AdminRoute } from "@/components/admin-route";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Line,
  LineChart,
} from "recharts";

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

export default function AdminPage() {
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [facilitators, setFacilitators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch admin metrics
        const metricsResponse = await fetch("/api/admin/metrics");
        const metricsData = await metricsResponse.json();

        if (metricsData.success) {
          setAdminMetrics(metricsData.metrics);
        } else {
          throw new Error(metricsData.error || "Failed to fetch metrics");
        }

        // Fetch bookings
        const bookingsResponse = await fetch("/api/admin/bookings");
        const bookingsData = await bookingsResponse.json();

        if (bookingsData.success) {
          setBookings(bookingsData.bookings);
        } else {
          throw new Error(bookingsData.error || "Failed to fetch bookings");
        }

        // Fetch facilitators
        const facilitatorsResponse = await fetch("/api/admin/facilitators");
        const facilitatorsData = await facilitatorsResponse.json();

        if (facilitatorsData.success) {
          setFacilitators(facilitatorsData.facilitators);
        } else {
          throw new Error(
            facilitatorsData.error || "Failed to fetch facilitators"
          );
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchData, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Prepare data for charts
  const seasonChartData = adminMetrics
    ? Object.entries(adminMetrics.seasonBreakdown).map(
        ([season, data]: [string, any]) => ({
          season,
          revenue: data.totalRevenue,
          costs: data.facilitatorCosts,
        })
      )
    : [];

  const performanceChartData = adminMetrics
    ? [
        {
          name: "Confirmed",
          value: adminMetrics.campaignPerformance.confirmedBookings,
        },
        {
          name: "Pending",
          value: adminMetrics.campaignPerformance.pendingBookings,
        },
        {
          name: "Cancelled",
          value: Math.round(
            (adminMetrics.campaignPerformance.totalBookings *
              adminMetrics.campaignPerformance.cancellationRate) /
              100
          ),
        },
      ]
    : [];

  const revenueOverTimeData = adminMetrics ? adminMetrics.revenueOverTime : [];

  // Define colors directly as they are defined in CSS
  // Light mode colors from globals.css
  const chartColors = {
    chart1: "oklch(0.646 0.222 41.116)", // Warm color
    chart2: "oklch(0.6 0.118 184.704)", // Cool blue-green
    chart3: "oklch(0.398 0.07 227.392)", // Deeper blue
    chart4: "oklch(0.828 0.189 84.429)", // Bright green
    chart5: "oklch(0.769 0.188 70.08)", // Yellow-green
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (error) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ojasen Healing Arts
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Admin Dashboard
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="px-3 py-1">
                  Admin
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Key metrics and performance indicators
            </p>
          </div>

          {/* Key Metrics Cards */}
          {adminMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Revenue
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(adminMetrics.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +20.1% from last period
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Facilitator Costs
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(adminMetrics.totalFacilitatorCosts)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +18.1% from last period
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Gross Profit
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(adminMetrics.grossProfit)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +25.3% from last period
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pending Bookings
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {adminMetrics.outstandingInvoices}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requires attention
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts Section */}
          {adminMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue by Season Chart */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Revenue by Season</CardTitle>
                  <CardDescription>
                    Seasonal breakdown of revenue and costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: chartColors.chart1,
                      },
                      costs: {
                        label: "Costs",
                        color: chartColors.chart2,
                      },
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={seasonChartData}
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
                          dataKey="season"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          className="text-xs"
                        />
                        <YAxis
                          tickFormatter={(value) => `LKR ${value / 1000}k`}
                          className="text-xs"
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                          dataKey="revenue"
                          name="Revenue"
                          fill={chartColors.chart1}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="costs"
                          name="Costs"
                          fill={chartColors.chart2}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Booking Performance Chart */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Booking Performance</CardTitle>
                  <CardDescription>
                    Overview of booking statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      confirmed: {
                        label: "Confirmed",
                        color: chartColors.chart1,
                      },
                      pending: {
                        label: "Pending",
                        color: chartColors.chart2,
                      },
                      cancelled: {
                        label: "Cancelled",
                        color: chartColors.chart3,
                      },
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={performanceChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {performanceChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 0
                                  ? chartColors.chart1
                                  : index === 1
                                  ? chartColors.chart2
                                  : chartColors.chart3
                              }
                            />
                          ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Revenue Over Time Chart */}
          {adminMetrics && (
            <Card className="mb-8 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue & Profit Over Time</CardTitle>
                <CardDescription>
                  Monthly revenue and profit trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: chartColors.chart1,
                    },
                    profit: {
                      label: "Profit",
                      color: chartColors.chart2,
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueOverTimeData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-gray-200 dark:stroke-gray-700"
                      />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis
                        tickFormatter={(value) => `LKR ${value / 1000}k`}
                        className="text-xs"
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke={chartColors.chart1}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
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
          )}

          <Separator className="my-8 bg-gray-200 dark:bg-gray-800" />

          {/* Customer & Loyalty Insights */}
          {adminMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Customer History */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                  <CardDescription>
                    Customer history and retention metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Returning Customers
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Customers with multiple bookings
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {adminMetrics.customerHistory.returningCustomers}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          New Customers
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          First-time customers
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {adminMetrics.customerHistory.newCustomers}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Retention Rate
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Percentage of returning customers
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {formatPercentage(
                          adminMetrics.customerHistory.customerRetentionRate
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Loyalty Program */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Loyalty Program</CardTitle>
                  <CardDescription>
                    Voucher and campaign performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Active Vouchers
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Currently available vouchers
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {adminMetrics.loyaltyProgram.activeVouchers}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Redeemed Vouchers
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Vouchers used by customers
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {adminMetrics.loyaltyProgram.redeemedVouchers}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Campaign Engagement
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Customer participation rate
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        {formatPercentage(
                          adminMetrics.loyaltyProgram.campaignEngagement
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Separator className="my-8 bg-gray-200 dark:bg-gray-800" />

          {/* Detailed Metrics Section */}
          {adminMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Customer Insights */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Customer Value Metrics</CardTitle>
                  <CardDescription>
                    Customer lifetime value analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Total Customers
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Active customer base
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {adminMetrics.customerLifetimeValue.totalCustomers}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Avg. Customer Value
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Lifetime value per customer
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(
                          adminMetrics.customerLifetimeValue
                            .avgCustomerLifetimeValue
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Total Customer Value
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cumulative customer value
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(
                          adminMetrics.customerLifetimeValue.totalCustomerValue
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Facilitator Insights */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Facilitator Performance</CardTitle>
                  <CardDescription>
                    Facilitator cost and assignment metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Total Facilitators
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Active facilitators
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {adminMetrics.facilitatorLifetimeCost.totalFacilitators}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Avg. Facilitator Cost
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Lifetime cost per facilitator
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(
                          adminMetrics.facilitatorLifetimeCost
                            .avgFacilitatorLifetimeCost
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Total Facilitator Cost
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cumulative facilitator costs
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(
                          adminMetrics.facilitatorLifetimeCost
                            .totalFacilitatorCost
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Business Performance */}
          {adminMetrics && (
            <Card className="mb-8 shadow-sm">
              <CardHeader>
                <CardTitle>Business Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {adminMetrics.campaignPerformance.totalBookings}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Total Bookings
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {adminMetrics.campaignPerformance.confirmedBookings}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Confirmed
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {adminMetrics.campaignPerformance.pendingBookings}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Pending
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatPercentage(
                        adminMetrics.campaignPerformance.cancellationRate
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Cancellation Rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="my-8 bg-gray-200 dark:bg-gray-800" />

          {/* Season Breakdown */}
          {adminMetrics &&
            Object.keys(adminMetrics.seasonBreakdown).length > 0 && (
              <Card className="mb-8 shadow-sm">
                <CardHeader>
                  <CardTitle>Seasonal Breakdown</CardTitle>
                  <CardDescription>
                    Detailed revenue and cost analysis by season
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(adminMetrics.seasonBreakdown).map(
                      ([season, data]: [string, any]) => (
                        <div
                          key={season}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {season}
                          </h4>
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Revenue
                              </span>
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                {formatCurrency(data.totalRevenue)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Costs
                              </span>
                              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                {formatCurrency(data.facilitatorCosts)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Bookings
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {data.bookingCount}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                Profit
                              </span>
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(
                                  data.totalRevenue - data.facilitatorCosts
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          <Separator className="my-8 bg-gray-200 dark:bg-gray-800" />

          {/* Facilitators Section */}
          <Card className="mb-8 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Facilitators</CardTitle>
                  <CardDescription>
                    Manage facilitators and their details
                  </CardDescription>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                  Add Facilitator
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Base Fee
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Commission
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Assigned Bookings
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {facilitators.map((facilitator) => (
                      <tr
                        key={facilitator.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {facilitator.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {facilitator.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {facilitator.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {formatCurrency(facilitator.baseFee)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <Badge variant="secondary">
                            {(facilitator.commission * 100).toFixed(0)}%
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {facilitator.assignedBookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <button className="text-primary hover:text-primary/80 mr-3">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Latest bookings and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Event
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Participants
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Facilitator
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {booking.eventName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {booking.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {booking.eventDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {booking.numberOfPeople}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {formatCurrency(booking.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {booking.facilitator}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <button className="text-primary hover:text-primary/80">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminRoute>
  );
}
import React from "react";
import { Package, ShoppingCart, MessageSquare, TrendingUp } from "lucide-react";
import { useGetAllOrdersQuery } from "../../redux/services/crudorder";
import { useGetStatsQuery } from "../../redux/services/crudstats";

export function Overview() {
  const { data: statsResponse, isLoading: isStatsLoading } = useGetStatsQuery();
  const { data: ordersResponse, isLoading: isOrdersLoading } = useGetAllOrdersQuery();
  const statsData = (statsResponse?.data ?? {}) as Record<string, unknown>;
  const orders = (ordersResponse?.data as Array<Record<string, unknown>>) ?? [];

  const stats = [
    {
      title: "Total Products",
      value: String(
        statsData.totalProducts ??
          statsData.products ??
          statsData.productCount ??
          0,
      ),
      change: "+12%",
      icon: Package,
      color: "#fef200",
    },
    {
      title: "Total Orders",
      value: String(
        statsData.totalOrders ??
          statsData.orders ??
          statsData.orderCount ??
          0,
      ),
      change: "+8%",
      icon: ShoppingCart,
      color: "#fef200",
    },
    {
      title: "Messages",
      value: String(
        statsData.totalMessages ??
          statsData.messages ??
          statsData.messageCount ??
          0,
      ),
      change: "+5",
      icon: MessageSquare,
      color: "#fef200",
    },
    {
      title: "Revenue",
      value: `$${String(
        statsData.totalRevenue ??
          statsData.revenue ??
          0,
      )}`,
      change: "+15%",
      icon: TrendingUp,
      color: "#fef200",
    },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => {
      const aTime = new Date(String(a.createdAt ?? a.date ?? 0)).getTime();
      const bTime = new Date(String(b.createdAt ?? b.date ?? 0)).getTime();
      return bTime - aTime;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: stat.color }}
              >
                <stat.icon size={24} className="text-black" />
              </div>
              <span className="text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={String(order._id ?? order.id)} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{String(order._id ?? order.id ?? "-")}</td>
                  <td className="px-6 py-4">{String(order.customer ?? order.customerName ?? "-")}</td>
                  <td className="px-6 py-4">{String(order.product ?? order.productName ?? "-")}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        String(order.status ?? "") === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : String(order.status ?? "") === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : String(order.status ?? "") === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {String(order.status ?? "Unknown")}
                    </span>
                  </td>
                  <td className="px-6 py-4">${String(order.total ?? order.totalPrice ?? 0)}</td>
                </tr>
              ))}
              {!isOrdersLoading && recentOrders.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={5}>
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {(isStatsLoading || isOrdersLoading) && (
          <div className="p-6 text-gray-600">Loading dashboard data...</div>
        )}
      </div>
    </div>
  );
}

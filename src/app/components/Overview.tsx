import React from "react";
import { Package, ShoppingCart, MessageSquare, TrendingUp } from "lucide-react";
import { useGetAllOrdersQuery } from "../../redux/services/crudorder";
import { useGetAllProductsQuery } from "../../redux/services/crudproduct";
import { useGetStatsQuery } from "../../redux/services/crudstats";

export function Overview() {
  const { data: statsResponse, isLoading: isStatsLoading } = useGetStatsQuery();
  const { data: ordersResponse, isLoading: isOrdersLoading } = useGetAllOrdersQuery();
  const { data: productsResponse } = useGetAllProductsQuery();
  const statsData = (statsResponse?.data ?? {}) as Record<string, unknown>;
  const orders = (ordersResponse?.data as Array<Record<string, unknown>>) ?? [];
  const products = productsResponse?.data ?? [];

  const normalizeRevenue = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value) || 0;
    if (Array.isArray(value)) {
      return value.reduce((sum, item) => {
        if (typeof item === "number") return sum + item;
        if (typeof item === "string") return sum + (Number(item) || 0);
        return sum;
      }, 0);
    }
    return 0;
  };

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
          statsData.totalMsgs ??
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
      value: `$${normalizeRevenue(
        statsData.totalRevenue ?? statsData.revenue ?? 0,
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

  const getCustomerName = (order: Record<string, unknown>) =>
    String(
      (order.userInfo as { name?: string } | undefined)?.name ??
        order.customer ??
        order.customerName ??
        "-",
    );

  const getProductName = (order: Record<string, unknown>) => {
    const cartItems = (order.cartItems as Array<{ product?: string }> | undefined) ?? [];
    const productId = String(order.product ?? order.productName ?? cartItems[0]?.product ?? "-");
    const matched = products.find((item) => item._id === productId);
    return matched?.name ?? productId;
  };

  const getSize = (order: Record<string, unknown>) => {
    const cartItems =
      (order.cartItems as Array<{ variations?: Array<{ size?: string }> }> | undefined) ?? [];
    const sizes = cartItems.flatMap((item) =>
      (item.variations ?? [])
        .map((variation) => variation.size)
        .filter((value): value is string => Boolean(value)),
    );
    return sizes.length ? sizes.join(", ") : "-";
  };

  const getColor = (order: Record<string, unknown>) => {
    const cartItems =
      (order.cartItems as Array<{ variations?: Array<{ color?: string }> }> | undefined) ?? [];
    const colors = cartItems.flatMap((item) =>
      (item.variations ?? [])
        .map((variation) => variation.color)
        .filter((value): value is string => Boolean(value)),
    );
    return colors.length ? colors.join(", ") : "-";
  };

  const getQuantity = (order: Record<string, unknown>) => {
    const cartItems =
      (order.cartItems as Array<{ variations?: Array<{ quantity?: number }> }> | undefined) ?? [];
    const quantity = cartItems.reduce(
      (sum, item) =>
        sum +
        (item.variations?.reduce(
          (innerSum, variation) => innerSum + (variation.quantity ?? 0),
          0,
        ) ?? 0),
      0,
    );
    return quantity || "-";
  };

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
                <th className="px-6 py-3 text-left">Size</th>
                <th className="px-6 py-3 text-left">Color</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={String(order._id ?? order.id)} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{String(order._id ?? order.id ?? "-")}</td>
                  <td className="px-6 py-4">{getCustomerName(order)}</td>
                  <td className="px-6 py-4">{getProductName(order)}</td>
                  <td className="px-6 py-4">{getSize(order)}</td>
                  <td className="px-6 py-4">{getColor(order)}</td>
                  <td className="px-6 py-4">{String(getQuantity(order))}</td>
                  <td className="px-6 py-4">${String(order.totalOrderPrice ?? order.total ?? order.totalPrice ?? 0)}</td>
                  <td className="px-6 py-4">{String(order.date ?? order.createdAt ?? "-").slice(0, 10)}</td>
                </tr>
              ))}
              {!isOrdersLoading && recentOrders.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={8}>
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

import { Package, ShoppingCart, MessageSquare, TrendingUp } from "lucide-react";

export function Overview() {
  const stats = [
    {
      title: "Total Products",
      value: "156",
      change: "+12%",
      icon: Package,
      color: "#fef200",
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8%",
      icon: ShoppingCart,
      color: "#fef200",
    },
    {
      title: "Messages",
      value: "48",
      change: "+5",
      icon: MessageSquare,
      color: "#fef200",
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+15%",
      icon: TrendingUp,
      color: "#fef200",
    },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", product: "Laptop", status: "Delivered", amount: "$1,299" },
    { id: "ORD-002", customer: "Jane Smith", product: "Smartphone", status: "Pending", amount: "$899" },
    { id: "ORD-003", customer: "Mike Johnson", product: "Headphones", status: "Shipped", amount: "$199" },
    { id: "ORD-004", customer: "Sarah Williams", product: "Tablet", status: "Processing", amount: "$599" },
    { id: "ORD-005", customer: "Tom Brown", product: "Smartwatch", status: "Delivered", amount: "$399" },
  ];

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
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.product}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

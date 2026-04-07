import { useState } from "react";
import { Search, Eye } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  quantity: number;
  total: number;
  status: string;
  date: string;
}

export function Orders() {
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      product: "Laptop Pro",
      quantity: 1,
      total: 1299,
      status: "Delivered",
      date: "2026-04-05",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      product: "Smartphone X",
      quantity: 2,
      total: 1798,
      status: "Pending",
      date: "2026-04-06",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      email: "mike@example.com",
      product: "Bluetooth Headphones",
      quantity: 1,
      total: 199,
      status: "Shipped",
      date: "2026-04-04",
    },
    {
      id: "ORD-004",
      customer: "Sarah Williams",
      email: "sarah@example.com",
      product: "Wireless Mouse",
      quantity: 3,
      total: 87,
      status: "Processing",
      date: "2026-04-07",
    },
    {
      id: "ORD-005",
      customer: "Tom Brown",
      email: "tom@example.com",
      product: "USB-C Cable",
      quantity: 5,
      total: 75,
      status: "Delivered",
      date: "2026-04-03",
    },
    {
      id: "ORD-006",
      customer: "Emily Davis",
      email: "emily@example.com",
      product: "Laptop Pro",
      quantity: 1,
      total: 1299,
      status: "Pending",
      date: "2026-04-07",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Orders</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders by ID, customer, or product..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.product}</td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4">${order.total}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm bg-white/20" onClick={() => setSelectedOrder(null)} />
          <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Order ID</p>
                  <p>{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p>{selectedOrder.date}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Customer</p>
                <p>{selectedOrder.customer}</p>
                <p className="text-sm text-gray-500">{selectedOrder.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Product</p>
                <p>{selectedOrder.product}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Quantity</p>
                  <p>{selectedOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p>${selectedOrder.total}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 rounded-lg"
                style={{ backgroundColor: "#fef200", color: "#000" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

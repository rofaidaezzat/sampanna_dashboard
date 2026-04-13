import { useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
} from "../../redux/services/crudorder";

interface Order {
  _id?: string;
  id?: string;
  customer?: string;
  customerName?: string;
  email?: string;
  product?: string;
  productName?: string;
  quantity?: number;
  total?: number;
  totalPrice?: number;
  status?: string;
  date?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionError, setActionError] = useState("");

  const { data, isLoading, isError } = useGetAllOrdersQuery();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const orders = ((data?.data as Order[]) ?? []);

  const filteredOrders = orders.filter(
    (order) =>
      (order._id ?? order.id ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.customer ?? order.customerName ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.product ?? order.productName ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleDeleteOrder = async (id: string) => {
    setActionError("");
    try {
      await deleteOrder(id).unwrap();
    } catch (err: unknown) {
      const maybeError = err as { data?: { message?: string }; message?: string };
      setActionError(
        maybeError?.data?.message ??
          maybeError?.message ??
          "Failed to delete order.",
      );
    }
  };

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
                <tr key={order._id ?? order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{order._id ?? order.id ?? "-"}</td>
                  <td className="px-6 py-4">{order.customer ?? order.customerName ?? "-"}</td>
                  <td className="px-6 py-4">{order.product ?? order.productName ?? "-"}</td>
                  <td className="px-6 py-4">{order.quantity ?? "-"}</td>
                  <td className="px-6 py-4">${order.total ?? order.totalPrice ?? 0}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        order.status ?? ""
                      )}`}
                    >
                      {order.status ?? "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.date ?? order.createdAt?.slice(0, 10) ?? "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        disabled={isDeleting}
                        onClick={() => {
                          const id = order._id ?? order.id;
                          if (id) {
                            void handleDeleteOrder(id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredOrders.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={8}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isLoading && <div className="p-6 text-gray-600">Loading orders...</div>}
        {isError && <div className="p-6 text-red-600">Failed to load orders.</div>}
        {actionError && <div className="p-6 text-red-600">{actionError}</div>}
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
                  <p>{selectedOrder._id ?? selectedOrder.id ?? "-"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p>{selectedOrder.date ?? selectedOrder.createdAt?.slice(0, 10) ?? "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Customer</p>
                <p>{selectedOrder.customer ?? selectedOrder.customerName ?? "-"}</p>
                <p className="text-sm text-gray-500">{selectedOrder.email ?? "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Product</p>
                <p>{selectedOrder.product ?? selectedOrder.productName ?? "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Quantity</p>
                  <p>{selectedOrder.quantity ?? "-"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p>${selectedOrder.total ?? selectedOrder.totalPrice ?? 0}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                    selectedOrder.status ?? ""
                  )}`}
                >
                  {selectedOrder.status ?? "Unknown"}
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

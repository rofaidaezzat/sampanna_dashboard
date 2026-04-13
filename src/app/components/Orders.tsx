import React from "react";
import { useState } from "react";
import { Search, Eye, Trash2, Pencil } from "lucide-react";
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useLazyGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "../../redux/services/crudorder";
import { useGetAllProductsQuery } from "../../redux/services/crudproduct";

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
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  cartItems?: Array<{
    product?: string;
    price?: number;
    variations?: Array<{
      quantity?: number;
      size?: string;
      color?: string;
    }>;
  }>;
  totalOrderPrice?: number;
  orderStatus?: string;
  shippingAddress?: {
    city?: string;
    district?: string;
    details?: string;
  };
  [key: string]: unknown;
}

type EditOrderForm = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  details: string;
  product: string;
  price: string;
  quantity: string;
  size: string;
  color: string;
};

export function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<EditOrderForm | null>(null);
  const [actionError, setActionError] = useState("");

  const { data, isLoading, isError } = useGetAllOrdersQuery();
  const { data: productsResponse } = useGetAllProductsQuery();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [getOrderById, { isLoading: isFetchingDetails }] = useLazyGetOrderByIdQuery();
  const orders = ((data?.data as Order[]) ?? []);
  const products = productsResponse?.data ?? [];

  const getCustomerName = (order: Order) =>
    order.userInfo?.name ?? order.customer ?? order.customerName ?? "-";

  const getCustomerEmail = (order: Order) =>
    order.userInfo?.email ?? order.email ?? "-";

  const getFirstProduct = (order: Order) => {
    if (order.productName) return order.productName;
    const productId = order.product ?? order.cartItems?.[0]?.product;
    if (!productId) return "-";
    const productName = products.find((item) => item._id === productId)?.name;
    return productName ?? productId;
  };

  const getOrderSize = (order: Order) => {
    const sizes =
      order.cartItems?.flatMap(
        (item) => item.variations?.map((variation) => variation.size).filter(Boolean) ?? [],
      ) ?? [];
    return sizes.length > 0 ? sizes.join(", ") : "-";
  };

  const getOrderColor = (order: Order) => {
    const colors =
      order.cartItems?.flatMap(
        (item) => item.variations?.map((variation) => variation.color).filter(Boolean) ?? [],
      ) ?? [];
    return colors.length > 0 ? colors.join(", ") : "-";
  };

  const getTotalQuantity = (order: Order) => {
    if (typeof order.quantity === "number") return order.quantity;
    return (
      order.cartItems?.reduce(
        (sum, item) =>
          sum +
          (item.variations?.reduce(
            (variationSum, variation) =>
              variationSum + (variation.quantity ?? 0),
            0,
          ) ?? 0),
        0,
      ) ?? "-"
    );
  };

  const getOrderTotal = (order: Order) =>
    order.totalOrderPrice ?? order.total ?? order.totalPrice ?? 0;

  const getOrderStatus = (order: Order) =>
    order.orderStatus ?? order.status ?? "Unknown";

  const filteredOrders = orders.filter(
    (order) =>
      (order._id ?? order.id ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getCustomerName(order)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getFirstProduct(order)
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

  const handleViewOrder = async (id: string) => {
    setActionError("");
    try {
      const response = await getOrderById(id).unwrap();
      setSelectedOrder((response.data as Order) ?? null);
    } catch (err: unknown) {
      const maybeError = err as { data?: { message?: string }; message?: string };
      setActionError(
        maybeError?.data?.message ??
          maybeError?.message ??
          "Failed to load order details.",
      );
    }
  };

  const handleOpenEditOrder = (order: Order) => {
    const firstItem = order.cartItems?.[0];
    const firstVariation = firstItem?.variations?.[0];
    const id = order._id ?? order.id;
    if (!id) return;

    setEditingOrder({
      id,
      name: order.userInfo?.name ?? "",
      email: order.userInfo?.email ?? "",
      phone: order.userInfo?.phone ?? "",
      city: order.shippingAddress?.city ?? "",
      district: order.shippingAddress?.district ?? "",
      details: order.shippingAddress?.details ?? "",
      product: firstItem?.product ?? "",
      price: String(firstItem?.price ?? 0),
      quantity: String(firstVariation?.quantity ?? 1),
      size: firstVariation?.size ?? "M",
      color: firstVariation?.color ?? "Black",
    });
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    setActionError("");

    try {
      await updateOrder({
        id: editingOrder.id,
        body: {
          userInfo: {
            name: editingOrder.name,
            email: editingOrder.email,
            phone: editingOrder.phone,
          },
          cartItems: [
            {
              product: editingOrder.product,
              price: Number(editingOrder.price),
              variations: [
                {
                  quantity: Number(editingOrder.quantity),
                  size: editingOrder.size,
                  color: editingOrder.color,
                },
              ],
            },
          ],
          shippingAddress: {
            city: editingOrder.city,
            district: editingOrder.district,
            details: editingOrder.details,
          },
        },
      }).unwrap();

      setEditingOrder(null);
    } catch (err: unknown) {
      const maybeError = err as { data?: { message?: string }; message?: string };
      setActionError(
        maybeError?.data?.message ??
          maybeError?.message ??
          "Failed to update order.",
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
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
                <th className="px-6 py-3 text-left">Size</th>
                <th className="px-6 py-3 text-left">Color</th>
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
                  <td className="px-6 py-4">{getCustomerName(order)}</td>
                  <td className="px-6 py-4">{getFirstProduct(order)}</td>
                  <td className="px-6 py-4">{getOrderSize(order)}</td>
                  <td className="px-6 py-4">{getOrderColor(order)}</td>
                  <td className="px-6 py-4">{getTotalQuantity(order)}</td>
                  <td className="px-6 py-4">${getOrderTotal(order)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        getOrderStatus(order)
                      )}`}
                    >
                      {getOrderStatus(order)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.date ?? order.createdAt?.slice(0, 10) ?? "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isFetchingDetails}
                        onClick={() => {
                          const id = order._id ?? order.id;
                          if (id) {
                            void handleViewOrder(id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 disabled:opacity-50"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenEditOrder(order)}
                        className="p-2 rounded-lg hover:bg-amber-50 text-amber-600"
                      >
                        <Pencil size={18} />
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
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={10}>
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
                <p>{getCustomerName(selectedOrder)}</p>
                <p className="text-sm text-gray-500">{getCustomerEmail(selectedOrder)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Product</p>
                <p>{getFirstProduct(selectedOrder)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Size</p>
                  <p>{getOrderSize(selectedOrder)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Color</p>
                  <p>{getOrderColor(selectedOrder)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Quantity</p>
                  <p>{getTotalQuantity(selectedOrder)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p>${getOrderTotal(selectedOrder)}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                    getOrderStatus(selectedOrder)
                  )}`}
                >
                  {getOrderStatus(selectedOrder)}
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

      {editingOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-white/20"
            onClick={() => setEditingOrder(null)}
          />
          <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl mb-4">Update Order</h2>
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  value={editingOrder.name}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, name: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  value={editingOrder.email}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, email: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Email"
                  required
                />
                <input
                  value={editingOrder.phone}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, phone: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Phone"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  value={editingOrder.city}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, city: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="City"
                  required
                />
                <input
                  value={editingOrder.district}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, district: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="District"
                  required
                />
                <input
                  value={editingOrder.details}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, details: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Address Details"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <select
                  value={editingOrder.product}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, product: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editingOrder.price}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, price: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Price"
                  required
                />
                <input
                  type="number"
                  value={editingOrder.quantity}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, quantity: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Quantity"
                  required
                />
                <input
                  value={editingOrder.size}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, size: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Size"
                  required
                />
                <input
                  value={editingOrder.color}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, color: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Color"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2 rounded-lg"
                  style={{ backgroundColor: "#fef200", color: "#000" }}
                >
                  {isUpdating ? "Updating..." : "Update Order"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Laptop Pro", category: "Electronics", price: 1299, stock: 45, status: "Active" },
    { id: "2", name: "Wireless Mouse", category: "Accessories", price: 29, stock: 120, status: "Active" },
    { id: "3", name: "USB-C Cable", category: "Accessories", price: 15, stock: 200, status: "Active" },
    { id: "4", name: "Smartphone X", category: "Electronics", price: 899, stock: 60, status: "Active" },
    { id: "5", name: "Bluetooth Headphones", category: "Audio", price: 199, stock: 85, status: "Active" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        status: product.status,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
          : p
      ));
    } else {
      // Create new product
      const newProduct: Product = {
        id: (products.length + 1).toString(),
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: formData.status,
      };
      setProducts([...products, newProduct]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: '#fef200', color: '#000' }}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg"
                  style={{ backgroundColor: '#fef200', color: '#000' }}
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
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

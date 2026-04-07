import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  size?: string[];
  color?: string[];
  image?: string;
  price: number;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Classic T-Shirt", category: "Men", size: ["M"], color: ["Black"], price: 29 },
    { id: "2", name: "Summer Dress", category: "Women", size: ["S"], color: ["Red"], price: 49 },
    { id: "3", name: "Unisex Hoodie", category: "Men & Women", size: ["L"], color: ["Blue"], price: 59 },
    { id: "4", name: "Denim Jacket", category: "Men", size: ["XL"], color: ["Blue"], price: 89 },
    { id: "5", name: "Running Shoes", category: "Men & Women", size: ["M"], color: ["White"], price: 120 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "Men",
    size: [] as string[],
    color: [] as string[],
    image: "",
    price: "",
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        size: product.size || [],
        color: product.color || [],
        image: product.image || "",
        price: product.price.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "Men",
        size: [],
        color: [],
        image: "",
        price: "",
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
          ? { ...p, ...formData, price: parseFloat(formData.price) }
          : p
      ));
    } else {
      // Create new product
      const newProduct: Product = {
        id: (products.length + 1).toString(),
        name: formData.name,
        category: formData.category,
        size: formData.size,
        color: formData.color,
        image: formData.image,
        price: parseFloat(formData.price),
      };
      setProducts([...products, newProduct]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
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
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                    )}
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">${product.price}</td>
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm bg-white/20" onClick={handleCloseModal} />
          <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-md">
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
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Men & Women">Men & Women (Together)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Sizes Available</label>
                  <div className="flex flex-wrap gap-2">
                    {["S", "M", "L", "XL"].map(s => (
                      <label key={s} className="flex items-center gap-1 text-sm border px-2 py-1 rounded cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.size.includes(s)}
                          onChange={(e) => {
                            if (e.target.checked) setFormData({ ...formData, size: [...formData.size, s] });
                            else setFormData({ ...formData, size: formData.size.filter(x => x !== s) });
                          }}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">Colors Available</label>
                  <div className="flex flex-wrap gap-2">
                    {["Black", "White", "Silver", "Blue", "Red"].map(c => (
                      <label key={c} className="flex items-center gap-1 text-sm border px-2 py-1 rounded cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.color.includes(c)}
                          onChange={(e) => {
                            if (e.target.checked) setFormData({ ...formData, color: [...formData.color, c] });
                            else setFormData({ ...formData, color: formData.color.filter(x => x !== c) });
                          }}
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div>
                <label className="block text-sm mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = URL.createObjectURL(e.target.files[0]);
                      setFormData({ ...formData, image: url });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {formData.image && (
                  <div className="mt-2 text-sm text-gray-500">Image selected/uploaded</div>
                )}
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

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm bg-white/20" onClick={() => setProductToDelete(null)} />
          <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Delete Product</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

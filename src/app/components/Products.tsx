import React from "react";
import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  Product,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useLazyGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../redux/services/crudproduct";

type ProductForm = {
  name: string;
  description: string;
  category: string;
  size: string[];
  color: string[];
  price: string;
  imageFile: File | null;
};

const initialForm: ProductForm = {
  name: "",
  description: "",
  category: "men",
  size: [],
  color: [],
  price: "",
  imageFile: null,
};

export function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ProductForm>(initialForm);

  const { data, isLoading, isError } = useGetAllProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [getProductById, { isLoading: isFetchingDetails }] =
    useLazyGetProductByIdQuery();

  const products = data?.data ?? [];
  const isSubmitting = isCreating || isUpdating;

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [products, searchTerm],
  );

  const handleOpenModal = (product?: Product) => {
    setError("");
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        size: product.sizes,
        color: product.colors,
        price: product.price.toString(),
        imageFile: null,
      });
    } else {
      setEditingProduct(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialForm);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const body = new FormData();
    body.append("name", formData.name);
    body.append("description", formData.description);
    body.append("category", formData.category);
    body.append("price", formData.price);
    body.append("sizes", JSON.stringify(formData.size));
    body.append("colors", JSON.stringify(formData.color));

    if (formData.imageFile) {
      body.append("images", formData.imageFile);
    }

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, body }).unwrap();
      } else {
        await createProduct(body).unwrap();
      }
      handleCloseModal();
    } catch (err: unknown) {
      const maybeError = err as { data?: { message?: string }; message?: string };
      setError(
        maybeError?.data?.message ??
          maybeError?.message ??
          "Request failed. Please try again.",
      );
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete?._id) return;
    setError("");

    try {
      await deleteProduct(productToDelete._id).unwrap();
      setProductToDelete(null);
    } catch (err: unknown) {
      const maybeError = err as { data?: { message?: string }; message?: string };
      setError(
        maybeError?.data?.message ??
          maybeError?.message ??
          "Failed to delete product.",
      );
    }
  };

  const handleViewProduct = async (id: string) => {
    setError("");
    try {
      const response = await getProductById(id).unwrap();
      setSelectedProduct(response.data);
    } catch (err: unknown) {
      const maybeError = err as { data?: { message?: string }; message?: string };
      setError(
        maybeError?.data?.message ??
          maybeError?.message ??
          "Failed to load product details.",
      );
    }
  };

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
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{product._id}</td>
                  <td className="px-6 py-4">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
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
                        disabled={isFetchingDetails}
                        onClick={() => void handleViewProduct(product._id)}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 disabled:opacity-50"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        disabled={isDeleting}
                        onClick={() => setProductToDelete(product)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredProducts.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isLoading && <div className="p-6 text-gray-600">Loading products...</div>}
        {isError && <div className="p-6 text-red-600">Failed to load products.</div>}
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
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  rows={3}
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
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
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
                      setFormData({ ...formData, imageFile: e.target.files[0] });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {formData.imageFile && (
                  <div className="mt-2 text-sm text-gray-500">Image selected/uploaded</div>
                )}
              </div>
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-lg"
                  style={{ backgroundColor: '#fef200', color: '#000' }}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingProduct
                      ? "Update"
                      : "Create"}
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

      {productToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-white/20"
            onClick={() => setProductToDelete(null)}
          />
          <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Delete Product</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium">{productToDelete.name}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => void handleDeleteProduct()}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
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

      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-white/20"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">ID</p>
                  <p>{selectedProduct._id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p>{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Description</p>
                  <p>{selectedProduct.description}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Category</p>
                  <p>{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Price</p>
                  <p>${selectedProduct.price}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Sizes</p>
                  <p>{selectedProduct.sizes?.join(", ") || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Colors</p>
                  <p>{selectedProduct.colors?.join(", ") || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Images</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(selectedProduct.images ?? []).map((image) => (
                      <img
                        key={image}
                        src={image}
                        alt={selectedProduct.name}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-6 w-full py-2 rounded-lg"
              style={{ backgroundColor: "#fef200", color: "#000" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { addProductFormElements } from "../../../config/index";
import ImageUpload from "../../components/admin-view/imageupload";
import { useDispatch, useSelector } from "react-redux";
import { findAllProduct, addNewProduct, updateProduct, deleteProduct } from "../../store/admin-slice/products/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProductTile from "../../components/admin-view/product-tile";

export default function Products() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    salePrice: 0,
    stock: 0,
    description: "",
    category: "",
    brand: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [editProductId, setEditProductId] = useState(null);

  const dispatch = useDispatch();
  const { productList = [] } = useSelector((state) => state.adminProduct);

  useEffect(() => {
    dispatch(findAllProduct());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["salePrice", "stock", "price"].includes(name) ? Number(value) : value,
    });
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      price: product.price,
      salePrice: product.salesprice || 0,
      stock: product.stock || 0,
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
    });
    setImageUrl(product.image);
    setEditProductId(product._id);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !imageUrl) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const finalData = {
      ...formData,
      image: imageUrl,
      salesprice: formData.salePrice,
      stock: Number(formData.totalStock) || 0,
    };

    try {
      if (editProductId) {
        await dispatch(updateProduct({ id: editProductId, updatedProduct: finalData }));
        toast.success("Product Updated Successfully!");
      } else {
        await dispatch(addNewProduct(finalData));
        toast.success("Product Added Successfully!");
      }
      dispatch(findAllProduct());
      setIsOpen(false);
      setEditProductId(null);
      setFormData({ title: "", price: 0, salePrice: 0, stock: 0, description: "", category: "", brand: "" });
      setImageUrl("");
    } catch (error) {
      toast.error("Failed to Save Product!");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteProduct(productId));
      toast.success("Product Deleted Successfully!");
      dispatch(findAllProduct());
    } catch (error) {
      toast.error("Failed to Delete Product!");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />

      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={() => {
            setIsOpen(true);
            setFormData({ title: "", price: 0, salePrice: 0, stock: 0, description: "", category: "", brand: "" });
            setImageUrl("");
            setEditProductId(null);
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {productList.length > 0 ? (
    productList.map((product) => (
      <AdminProductTile key={product._id} product={product} onEdit={handleEdit} onDelete={handleDelete} />
    ))
  ) : (
    <p className="text-gray-500 col-span-full text-center">No products available.</p>
  )}
</div>


      {/* Product Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editProductId ? "Edit Product" : "Add New Product"}</h2>

            <ImageUpload onImageUpload={setImageUrl} existingImage={imageUrl} />

            <form onSubmit={handleSubmit}>
              {addProductFormElements.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block font-semibold">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                    value={formData[field.name] || ""}
                  />
                </div>
              ))}

              <div className="flex justify-end gap-4">
                <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  {editProductId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

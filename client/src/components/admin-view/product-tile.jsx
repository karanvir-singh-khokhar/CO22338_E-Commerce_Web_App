export default function AdminProductTile({ product, onEdit, onDelete }) {
  if (!product || !product.image || !product.title || !product.price) {
    return (
      <div className="border rounded-xl shadow-lg p-6 bg-white w-full sm:w-80 flex items-center justify-center text-gray-500">
        Invalid Product Data
      </div>
    );
  }

  return (
    <div className="border rounded-xl shadow-lg p-5 bg-white w-full sm:max-w-xs transition-all hover:shadow-xl hover:scale-[1.03] duration-300">
      {/* Product Image */}
      <div className="relative w-full h-56">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Product Title */}
      <h2 className="text-lg font-semibold mt-3 text-gray-800">{product.title}</h2>

      {/* Product Price */}
      <div className="flex justify-between items-center mt-2">
        <span className={`text-gray-600 ${product.salePrice ? "line-through text-gray-400" : ""}`}>
          ${product.price.toFixed(2)}
        </span>
        {product.salePrice && (
          <span className="text-red-600 font-semibold">${product.salePrice.toFixed(2)}</span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button 
          onClick={() => onEdit(product)} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition">
          Edit
        </button>
        <button 
          onClick={() => onDelete(product?._id)} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 active:scale-95 transition">
          Delete
        </button>
      </div>
    </div>
  );
}

function ShoppingProductTile({ product,handleProductDetails,handleAddtoCart}) {  
    return ( 
        <div className="border rounded-xl shadow-lg p-5 bg-white w-full sm:max-w-xs transition-all hover:shadow-xl hover:scale-[1.03] duration-300" onClick={()=>handleProductDetails(product._id)}>
            <div className="relative w-full h-56">
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>

            <h2 className="text-lg font-semibold mt-3 text-gray-800">{product.title}</h2>

            <div className="flex justify-between items-center mt-2">
                <span className={`text-gray-600 ${product.salePrice ? "line-through text-gray-400" : ""}`}>
                    ${product.price ? product.price.toFixed(2) : "N/A"}
                </span>
                {product.salePrice && (
                    <span className="text-red-600 font-semibold">
                        ${product.salePrice ? product.salePrice.toFixed(2) : "N/A"}
                    </span>
                )}
            </div>
            <h2 className="text-sm font-light mt-3 text-gray-800">{product.brand}</h2>
            {product.stock>0 &&(
                            <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddtoCart(product?._id)
                            }} 
                           
                            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                            Add to Cart
                        </button>
            )
            }

        </div>
    );
}

export default ShoppingProductTile;

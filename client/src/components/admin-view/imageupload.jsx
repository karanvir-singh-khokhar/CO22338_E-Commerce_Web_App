import { useState } from "react";
import { CloudUpload, X } from "lucide-react";

function ImageUpload({ onImageUpload }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // For preview
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl); // Show preview

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/upload_image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setImage(data.imageUrl); // Save uploaded image URL
        onImageUpload(data.imageUrl); // Send image URL to parent
      } else {
        console.error("Upload failed:", data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setImage(null);
    onImageUpload(null); // Reset image in parent
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-full max-w-md bg-white">
      <h1 className="text-lg font-semibold mb-2">Upload Image</h1>

      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500"
      >
        <CloudUpload className="size-20 text-gray-500" />
        <span className="mt-2 text-gray-600">Drag & Drop or Click to Upload</span>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>

      {/* Image Preview */}
      {previewUrl && (
        <div className="mt-4 relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto rounded-lg border"
          />
          <X
            className="absolute top-2 right-2 text-red-500 cursor-pointer bg-white rounded-full p-1"
            onClick={removeImage}
          />
        </div>
      )}

      {loading && <p className="text-blue-500 mt-2">Uploading...</p>}
    </div>
  );
}

export default ImageUpload;

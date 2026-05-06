function AddressCard({ addressInfo ,handleDeleteAddress,handleUpdateAddress,setCurrentSelectedAddress}) {
    if (!addressInfo) return null;
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm space-y-1" onClick={setCurrentSelectedAddress?()=>setCurrentSelectedAddress(addressInfo):null}>
        <p><strong>Address:</strong> {addressInfo?.address}</p>
        <p><strong>City:</strong> {addressInfo?.city}</p>
        <p><strong>Pincode:</strong> {addressInfo?.pincode}</p>
        <p><strong>Number:</strong> {addressInfo?.number}</p>
        <p><strong>Notes:</strong> {addressInfo?.notes}</p>
        <div className="flex items-center gap-4 mt-3">
        <button className="px-4 py-2 bg-green-600 hover:bg-green-800 text-white rounded-full shadow-sm transition" onClick={()=>handleUpdateAddress(addressInfo)}>
         Edit
        </button>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-800 text-white rounded-full shadow-sm transition" onClick={()=>handleDeleteAddress(addressInfo)}>
        Delete
        </button>
        </div>

      </div>
    );
  }
  
  export default AddressCard;
  
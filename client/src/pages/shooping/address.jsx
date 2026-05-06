import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import {addAddress,fetchAllAddress,editAddress,deleteAddress} from '../../store/shop-slice/address-slice/index'
import AddressCard from '../../pages/shooping/address-cart'
import { toast, Toaster } from "react-hot-toast";


const initialAddress = {
  address: '',
  city: '',
  pincode: '',
  number: '',
  notes: ''
};

function Address({setCurrentSelectedAddress}) {
  const [formData, setFormData] = useState(initialAddress);
  const dispatch=useDispatch()
    const { user } = useSelector((state) => state.auth);
    const {addressList}=useSelector((state)=>state.address)
    const [editMode, setEditMode] = useState(null);
    
    function handleDeleteAddress(addressInfo) {
      dispatch(deleteAddress({ userId: user._id, addressId: addressInfo._id })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress({ userId: user._id }));
          setFormData(initialAddress);
          if (editMode === addressInfo._id) {
            setEditMode(null);
          }
        }
      });
    }
    

  
    function handleUpdateAddress(addressInfo){
      setEditMode(addressInfo._id)
      setFormData({
        ...formData,
        address: addressInfo.address,
        city: addressInfo.city,
        pincode: addressInfo.pincode,
        number: addressInfo.number,
        notes: addressInfo.notes
      })
    }


  function handleChange(e) {
    const { name, value } = e.target;
    console.log(name,"name")
    console.log(value,"value")
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleManageAddresses(event) {
    event.preventDefault();
    if (!editMode && addressList.length >= 3) {
      toast.error("Failed to add more than 3 addresses");
      return;
    }
    
  
    if (editMode) {
      dispatch(editAddress({ userId: user._id, addressId: editMode, ...formData })).then((data) => {
        if (data?.payload?.success) {
          toast.success("Address edited successfully");
          setFormData(initialAddress);
          setEditMode(null);
          dispatch(fetchAllAddress({ userId: user._id }));
        }
      });
    } else {
      dispatch(addAddress({ ...formData, userId: user._id })).then((data) => {
        if (data?.payload?.success) {
          toast.success("Address Added successfully");
          setFormData(initialAddress);
          dispatch(fetchAllAddress({ userId: user._id }));
        }
      });
    }
  }
  
  console.log(addressList,"addressList")

  useEffect(()=>{
    dispatch(fetchAllAddress({ userId: user._id }));
  },[dispatch,user._id])

  return (
    <div className="p-6 bg-white rounded shadow-md">
                  <Toaster />

      <h1 className="text-2xl font-semibold mb-4">Address List</h1>
      <div className="space-y-4 mb-6">
  {addressList && addressList.length > 0 && (
    addressList.map((singleAddressitem) => (
      <AddressCard key={singleAddressitem._id} addressInfo={singleAddressitem} handleDeleteAddress={handleDeleteAddress} handleUpdateAddress={handleUpdateAddress} setCurrentSelectedAddress={setCurrentSelectedAddress}/>
    ))
  )}
</div>

      <div>

          {editMode ? (
            <p className="text-lg font-medium mb-2">Editing address</p>
          ):(
            <h2 className="text-lg font-medium mb-2">Add New Address</h2>
          )}
        
        <form onSubmit={handleManageAddresses} className="space-y-4">
          <div>
            <label htmlFor="address" className="block font-medium">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="city" className="block font-medium">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="pincode" className="block font-medium">Pincode:</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="number" className="block font-medium">Number:</label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block font-medium">Notes:</label>
            <input
              type="text"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              required
              className="w-full p-6 border rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editMode?"Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Address;

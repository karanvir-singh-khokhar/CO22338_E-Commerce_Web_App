import { useState } from "react";
import account from "../../assets/account.jpg";
import Address from '../../pages/shooping/address'
import ShopingOrders from '../../pages/shooping/orders'
function Account() {
    const [view, setView] = useState(null); 


    return (
        <div>
            <div className="min-h-screen p-8 bg-gray-100 border-2 border-red-500">
               

                <div className="mt-8 flex justify-center">
                    <img src={account} alt="Account"  />
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={() => setView("orders")}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setView("address")}
                        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        Address
                    </button>
                </div>

                <div className="mt-8">
                    {view === "orders" && <ShopingOrders />}
                    {view === "address" && <Address />}
                </div>
            </div>
        </div>
    );
}

export default Account;

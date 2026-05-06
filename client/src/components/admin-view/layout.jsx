import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./header";
import Sidebar from "./sidebar";

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return ( 
        <div className="flex min-h-screen w-full">
            {/* Header */}
            <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            {/* Sidebar + Content */}
            <div className="flex flex-1 flex-row pt-[64px]"> {/* Prevent content from hiding behind header */}
                {/* Sidebar */}
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                {/* Main Content (Adjusted for Sidebar) */}
                <main 
                    className={`flex-1 flex-col flex bg-muted/40 p-4 md:p-6 transition-all duration-300 ${
                        isSidebarOpen ? "ml-64 md:ml-0" : "ml-0"
                    }`}
                    onClick={() => setIsSidebarOpen(false)} // Close sidebar on clicking outside
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;

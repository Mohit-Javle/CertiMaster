import { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Sidebar, DashboardTopbar } from "./Sidebar";

const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden font-sans text-slate-900 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Soft decorative background glows */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[120px] pointer-events-none" />

                <DashboardTopbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export { MainLayout, DashboardLayout };

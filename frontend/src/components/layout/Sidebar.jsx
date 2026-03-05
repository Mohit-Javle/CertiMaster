import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, LayoutTemplate, Settings, LogOut, Menu, X, Award, Search, Bell, ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { name: "User", email: "" };
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "My Certificates", path: "/my-certificates", icon: FileText },
        { name: "Templates", path: "/templates", icon: LayoutTemplate },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white/70 backdrop-blur-xl text-slate-600 transition-all duration-300 ease-in-out md:static md:flex md:flex-col border-r border-slate-200/50 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } ${!isHovered ? "w-20" : "w-64"} md:translate-x-0`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex h-16 items-center justify-between px-6 bg-white/50 border-b border-slate-100">
                    <Link to="/" className={`flex items-center gap-2 text-slate-900 ${!isHovered ? "justify-center w-full px-0 mx-auto" : ""}`}>
                        <Award className="h-6 w-6 text-amber-500 shrink-0" />
                        {isHovered && <span className="text-xl font-bold tracking-tight">CertiMaster</span>}
                    </Link>
                    {isHovered && (
                        <button className="md:hidden" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <div className="mb-6 px-2">

                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname.startsWith(item.path);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${isActive
                                            ? "bg-white text-amber-600 skeuo-raised border border-white/50"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                            } ${!isHovered ? "justify-center" : "gap-3"}`}
                                        onClick={() => setIsOpen(false)}
                                        title={!isHovered ? item.name : undefined}
                                    >
                                        <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-amber-500" : "text-slate-500"}`} />
                                        {isHovered && <span>{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
                    {/* User Profile & Notifications Area */}
                    <Link
                        to="/settings"
                        className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors w-full cursor-pointer ${!isHovered ? "justify-center" : "gap-3"}`}
                        title={!isHovered ? "Profile" : undefined}
                    >
                        <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 text-white font-medium skeuo-raised border border-amber-400">
                            {getInitials(user.name)}
                        </div>
                        {isHovered && (
                            <div className="flex-1 min-w-0 flex items-center justify-between text-slate-900">
                                <span className="truncate font-semibold">{user.name}</span>
                            </div>
                        )}
                    </Link>

                    <button
                        className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full relative ${!isHovered ? "justify-center" : "gap-3"}`}
                        title={!isHovered ? "Notifications" : undefined}
                    >
                        <div className="relative shrink-0">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border border-white shadow-sm"></span>
                        </div>
                        {isHovered && <span>Notifications</span>}
                    </button>

                    <div className="h-px bg-slate-100 my-1"></div>

                    {/* Logout Button */}
                    <Link
                        to="/login"
                        onClick={handleLogout}
                        className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full ${!isHovered ? "justify-center" : "gap-3"}`}
                        title={!isHovered ? "Sign out" : undefined}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {isHovered && <span>Sign out</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
};

const DashboardTopbar = ({ onOpenSidebar }) => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { name: "User" };
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/40 backdrop-blur-md px-4 sm:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenSidebar}
                    className="p-2 text-slate-500 hover:text-slate-900 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="hidden sm:flex items-center gap-2 relative text-slate-900">
                    <Search className="absolute left-3 h-4 w-4 text-slate-400 z-10" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="h-10 w-64 rounded-xl border border-slate-200/50 bg-white/30 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all font-medium skeuo-input"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Empty spacer or you could add something else here later */}
            </div>
        </header>
    );
};

export { Sidebar, DashboardTopbar };

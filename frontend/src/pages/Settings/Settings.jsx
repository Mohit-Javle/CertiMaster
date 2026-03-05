import { useState } from "react";
import { User, Lock, Bell, UploadCloud } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { name: "User", email: "" };

    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const handleSave = async () => {
        setMessage({ type: "", text: "" });
        setIsSaving(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: "error", text: data.message || "Failed to update profile" });
                return;
            }

            // Update local storage
            localStorage.setItem("user", JSON.stringify(data.user));
            setMessage({ type: "success", text: "Profile updated successfully!" });

            // clear success message after 3s
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);

        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Server error. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account preferences and personal information.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Nav */}
                <div className="w-full md:w-64 shrink-0">
                    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                        {[
                            { id: "profile", label: "Profile", icon: User },
                            { id: "security", label: "Security", icon: Lock },
                            { id: "notifications", label: "Notifications", icon: Bell },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-amber-100 text-amber-900"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-amber-600' : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === "profile" && (
                        <Card className="p-6 md:p-8 border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Profile Information</h2>

                            <div className="mb-8 flex items-center gap-6">
                                <div className="h-20 w-20 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-bold relative group cursor-pointer shadow-md">
                                    {getInitials(user.name)}
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity flex-col gap-1">
                                        <UploadCloud className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Profile Picture</h3>
                                    <p className="text-sm text-slate-500 mb-3">JPG, GIF or PNG. 1MB max.</p>
                                    <Button variant="outline" size="sm">Change Picture</Button>
                                </div>
                            </div>

                            <div className="space-y-5 max-w-md">
                                {message.text && (
                                    <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {message.text}
                                    </div>
                                )}
                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <Input
                                    label="Email Address"
                                    value={formData.email}
                                    type="email"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <Input label="Organization / Company" defaultValue="" placeholder="Enter your organization" />

                                <div className="pt-4 border-t border-slate-100">
                                    <Button
                                        onClick={handleSave}
                                        isLoading={isSaving}
                                        className="bg-slate-900 text-white hover:bg-slate-800"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <Card className="p-6 md:p-8 border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Update Password</h2>
                            <div className="space-y-5 max-w-md">
                                <Input label="Current Password" type="password" />
                                <Input label="New Password" type="password" />
                                <Input label="Confirm New Password" type="password" />

                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <Button className="bg-slate-900 text-white hover:bg-slate-800">Update Password</Button>
                                    <button className="text-sm font-medium text-red-500 hover:text-red-600">Delete Account</button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === "notifications" && (
                        <Card className="p-6 md:p-8 border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Email Preferences</h2>

                            <div className="space-y-6">
                                {[
                                    { title: "Product Updates", desc: "Receive emails about new features and templates." },
                                    { title: "Successful Generations", desc: "Get notified when a large batch finishes generating." },
                                    { title: "Monthly Digest", desc: "A summary of your template usage and statistics." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1">
                                            <div className="w-10 h-6 bg-amber-500 rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900">{item.title}</h4>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-6 border-t border-slate-100">
                                    <Button className="bg-slate-900 text-white hover:bg-slate-800">Save Preferences</Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div >
    );
};

export { Settings };

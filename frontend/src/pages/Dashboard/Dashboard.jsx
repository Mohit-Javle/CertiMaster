import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, FileText, LayoutTemplate, Plus, Users, Clock, Download, ArrowRight, Settings } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

const Dashboard = () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { name: "User" };

    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/certificates", {
                    headers: { "x-auth-token": token }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCertificates(data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const totalGenerated = certificates.reduce((acc, cert) => {
        if (cert.type === 'bulk') {
            const count = parseInt(cert.recipientName) || 1;
            return acc + count;
        }
        return acc + 1;
    }, 0);

    const uniqueTemplates = new Set(certificates.map(c => c.templateId)).size;

    const stats = [
        { label: "Total Generated", value: totalGenerated.toLocaleString(), icon: Award, color: "text-amber-500", bg: "bg-amber-100" },
        { label: "Templates Used", value: uniqueTemplates.toString(), icon: LayoutTemplate, color: "text-emerald-500", bg: "bg-emerald-100" },
        { label: "Recent Downloads", value: totalGenerated.toLocaleString(), icon: Download, color: "text-blue-500", bg: "bg-blue-100" }
    ];

    const recentActivity = certificates.slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium">Welcome back, <span className="text-amber-600">{user.name}</span>. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Link to="/templates" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full">
                            <LayoutTemplate className="mr-2 h-4 w-4" /> Browse Templates
                        </Button>
                    </Link>
                    <Link to="/bulk" className="w-full sm:w-auto">
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Bulk Generate
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card variant="skeuo" className="p-6 flex items-center gap-4 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} skeuo-raised border border-white`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-sm font-bold text-slate-500 mb-0.5 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-600" /> Recent Activity
                        </h2>
                        <Link to="/my-certificates" className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors flex items-center">
                            View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <Card className="overflow-hidden border-slate-200">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
                                Loading activity...
                            </div>
                        ) : recentActivity.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No recent activity found. Generate a certificate to get started!
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentActivity.map((cert) => (
                                    <div key={cert._id} className="p-4 hover:bg-amber-50/50 transition-all flex items-center justify-between border-b border-slate-100 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${cert.type === 'bulk' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'
                                                } border border-white shadow-sm ring-1 ring-slate-100`}>
                                                {cert.type === 'bulk' ? <Users className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 truncate">
                                                    {cert.type === 'bulk' ? `Bulk Batch: ${cert.courseTitle}` : cert.recipientName}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 truncate uppercase tracking-widest font-bold opacity-70">
                                                    {cert.type === 'bulk' ? 'Multiple recipients' : cert.courseTitle} • {cert.issueDate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4 shrink-0">
                                            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${cert.type === 'bulk' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                                                } border border-current opacity-60`}>
                                                {cert.type === 'bulk' ? 'Batch' : 'Single'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-xl font-extrabold text-slate-900 px-1">Quick Actions</h2>
                    <Card variant="skeuo" className="p-2">
                        <div className="flex flex-col gap-1">
                            <Link to="/templates" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all group border border-transparent hover:border-amber-100 active:skeuo-pressed">
                                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform skeuo-raised border border-white">
                                    <LayoutTemplate className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">Start from Template</p>
                                    <p className="text-xs text-slate-500 font-medium">Browse 50+ premium designs</p>
                                </div>
                            </Link>

                            <Link to="/bulk" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all group border border-transparent hover:border-indigo-100 active:skeuo-pressed">
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform skeuo-raised border border-white">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">Bulk Generation</p>
                                    <p className="text-xs text-slate-500 font-medium">Upload Excel or CSV data</p>
                                </div>
                            </Link>

                            <Link to="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all group border border-transparent hover:border-slate-200 active:skeuo-pressed">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform skeuo-raised border border-white">
                                    <Settings className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">Account Settings</p>
                                    <p className="text-xs text-slate-500 font-medium">Manage profile and preferences</p>
                                </div>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export { Dashboard };

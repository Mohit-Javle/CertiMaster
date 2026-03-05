import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Download, Trash2, FileText, Users, Eye } from "lucide-react";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { mockCertificates } from "../../data/mockData";

const MyCertificates = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/certificates", {
                    headers: {
                        "x-auth-token": token
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setCertificates(data);
                }
            } catch (err) {
                console.error("Failed to fetch certificates:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this certificate?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/certificates/${id}`, {
                method: "DELETE",
                headers: {
                    "x-auth-token": token
                }
            });

            if (res.ok) {
                setCertificates(certificates.filter(cert => cert._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete certificate:", err);
        }
    };

    const filtered = certificates.filter(cert => {
        const matchesSearch = cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || cert.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Certificates</h1>
                    <p className="text-slate-500 font-medium">Manage, view, and organize all the certificates you've generated.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link to="/bulk" className="w-full sm:w-auto">
                        <Button variant="skeuo" className="w-full">Bulk Import</Button>
                    </Link>
                    <Link to="/templates" className="w-full sm:w-auto">
                        <Button variant="skeuoSecondary" className="w-full">New Certificate</Button>
                    </Link>
                </div>
            </div>

            <Card variant="skeuo" className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-xs group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10" />
                    <Input
                        placeholder="Search name or course..."
                        className="pl-10 h-10 pb-0 pt-0 bg-white/30 border-slate-200/50 text-slate-900 placeholder:text-slate-400 focus:border-amber-500/50 focus:ring-amber-500/50 transition-all font-medium skeuo-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    <Filter className="h-5 w-5 text-slate-500 mr-1 flex-shrink-0" />
                    <select
                        className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 bg-white text-slate-900 transition-all outline-none font-medium"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="single">Single Certificates</option>
                        <option value="bulk">Bulk Batches</option>
                    </select>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                        <p className="text-slate-500">Loading your certificates...</p>
                    </div>
                ) : filtered.map((cert, i) => (
                    <motion.div
                        key={cert._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card variant="skeuo" className="overflow-hidden group flex flex-col h-full active:scale-[0.98] transition-all">
                            <div className="p-5 flex items-start gap-4">
                                <div className={`h-12 w-12 rounded-xl flex flex-shrink-0 items-center justify-center ${cert.type === 'bulk' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} skeuo-raised border border-white`}>
                                    {cert.type === 'bulk' ? <Users className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-900 truncate pr-2 group-hover:text-amber-600 transition-colors">
                                            {cert.type === 'bulk' ? `Batch: ${cert.courseTitle}` : cert.recipientName}
                                        </h3>
                                        <Badge variant={cert.type === 'bulk' ? 'primary' : 'success'}>
                                            {cert.type === 'bulk' ? 'Batch' : 'Single'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 font-bold truncate mb-1 opacity-70">
                                        {cert.type === 'bulk' ? 'Multiple Recipients' : cert.courseTitle}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Issue Date: {cert.issueDate}</p>
                                </div>
                            </div>
                            <div className="mt-auto bg-white/50 px-5 py-3 border-t border-slate-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all">
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-amber-600 hover:bg-amber-50">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-amber-600 hover:bg-amber-50">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(cert._id)} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0 ml-2">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}


            </div>
        </div >
    );
};

export { MyCertificates };

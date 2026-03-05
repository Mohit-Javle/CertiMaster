import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Edit2, Filter, X } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { templates } from "../../data/mockData";

const TemplatesGallery = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [previewTemplate, setPreviewTemplate] = useState(null);

    const categories = ["All", ...new Set(templates.map(t => t.category))];

    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "All" || t.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="max-w-xl">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Template Gallery</h1>
                    <p className="text-slate-500 font-medium">Choose from our collection of premium, professionally designed templates. All templates are fully customizable.</p>
                </div>

                <div className="w-full md:w-72 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-10 h-10 pb-0 pt-0 bg-white/30 border-slate-200/50 text-slate-900 placeholder:text-slate-400 focus:border-amber-500/50 focus:ring-amber-500/50 transition-all font-medium skeuo-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Filter className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat
                            ? "bg-white text-amber-600 skeuo-raised border border-white/50"
                            : "bg-white/30 text-slate-500 border border-slate-200/50 hover:bg-white/80 hover:text-slate-900 hover:skeuo-raised"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredTemplates.map((template) => (
                        <motion.div
                            key={template.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card variant="skeuo" className="group overflow-hidden transition-all duration-300">
                                <div className={`aspect-[4/3] w-full relative ${template.thumbnail}`}>
                                    {/* Faux Certificate Preview Graphic */}
                                    <div className="absolute inset-0 flex items-center justify-center p-6">
                                        <div className="w-full h-full bg-white/50 backdrop-blur-sm skeuo-raised rounded border border-black/5 flex flex-col items-center justify-center p-4 text-center">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 mb-2 skeuo-pressed" />
                                            <div className="h-4 w-3/4 bg-slate-300 rounded mb-1" />
                                            <div className="h-2 w-1/2 bg-slate-200 rounded mb-4" />
                                            <div className="h-6 w-full bg-slate-800 rounded mb-2" />
                                            <div className="flex gap-4 w-full mt-auto">
                                                <div className="h-1 w-full bg-slate-300 rounded" />
                                                <div className="h-1 w-full bg-slate-300 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                        <Link to={`/editor/${template.id}`} className="w-3/4">
                                            <Button variant="skeuoSecondary" className="w-full">
                                                <Edit2 className="h-4 w-4 mr-2" /> Use Template
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="skeuo"
                                            className="w-3/4"
                                            onClick={() => setPreviewTemplate(template)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" /> Preview
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4 bg-transparent relative z-10 border-t border-slate-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{template.name}</h3>
                                        <Badge variant={
                                            template.category === 'Academic' ? 'primary' :
                                                template.category === 'Corporate' ? 'default' :
                                                    template.category === 'Achievement' ? 'warning' : 'success'
                                        }>
                                            {template.category}
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredTemplates.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/40 shadow-inner">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4 border border-amber-100 shadow-sm">
                            <Search className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">No templates found</h3>
                        <p className="text-slate-500 font-medium">Try adjusting your search or category filter.</p>
                    </div>
                )}
            </motion.div>

            {/* Preview Modal */}
            <AnimatePresence>
                {previewTemplate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-400/20 backdrop-blur-md"
                            onClick={() => setPreviewTemplate(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-4 border-b border-slate-100">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{previewTemplate.name}</h3>
                                    <p className="text-sm text-slate-500">Preview Mode</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link to={`/editor/${previewTemplate.id}`}>
                                        <Button variant="skeuoSecondary">
                                            <Edit2 className="h-4 w-4 mr-2" /> Use Template
                                        </Button>
                                    </Link>
                                    <button
                                        onClick={() => setPreviewTemplate(null)}
                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 overflow-y-auto flex-1 flex justify-center items-center">
                                <div className="w-full max-w-[1056px] aspect-[1056/816] bg-white shadow-sm ring-1 ring-slate-200" dangerouslySetInnerHTML={{ __html: previewTemplate.html }} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export { TemplatesGallery };

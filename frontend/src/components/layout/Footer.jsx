import { Link } from "react-router-dom";
import { Award, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="rounded-lg bg-amber-500 p-1 text-white">
                                <Award className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-900">CertiMaster</span>
                        </Link>
                        <p className="text-sm text-slate-500 mb-4">
                            Generate thousands of premium certificates in seconds. Perfect for educators, event organizers, and businesses.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Github className="h-5 w-5" /></a>
                            <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><Link to="/templates" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Templates</Link></li>
                            <li><Link to="/pricing" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Pricing</Link></li>
                            <li><Link to="/features" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Features</Link></li>
                            <li><Link to="/api" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">API</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Guides</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Blog</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 text-center">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} CertiMaster. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export { Footer };

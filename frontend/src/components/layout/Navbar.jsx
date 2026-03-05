import { Link } from "react-router-dom";
import { Award, Menu } from "lucide-react";
import { Button } from "../ui/Button";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="rounded-lg bg-amber-500 p-1.5 text-white">
                                <Award className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">CertiMaster</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
                        <Link to="#templates" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Templates</Link>
                        <Link to="#testimonials" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Testimonials</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm">Get Started</Button>
                        </Link>
                    </div>

                    <button className="md:hidden p-2 text-slate-600">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export { Navbar };

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Image as ImageIcon, Download, Settings, Users, Star } from "lucide-react";
import { Button } from "../components/ui/Button";

const Landing = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 lg:pt-40 lg:pb-28">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/2 w-[100%] h-[100%] rounded-full bg-amber-500/10 blur-[120px]" />
                    <div className="absolute -bottom-1/2 -left-1/2 w-[100%] h-[100%] rounded-full bg-blue-500/10 blur-[120px]" />
                </div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            CertiMaster v1.0 is now live
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
                            Generate 1000 Certificates in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Seconds</span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                            The ultimate certificate generation platform. Beautiful templates, bulk Excel imports, and instant PDF/JPEG downloads. Perfect for courses, events, and organizations.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                                    Start Generating Free <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="#features">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800 hover:text-white">
                                    See How It Works
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to reward success</h2>
                        <p className="text-lg text-slate-600">Powerful tools designed to make certificate creation effortless, whether you need one or one thousand.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Zap, title: "Lightning Fast API", desc: "No more waiting. Our local engine generates massive batches of certificates instantly in your browser." },
                            { icon: ImageIcon, title: "Premium Templates", desc: "Start with our professionally designed HTML/CSS templates. Fully customizable and responsive." },
                            { icon: Settings, title: "Visual Editor", desc: "See your changes in real-time. Adjust fonts, colors, and layout right on the certificate canvas." },
                            { icon: Download, title: "Bulk Export ZIP", desc: "Map your Excel data to template fields and download cleanly organized ZIP files containing PDFs or JPEGs." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all group"
                            >
                                <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Loved by educators and managers</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Jenkins", role: "Course Creator", quote: "CertiMaster saved me weeks of manual work. The bulk Excel upload mapped perfectly to my custom template." },
                            { name: "Michael Chen", role: "HR Director", quote: "The designs are absolutely premium. Our employees love sharing these on LinkedIn. Best tool we've used." },
                            { name: "Jessica Alba", role: "Event Organizer", quote: "We generated 500 participation certificates during the closing ceremony. Flawless and fast." }
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex gap-1 mb-4 text-amber-500">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                                </div>
                                <p className="text-slate-700 mb-6 italic">"{t.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{t.name}</p>
                                        <p className="text-sm text-slate-500">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-center relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to scale your certification?</h2>
                    <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">Join thousands of users who have streamlined their workflow with CertiMaster.</p>
                    <Link to="/register">
                        <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8">
                            Create Your First Certificate
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export { Landing };

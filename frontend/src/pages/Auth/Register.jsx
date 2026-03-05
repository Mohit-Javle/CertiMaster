import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Mail, Lock, User, Github, Twitter } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) {
                setErrors({ email: data.message || "Registration failed" });
                return;
            }

            // Store token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/dashboard");
        } catch (error) {
            console.error("Registration error:", error);
            setErrors({ email: "Server error. Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-500 text-white mb-6 shadow-md">
                        <Award className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create an account</h1>
                    <p className="text-slate-500">Start generating beautiful certificates today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: "" }) }}
                        error={errors.name}
                    />

                    <Input
                        label="Email address"
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: "" }) }}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: "" }) }}
                        error={errors.password}
                    />

                    <Button type="submit" className="w-full bg-slate-900 text-white shadow-md hover:shadow-lg transition-all" isLoading={isLoading}>
                        Create Account
                    </Button>

                    <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed">
                        By clicking "Create Account", you agree to our <a href="#" className="underline hover:text-slate-800">Terms of Service</a> and <a href="#" className="underline hover:text-slate-800">Privacy Policy</a>.
                    </p>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-slate-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button type="button" variant="outline" className="w-full text-slate-700">
                            <Github className="mr-2 h-4 w-4" /> GitHub
                        </Button>
                        <Button type="button" variant="outline" className="w-full text-slate-700">
                            <Twitter className="mr-2 h-4 w-4" /> Twitter
                        </Button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-slate-600 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-amber-500 hover:text-amber-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export { Register };

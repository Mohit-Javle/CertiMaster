import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Mail, Lock, Github, Twitter } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
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
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) {
                setErrors({ email: data.message || "Login failed" });
                return;
            }

            // Store token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            setErrors({ email: "Server error. Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-100 text-amber-500 mb-6">
                        <Award className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h1>
                    <p className="text-slate-500">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: "" }) }}
                        error={errors.email}
                    />

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <a href="#" className="text-xs font-medium text-amber-500 hover:text-amber-600">Forgot password?</a>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: "" }) }}
                            error={errors.password}
                        />
                    </div>

                    <Button type="submit" className="w-full bg-slate-900 text-white" isLoading={isLoading}>
                        Sign In
                    </Button>

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
                    Don't have an account?{' '}
                    <Link to="/register" className="text-amber-500 hover:text-amber-600 hover:underline">
                        Sign up for free
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export { Login };

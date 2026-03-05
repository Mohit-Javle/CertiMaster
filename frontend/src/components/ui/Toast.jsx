import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simplified toast for quick UI demo without complex providers
const Toast = ({ message, type = "success", isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible && duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    };

    const bgs = {
        success: "bg-emerald-50 border-emerald-200",
        error: "bg-red-50 border-red-200",
        warning: "bg-amber-50 border-amber-200",
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${bgs[type]}`}
                >
                    {icons[type]}
                    <p className="text-sm font-medium text-slate-800">{message}</p>
                    <button onClick={onClose} className="ml-2 text-slate-500 hover:text-slate-700">
                        <X className="h-4 w-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { Toast };

import { forwardRef } from "react";

const Input = forwardRef(({ className = "", label, error, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
            <input
                ref={ref}
                className={`flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all ${error ? "border-red-500 focus:ring-red-500" : ""
                    } ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";

export { Input };

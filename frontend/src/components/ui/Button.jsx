import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const Button = forwardRef(
    ({ className = "", variant = "primary", size = "md", isLoading = false, children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl";

        const variants = {
            primary: "bg-slate-900 text-white hover:bg-slate-800",
            secondary: "bg-amber-500 text-white hover:bg-amber-600",
            outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900",
            ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
            danger: "bg-red-500 text-white hover:bg-red-600",
            skeuo: "skeuo-button text-slate-900",
            skeuoSecondary: "skeuo-button text-amber-600 font-extrabold"
        };

        const sizes = {
            sm: "h-9 px-4 text-sm",
            md: "h-11 px-6 text-base",
            lg: "h-14 px-8 text-lg"
        };

        return (
            <button
                ref={ref}
                disabled={isLoading}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };

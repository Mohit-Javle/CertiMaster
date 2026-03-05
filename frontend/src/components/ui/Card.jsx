const Card = ({ className = "", children, variant = "default", ...props }) => {
    const variants = {
        default: "bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        skeuo: "skeuo-card-premium"
    };

    return (
        <div className={`${variants[variant] || variants.default} rounded-2xl ${className}`} {...props}>
            {children}
        </div>
    );
};

export { Card };

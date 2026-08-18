import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export const Button = ({ children, className, variant = "primary", ...props }) => {
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-blue-600 shadow-lg",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn("px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2", styles[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};

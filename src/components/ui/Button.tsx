import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'icon';
 size?: 'sm' | 'md' | 'lg';
 isLoading?: boolean;
 leftIcon?: React.ReactNode;
 rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
 children,
 variant = 'primary',
 size = 'md',
 isLoading = false,
 leftIcon,
 rightIcon,
 className = '',
 disabled,
 onClick,
 ...props
}) => {
 const variantStyles = {
 primary:
 'bg-[#053229] hover:bg-[#07483A] active:bg-[#053229] text-white shadow-md shadow-[#053229]/25 border border-[#07483A]/30',
 secondary:
 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-[#10201C] border border-slate-200 ',
 ghost:
 'bg-transparent hover:bg-slate-100 text-[#536761] hover:text-[#10201C] ',
 destructive:
 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-md shadow-rose-600/25 border border-rose-500/30',
 icon:
 'p-2 bg-slate-100 hover:bg-slate-200 text-[#536761] rounded-xl border border-slate-200 ',
 };

 const sizeStyles = {
 sm: 'px-3 py-1.5 text-xs font-bold rounded-xl gap-1.5',
 md: 'px-4 py-2.5 text-xs font-bold rounded-xl gap-2',
 lg: 'px-6 py-3.5 text-sm font-extrabold rounded-2xl gap-2.5',
 };

 return (
 <motion.button
 whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
 whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
 transition={{ duration: 0.15 }}
 disabled={disabled || isLoading}
 onClick={onClick}
 className={`inline-flex items-center justify-center font-sans tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-[#07483A]/40 disabled:opacity-50 disabled:pointer-events-none ${
 variantStyles[variant]
 } ${variant !== 'icon' ? sizeStyles[size] : ''} ${className}`}
 {...(props as any)}
 >
 {isLoading ? (
 <Loader2 className="w-4 h-4 animate-spin text-current" />
 ) : (
 <>
 {leftIcon && <span className="shrink-0">{leftIcon}</span>}
 {children}
 {rightIcon && <span className="shrink-0">{rightIcon}</span>}
 </>
 )}
 </motion.button>
 );
};

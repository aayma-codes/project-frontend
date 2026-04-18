import { motion } from 'framer-motion';
import { cn } from './Button';

export function Card({ className, children, hover = false, ...props }) {
  return (
    <motion.div
      className={cn(
        "bg-surface rounded-2xl border border-border/50 shadow-sm overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-5 border-b border-border/50", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-xl font-display font-semibold text-text", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-4 bg-background/50 border-t border-border/50 flex items-center", className)} {...props}>
      {children}
    </div>
  );
}

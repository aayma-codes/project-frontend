import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from './Button';

const Input = forwardRef(({ 
  label, 
  error, 
  className, 
  type = 'text', 
  icon: Icon,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label className="text-sm font-medium text-text-muted ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-text placeholder:text-text-muted/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface",
            Icon && "pl-10",
            isPassword && "pr-10",
            error && "border-error focus:ring-error/20 focus:border-error"
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-sm text-error ml-1 font-medium">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

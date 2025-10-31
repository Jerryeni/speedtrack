import { InputHTMLAttributes, forwardRef } from "react";

interface ResponsiveInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal" | "search" | "url";
}

const ResponsiveInput = forwardRef<HTMLInputElement, ResponsiveInputProps>(
  ({ label, error, icon, className = "", inputMode, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i className={`fas ${icon}`}></i>
            </div>
          )}
          <input
            ref={ref}
            inputMode={inputMode}
            className={`
              w-full min-h-[48px]
              bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-700'}
              rounded-xl
              ${icon ? 'pl-12 pr-4' : 'px-4'} py-3
              text-white text-base
              placeholder:text-gray-500
              focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `.trim().replace(/\s+/g, ' ')}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </p>
        )}
      </div>
    );
  }
);

ResponsiveInput.displayName = "ResponsiveInput";

export default ResponsiveInput;

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      prefix,
      suffix,
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">

        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <div className="flex items-center overflow-hidden rounded-2xl border border-slate-300 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">

          {prefix && (
            <span className="px-4 text-slate-500">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            className={`w-full bg-transparent px-4 py-3 outline-none ${className}`}
            {...props}
          />

          {suffix && (
            <span className="px-4 text-slate-500">
              {suffix}
            </span>
          )}

        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
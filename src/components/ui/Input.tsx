import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const baseClasses =
      "w-full rounded-md bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2";

    const stateClasses = error
      ? "border border-red-500 focus:ring-red-500"
      : "border border-zinc-700 focus:ring-indigo-500";

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm text-zinc-400">
            {label}
          </label>
        )}

        <input
          ref={ref}
          {...props}
          className={`${baseClasses} ${stateClasses} ${className}`}
        />

        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

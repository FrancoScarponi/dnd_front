import type { TextareaHTMLAttributes } from "react";

type TextAreaFieldProps = {
  label: string;
  error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ label, error, ...rest }: TextAreaFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-zinc-400">{label}</label>
      <textarea
        {...rest}
        className="w-full min-h-[90px] rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}

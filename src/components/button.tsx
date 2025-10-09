import { cn } from "@/lib/utils";

export default function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        `hover:bg-primary/10 px-4 py-2 border rounded-xl border-primary w-max text-primary active:scale-95 transition duration-200 ${className}`
      )}
      {...props}
    >
      {children}
    </button>
  );
}

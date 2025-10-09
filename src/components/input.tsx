import { cn } from "@/lib/utils";
export default function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "bg-background px-4 py-3 border border-primary/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary w-full text-foreground",
        className
      )}
      {...props}
    />
  );
}

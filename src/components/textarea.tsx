import { cn } from "@/lib/utils";

export default function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "bg-background px-4 py-3 border border-primary/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary w-full text-foreground resize-none",
        className
      )}
      {...props}
    />
  );
}

import { cn } from "@/lib/utils";

export default function Loader({ text = 'Loading...', className }: { text?: string, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 text-center", className)}>
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-muted-foreground">{text}</p>
    </div>
  );
}

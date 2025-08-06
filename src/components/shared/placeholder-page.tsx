import { Package } from "lucide-react";

export function PlaceholderPage({ title, description }: { title: string; description: string; }) {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center rounded-xl border border-dashed bg-card shadow-sm">
      <div className="flex flex-col items-center text-center gap-4 p-8">
        <div className="bg-primary/10 p-4 rounded-full">
            <Package className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

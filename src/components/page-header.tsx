import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

export function PageHeader({ title, description, icon: Icon, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-4">
        {Icon && <Icon className="h-8 w-8 text-accent hidden sm:inline-block" />}
        <div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

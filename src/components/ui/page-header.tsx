interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}
  
export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="mt-1 text-muted-foreground">{description}</p>}
          </div>
          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      </div>
    );
}

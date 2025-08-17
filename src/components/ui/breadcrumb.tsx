import type * as React from 'react';

export function Breadcrumb({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <nav {...props}>{children}</nav>;
}

export function BreadcrumbList({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return <ol {...props}>{children}</ol>;
}

export function BreadcrumbItem({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li {...props}>{children}</li>;
}

export function BreadcrumbLink({ href = '#', children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export function BreadcrumbSeparator({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={className} {...props}>
      /
    </span>
  );
}

export function BreadcrumbPage({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...props}>{children}</span>;
}

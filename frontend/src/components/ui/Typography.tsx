import { ReactNode, ElementType } from "react";

interface TypographyProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function Hero({ children, as: Component = "h1", className = "" }: TypographyProps) {
  return (
    <Component className={`text-hero font-semibold tracking-tighter text-primary ${className}`}>
      {children}
    </Component>
  );
}

export function SectionTitle({ children, as: Component = "h2", className = "" }: TypographyProps) {
  return (
    <Component className={`text-section-title font-semibold tracking-tight text-primary ${className}`}>
      {children}
    </Component>
  );
}

export function Metric({ children, as: Component = "p", className = "" }: TypographyProps) {
  return (
    <Component className={`text-metric font-medium tracking-tighter text-primary ${className}`}>
      {children}
    </Component>
  );
}

export function Body({ children, as: Component = "p", className = "" }: TypographyProps) {
  return (
    <Component className={`text-body text-secondary max-w-prose ${className}`}>
      {children}
    </Component>
  );
}

export function Metadata({ children, as: Component = "span", className = "" }: TypographyProps) {
  return (
    <Component className={`text-metadata font-mono text-tertiary uppercase ${className}`}>
      {children}
    </Component>
  );
}

// sspa/mfe-design-system/src/components/Card.tsx
import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ className = '', children, ...props }: CardProps) {
  const classes = `ds-card ${className}`.trim();
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// sspa/mfe-design-system/src/components/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';

const badgeVariants = cva('ds-badge', {
  variants: {
    variant: {
      default: 'ds-badge-default',
      success: 'ds-badge-success',
      warning: 'ds-badge-warning',
      destructive: 'ds-badge-destructive',
      info: 'ds-badge-info',
    },
    size: {
      sm: 'ds-badge-sm',
      default: 'ds-badge-default-size',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    children: ReactNode;
  };

export function Badge({ variant = 'default', size = 'default', className = '', children, ...props }: BadgeProps) {
  const classes = [badgeVariants({ variant, size }), className].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export { badgeVariants };

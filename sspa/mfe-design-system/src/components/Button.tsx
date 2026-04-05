// sspa/mfe-design-system/src/components/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const buttonVariants = cva('ds-button', {
  variants: {
    variant: {
      primary: 'ds-button-primary',
      secondary: 'ds-button-secondary',
      ghost: 'ds-button-ghost',
      outline: 'ds-button-outline',
      destructive: 'ds-button-destructive',
    },
    size: {
      sm: 'ds-button-sm',
      default: 'ds-button-default',
      lg: 'ds-button-lg',
      icon: 'ds-button-icon',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode;
  };

export function Button({ variant = 'primary', size = 'default', className = '', children, ...props }: ButtonProps) {
  const classes = [buttonVariants({ variant, size }), className].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export { buttonVariants };
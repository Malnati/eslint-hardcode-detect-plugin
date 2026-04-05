// sspa/mfe-design-system/src/components/Form.tsx
import type { FormHTMLAttributes, ReactNode } from 'react';

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};

export function Form({ className = '', children, ...props }: FormProps) {
  const classes = `ds-form ${className}`.trim();
  return (
    <form className={classes} {...props}>
      {children}
    </form>
  );
}

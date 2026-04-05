// sspa/mfe-design-system/src/components/Input.tsx
import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export function Input({ className = '', error = false, ...props }: InputProps) {
  const classes = `ds-input ${error ? 'ds-input-error' : ''} ${className}`.trim();
  return <input className={classes} {...props} />;
}
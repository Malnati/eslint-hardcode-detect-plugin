// sspa/mfe-design-system/src/components/Checkbox.tsx
import type { InputHTMLAttributes } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className = '', ...props }: CheckboxProps) {
  const classes = `ds-checkbox ${className}`.trim();
  return <input className={classes} type="checkbox" {...props} />;
}

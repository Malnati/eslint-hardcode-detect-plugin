// sspa/mfe-design-system/src/components/Select.tsx
import type { SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export function Select({ className = '', error = false, ...props }: SelectProps) {
  const classes = `ds-select ${error ? 'ds-input-error' : ''} ${className}`.trim();
  return <select className={classes} {...props} />;
}

// sspa/mfe-design-system/src/components/Code.tsx
import type { HTMLAttributes } from 'react';

type CodeProps = HTMLAttributes<HTMLElement>;

export function Code({ className = '', ...props }: CodeProps) {
  const classes = `ds-code ${className}`.trim();
  return <code className={classes} {...props} />;
}

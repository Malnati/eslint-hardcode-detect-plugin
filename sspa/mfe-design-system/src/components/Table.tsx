// sspa/mfe-design-system/src/components/Table.tsx
import type { ReactNode, TableHTMLAttributes } from 'react';

type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  children: ReactNode;
};

export function Table({ className = '', children, ...props }: TableProps) {
  const classes = `ds-table ${className}`.trim();
  return (
    <div className="ds-table-wrapper">
      <table className={classes} {...props}>
        {children}
      </table>
    </div>
  );
}

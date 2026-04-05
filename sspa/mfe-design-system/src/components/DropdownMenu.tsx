// sspa/mfe-design-system/src/components/DropdownMenu.tsx
import type { ChangeEvent } from 'react';

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownMenuProps = {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  name?: string;
  id?: string;
};

export function DropdownMenu({ options, value, onChange, className = '', name, id }: DropdownMenuProps) {
  const classes = `ds-select ${className}`.trim();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <select className={classes} value={value} onChange={handleChange} name={name} id={id}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

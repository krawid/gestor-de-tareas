interface NativeCheckboxProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  "data-testid"?: string;
}

export function NativeCheckbox({ 
  id, 
  checked, 
  onCheckedChange, 
  className = "",
  "data-testid": testId 
}: NativeCheckboxProps) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={`cursor-pointer accent-primary ${className}`}
      data-testid={testId}
    />
  );
}

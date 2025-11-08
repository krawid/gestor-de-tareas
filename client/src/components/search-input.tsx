import { forwardRef } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange }, ref) => {
    return (
      <div className="relative flex-1 max-w-md">
        <label htmlFor="search-tasks" className="sr-only">
          Buscar tareas
        </label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={ref}
          id="search-tasks"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar tareas..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          data-testid="input-search"
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

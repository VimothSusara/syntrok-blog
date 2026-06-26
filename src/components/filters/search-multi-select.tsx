"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type SearchMultiSelectItem = {
  value: string;
  label: string;
  keywords?: string;
};

type SearchMultiSelectProps = {
  items: SearchMultiSelectItem[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  multiple?: boolean;
  renderItem?: (
    item: SearchMultiSelectItem,
    selected: boolean,
  ) => React.ReactNode;
  className?: string;
};

export function SearchMultiSelect({
  items,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results.",
  multiple = true,
  renderItem,
  className,
}: SearchMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedItems = items.filter((item) => value.includes(item.value));

  const toggle = (itemValue: string) => {
    if (!multiple) {
      onChange(value.includes(itemValue) ? [] : [itemValue]);
      setOpen(false);
      return;
    }
    onChange(
      value.includes(itemValue)
        ? value.filter((v) => v !== itemValue)
        : [...value, itemValue],
    );
  };

  const remove = (itemValue: string) => {
    onChange(value.filter((v) => v !== itemValue));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.map((item) => (
            <Badge key={item.value} variant="secondary" className="gap-1">
              {item.label}
              <button
                type="button"
                onClick={() => remove(item.value)}
                className="rounded-full hover:bg-muted"
                aria-label={`Remove ${item.label}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className="truncate text-muted-foreground">
              {selectedItems.length
                ? multiple
                  ? `${selectedItems.length} selected`
                  : selectedItems[0]?.label
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => {
                  const selected = value.includes(item.value);
                  return (
                    <CommandItem
                      key={item.value}
                      value={`${item.label} ${item.keywords ?? ""}`}
                      onSelect={() => toggle(item.value)}
                    >
                      <Check
                        className={cn(
                          "size-4",
                          selected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {renderItem ? (
                        renderItem(item, selected)
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

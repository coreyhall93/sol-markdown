import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "./button";

const themes = [
  { value: "system", label: "System theme" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

// Adapted from shadcn/ui's DropdownMenu radio-item composition (MIT).
export function ThemeMenu({ value, onValueChange }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className="sol-theme-trigger" aria-label="Color theme">
          {themes.find((theme) => theme.value === value)?.label}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal container={document.getElementById("sol-markdown")}>
        <DropdownMenu.Content
          className="sol-theme-menu"
          align="end"
          sideOffset={6}
          collisionPadding={12}
        >
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={onValueChange}
            aria-label="Color theme"
          >
            {themes.map((theme) => (
              <DropdownMenu.RadioItem
                key={theme.value}
                value={theme.value}
                className="sol-theme-item"
              >
                <span className="sol-theme-check">
                  <DropdownMenu.ItemIndicator>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </DropdownMenu.ItemIndicator>
                </span>
                {theme.label}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

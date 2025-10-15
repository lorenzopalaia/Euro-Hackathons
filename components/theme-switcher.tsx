"use client";

import { useState, useEffect } from "react";
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
import { Check, ChevronsUpDown, Moon, Palette, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeStore, AVAILABLE_THEMES } from "@/lib/theme-store";
import { getThemePreviewColors } from "@/lib/theme-utils";
import { useTranslation } from "@/contexts/translation-context";

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const { styles, currentMode, setThemeById, toggleMode } = useThemeStore();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const currentTheme = AVAILABLE_THEMES.find(
    (theme) => JSON.stringify(theme.styles) === JSON.stringify(styles),
  );

  const previewColors =
    hydrated && currentTheme
      ? getThemePreviewColors(currentTheme.styles[currentMode])
      : { primary: "transparent", accent: "transparent" };
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Header con icona e Toggle Dark/Light */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <h2 className="font-semibold">{t("theme")}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleMode}
          title={
            currentMode === "light"
              ? t("theme.switchToDark")
              : t("theme.switchToLight")
          }
        >
          {currentMode === "light" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Selettore Tema */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              {/* Preview colori tema corrente nel trigger */}
              <div className="flex gap-1">
                <div
                  className="h-4 w-4 rounded border"
                  style={{ backgroundColor: previewColors.primary }}
                />
                <div
                  className="h-4 w-4 rounded border"
                  style={{ backgroundColor: previewColors.accent }}
                />
              </div>
              {hydrated
                ? (currentTheme?.name ?? t("theme.selectPlaceholder"))
                : t("theme.loading")}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder={t("theme.searchPlaceholder")} />
            <CommandList>
              <CommandEmpty>{t("theme.noThemeFound")}</CommandEmpty>
              <CommandGroup>
                {AVAILABLE_THEMES.map((theme) => {
                  const isSelected = currentTheme?.id === theme.id;
                  const colors = getThemePreviewColors(
                    theme.styles[currentMode],
                  );

                  return (
                    <CommandItem
                      key={theme.id}
                      value={theme.id}
                      onSelect={() => {
                        setThemeById(theme.id);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {/* Preview colori nel dropdown */}
                        <div className="flex gap-1">
                          <div
                            className="h-4 w-4 rounded border"
                            style={{ backgroundColor: colors.primary }}
                            title="Primary"
                          />
                          <div
                            className="h-4 w-4 rounded border"
                            style={{ backgroundColor: colors.accent }}
                            title="Accent"
                          />
                        </div>
                        <span className="font-medium">{theme.name}</span>
                      </div>
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

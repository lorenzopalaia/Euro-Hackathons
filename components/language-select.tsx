"use client";

import React from "react";
import { useTranslation } from "@/contexts/translation-context";
import ReactCountryFlag from "react-country-flag";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function LanguageSelect({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div className={className}>
      <Select value={locale} onValueChange={(v) => setLocale(v)}>
        <SelectTrigger size="sm" className="w-36">
          <SelectValue placeholder={locale === "en" ? "EN" : "IT"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">
            <span className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode="GB"
                svg
                style={{ width: "1.2em" }}
              />
              <span>English</span>
            </span>
          </SelectItem>
          <SelectItem value="it">
            <span className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode="IT"
                svg
                style={{ width: "1.2em" }}
              />
              <span>Italiano</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

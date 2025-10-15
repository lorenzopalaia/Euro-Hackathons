"use client";

import React, { createContext, useContext, useMemo } from "react";
import de from "@/i18n/de.json";
import en from "@/i18n/en.json";
import es from "@/i18n/es.json";
import fr from "@/i18n/fr.json";
import it from "@/i18n/it.json";
import nl from "@/i18n/nl.json";
import pt from "@/i18n/pt.json";
import { useLocaleStore } from "@/lib/locale-store";

type Messages = Record<string, string>;

type TranslationContextValue = {
  locale: string;
  setLocale: (l: string) => void;
  // t supports simple interpolation: t('key', { name: 'Lorenzo' })
  t: (key: string, vars?: Record<string, string | number>) => string;
  // format a date range according to the active locale
  formatDateRange: (start: string | Date, end?: string | Date | null) => string;
  // next-intl like formatting helpers
  format: {
    dateTime: (value: string | Date, formatName?: string) => string;
    relativeTime: (value: string | Date) => string;
    number?: (value: number, opts?: Intl.NumberFormatOptions) => string;
  };
  messages: Messages;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx)
    throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
};

const MESSAGES: Record<string, Messages> = {
  de,
  en,
  es,
  fr,
  it,
  nl,
  pt,
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const messages = useMemo(() => MESSAGES[locale] || MESSAGES["en"], [locale]);

  const value = useMemo(() => {
    const t = (key: string, vars?: Record<string, string | number>) => {
      if (!key) return key;
      // direct lookup (works with flat JSON keys that include dots)
      const direct = (messages as Record<string, string>)[key];
      if (typeof direct === "string") return direct;

      // try nested lookup: support for nested objects if JSON uses nested structure
      const parts = key.split(".");
      let cur: unknown = messages;
      for (const p of parts) {
        if (
          cur &&
          typeof cur === "object" &&
          p in (cur as Record<string, unknown>)
        ) {
          cur = (cur as Record<string, unknown>)[p];
        } else {
          cur = undefined;
          break;
        }
      }
      const resolved = typeof cur === "string" ? cur : key;
      if (vars && typeof resolved === "string") {
        return Object.keys(vars).reduce((acc, k) => {
          const val = String(vars[k]);
          return acc.split(`{${k}}`).join(val);
        }, resolved);
      }

      return resolved;
    };

    const formatDateRange = (
      startInput: string | Date,
      endInput?: string | Date | null
    ) => {
      const start =
        startInput instanceof Date ? startInput : new Date(startInput);
      const end = endInput
        ? endInput instanceof Date
          ? endInput
          : new Date(endInput)
        : null;

      const localeForIntl = locale === "en" ? "en-GB" : locale;

      if (!end || start.toDateString() === end.toDateString()) {
        return new Intl.DateTimeFormat(localeForIntl, {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(start);
      }

      if (
        start.getMonth() !== end.getMonth() ||
        start.getFullYear() !== end.getFullYear()
      ) {
        const startStr = new Intl.DateTimeFormat(localeForIntl, {
          day: "numeric",
          month: "short",
        }).format(start);
        const endStr = new Intl.DateTimeFormat(localeForIntl, {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(end!);
        return `${startStr} - ${endStr}`;
      }

      const monthYear = new Intl.DateTimeFormat(localeForIntl, {
        month: "short",
        year: "numeric",
      }).format(start);
      return `${start.getDate()}-${end!.getDate()} ${monthYear}`;
    };

    const format = {
      dateTime: (value: string | Date, _formatName?: string) => {
        const date = value instanceof Date ? value : new Date(value);
        const localeForIntl = locale === "en" ? "en-GB" : locale;
        // support basic formatName tokens: 'short'|'medium'|'long'
        const opts: Intl.DateTimeFormatOptions =
          _formatName === "short"
            ? { day: "numeric", month: "numeric", year: "numeric" }
            : _formatName === "long"
              ? { day: "numeric", month: "long", year: "numeric" }
              : { day: "numeric", month: "short", year: "numeric" };
        return new Intl.DateTimeFormat(localeForIntl, opts).format(date);
      },

      relativeTime: (value: string | Date) => {
        const date = value instanceof Date ? value : new Date(value);
        const now = Date.now();
        const diffMs = date.getTime() - now;
        const seconds = Math.round(diffMs / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        const rtf = new Intl.RelativeTimeFormat(
          locale === "en" ? "en" : locale,
          {
            numeric: "auto",
          }
        );

        if (Math.abs(hours) < 1) return rtf.format(minutes, "minute");
        if (Math.abs(days) < 1) return rtf.format(hours, "hour");
        if (Math.abs(days) < 30) return rtf.format(days, "day");
        // fallback to formatted date
        return format.dateTime(date, "medium");
      },

      number: (value: number, opts?: Intl.NumberFormatOptions) => {
        const localeForIntl = locale === "en" ? "en-GB" : locale;
        return new Intl.NumberFormat(localeForIntl, opts).format(value);
      },
    };

    return { locale, setLocale, t, messages, formatDateRange, format };
  }, [locale, messages, setLocale]);

  // DEBUG: log locale & message keys in dev to diagnose missing translations
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // limit output
        const keys = Object.keys(messages).slice(0, 20);
        console.debug("[i18n] locale:", locale, "messageKeys:", keys);
      } catch {}
    }
  }, [locale, messages]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationContext;

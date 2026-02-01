import { keyboardLaunchOptions } from "@/constants/system-options";
import { useEffect, useRef, useState } from "react";
type Props = {
  value?: string | null;
  placeholder?: string;
  // eslint-disable-next-line no-unused-vars
  setEditing?: (state: boolean) => void;

  // eslint-disable-next-line no-unused-vars
  onChange: (combo: string | null) => void;
};

// Constantes únicas (solo existen una vez)
const KEY_MAP: Record<string, string> = {
  " ": "Space",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Escape: "Esc",
  Enter: "Enter",
  Tab: "Tab",
  Backspace: "Backspace",
  Delete: "Delete",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
};

const MODIFIER_KEYS = ["Control", "Alt", "Shift", "Meta"];
const MODIFIER_ALIASES = ["Ctrl", "Alt", "Shift", "Meta"];
const MODIFIER_ORDER: Record<string, number> = {
  Ctrl: 0, Alt: 1, Shift: 2, Meta: 3,
};

// Funciones inline ultra rápidas
const normalizeKey = (key: string): string =>
  KEY_MAP[key] || (key.length === 1 ? key.toUpperCase() : key);

// eslint-disable-next-line no-undef
const modifiersFromEvent = (e: KeyboardEvent): string[] => {
  let i = 0;
  const mods: string[] = [];
  if (e.ctrlKey) mods[i++] = MODIFIER_ALIASES[0];
  if (e.altKey) mods[i++] = MODIFIER_ALIASES[1];
  if (e.shiftKey) mods[i++] = MODIFIER_ALIASES[2];
  if (e.metaKey) mods[i++] = MODIFIER_ALIASES[3];
  if (i > 1) mods.sort((a, b) => MODIFIER_ORDER[a] - MODIFIER_ORDER[b]);
  return mods;
};

const isModifierToken = (t: string) => MODIFIER_ALIASES.includes(t);

// Normaliza un combo para que tenga entre 2 y 3 tokens:
// - Si >3 recorta a los primeros 3 (ordena modificadores primero).
// - Si <2 rellena con valores por defecto (`keyboardLaunchOptions.items[0].value`).
const normalizeCombo = (raw: string): string => {
  const defaultParts = keyboardLaunchOptions.defaultValue.split("+");
  const defaultMod = defaultParts[0];
  const defaultKey = defaultParts[1] ?? "";

  if (!raw || raw.trim() === "") {
    return `${defaultMod}+${defaultKey}`;
  }

  let parts = raw.split("+").map((p) => p.trim()).filter(Boolean);

  // Classify tokens
  const mods = parts.filter(isModifierToken);
  const mains = parts.filter((p) => !isModifierToken(p));

  // If too many tokens overall, prefer keeping modifiers first then mains, limit to 3
  let ordered = [...mods.sort((a, b) => MODIFIER_ORDER[a] - MODIFIER_ORDER[b]), ...mains];
  if (ordered.length > 3) ordered = ordered.slice(0, 3);

  // Ensure at least one modifier and one main key
  const hasMod = ordered.some(isModifierToken);
  const hasMain = ordered.some((p) => !isModifierToken(p));

  if (!hasMod) {
    ordered = [defaultMod, ...ordered];
  }
  if (!hasMain) {
    ordered = [...ordered, defaultKey];
  }

  // After padding, if still >3 (rare), trim to 3 keeping modifiers first
  ordered = [
    ...ordered.filter(isModifierToken).sort((a, b) => MODIFIER_ORDER[a] - MODIFIER_ORDER[b]),
    ...ordered.filter((p) => !isModifierToken(p)),
  ].slice(0, 3);

  return ordered.join("+");
};

export default function ShortcutInput({ value, placeholder, onChange, setEditing }: Props) {
  const [display, setDisplay] = useState(value ?? "");
  const listening = useRef(false);
  const lastValue = useRef(value ?? "");

  // Solo se sincroniza si cambia externamente
  useEffect(() => {
    if (value !== lastValue.current) {
      lastValue.current = value ?? "";
      setDisplay(lastValue.current);
    }
  }, [value]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const handler = (e: KeyboardEvent) => {
      if (!listening.current) return;

      e.preventDefault();
      e.stopPropagation();

      const key = e.key;

      if (MODIFIER_KEYS.includes(key)) {
        const mods = modifiersFromEvent(e);
        setDisplay(mods.join("+"));
        return;
      }

      if (key === "Escape") {
        listening.current = false;
        setDisplay(lastValue.current);
        return;
      }

      // if (key === "Backspace") {

      //   listening.current = false;
      //   lastValue.current = "";
      //   setDisplay("");
      //   onChange(null);
      //   return;
      // }

      const combo = (() => {
        const mods = modifiersFromEvent(e);
        const main = normalizeKey(key);
        return mods.length ? `${mods.join("+")}+${main}` : main;
      })();

      listening.current = false;
      const normalized = normalizeCombo(combo);
      lastValue.current = normalized;
      setDisplay(normalized);
      onChange(normalized);
    };

    // Registrar solo una vez
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [onChange]);

  const start = () => {
    listening.current = true;
    setEditing?.(true);
    setDisplay("");
  };

  const stop = () => {
    listening.current = false;
    setEditing?.(false);

    const normalized = normalizeCombo(display);
    setDisplay(normalized);
    onChange(normalized);
  };

  return (
    <input
      readOnly
      value={display}
      placeholder={placeholder ?? "Pulsar combinación..."}
      className="font-light text-black dark:text-white bg-gray-300 dark:bg-secondary-light border-solid border-width-selected  rounded-lg  px-0.5 py-2.5 text-center inline-flex items-center border-gray-400 dark:border-tertiary-dark w-full max-w-45"
      onFocus={start}
      onClick={start}
      onBlur={stop}
    />
  );
}

export const colors = {
  background: '#F9FBFD',
  surface: '#FFFFFF',
  cardBorder: '#ECEFF3',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  textWhite: '#FFFFFF',
  primary: '#3B82F6',
  primaryLight: '#EFF6FF',
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  types: {
    normal: '#8B9AA8',
    fire: '#F57D31',
    water: '#6493EB',
    grass: '#74CB48',
    electric: '#F9CF30',
    ice: '#9AD6DF',
    fighting: '#C12239',
    poison: '#A43E9E',
    ground: '#D97845',
    flying: '#A891EC',
    psychic: '#FB5584',
    bug: '#A7B723',
    rock: '#B69E31',
    ghost: '#70559B',
    dragon: '#7037FF',
    dark: '#75574C',
    steel: '#B7B9D0',
    fairy: '#E69EAC',
  } as Record<string, string>,
};

export type PokemonType = keyof typeof colors.types;

export const getTypeColor = (type: string): string => {
  const normalized = type.toLowerCase();
  return colors.types[normalized] || colors.types.normal;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const normalizeHex = (hex: string): string => {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    return cleanHex
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }
  return cleanHex.length === 6 ? cleanHex : '8B9AA8';
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const normalized = normalizeHex(hex);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (value: number) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const withAlpha = (hex: string, alpha: number): string => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

export const mixColors = (baseColor: string, mixWith: string, weight = 0.5): string => {
  const ratio = clamp(weight, 0, 1);
  const base = hexToRgb(baseColor);
  const blend = hexToRgb(mixWith);
  return rgbToHex(
    base.r * (1 - ratio) + blend.r * ratio,
    base.g * (1 - ratio) + blend.g * ratio,
    base.b * (1 - ratio) + blend.b * ratio
  );
};

export const getTypeGradient = (type: string): readonly [string, string] => {
  const primary = getTypeColor(type);
  const darker = mixColors(primary, '#0F172A', 0.28);
  return [primary, darker] as const;
};

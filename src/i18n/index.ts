import categoriesJson from './categories.json';
import interfaceJson from './interface.json';
import projectNamesJson from './project-names.json';
import type {
  Locale,
  LocalizedProjectText,
  PortfolioCategory,
  PortfolioProject,
  ProjectLevel,
} from '../types/portfolio';

export type { Locale } from '../types/portfolio';

export const locales: Locale[] = ['en', 'fi', 'uk', 'ru'];
export const prefixedLocales: Locale[] = ['fi', 'uk', 'ru'];

type InterfaceDictionary = Record<Locale, Record<string, string>>;
type LocalizedValue = Record<Locale, string>;

interface CategoryTranslation {
  id: number;
  slug: string;
  count: number;
  cover: string;
  name: LocalizedValue;
  blurb: LocalizedValue;
}

const dictionary = interfaceJson as InterfaceDictionary;
const categoryTranslations = categoriesJson as CategoryTranslation[];

/** Translated project names keyed by the original Russian name: [en, fi, uk]. */
const projectNames = projectNamesJson.names as Record<
  string,
  [string, string, string]
>;
const nameLocaleIndex: Record<Exclude<Locale, 'ru'>, 0 | 1 | 2> = {
  en: 0,
  fi: 1,
  uk: 2,
};

export function t(locale: Locale, key: string): string {
  return dictionary[locale]?.[key] ?? dictionary.en[key] ?? key;
}

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'fi' || value === 'uk' || value === 'ru';
}

export function localeFrom(pathname: string): Locale {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return isLocale(firstSegment) ? firstSegment : 'en';
}

export function stripLocale(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return path.replace(/^\/(fi|uk|ru)(?=\/|$)/, '') || '/';
}

export function localizePath(locale: Locale, pathname: string): string {
  const [path, hash = ''] = pathname.split('#', 2);
  const cleanPath = stripLocale(path || '/');
  const localized = locale === 'en' ? cleanPath : `/${locale}${cleanPath === '/' ? '/' : cleanPath}`;
  return hash ? `${localized}#${hash}` : localized;
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  return localizePath(locale, stripLocale(pathname));
}

export function categoryTranslation(
  category: Pick<PortfolioCategory, 'id' | 'slug' | 'name'>,
): CategoryTranslation | undefined {
  return categoryTranslations.find(
    (item) => item.id === category.id || item.slug === category.slug,
  );
}

export function categoryName(
  category: Pick<PortfolioCategory, 'id' | 'slug' | 'name'>,
  locale: Locale,
): string {
  return (
    categoryTranslation(category)?.name[locale] ||
    categoryTranslation(category)?.name.en ||
    category.name
  );
}

export function categoryBlurb(
  category: Pick<PortfolioCategory, 'id' | 'slug' | 'name'>,
  locale: Locale,
): string {
  const translation = categoryTranslation(category);
  return translation?.blurb[locale] || translation?.blurb.en || '';
}

export function projectText(
  project: PortfolioProject,
  locale: Locale,
): LocalizedProjectText {
  if (locale === 'ru') return { name: project.name };
  const translated = projectNames[project.name]?.[nameLocaleIndex[locale]];
  return { name: translated || project.name };
}

export function normalizeLevel(size: string): ProjectLevel {
  const value = size.trim().toLocaleLowerCase('ru');
  if (value.includes('эконом')) return 'eco';
  if (value.includes('стандарт')) return 'std';
  if (value.includes('премиум')) return 'prem';
  return '';
}

export function levelLabel(
  locale: Locale,
  size: string,
): string {
  const level = normalizeLevel(size);
  return level ? t(locale, `level.${level}`) : size;
}

/**
 * Archive articles are stored as "Проект №1-397". Rewrite the label and the
 * number sign per locale, keeping the reference number itself intact.
 */
export function projectReference(locale: Locale, article: string): string {
  const match = article.match(/^Проект\s*№\s*(\S+)$/u);
  if (!match) return article;
  return `${t(locale, 'project.articlePrefix')}${match[1]}`;
}

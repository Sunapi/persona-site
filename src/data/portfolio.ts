import portfolioJson from './portfolio.json';
import type {
  Locale,
  PortfolioCategory,
  PortfolioData,
  PortfolioProject,
} from '../types/portfolio';

export const portfolio = portfolioJson as PortfolioData;
export const PAGE_SIZE = 24;
export const CATEGORY_PAGE_SIZE = 48;

export function newestProjects(): PortfolioProject[] {
  return [...portfolio.projects].sort((left, right) => right.id - left.id);
}

export function categoryProjects(
  category: Pick<PortfolioCategory, 'id'>,
): PortfolioProject[] {
  return portfolio.projects.filter(
    (project) => project.category.id === category.id,
  );
}

export function portfolioPageCount(): number {
  return Math.ceil(portfolio.projects.length / PAGE_SIZE);
}

export function categoryPageCount(category: PortfolioCategory): number {
  return Math.ceil(category.count / CATEGORY_PAGE_SIZE);
}

export function pageSlice<T>(
  items: T[],
  page: number,
  pageSize: number,
): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export interface PageRouteProps {
  locale: Locale;
  page: number;
}

export interface CategoryRouteProps extends PageRouteProps {
  category: PortfolioCategory;
  projects: PortfolioProject[];
}

export interface ProjectRouteProps {
  locale: Locale;
  project: PortfolioProject;
  previous: PortfolioProject | null;
  next: PortfolioProject | null;
  related: PortfolioProject[];
}

export function portfolioPagePaths(locales: Locale[]) {
  const pages = Array.from(
    { length: Math.max(portfolioPageCount() - 1, 0) },
    (_, index) => index + 2,
  );
  return locales.flatMap((locale) =>
    pages.map((page) => ({
      params: { ...(locale === 'en' ? {} : { locale }), page: String(page) },
      props: { locale, page } satisfies PageRouteProps,
    })),
  );
}

export function categoryRootPaths(locales: Locale[]) {
  return locales.flatMap((locale) =>
    portfolio.categories.map((category) => ({
      params: {
        ...(locale === 'en' ? {} : { locale }),
        category: category.slug,
      },
      props: {
        locale,
        page: 1,
        category,
        projects: categoryProjects(category),
      } satisfies CategoryRouteProps,
    })),
  );
}

export function categoryPagePaths(locales: Locale[]) {
  return locales.flatMap((locale) =>
    portfolio.categories.flatMap((category) => {
      const pages = Array.from(
        { length: Math.max(categoryPageCount(category) - 1, 0) },
        (_, index) => index + 2,
      );
      return pages.map((page) => ({
        params: {
          ...(locale === 'en' ? {} : { locale }),
          category: category.slug,
          page: String(page),
        },
        props: {
          locale,
          page,
          category,
          projects: categoryProjects(category),
        } satisfies CategoryRouteProps,
      }));
    }),
  );
}

export function projectPaths(locales: Locale[]) {
  return locales.flatMap((locale) =>
    portfolio.projects.map((project) => {
      const projects = categoryProjects(project.category);
      const index = projects.findIndex((item) => item.id === project.id);
      const relatedCandidates = projects.filter(
        (item) => item.id !== project.id,
      );
      const relatedStart = Math.min(
        Math.max(0, index - 2),
        Math.max(0, relatedCandidates.length - 4),
      );
      const related = relatedCandidates.slice(
        relatedStart,
        relatedStart + 4,
      );

      return {
        params: {
          ...(locale === 'en' ? {} : { locale }),
          category: project.category.slug,
          slug: project.slug,
        },
        props: {
          locale,
          project,
          previous: projects[index - 1] ?? projects.at(-1) ?? null,
          next: projects[index + 1] ?? projects[0] ?? null,
          related,
        } satisfies ProjectRouteProps,
      };
    }),
  );
}

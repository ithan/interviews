import { LANGUAGES, type Language } from "../types/mod.ts";

// More realistic blog post titles
const TITLES = [
  "Getting Started with TypeScript in 2024",
  "A Complete Guide to React Hooks",
  "Building Scalable REST APIs",
  "Mastering CSS Grid Layout",
  "JavaScript Performance Tips",
  "Database Design Best Practices",
  "Modern Authentication Methods",
  "Web Performance Optimization",
  "Unit Testing Strategies",
  "Introduction to DevOps",
  "Cloud Architecture Patterns",
  "Microservices vs Monoliths",
  "GraphQL Fundamentals",
  "State Management in React",
  "Web Security Guidelines",
  "API Design Principles",
  "Effective Code Reviews",
  "Debugging Like a Pro",
  "CI/CD Pipeline Setup",
  "Monitoring and Logging",
];

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random item from an array
 */
export function randomPick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

/**
 * Generate lorem ipsum paragraph
 */
function loremParagraph(): string {
  const sentences = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    "Nulla pariatur excepteur sint occaecat cupidatat non proident.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  ];
  const count = randomInt(3, 5);
  return Array.from({ length: count }, () => randomPick(sentences)).join(" ");
}

/**
 * Generate simple HTML content (1 depth only)
 * Only paragraphs, lists, or headings - easy to transform to JSON blocks
 */
export function generateSimpleHtml(): string {
  const blocks: string[] = [];
  const blockCount = randomInt(4, 8);

  for (let i = 0; i < blockCount; i++) {
    const blockType = randomPick(["paragraph", "paragraph", "heading", "list"]);

    switch (blockType) {
      case "paragraph":
        blocks.push(`<p>${loremParagraph()}</p>`);
        break;
      case "heading": {
        const level = randomPick([2, 3]);
        const headings = [
          "Introduction",
          "Getting started",
          "Key concepts",
          "Implementation",
          "Best practices",
          "Common pitfalls",
          "Advanced topics",
          "Conclusion",
          "Next Steps",
          "Summary",
        ];
        blocks.push(`<h${level}>${randomPick(headings)}</h${level}>`);
        break;
      }
      case "list": {
        const itemCount = randomInt(3, 5);
        const listItems = [
          "Configure your development environment",
          "Install required dependencies",
          "Create the project structure",
          "Write unit tests first",
          "Document your code thoroughly",
          "Use version control effectively",
          "Review code before merging",
          "Monitor performance metrics",
          "Handle errors gracefully",
          "Optimize for production",
        ];
        const items = Array.from({ length: itemCount }, () =>
          `<li>${randomPick(listItems)}</li>`
        ).join("");
        blocks.push(`<ul>${items}</ul>`);
        break;
      }
    }
  }

  return blocks.join("\n");
}

/**
 * Generate a title for a given index
 */
export function generateTitle(index: number): string {
  return TITLES[index % TITLES.length];
}

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string, index: number): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${index}`;
}

/**
 * Translate title to a mock version for different languages
 */
export function translateTitle(title: string, lang: Language): string {
  if (lang === "en") return title;
  
  const translations: Record<Language, Record<string, string>> = {
    en: {},
    fr: {
      "Getting Started": "Commencer",
      "A Complete Guide": "Guide complet",
      "Building": "Construction de",
      "Mastering": "Maîtriser",
      "Introduction to": "Introduction à",
      "Modern": "Moderne",
      "Web": "Web",
      "Best Practices": "Meilleures pratiques",
    },
    de: {
      "Getting Started": "Erste schritte",
      "A Complete Guide": "Vollständiger leitfaden",
      "Building": "Aufbau von",
      "Mastering": "Beherrschen",
      "Introduction to": "Einführung in",
      "Modern": "Modern",
      "Web": "Web",
      "Best Practices": "Best practices",
    },
    es: {
      "Getting Started": "Comenzando",
      "A Complete Guide": "Guía completa",
      "Building": "Construcción de",
      "Mastering": "Dominando",
      "Introduction to": "Introducción a",
      "Modern": "Moderno",
      "Web": "Web",
      "Best Practices": "Mejores prácticas",
    },
    it: {
      "Getting Started": "Iniziare",
      "A Complete Guide": "Guida completa",
      "Building": "Costruzione di",
      "Mastering": "Padroneggiare",
      "Introduction to": "Introduzione a",
      "Modern": "Moderno",
      "Web": "Web",
      "Best Practices": "Best practices",
    },
    cs: {
      "Getting Started": "Začínáme",
      "A Complete Guide": "Kompletní průvodce",
      "Building": "Budování",
      "Mastering": "Ovládnutí",
      "Introduction to": "Úvod do",
      "Modern": "Moderní",
      "Web": "Web",
      "Best Practices": "Osvědčené postupy",
    },
    pl: {
      "Getting Started": "Rozpoczęcie",
      "A Complete Guide": "Kompletny przewodnik",
      "Building": "Budowanie",
      "Mastering": "Opanowanie",
      "Introduction to": "Wprowadzenie do",
      "Modern": "Nowoczesny",
      "Web": "Web",
      "Best Practices": "Najlepsze praktyki",
    },
    jp: {
      "Getting Started": "はじめに",
      "A Complete Guide": "完全なガイド",
      "Building": "構築",
      "Mastering": "マスター",
      "Introduction to": "入門",
      "Modern": "モダン",
      "Web": "ウェブ",
      "Best Practices": "ベストプラクティスです",
    },
  };

  let translated = title;
  const langTrans = translations[lang];
  for (const [eng, trans] of Object.entries(langTrans)) {
    translated = translated.replace(eng, trans);
  }
  
  // If no translation found, prefix with language code
  if (translated === title) {
    return `[${lang.toUpperCase()}] ${title}`;
  }
  
  return translated;
}

/**
 * Generate a random date within the past year
 */
export function generatePastDate(): string {
  const now = Date.now();
  const yearAgo = now - 365 * 24 * 60 * 60 * 1000;
  const randomTime = randomInt(yearAgo, now);
  return new Date(randomTime).toISOString();
}

/**
 * Generate a UUID
 */
export function generateUuid(): string {
  return crypto.randomUUID();
}

/**
 * Get random languages for a post (always includes 'en' first)
 */
export function getRandomLanguages(): Language[] {
  const otherLangs = LANGUAGES.filter((l) => l !== "en");
  const count = randomInt(2, 5);
  const shuffled = otherLangs.sort(() => Math.random() - 0.5);
  return ["en" as Language, ...shuffled.slice(0, count)];
}

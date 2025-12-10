import { LANGUAGES, type Language } from "../types/mod.ts";

const TITLES_EN = [
  "Getting Started with TypeScript",
  "Understanding React Hooks",
  "Building REST APIs",
  "CSS Grid Layout Guide",
  "JavaScript Best Practices",
  "Database Design Patterns",
  "Authentication Methods",
  "Performance Optimization",
  "Testing Strategies",
  "DevOps Fundamentals",
  "Cloud Architecture",
  "Microservices Explained",
  "GraphQL vs REST",
  "State Management",
  "Security Guidelines",
  "API Design Principles",
  "Code Review Tips",
  "Debugging Techniques",
  "Deployment Strategies",
  "Monitoring and Logging",
];

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "labore", "dolore", "magna",
  "aliqua", "enim", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "commodo", "consequat", "duis",
  "aute", "irure", "reprehenderit", "voluptate", "velit", "esse", "cillum",
  "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "proident", "sunt", "culpa", "officia", "deserunt", "mollit", "anim",
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
 * Generate a random sentence
 */
export function generateSentence(wordCount: number): string {
  const words = Array.from({ length: wordCount }, () => randomPick(WORDS));
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

/**
 * Generate a random paragraph
 */
export function generateParagraph(): string {
  const sentenceCount = randomInt(3, 6);
  return Array.from({ length: sentenceCount }, () => generateSentence(randomInt(8, 15))).join(" ");
}

/**
 * Generate simple HTML content (1 depth only)
 * Only paragraphs, lists, or headings - easy to transform
 */
export function generateSimpleHtml(): string {
  const blocks: string[] = [];
  const blockCount = randomInt(3, 7);

  for (let i = 0; i < blockCount; i++) {
    const blockType = randomPick(["paragraph", "heading", "list"]);

    switch (blockType) {
      case "paragraph":
        blocks.push(`<p>${generateParagraph()}</p>`);
        break;
      case "heading": {
        const level = randomPick([2, 3, 4]);
        const text = generateSentence(randomInt(3, 6)).replace(".", "");
        blocks.push(`<h${level}>${text}</h${level}>`);
        break;
      }
      case "list": {
        const itemCount = randomInt(3, 5);
        const items = Array.from({ length: itemCount }, () =>
          `<li>${generateSentence(randomInt(5, 10))}</li>`
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
  const baseTitle = TITLES_EN[index % TITLES_EN.length];
  const suffix = Math.floor(index / TITLES_EN.length);
  return suffix > 0 ? `${baseTitle} Part ${suffix + 1}` : baseTitle;
}

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Translate text to a mock version (just prefix with language code)
 */
export function mockTranslate(text: string, lang: Language): string {
  if (lang === "en") return text;
  const prefixes: Record<Language, string> = {
    en: "",
    fr: "[FR] ",
    de: "[DE] ",
    es: "[ES] ",
    it: "[IT] ",
    cs: "[CS] ",
    pl: "[PL] ",
    jp: "[JP] ",
  };
  return prefixes[lang] + text;
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
 * Get random languages for a post (always includes 'en')
 */
export function getRandomLanguages(): Language[] {
  const otherLangs = LANGUAGES.filter((l) => l !== "en");
  const count = randomInt(1, 4);
  const shuffled = otherLangs.sort(() => Math.random() - 0.5);
  return ["en" as Language, ...shuffled.slice(0, count)];
}


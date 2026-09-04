/**
 * ─────────────────────────────────────────────────────────────
 *  TOOL REGISTRY  (single source of truth for all tools)
 *
 *  Every tool is described once here. From this list we derive:
 *    • /tools listing page (search + category filter)
 *    • /tools/:slug detail pages (component + SEO copy + FAQ)
 *    • Home-page previews, footer category links, sitemap.xml
 *
 *  To ADD a tool:
 *    1. Write the React component in src/tools/<category>/index.tsx
 *    2. Add an entry below (slug must be unique & URL safe)
 *    3. Run `node scripts/generate-sitemap.mjs` to refresh sitemap
 * ─────────────────────────────────────────────────────────────
 */
import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type CategorySlug = "text" | "developer" | "converters" | "generators" | "calculators" | "utilities";

export interface ToolCategory {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string; // emoji – zero-dependency icons
}

export interface Tool {
  slug: string;
  name: string;
  category: CategorySlug;
  /** One-liner shown on cards (≤ 120 chars). */
  description: string;
  keywords: string[];
  /** Two or more paragraphs of helpful, original copy for the tool page. */
  about: string[];
  howTo: string[];
  faq: { q: string; a: string }[];
  component: LazyExoticComponent<ComponentType>;
  featured?: boolean;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  { slug: "text", name: "Text Tools", description: "Count, clean, transform and analyse any text.", icon: "✍️" },
  { slug: "developer", name: "Developer Tools", description: "Format, encode, decode and debug faster.", icon: "🧑‍💻" },
  { slug: "converters", name: "Converters", description: "Colours, units, timestamps, bases and more.", icon: "🔁" },
  { slug: "generators", name: "Generators", description: "Passwords, QR codes, CSS snippets, palettes.", icon: "✨" },
  { slug: "calculators", name: "Calculators", description: "Everyday maths for money, health and dates.", icon: "🧮" },
  { slug: "utilities", name: "Utilities", description: "Timers, notepad, speech and device helpers.", icon: "🧰" },
];

/* Lazy loaders per category file – keeps the registry readable. */
const T = (name: string) => lazy(() => import("./text").then((m) => ({ default: (m as Record<string, ComponentType>)[name] })));
const D = (name: string) => lazy(() => import("./developer").then((m) => ({ default: (m as Record<string, ComponentType>)[name] })));
const C = (name: string) => lazy(() => import("./converters").then((m) => ({ default: (m as Record<string, ComponentType>)[name] })));
const G = (name: string) => lazy(() => import("./generators").then((m) => ({ default: (m as Record<string, ComponentType>)[name] })));
const K = (name: string) => lazy(() => import("./calculators").then((m) => ({ default: (m as Record<string, ComponentType>)[name] })));
const U = (name: string) => lazy(() => import("./utilities").then((m) => ({ default: (m as Record<string, ComponentType>)[name] })));

const PRIVACY = "Everything runs locally in your browser – no data is uploaded to any server.";

export const TOOLS: Tool[] = [
  /* ──────────────── TEXT ──────────────── */
  {
    slug: "word-counter", name: "Word Counter", category: "text", featured: true,
    description: "Count words, characters, sentences and paragraphs with an instant reading-time estimate.",
    keywords: ["word counter", "character counter", "count words online", "reading time calculator"],
    about: [
      "The Axiomleaf Word Counter gives you live statistics as you type or paste. It tracks words, characters (with and without spaces), sentences and paragraphs, and estimates reading time based on an average pace of 200 words per minute. Writers use it to hit essay limits, marketers use it to keep ad copy tight, and students use it to meet assignment requirements.",
      "Unlike heavyweight editors, this counter loads instantly and processes text entirely inside your browser. Nothing you type is stored or sent anywhere, so it is safe for confidential drafts, contracts and personal notes.",
    ],
    howTo: ["Paste or type your text into the box.", "Read the live counts below – they update on every keystroke.", "Use the reading-time figure to plan blog posts, speeches or scripts."],
    faq: [
      { q: "How is reading time calculated?", a: "We divide the word count by 200 words per minute, a widely used average for adult readers, and round up to the nearest minute." },
      { q: "Does the counter treat hyphenated words as one word?", a: "Yes. Words are split on whitespace, so 'well-known' counts as a single word, matching most word-processor behaviour." },
      { q: "Is my text saved anywhere?", a: PRIVACY },
    ],
    component: T("WordCounter"),
  },
  {
    slug: "case-converter", name: "Case Converter", category: "text", featured: true,
    description: "Switch text between UPPERCASE, lowercase, Title Case, camelCase, snake_case and more.",
    keywords: ["case converter", "uppercase to lowercase", "title case converter", "camelcase converter"],
    about: [
      "Re-typing a heading because Caps Lock was on is a waste of time. The Case Converter transforms any block of text into eight common formats in a single click: uppercase, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and alternating case.",
      "Developers find the programming cases handy when renaming variables or generating file names, while writers and editors use Title and Sentence case to standardise headlines across a publication.",
    ],
    howTo: ["Enter or paste the text you want to change.", "Click one of the case buttons – the text transforms in place.", "Press Copy to grab the result, or chain multiple conversions."],
    faq: [
      { q: "What is the difference between Title Case and Sentence case?", a: "Title Case capitalises the first letter of every word; Sentence case only capitalises the first word of each sentence." },
      { q: "Can I convert to camelCase from a normal sentence?", a: "Yes. Spaces and punctuation are removed and each subsequent word is capitalised, producing e.g. 'helloWorldExample'." },
      { q: "Is there a length limit?", a: "No hard limit – it comfortably handles many thousands of words because processing happens locally." },
    ],
    component: T("CaseConverter"),
  },
  {
    slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", category: "text",
    description: "Generate placeholder paragraphs, sentences or words for mock-ups and layouts.",
    keywords: ["lorem ipsum generator", "placeholder text", "dummy text generator"],
    about: [
      "Designers and developers need filler text to evaluate typography and layout before real content exists. This generator produces classic Lorem Ipsum in whatever quantity you need – by paragraph, sentence or word – so you can focus on structure rather than copy.",
      "Each run is randomised from the traditional Latin corpus, giving natural-looking variation in sentence length. The output is plain text, so it drops cleanly into Figma, WordPress, HTML templates or any editor.",
    ],
    howTo: ["Choose how many units you want and whether they are paragraphs, sentences or words.", "Click Generate.", "Copy the result into your design or code."],
    faq: [
      { q: "Why do designers use Lorem Ipsum?", a: "Its letter distribution resembles natural English, so readers evaluate the layout rather than being distracted by meaningful content." },
      { q: "Can I generate a specific word count?", a: "Yes – select 'Words' as the unit and enter the exact number you need." },
      { q: "Is the text copyrighted?", a: "No. Lorem Ipsum derives from a 1st-century BC text by Cicero and is free to use anywhere." },
    ],
    component: T("LoremIpsum"),
  },
  {
    slug: "remove-duplicate-lines", name: "Remove Duplicate Lines", category: "text",
    description: "Delete repeated lines from lists, logs or CSV columns with case and whitespace options.",
    keywords: ["remove duplicate lines", "dedupe list online", "unique lines"],
    about: [
      "Email lists, keyword sheets and log exports often contain repeats. This tool removes duplicate lines while preserving the original order of first appearance, and reports exactly how many entries were dropped.",
      "Toggle case sensitivity to treat 'Apple' and 'apple' as the same item, and enable whitespace trimming so that trailing spaces do not hide duplicates. It is a faster alternative to spreadsheet formulas for one-off clean-ups.",
    ],
    howTo: ["Paste your list with one item per line.", "Adjust the case-sensitive and trim options as needed.", "Copy the cleaned output on the right."],
    faq: [
      { q: "Does it keep the original order?", a: "Yes – the first occurrence of each line stays where it was; only later repeats are removed." },
      { q: "Can it handle very large lists?", a: "It uses a hash set, so tens of thousands of lines process in milliseconds." },
      { q: "Are empty lines removed?", a: "Only duplicate empty lines are collapsed; the first blank line is kept unless trimming makes it identical to another." },
    ],
    component: T("DuplicateRemover"),
  },
  {
    slug: "text-reverser", name: "Text Reverser", category: "text",
    description: "Reverse characters, word order or line order in any text instantly.",
    keywords: ["reverse text", "backwards text generator", "flip text"],
    about: [
      "Reversing text is useful for creating mirror puzzles, testing string-handling code, checking palindromes or simply having fun with social media captions. This tool offers three modes: reverse every character, reverse the order of words while keeping each word intact, or reverse the order of lines.",
      "Unicode-aware processing means emoji and accented characters stay intact rather than being split into broken code points.",
    ],
    howTo: ["Select a reversal mode from the dropdown.", "Type or paste your text on the left.", "Copy the reversed result from the right-hand box."],
    faq: [
      { q: "Will emoji be reversed correctly?", a: "Yes. The tool iterates over full Unicode code points, so multi-byte characters remain valid." },
      { q: "Can I check whether a phrase is a palindrome?", a: "Reverse the characters and compare – if the output matches the input (ignoring spaces), it is a palindrome." },
      { q: "Does it work with right-to-left languages?", a: "It reverses the logical character order; visual rendering depends on your browser's bidi handling." },
    ],
    component: T("TextReverser"),
  },
  {
    slug: "slug-generator", name: "URL Slug Generator", category: "text",
    description: "Turn titles into clean, SEO-friendly URL slugs with hyphens or underscores.",
    keywords: ["slug generator", "url slug", "seo friendly url", "permalink generator"],
    about: [
      "A slug is the human-readable part of a URL that identifies a page, such as /blog/how-to-bake-bread. Clean slugs improve click-through rates in search results and are easier to share. This generator lowercases your title, strips accents and punctuation, and joins words with hyphens (or underscores if you prefer).",
      "It follows the same conventions used by WordPress, Ghost and most static-site generators, so the slugs it produces will be accepted anywhere.",
    ],
    howTo: ["Type your headline or product name.", "Pick a separator character.", "Copy the generated slug into your CMS or router."],
    faq: [
      { q: "Should I use hyphens or underscores in URLs?", a: "Google recommends hyphens because they are treated as word separators, whereas underscores join words together." },
      { q: "What happens to accented letters like é or ü?", a: "They are transliterated to their base ASCII letter (é → e), keeping the URL portable." },
      { q: "Is there an ideal slug length?", a: "Aim for 3–6 meaningful words. Shorter slugs are easier to read and remember." },
    ],
    component: T("SlugGenerator"),
  },
  {
    slug: "find-and-replace", name: "Find & Replace", category: "text",
    description: "Bulk find-and-replace with optional regular expressions and case-insensitive matching.",
    keywords: ["find and replace online", "regex replace", "bulk text replace"],
    about: [
      "Find & Replace lets you change every occurrence of a word or pattern in one go. Simple mode matches literal text; regex mode unlocks the full power of JavaScript regular expressions, including capture groups you can reference as $1, $2 in the replacement.",
      "A live match counter shows how many substitutions will be made before you copy the output, which helps avoid accidental over-replacement.",
    ],
    howTo: ["Enter the text to find and the replacement.", "Optionally enable Regex or Ignore case.", "Paste your source text and copy the result."],
    faq: [
      { q: "How do I use capture groups?", a: "Enable Regex, wrap part of the pattern in parentheses, and reference it in the replacement as $1." },
      { q: "Can I replace line breaks?", a: "Yes – with Regex enabled, search for \\n to match newline characters." },
      { q: "Is the replacement applied to all matches?", a: "Yes, the global flag is always on, so every occurrence is replaced." },
    ],
    component: T("FindReplace"),
  },
  {
    slug: "word-frequency-counter", name: "Word Frequency Counter", category: "text",
    description: "See which words appear most often in a document, with counts and percentages.",
    keywords: ["word frequency counter", "keyword density", "most common words"],
    about: [
      "Word frequency analysis reveals overused terms, checks keyword density for SEO and helps language learners identify high-value vocabulary. Paste any text and the tool tabulates the top 50 words with their absolute counts and percentage share.",
      "Matching is case-insensitive and Unicode-aware, so it works for English as well as accented and non-Latin scripts.",
    ],
    howTo: ["Paste an article, essay or transcript.", "Scan the table – it is sorted by count, highest first.", "Adjust your writing to balance repetitive words."],
    faq: [
      { q: "What keyword density is ideal for SEO?", a: "There is no magic number; most experts suggest keeping any single keyword below 2–3% and writing naturally." },
      { q: "Are stop words like 'the' included?", a: "Yes. All words are counted so you get a complete picture; simply ignore the common ones." },
      { q: "Does capitalisation matter?", a: "No. 'Data' and 'data' are counted together." },
    ],
    component: T("WordFrequency"),
  },
  {
    slug: "text-sorter", name: "Line Sorter & Shuffler", category: "text",
    description: "Sort lines alphabetically, by length, reverse them or shuffle randomly.",
    keywords: ["sort lines alphabetically", "shuffle lines", "sort text online"],
    about: [
      "Sorting a list should not require opening a spreadsheet. Paste any lines and sort them A–Z, Z–A or by length, or shuffle them into a random order for quizzes, draws and playlists. Natural sorting is used, so 'item2' correctly comes before 'item10'.",
      "The tool is ideal for tidying bibliographies, tag lists, CSS class names and to-do lists.",
    ],
    howTo: ["Paste your lines on the left.", "Choose a sort mode.", "Copy the sorted output."],
    faq: [
      { q: "What is natural sorting?", a: "It compares embedded numbers by value rather than character-by-character, so 'file2' precedes 'file10'." },
      { q: "Is the shuffle truly random?", a: "It uses the Fisher–Yates algorithm, which produces an unbiased permutation." },
      { q: "Are blank lines removed?", a: "Yes – empty lines are dropped before sorting." },
    ],
    component: T("TextSorter"),
  },

  /* ──────────────── DEVELOPER ──────────────── */
  {
    slug: "json-formatter", name: "JSON Formatter & Validator", category: "developer", featured: true,
    description: "Pretty-print, minify and validate JSON with clear error messages.",
    keywords: ["json formatter", "json validator", "json beautifier", "json minify"],
    about: [
      "Raw JSON from an API is often a single unreadable line. The Axiomleaf JSON Formatter indents it with 2 or 4 spaces, or squeezes it back down to a minified form for production. If the input is invalid, you get the exact parser error so you can locate the missing comma or stray quote quickly.",
      "Because parsing uses the browser's native JSON engine, results are identical to what Node.js or any modern runtime would produce. Your data never leaves your machine – important when debugging payloads that contain tokens or customer records.",
    ],
    howTo: ["Paste JSON into the left panel.", "Pick 2 spaces, 4 spaces or Minified.", "Copy or download the formatted result."],
    faq: [
      { q: "Why does my JSON fail validation?", a: "Common culprits are trailing commas, single quotes instead of double quotes, and unquoted keys – none of which are valid JSON." },
      { q: "Can it format very large files?", a: "Yes, several megabytes are fine. Extremely large inputs may take a second on slower devices." },
      { q: "Is my JSON uploaded anywhere?", a: PRIVACY },
    ],
    component: D("JsonFormatter"),
  },
  {
    slug: "base64-encode-decode", name: "Base64 Encoder / Decoder", category: "developer", featured: true,
    description: "Encode text to Base64 or decode Base64 back to UTF-8 text, fully offline.",
    keywords: ["base64 encode", "base64 decode", "base64 converter online"],
    about: [
      "Base64 represents binary data using 64 printable ASCII characters, making it safe to embed in JSON, URLs, email and HTML. This tool converts in both directions and correctly handles Unicode, so emoji and non-Latin scripts round-trip without corruption.",
      "Typical uses include inspecting HTTP Basic-Auth headers, decoding JWT segments, embedding small images and debugging webhook payloads.",
    ],
    howTo: ["Choose Encode or Decode.", "Paste your input.", "Copy the converted output."],
    faq: [
      { q: "Is Base64 encryption?", a: "No. It is an encoding, not encryption – anyone can decode it. Never rely on it for secrecy." },
      { q: "Why is the encoded string longer?", a: "Base64 expands data by roughly 33% because it packs 3 bytes into 4 characters." },
      { q: "Does it support URL-safe Base64?", a: "Decoding accepts standard Base64; replace '-' with '+' and '_' with '/' for URL-safe variants." },
    ],
    component: D("Base64Tool"),
  },
  {
    slug: "url-encoder-decoder", name: "URL Encoder / Decoder", category: "developer",
    description: "Percent-encode query strings or decode encoded URLs safely.",
    keywords: ["url encoder", "url decoder", "percent encoding", "encodeURIComponent"],
    about: [
      "URLs can only contain a limited set of characters; spaces, ampersands, non-ASCII letters and many symbols must be percent-encoded. This tool applies the same encodeURIComponent / decodeURIComponent logic browsers use, so results match exactly what your JavaScript would produce.",
      "Use it to build safe query strings, debug redirect chains and read tracking URLs that have been encoded multiple times.",
    ],
    howTo: ["Select Encode or Decode.", "Paste your URL or parameter value.", "Copy the output."],
    faq: [
      { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURIComponent encodes reserved characters like / ? & = as well, so it is correct for individual parameter values." },
      { q: "Why does a space become %20 and not +?", a: "%20 is the standard percent-encoding; '+' is only interpreted as a space in application/x-www-form-urlencoded bodies." },
      { q: "Can I decode a URL that was encoded twice?", a: "Yes – simply run Decode twice." },
    ],
    component: D("UrlEncoder"),
  },
  {
    slug: "html-entity-encoder", name: "HTML Entity Encoder / Decoder", category: "developer",
    description: "Escape special characters for HTML or convert entities back to text.",
    keywords: ["html entities", "html escape", "html encode online", "&amp; decoder"],
    about: [
      "Displaying code samples or user input on a web page requires escaping characters like < > & and quotes so browsers do not interpret them as markup. This tool converts them into safe entities, and decodes any named or numeric entity back to plain text.",
      "Correct escaping is a fundamental defence against cross-site scripting (XSS), so this is a handy checker when reviewing templates.",
    ],
    howTo: ["Pick Encode to escape or Decode to unescape.", "Paste the HTML or text.", "Copy the result."],
    faq: [
      { q: "Which characters must always be escaped in HTML?", a: "At minimum & < > and, inside attribute values, double and single quotes." },
      { q: "Does decoding support numeric entities like &#8364;?", a: "Yes, both decimal and hexadecimal numeric entities are decoded." },
      { q: "Will encoding break my Unicode text?", a: "No. Only the reserved characters are replaced; letters and emoji remain unchanged." },
    ],
    component: D("HtmlEntities"),
  },
  {
    slug: "regex-tester", name: "Regex Tester", category: "developer", featured: true,
    description: "Test JavaScript regular expressions with live highlighting and capture groups.",
    keywords: ["regex tester", "regular expression tester", "javascript regex", "regex online"],
    about: [
      "Regular expressions are powerful but unforgiving. This tester highlights every match in real time as you edit the pattern, lists match positions and shows captured groups, so you can iterate quickly without running code.",
      "It uses the browser's native JavaScript engine, meaning the behaviour is identical to what you will get in Node.js, React or any front-end project.",
    ],
    howTo: ["Type a pattern and optional flags (g, i, m, s, u, y).", "Paste sample text below.", "Review the highlighted matches and group captures."],
    faq: [
      { q: "What do the flags mean?", a: "g = global, i = case-insensitive, m = multiline anchors, s = dot matches newline, u = Unicode, y = sticky." },
      { q: "Why is my pattern matching an empty string forever?", a: "Patterns like a* can match zero characters. Anchor them or use + to require at least one character." },
      { q: "Does it support look-behind?", a: "Yes, modern browsers support (?<=…) and (?<!…) look-behind assertions." },
    ],
    component: D("RegexTester"),
  },
  {
    slug: "uuid-generator", name: "UUID Generator", category: "developer",
    description: "Generate one or hundreds of RFC 4122 version-4 UUIDs with secure randomness.",
    keywords: ["uuid generator", "guid generator", "random uuid v4"],
    about: [
      "Universally unique identifiers are the standard way to label database rows, sessions and files without a central authority. This generator uses crypto.randomUUID(), the cryptographically secure API built into modern browsers, to create version-4 UUIDs in bulk.",
      "Generate a single ID for a config file or five hundred for seeding a test database – all instantly and offline.",
    ],
    howTo: ["Set how many UUIDs you need.", "Click Generate.", "Copy all with one click."],
    faq: [
      { q: "What is a version-4 UUID?", a: "A 128-bit identifier where 122 bits are random, formatted as 8-4-4-4-12 hexadecimal digits." },
      { q: "Can two generated UUIDs collide?", a: "The probability is astronomically small – you would need to generate billions per second for decades." },
      { q: "Are these suitable as security tokens?", a: "They are generated securely, but purpose-built tokens with more entropy are recommended for authentication." },
    ],
    component: D("UuidGenerator"),
  },
  {
    slug: "jwt-decoder", name: "JWT Decoder", category: "developer",
    description: "Decode JSON Web Tokens to inspect the header and payload claims locally.",
    keywords: ["jwt decoder", "decode jwt online", "json web token viewer"],
    about: [
      "JSON Web Tokens carry authentication claims between services. When debugging login flows it is invaluable to see exactly what a token contains – its algorithm, issuer, expiry and custom claims. This decoder splits the token and Base64URL-decodes the header and payload into readable JSON.",
      "Because tokens often grant access to real accounts, decoding happens strictly inside your browser. Nothing is transmitted, logged or stored.",
    ],
    howTo: ["Paste the full JWT (three dot-separated segments).", "Read the decoded header and payload.", "Check the exp claim to see whether the token is still valid."],
    faq: [
      { q: "Does this verify the signature?", a: "No. Verification requires the secret or public key; this tool only decodes the readable parts." },
      { q: "What is the exp claim?", a: "The expiry time as a Unix timestamp in seconds. Use our Timestamp Converter to read it as a date." },
      { q: "Is it safe to paste a production token here?", a: "The token never leaves your device, but as a best practice avoid sharing live tokens anywhere." },
    ],
    component: D("JwtDecoder"),
  },
  {
    slug: "hash-generator", name: "Hash Generator (SHA-1/256/512)", category: "developer",
    description: "Compute SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text instantly.",
    keywords: ["sha256 generator", "hash generator online", "sha512", "checksum"],
    about: [
      "Cryptographic hashes turn any input into a fixed-length fingerprint. They are used to verify downloads, store passwords safely and detect tampering. This tool calculates four SHA variants simultaneously using the Web Crypto API – the same implementation your browser uses for TLS.",
      "Type or paste text and the digests update live. Compare them against published checksums or use them as deterministic identifiers.",
    ],
    howTo: ["Enter the text to hash.", "Read the four hash values.", "Copy the one you need."],
    faq: [
      { q: "Why isn't MD5 included?", a: "MD5 is cryptographically broken and not available in the Web Crypto API. SHA-256 is the recommended modern choice." },
      { q: "Can I hash a file?", a: "This tool hashes text. File hashing is on our roadmap." },
      { q: "Are hashes reversible?", a: "No. A hash cannot be turned back into the original input; that is what makes it useful." },
    ],
    component: D("HashGenerator"),
  },
  {
    slug: "markdown-previewer", name: "Markdown Previewer", category: "developer",
    description: "Write Markdown and see sanitized HTML output side-by-side in real time.",
    keywords: ["markdown previewer", "markdown to html", "markdown editor online"],
    about: [
      "Markdown is the lingua franca of READMEs, documentation and blog drafts. This live previewer renders headings, emphasis, lists, links, images, code blocks and blockquotes as you type, and can copy the resulting HTML for pasting into a CMS.",
      "Output is passed through DOMPurify before rendering, so even pasted Markdown containing scripts cannot execute in your browser.",
    ],
    howTo: ["Type Markdown in the left panel.", "Watch the preview update instantly.", "Click Copy HTML to export."],
    faq: [
      { q: "Which Markdown syntax is supported?", a: "Headings, bold, italic, inline code, fenced code blocks, ordered and unordered lists, links, images, blockquotes and horizontal rules." },
      { q: "Are tables supported?", a: "Not yet – the parser is intentionally lightweight. Table support is planned." },
      { q: "Is the HTML safe to embed?", a: "Yes. It is sanitized to strip scripts and dangerous attributes." },
    ],
    component: D("MarkdownPreview"),
  },
  {
    slug: "css-minifier", name: "CSS Minifier & Beautifier", category: "developer",
    description: "Compress CSS for production or expand minified stylesheets for reading.",
    keywords: ["css minifier", "css beautifier", "minify css online", "format css"],
    about: [
      "Smaller stylesheets download faster. The minifier strips comments, whitespace and redundant semicolons, typically shaving 20–40% off hand-written CSS. The beautifier does the reverse, reformatting compressed third-party CSS into indented, readable rules.",
      "The tool reports the before-and-after byte count so you can see the saving immediately.",
    ],
    howTo: ["Select Minify or Beautify.", "Paste your CSS.", "Copy the result."],
    faq: [
      { q: "Will minification change how my styles work?", a: "No. Only whitespace, comments and unnecessary semicolons are removed; selectors and declarations are untouched." },
      { q: "Should I minify in production?", a: "Yes. Build tools like Vite do this automatically, but this tool is handy for quick one-off files." },
      { q: "Does it handle media queries?", a: "Yes, nested blocks are preserved correctly." },
    ],
    component: D("CssMinifier"),
  },

  /* ──────────────── CONVERTERS ──────────────── */
  {
    slug: "color-converter", name: "Color Converter", category: "converters", featured: true,
    description: "Convert colours between HEX, RGB, HSL and CMYK with a live swatch.",
    keywords: ["color converter", "hex to rgb", "rgb to hsl", "hex to cmyk"],
    about: [
      "Different tools speak different colour languages: CSS prefers HEX or HSL, design apps often show RGB, and printers need CMYK. Pick a colour with the visual picker or type a HEX value and instantly see every equivalent format alongside a large preview swatch.",
      "HSL values are particularly useful for creating consistent colour scales – adjust lightness while keeping hue and saturation fixed.",
    ],
    howTo: ["Use the colour picker or type a HEX code.", "Read the RGB, HSL and CMYK equivalents.", "Copy the format your project needs."],
    faq: [
      { q: "Why does CMYK look different when printed?", a: "Screen colours are additive light (RGB) while print is subtractive ink; some vivid RGB colours cannot be reproduced exactly in CMYK." },
      { q: "Does it support 3-digit HEX?", a: "Yes, #abc is expanded to #aabbcc automatically." },
      { q: "Can I convert colours with transparency?", a: "Alpha channels are not included in this version; use RGB then append the alpha manually." },
    ],
    component: C("ColorConverter"),
  },
  {
    slug: "unit-converter", name: "Unit Converter", category: "converters", featured: true,
    description: "Convert length, weight, area, volume, speed, data size and time units.",
    keywords: ["unit converter", "metric to imperial", "km to miles", "kg to lbs"],
    about: [
      "From recipe measurements to engineering specs, unit conversion is a daily need. This converter covers seven categories – length, weight, area, volume, speed, data size and time – with precise conversion factors based on international standards.",
      "Results update as you type and are rounded to ten significant digits, which is more than enough for everyday and scientific work alike.",
    ],
    howTo: ["Choose a category.", "Enter a value and select the from/to units.", "Read the converted value instantly."],
    faq: [
      { q: "Is a kilobyte 1000 or 1024 bytes?", a: "This tool uses the binary convention (1024) common in operating systems. Storage manufacturers often use 1000." },
      { q: "Which gallon is used?", a: "The US liquid gallon (3.785 L). The UK imperial gallon is 4.546 L." },
      { q: "How accurate are the conversions?", a: "Factors follow NIST and SI definitions, so results are exact to the displayed precision." },
    ],
    component: C("UnitConverter"),
  },
  {
    slug: "temperature-converter", name: "Temperature Converter", category: "converters",
    description: "Convert between Celsius, Fahrenheit and Kelvin in both directions.",
    keywords: ["celsius to fahrenheit", "fahrenheit to celsius", "kelvin converter"],
    about: [
      "Whether you are following a foreign recipe, reading a weather forecast abroad or working through a physics problem, this converter makes temperature scales interchangeable. Edit any of the three fields and the other two update immediately.",
      "Formulas used: °F = °C × 9/5 + 32 and K = °C + 273.15, with results rounded to two decimals.",
    ],
    howTo: ["Type a value in any field.", "The other scales update automatically.", "Round as needed for your context."],
    faq: [
      { q: "What is absolute zero?", a: "0 K, equal to −273.15 °C or −459.67 °F – the lowest possible temperature." },
      { q: "At what temperature are Celsius and Fahrenheit equal?", a: "−40 degrees is the same on both scales." },
      { q: "Why does science use Kelvin?", a: "Kelvin starts at absolute zero, so it has no negative values, simplifying thermodynamic equations." },
    ],
    component: C("TemperatureConverter"),
  },
  {
    slug: "timestamp-converter", name: "Unix Timestamp Converter", category: "converters",
    description: "Convert Unix epoch timestamps to human dates and back, in UTC and local time.",
    keywords: ["unix timestamp converter", "epoch converter", "timestamp to date"],
    about: [
      "Databases, logs and APIs frequently store time as seconds or milliseconds since 1 January 1970 UTC. This converter turns those numbers into readable UTC, local and ISO-8601 dates, shows a relative phrase like 'in 3 days', and converts a chosen date back to epoch seconds and milliseconds.",
      "It auto-detects whether you pasted seconds (10 digits) or milliseconds (13 digits), so there is no unit to configure.",
    ],
    howTo: ["Paste a timestamp or click Now.", "Read the converted date formats.", "Or pick a date to get its timestamp."],
    faq: [
      { q: "What is the Unix epoch?", a: "Midnight UTC on 1 January 1970 – the zero point from which Unix time counts seconds." },
      { q: "What happens in 2038?", a: "32-bit signed timestamps overflow on 19 January 2038. Modern 64-bit systems are unaffected." },
      { q: "Why do local and UTC differ?", a: "Local time applies your device's timezone offset; UTC has no offset." },
    ],
    component: C("TimestampConverter"),
  },
  {
    slug: "number-base-converter", name: "Number Base Converter", category: "converters",
    description: "Convert numbers between binary, octal, decimal and hexadecimal.",
    keywords: ["binary to decimal", "hex to decimal", "number base converter", "octal converter"],
    about: [
      "Programmers, students and electronics hobbyists constantly move between number systems. Enter a value in any base and instantly see it in binary, octal, decimal and hexadecimal. Prefixes such as 0x, 0b and 0o are accepted and ignored.",
      "It is perfect for reading colour codes, file permissions, memory addresses and bitmask flags.",
    ],
    howTo: ["Enter a number.", "Select which base the input is in.", "Read all four representations."],
    faq: [
      { q: "Why is hexadecimal used for colours?", a: "One hex digit pair maps neatly to one byte (0–255), so a 24-bit colour is exactly six hex digits." },
      { q: "What is the largest number supported?", a: "Values up to 2^53 − 1 (about 9 quadrillion) are exact." },
      { q: "Are negative numbers supported?", a: "Not in this version; enter positive integers." },
    ],
    component: C("BaseConverter"),
  },
  {
    slug: "roman-numeral-converter", name: "Roman Numeral Converter", category: "converters",
    description: "Convert numbers to Roman numerals and Roman numerals back to numbers.",
    keywords: ["roman numeral converter", "number to roman", "roman to number"],
    about: [
      "Roman numerals still appear on clock faces, film credits, book chapters and monarch names. Type a number from 1 to 3999 to get its numeral, or type a numeral to get the number – both directions update live.",
      "The converter follows standard subtractive notation (IV rather than IIII), matching modern usage.",
    ],
    howTo: ["Type a number or a Roman numeral.", "The other field converts instantly.", "Copy the result."],
    faq: [
      { q: "Why is the limit 3999?", a: "Standard notation has no symbol above M (1000) and repeats a symbol at most three times, capping at MMMCMXCIX." },
      { q: "Is there a Roman numeral for zero?", a: "No – the Romans had no numeral for zero." },
      { q: "What year is MMXXV?", a: "2025." },
    ],
    component: C("RomanNumerals"),
  },
  {
    slug: "binary-text-converter", name: "Binary ⇄ Text Converter", category: "converters",
    description: "Translate text into 8-bit binary and binary back into readable text.",
    keywords: ["text to binary", "binary to text", "binary translator"],
    about: [
      "Every character you type is stored as bytes. This converter shows the UTF-8 binary representation of any text and decodes space-separated binary back into characters. It is a great teaching aid for understanding how computers store language.",
      "Because it uses UTF-8, multibyte characters such as accented letters and emoji are handled correctly.",
    ],
    howTo: ["Type text on the left to see binary.", "Or paste 8-bit binary groups on the right to see text.", "Copy either side."],
    faq: [
      { q: "Why are some characters more than 8 bits?", a: "UTF-8 uses 1–4 bytes per character; non-ASCII characters need multiple bytes." },
      { q: "Do I need spaces between bytes?", a: "Yes – separate each 8-bit group with a space for decoding." },
      { q: "What does 01001000 mean?", a: "It is 72 in decimal, the ASCII code for the letter H." },
    ],
    component: C("BinaryText"),
  },
  {
    slug: "csv-to-json", name: "CSV to JSON Converter", category: "converters",
    description: "Convert CSV spreadsheets into a JSON array of objects, with numbers detected.",
    keywords: ["csv to json", "convert csv to json online", "spreadsheet to json"],
    about: [
      "Spreadsheets export CSV; web apps consume JSON. Paste CSV with a header row and this converter produces an array of objects keyed by column name. Numeric cells are converted to numbers and quoted fields containing commas are handled correctly.",
      "Use it to seed a database, mock an API response or feed data into a JavaScript chart library.",
    ],
    howTo: ["Paste CSV including the header line.", "Review the JSON on the right.", "Copy it into your project."],
    faq: [
      { q: "Does it support semicolon-separated files?", a: "Currently only comma separation is supported; replace semicolons with commas first." },
      { q: "How are empty cells handled?", a: "They become empty strings." },
      { q: "Can I convert JSON back to CSV?", a: "That reverse tool is on our roadmap." },
    ],
    component: C("CsvJson"),
  },

  /* ──────────────── GENERATORS ──────────────── */
  {
    slug: "password-generator", name: "Password Generator", category: "generators", featured: true,
    description: "Create strong, random passwords with a live entropy estimate. Nothing is stored.",
    keywords: ["password generator", "strong password", "random password generator", "secure password"],
    about: [
      "Weak and reused passwords are the leading cause of account takeovers. This generator builds passwords from a cryptographically secure random source (the Web Crypto API), letting you choose length and character classes. Ambiguous characters like 0/O and 1/l are excluded to avoid transcription errors.",
      "A live entropy estimate tells you how resistant the password is to brute-force attacks. Pair it with a password manager for the best protection.",
    ],
    howTo: ["Set the desired length with the slider.", "Toggle uppercase, lowercase, digits and symbols.", "Copy the password – click Regenerate for another."],
    faq: [
      { q: "How long should a password be?", a: "At least 12–16 characters with mixed character classes. Longer is always better." },
      { q: "Is this generator safe to use?", a: "Yes – randomness comes from crypto.getRandomValues() and the password never leaves your browser." },
      { q: "What is entropy?", a: "A measure in bits of how many guesses an attacker would need. 80+ bits is considered very strong." },
    ],
    component: G("PasswordGenerator"),
  },
  {
    slug: "qr-code-generator", name: "QR Code Generator", category: "generators", featured: true,
    description: "Generate downloadable QR codes for URLs, Wi-Fi, text or contact details.",
    keywords: ["qr code generator", "free qr code", "create qr code online", "qr code png"],
    about: [
      "QR codes bridge print and digital – menus, posters, business cards and packaging all use them. Enter any text or URL and this generator renders a crisp QR code on a canvas that you can download as a PNG at up to 1024 pixels.",
      "Codes are generated locally, so private links and Wi-Fi credentials are never sent to a third-party service, unlike many online generators.",
    ],
    howTo: ["Enter a URL or text.", "Adjust the size slider.", "Click Download PNG."],
    faq: [
      { q: "Do the QR codes expire?", a: "No. They are static codes that encode your text directly, with no redirect service involved." },
      { q: "How do I make a Wi-Fi QR code?", a: "Enter WIFI:T:WPA;S:NetworkName;P:Password;; and phones will offer to join the network." },
      { q: "What size should I print?", a: "At least 2 cm × 2 cm for close scanning; larger for posters viewed from a distance." },
    ],
    component: G("QrGenerator"),
  },
  {
    slug: "css-gradient-generator", name: "CSS Gradient Generator", category: "generators",
    description: "Design linear and radial gradients visually and copy the CSS.",
    keywords: ["css gradient generator", "linear gradient", "radial gradient css"],
    about: [
      "Gradients add depth to buttons, hero sections and cards without any image assets. Pick two colours, choose linear or radial, and adjust the angle – the preview and CSS update instantly.",
      "The generated code uses standard syntax supported by every modern browser, ready to paste into a stylesheet or Tailwind arbitrary value.",
    ],
    howTo: ["Choose start and end colours.", "Select linear or radial and set the angle.", "Copy the CSS declaration."],
    faq: [
      { q: "Can I add more than two colour stops?", a: "Not yet – multi-stop gradients are planned. You can edit the copied CSS to add stops manually." },
      { q: "What angle makes a top-to-bottom gradient?", a: "180deg. 90deg is left-to-right." },
      { q: "Do gradients affect performance?", a: "CSS gradients are rendered by the GPU and are far lighter than image files." },
    ],
    component: G("GradientGenerator"),
  },
  {
    slug: "box-shadow-generator", name: "Box Shadow Generator", category: "generators",
    description: "Tune offset, blur, spread and opacity to craft the perfect CSS box-shadow.",
    keywords: ["box shadow generator", "css shadow", "box-shadow css generator"],
    about: [
      "Subtle shadows make interfaces feel layered and tactile. Rather than guessing values, drag the sliders for offset, blur, spread, colour and opacity while watching a live preview card, then copy the finished box-shadow declaration.",
      "The default settings produce the soft, modern shadow style used throughout Axiomleaf itself.",
    ],
    howTo: ["Adjust the sliders until the preview looks right.", "Pick a shadow colour.", "Copy the CSS."],
    faq: [
      { q: "What does spread do?", a: "Positive spread enlarges the shadow in all directions; negative spread shrinks it, creating tighter shadows." },
      { q: "How do I make an inset shadow?", a: "Add the keyword 'inset' at the start of the copied value." },
      { q: "Can I layer multiple shadows?", a: "Yes – separate multiple shadow values with commas in your CSS." },
    ],
    component: G("BoxShadowGenerator"),
  },
  {
    slug: "random-number-generator", name: "Random Number Generator", category: "generators",
    description: "Pick random numbers within any range, with an option for no repeats.",
    keywords: ["random number generator", "random number picker", "lottery number generator"],
    about: [
      "Draw raffle winners, assign teams, pick dice rolls or sample test data with truly random numbers. Set a minimum, maximum and count, and optionally disallow repeats for unique draws.",
      "Randomness comes from the browser's cryptographic generator, which is more uniform than Math.random() and suitable for fair selections.",
    ],
    howTo: ["Enter the min, max and how many numbers you want.", "Tick No repeats for unique results.", "Click Generate."],
    faq: [
      { q: "Are the results truly random?", a: "They come from crypto.getRandomValues(), which draws from the operating system's entropy source." },
      { q: "Can I generate decimals?", a: "This tool produces integers. For decimals, generate a larger range and divide." },
      { q: "Is the range inclusive?", a: "Yes – both the minimum and maximum can be selected." },
    ],
    component: G("RandomNumber"),
  },
  {
    slug: "color-palette-generator", name: "Color Palette Generator", category: "generators",
    description: "Generate harmonious five-colour palettes using analogous, triadic and other schemes.",
    keywords: ["color palette generator", "color scheme generator", "brand colors"],
    about: [
      "Choosing colours that work together is hard. This generator applies colour-theory rules – analogous, complementary, triadic and monochrome – to a base hue you control, producing a five-swatch palette suitable for websites, presentations and branding.",
      "Click any swatch to copy its HEX code, or hit Randomize for inspiration.",
    ],
    howTo: ["Drag the hue slider or click Randomize.", "Choose a harmony scheme.", "Click a swatch to copy its HEX value."],
    faq: [
      { q: "What is an analogous palette?", a: "Colours adjacent on the colour wheel (within about 30°), producing a calm, cohesive look." },
      { q: "What is a complementary palette?", a: "Colours opposite each other on the wheel, creating strong contrast – great for call-to-action buttons." },
      { q: "How many colours should a brand use?", a: "Typically one primary, one accent and a few neutrals. Five swatches give you room to choose." },
    ],
    component: G("PaletteGenerator"),
  },
  {
    slug: "meta-tag-generator", name: "Meta Tag Generator", category: "generators",
    description: "Create SEO title, description, Open Graph and Twitter Card tags for any page.",
    keywords: ["meta tag generator", "open graph generator", "seo meta tags", "twitter card generator"],
    about: [
      "Search engines and social networks rely on meta tags to display your page correctly. Fill in the title, description, URL and image, and this generator writes a complete, correctly escaped block of tags – including Open Graph and Twitter Card markup – ready to paste into your <head>.",
      "Character counters keep your title under 60 and description under 160 characters, the practical limits for Google snippets.",
    ],
    howTo: ["Fill in the page details.", "Watch the counters to stay within recommended lengths.", "Copy the generated tags into your HTML."],
    faq: [
      { q: "What is Open Graph?", a: "A protocol created by Facebook that controls how links appear when shared on social platforms." },
      { q: "What image size should I use?", a: "1200 × 630 pixels is the recommended size for both Open Graph and Twitter large cards." },
      { q: "Do meta keywords still matter?", a: "No – Google ignores the keywords tag, which is why this tool omits it." },
    ],
    component: G("MetaTagGenerator"),
  },

  /* ──────────────── CALCULATORS ──────────────── */
  {
    slug: "percentage-calculator", name: "Percentage Calculator", category: "calculators", featured: true,
    description: "Solve the three classic percentage problems: X% of Y, X is what % of Y, and % change.",
    keywords: ["percentage calculator", "percent change calculator", "what percent of"],
    about: [
      "Percentages appear everywhere – discounts, grades, tax, growth reports – yet they are easy to get backwards. This calculator lays out the three most common questions side by side so you always pick the right formula.",
      "Results update as you type and are rounded to two decimal places for clarity.",
    ],
    howTo: ["Choose the question that matches your problem.", "Enter the two known values.", "Read the answer instantly."],
    faq: [
      { q: "How do I calculate percentage increase?", a: "Subtract the old value from the new, divide by the old value, and multiply by 100." },
      { q: "What is 15% of 200?", a: "30 – multiply 200 by 0.15." },
      { q: "Why is the percentage change negative?", a: "A negative result means the value decreased." },
    ],
    component: K("PercentageCalculator"),
  },
  {
    slug: "bmi-calculator", name: "BMI Calculator", category: "calculators",
    description: "Calculate Body Mass Index in metric or imperial units and see your category.",
    keywords: ["bmi calculator", "body mass index", "healthy weight calculator"],
    about: [
      "Body Mass Index is a simple screening measure that relates weight to height. Enter your measurements in metric or imperial units to see your BMI and where it falls on the WHO scale from underweight to obese.",
      "BMI does not account for muscle mass, age or body composition, so treat it as a starting point for a conversation with a healthcare professional rather than a diagnosis.",
    ],
    howTo: ["Select metric or imperial units.", "Enter your height and weight.", "Read your BMI and category."],
    faq: [
      { q: "What is a healthy BMI range?", a: "18.5 to 24.9 is classified as normal weight by the World Health Organization." },
      { q: "Is BMI accurate for athletes?", a: "Often not – muscle is denser than fat, so muscular people may register as overweight." },
      { q: "How is BMI calculated?", a: "Weight in kilograms divided by height in metres squared." },
    ],
    component: K("BmiCalculator"),
  },
  {
    slug: "age-calculator", name: "Age Calculator", category: "calculators",
    description: "Find your exact age in years, months and days, plus total days and next birthday.",
    keywords: ["age calculator", "how old am i", "date of birth calculator"],
    about: [
      "Beyond a simple birthday count, this calculator reports your precise age in years, months and days, total days lived, weeks, hours and the countdown to your next birthday. Change the 'age at' date to compute age on any historical or future day.",
      "It handles leap years and month-length differences correctly, which naive calculations frequently get wrong.",
    ],
    howTo: ["Enter the date of birth.", "Optionally change the reference date.", "Read the detailed breakdown."],
    faq: [
      { q: "Does it account for leap years?", a: "Yes – calculations use real calendar dates, so 29 February is handled correctly." },
      { q: "Can I calculate age at a past date?", a: "Yes, set 'Age at date' to any date after the birth date." },
      { q: "Why does the day count differ from years × 365?", a: "Because leap years add an extra day roughly every four years." },
    ],
    component: K("AgeCalculator"),
  },
  {
    slug: "loan-emi-calculator", name: "Loan / EMI Calculator", category: "calculators", featured: true,
    description: "Estimate monthly payments, total interest and total cost for any loan or mortgage.",
    keywords: ["loan calculator", "emi calculator", "mortgage calculator", "monthly payment"],
    about: [
      "Before signing a mortgage, car loan or personal loan, know what it really costs. Enter the principal, annual interest rate and term to see the fixed monthly payment (EMI), the total interest you will pay and the overall amount repaid.",
      "The calculator uses the standard amortisation formula used by banks worldwide. Try different terms to see how a shorter loan dramatically reduces interest.",
    ],
    howTo: ["Enter the loan amount.", "Enter the annual interest rate and term in years.", "Compare monthly payment and total interest."],
    faq: [
      { q: "What does EMI stand for?", a: "Equated Monthly Instalment – a fixed payment covering both interest and principal." },
      { q: "Does this include taxes or insurance?", a: "No. It covers principal and interest only; add escrow items separately." },
      { q: "How does a lower rate affect payments?", a: "Even a 0.5% reduction can save thousands over a 30-year term – test it above." },
    ],
    component: K("LoanCalculator"),
  },
  {
    slug: "tip-calculator", name: "Tip Calculator", category: "calculators",
    description: "Work out the tip and split the bill evenly among any number of people.",
    keywords: ["tip calculator", "bill splitter", "gratuity calculator"],
    about: [
      "Dining out with friends should not end in mental arithmetic. Enter the bill, slide to your tip percentage and choose how many people are paying – the tool shows the tip, total and per-person share.",
      "Works for restaurants, taxis, salons and any service where gratuity is customary.",
    ],
    howTo: ["Enter the bill amount.", "Set the tip percentage.", "Choose how many people to split between."],
    faq: [
      { q: "What is a standard tip in the US?", a: "15–20% for restaurant service is typical; 18% is a common default." },
      { q: "Should I tip on the pre-tax amount?", a: "Etiquette varies; many people tip on the pre-tax subtotal." },
      { q: "Can I split unevenly?", a: "This tool splits evenly; adjust the shares manually if needed." },
    ],
    component: K("TipCalculator"),
  },
  {
    slug: "date-difference-calculator", name: "Date Difference Calculator", category: "calculators",
    description: "Count the days, weeks, months, years and business days between two dates.",
    keywords: ["date difference calculator", "days between dates", "business days calculator"],
    about: [
      "Project deadlines, notice periods, pregnancy tracking and travel planning all need accurate day counts. Choose two dates to see the difference in days, weeks, months and years, plus the number of business days (Monday–Friday) in between.",
      "Order does not matter – pick the dates in either sequence.",
    ],
    howTo: ["Select the start date.", "Select the end date.", "Read the breakdown including business days."],
    faq: [
      { q: "Are public holidays excluded from business days?", a: "No – only weekends are excluded, because holidays vary by country." },
      { q: "Is the end date included?", a: "The count is the number of full days between the two dates." },
      { q: "How are months calculated?", a: "Using an average month length of 30.44 days." },
    ],
    component: K("DateDifference"),
  },
  {
    slug: "discount-calculator", name: "Discount Calculator", category: "calculators",
    description: "See the sale price, savings and final cost with tax for any percentage discount.",
    keywords: ["discount calculator", "sale price calculator", "percent off calculator"],
    about: [
      "Is 25% off with 8% tax really a bargain? Enter the original price, discount percentage and optional sales tax to see exactly what you save and what you pay at the till.",
      "Useful for shoppers comparing deals and for retailers pricing promotions.",
    ],
    howTo: ["Enter the original price.", "Enter the discount percentage.", "Optionally add sales tax to see the final amount."],
    faq: [
      { q: "How do I calculate 20% off?", a: "Multiply the price by 0.20 to get the saving, then subtract it from the price." },
      { q: "Is tax applied before or after the discount?", a: "After – tax is charged on the discounted price, which is the norm in most regions." },
      { q: "Can I stack two discounts?", a: "Run the calculator twice, using the first sale price as the second original price." },
    ],
    component: K("DiscountCalculator"),
  },
  {
    slug: "aspect-ratio-calculator", name: "Aspect Ratio Calculator", category: "calculators",
    description: "Find the aspect ratio of any dimensions and scale images or videos proportionally.",
    keywords: ["aspect ratio calculator", "16:9 calculator", "resize image proportionally"],
    about: [
      "Resizing images and videos without distortion requires keeping the aspect ratio constant. Enter a width and height to get the simplified ratio (like 16:9), then enter a new width to compute the matching height.",
      "Handy for thumbnails, responsive embeds, social media graphics and print layouts.",
    ],
    howTo: ["Enter the original width and height.", "Read the simplified ratio.", "Enter a new width to get the proportional height."],
    faq: [
      { q: "What is the aspect ratio of 1920×1080?", a: "16:9 – the standard for HD video and most monitors." },
      { q: "What ratio should I use for Instagram?", a: "1:1 for square posts, 4:5 for portrait and 9:16 for Stories and Reels." },
      { q: "How is the ratio simplified?", a: "By dividing both numbers by their greatest common divisor." },
    ],
    component: K("AspectRatio"),
  },

  /* ──────────────── UTILITIES ──────────────── */
  {
    slug: "stopwatch", name: "Online Stopwatch", category: "utilities",
    description: "A precise stopwatch with lap times – runs right in your browser tab.",
    keywords: ["online stopwatch", "stopwatch with laps", "timer online"],
    about: [
      "Time workouts, speeches, cooking steps or coding sprints with a clean, distraction-free stopwatch. It shows hundredths of a second and records unlimited laps so you can review split times afterwards.",
      "Timing is based on system timestamps rather than interval ticks, so it stays accurate even if the tab is briefly throttled.",
    ],
    howTo: ["Click Start.", "Press Lap to record split times.", "Pause or Reset when finished."],
    faq: [
      { q: "Does it keep running if I switch tabs?", a: "Yes – elapsed time is calculated from the real clock, so it remains correct." },
      { q: "Can I export lap times?", a: "Not currently; take a screenshot or note the values." },
      { q: "Is there a keyboard shortcut?", a: "Tab to the Start button and press Space or Enter." },
    ],
    component: U("Stopwatch"),
  },
  {
    slug: "countdown-timer", name: "Countdown Timer", category: "utilities",
    description: "Set a minute-based countdown with a visual progress ring – ideal for Pomodoro sessions.",
    keywords: ["countdown timer", "pomodoro timer", "online timer minutes"],
    about: [
      "Focused work sessions, tea steeping, exam practice and presentation rehearsals all benefit from a visible countdown. Set the minutes, press Start and watch the ring drain; a clear message appears when time is up.",
      "Use 25 minutes for a classic Pomodoro, then 5 for a break.",
    ],
    howTo: ["Enter the number of minutes.", "Click Start.", "Pause or Reset at any time."],
    faq: [
      { q: "What is the Pomodoro Technique?", a: "A productivity method using 25-minute focused intervals separated by short breaks." },
      { q: "Does it play a sound?", a: "It shows an on-screen message; audio alerts are planned." },
      { q: "Can I set seconds?", a: "The timer accepts whole minutes; seconds precision is on the roadmap." },
    ],
    component: U("CountdownTimer"),
  },
  {
    slug: "image-to-base64", name: "Image to Base64", category: "utilities",
    description: "Convert PNG, JPG, SVG or GIF images into Base64 data URLs for CSS and HTML.",
    keywords: ["image to base64", "base64 image encoder", "data url generator"],
    about: [
      "Embedding small images directly in HTML or CSS as Base64 data URLs removes an HTTP request and is handy for icons, email signatures and offline documents. Drop an image and this tool produces the data URL along with ready-to-use <img> and CSS snippets.",
      "Conversion uses the browser's FileReader API – the image is never uploaded, making it safe for private photos and unreleased designs.",
    ],
    howTo: ["Drag an image onto the drop zone or click to browse.", "Preview the image and check its size.", "Copy the data URL, <img> tag or CSS."],
    faq: [
      { q: "When should I not use Base64 images?", a: "For large images – Base64 is ~33% bigger than the file and cannot be cached separately." },
      { q: "What is the size limit?", a: "5 MB per image in this tool." },
      { q: "Which formats are supported?", a: "Any image type your browser can read: PNG, JPEG, GIF, WebP, SVG, BMP, AVIF." },
    ],
    component: U("ImageToBase64"),
  },
  {
    slug: "text-to-speech", name: "Text to Speech", category: "utilities",
    description: "Listen to any text read aloud with your browser's built-in voices and adjustable speed.",
    keywords: ["text to speech", "read text aloud", "tts online free"],
    about: [
      "Proofread by ear, practise pronunciation or rest your eyes by having text read aloud. This tool uses the Web Speech API built into Chrome, Edge, Safari and Firefox, giving you access to every voice installed on your device in dozens of languages.",
      "Adjust the speaking rate from half speed to double speed. No audio is recorded or transmitted.",
    ],
    howTo: ["Paste or type text.", "Choose a voice and speed.", "Click Speak; press Stop to interrupt."],
    faq: [
      { q: "Why do I see different voices on different devices?", a: "Voices are provided by your operating system, so the list varies between Windows, macOS, Android and iOS." },
      { q: "Can I download the audio?", a: "The Web Speech API does not expose audio for download; use screen recording if needed." },
      { q: "Is there a text length limit?", a: "Some browsers cut off very long utterances; split texts over ~4,000 characters." },
    ],
    component: U("TextToSpeech"),
  },
  {
    slug: "online-notepad", name: "Online Notepad", category: "utilities",
    description: "A distraction-free notepad that auto-saves to your browser – no account required.",
    keywords: ["online notepad", "quick notes browser", "scratchpad"],
    about: [
      "Sometimes you just need somewhere to type. This notepad saves automatically to your browser's local storage as you write, so your note is still there when you come back – even after closing the tab. Download it as a .txt file whenever you like.",
      "Notes stay on your device only; they are not synced or visible to Axiomleaf.",
    ],
    howTo: ["Start typing – saving is automatic.", "Return any time on the same browser to continue.", "Download or copy your note when done."],
    faq: [
      { q: "Where is my note stored?", a: "In your browser's localStorage for this site only. Clearing site data will erase it." },
      { q: "Can I access it from another device?", a: "No – storage is per browser. Download the file to move it." },
      { q: "Is there a size limit?", a: "Browsers allow roughly 5 MB of localStorage, enough for a very long document." },
    ],
    component: U("Notepad"),
  },
  {
    slug: "character-counter", name: "Social Media Character Counter", category: "utilities",
    description: "Check text length against limits for X, Instagram, meta tags, SMS and more.",
    keywords: ["character counter", "twitter character limit", "meta description length"],
    about: [
      "Every platform enforces a different character ceiling. Draft your post once and see at a glance whether it fits an X post (280), a meta description (160), an SMS (160), an Instagram caption (2,200) and more – with progress bars that turn red when you go over.",
      "Perfect for social media managers, copywriters and SEO specialists.",
    ],
    howTo: ["Type or paste your draft.", "Check each platform's progress bar.", "Trim until everything is green."],
    faq: [
      { q: "Do emoji count as one character?", a: "This tool counts JavaScript string length; some platforms count emoji as two. Leave a small margin." },
      { q: "What is the ideal meta title length?", a: "Under 60 characters to avoid truncation in Google results." },
      { q: "Do URLs count in X posts?", a: "X counts every link as 23 characters regardless of its actual length." },
    ],
    component: U("CharCounter"),
  },
  {
    slug: "device-info", name: "Screen & Device Info", category: "utilities",
    description: "View your viewport size, screen resolution, pixel ratio, timezone and user agent.",
    keywords: ["what is my screen resolution", "viewport size", "user agent checker"],
    about: [
      "Front-end developers and support teams often need to know a device's exact viewport size, pixel density and browser identity. This page reports everything the browser exposes about itself and updates live when you resize the window.",
      "All information is read locally using standard JavaScript APIs and is not logged.",
    ],
    howTo: ["Open the page on the device you want to inspect.", "Resize the window to watch the viewport update.", "Copy any value you need."],
    faq: [
      { q: "What is device pixel ratio?", a: "The number of physical pixels per CSS pixel – 2 or 3 on Retina and high-DPI phones." },
      { q: "Why is my viewport smaller than my screen?", a: "Browser chrome, scrollbars and OS taskbars reduce the space available to web pages." },
      { q: "Is the user agent reliable?", a: "Increasingly less so – browsers are freezing or reducing it for privacy reasons." },
    ],
    component: U("DeviceInfo"),
  },
];

/* ───────────── Helpers ───────────── */
export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const getCategory = (slug: string) => TOOL_CATEGORIES.find((c) => c.slug === slug);
export const toolsByCategory = (slug: CategorySlug) => TOOLS.filter((t) => t.category === slug);
export const featuredTools = () => TOOLS.filter((t) => t.featured);
export const relatedTools = (tool: Tool, n = 4) =>
  TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, n);

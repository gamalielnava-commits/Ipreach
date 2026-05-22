// Integracion con la API biblica de bolls.life para insertar versiculos.

export interface BibleVersion {
  code: string;
  name: string;
}

// RV1909 es de dominio publico. Las demas son de uso comun pero con
// derechos de autor; el usuario es responsable de su uso.
export const bibleVersions: BibleVersion[] = [
  { code: "RV1909", name: "Reina-Valera 1909 (dominio publico)" },
  { code: "RV1960", name: "Reina-Valera 1960" },
  { code: "NVI", name: "Nueva Version Internacional" },
  { code: "NTV", name: "Nueva Traduccion Viviente" },
];

interface BookEntry {
  n: number;
  display: string;
  aliases: string[];
}

const books: BookEntry[] = [
  { n: 1, display: "Genesis", aliases: ["genesis", "gn", "gen"] },
  { n: 2, display: "Exodo", aliases: ["exodo", "ex", "exo"] },
  { n: 3, display: "Levitico", aliases: ["levitico", "lv", "lev"] },
  { n: 4, display: "Numeros", aliases: ["numeros", "nm", "num"] },
  { n: 5, display: "Deuteronomio", aliases: ["deuteronomio", "dt", "deut"] },
  { n: 6, display: "Josue", aliases: ["josue", "jos"] },
  { n: 7, display: "Jueces", aliases: ["jueces", "jue", "jc"] },
  { n: 8, display: "Rut", aliases: ["rut", "rt"] },
  { n: 9, display: "1 Samuel", aliases: ["1 samuel", "1samuel", "1 sam", "1sam", "i samuel"] },
  { n: 10, display: "2 Samuel", aliases: ["2 samuel", "2samuel", "2 sam", "2sam", "ii samuel"] },
  { n: 11, display: "1 Reyes", aliases: ["1 reyes", "1reyes", "1 re", "1re", "i reyes"] },
  { n: 12, display: "2 Reyes", aliases: ["2 reyes", "2reyes", "2 re", "2re", "ii reyes"] },
  { n: 13, display: "1 Cronicas", aliases: ["1 cronicas", "1cronicas", "1 cr", "1cr", "i cronicas"] },
  { n: 14, display: "2 Cronicas", aliases: ["2 cronicas", "2cronicas", "2 cr", "2cr", "ii cronicas"] },
  { n: 15, display: "Esdras", aliases: ["esdras", "esd"] },
  { n: 16, display: "Nehemias", aliases: ["nehemias", "neh"] },
  { n: 17, display: "Ester", aliases: ["ester", "est"] },
  { n: 18, display: "Job", aliases: ["job"] },
  { n: 19, display: "Salmos", aliases: ["salmos", "salmo", "sal", "sl"] },
  { n: 20, display: "Proverbios", aliases: ["proverbios", "proverbio", "pr", "prov"] },
  { n: 21, display: "Eclesiastes", aliases: ["eclesiastes", "ec", "ecl"] },
  { n: 22, display: "Cantares", aliases: ["cantares", "cantar", "cantar de los cantares", "cnt"] },
  { n: 23, display: "Isaias", aliases: ["isaias", "is", "isa"] },
  { n: 24, display: "Jeremias", aliases: ["jeremias", "jer", "jr"] },
  { n: 25, display: "Lamentaciones", aliases: ["lamentaciones", "lam"] },
  { n: 26, display: "Ezequiel", aliases: ["ezequiel", "ez", "eze"] },
  { n: 27, display: "Daniel", aliases: ["daniel", "dn", "dan"] },
  { n: 28, display: "Oseas", aliases: ["oseas", "os"] },
  { n: 29, display: "Joel", aliases: ["joel", "jl"] },
  { n: 30, display: "Amos", aliases: ["amos", "am"] },
  { n: 31, display: "Abdias", aliases: ["abdias", "abd"] },
  { n: 32, display: "Jonas", aliases: ["jonas", "jon"] },
  { n: 33, display: "Miqueas", aliases: ["miqueas", "mi", "miq"] },
  { n: 34, display: "Nahum", aliases: ["nahum", "nah"] },
  { n: 35, display: "Habacuc", aliases: ["habacuc", "hab"] },
  { n: 36, display: "Sofonias", aliases: ["sofonias", "sof"] },
  { n: 37, display: "Hageo", aliases: ["hageo", "hag"] },
  { n: 38, display: "Zacarias", aliases: ["zacarias", "zac"] },
  { n: 39, display: "Malaquias", aliases: ["malaquias", "mal"] },
  { n: 40, display: "Mateo", aliases: ["mateo", "mt", "mat"] },
  { n: 41, display: "Marcos", aliases: ["marcos", "mr", "mar", "mc"] },
  { n: 42, display: "Lucas", aliases: ["lucas", "lc", "luc"] },
  { n: 43, display: "Juan", aliases: ["juan", "jn", "jua"] },
  { n: 44, display: "Hechos", aliases: ["hechos", "hch", "hec"] },
  { n: 45, display: "Romanos", aliases: ["romanos", "ro", "rom"] },
  { n: 46, display: "1 Corintios", aliases: ["1 corintios", "1corintios", "1 co", "1co", "i corintios"] },
  { n: 47, display: "2 Corintios", aliases: ["2 corintios", "2corintios", "2 co", "2co", "ii corintios"] },
  { n: 48, display: "Galatas", aliases: ["galatas", "ga", "gal"] },
  { n: 49, display: "Efesios", aliases: ["efesios", "ef", "efe"] },
  { n: 50, display: "Filipenses", aliases: ["filipenses", "fil", "flp"] },
  { n: 51, display: "Colosenses", aliases: ["colosenses", "col"] },
  { n: 52, display: "1 Tesalonicenses", aliases: ["1 tesalonicenses", "1tesalonicenses", "1 ts", "1ts"] },
  { n: 53, display: "2 Tesalonicenses", aliases: ["2 tesalonicenses", "2tesalonicenses", "2 ts", "2ts"] },
  { n: 54, display: "1 Timoteo", aliases: ["1 timoteo", "1timoteo", "1 ti", "1ti"] },
  { n: 55, display: "2 Timoteo", aliases: ["2 timoteo", "2timoteo", "2 ti", "2ti"] },
  { n: 56, display: "Tito", aliases: ["tito", "tit"] },
  { n: 57, display: "Filemon", aliases: ["filemon", "flm"] },
  { n: 58, display: "Hebreos", aliases: ["hebreos", "he", "heb"] },
  { n: 59, display: "Santiago", aliases: ["santiago", "stg", "sant"] },
  { n: 60, display: "1 Pedro", aliases: ["1 pedro", "1pedro", "1 p", "1p"] },
  { n: 61, display: "2 Pedro", aliases: ["2 pedro", "2pedro", "2 p", "2p"] },
  { n: 62, display: "1 Juan", aliases: ["1 juan", "1juan", "1 jn", "1jn"] },
  { n: 63, display: "2 Juan", aliases: ["2 juan", "2juan", "2 jn", "2jn"] },
  { n: 64, display: "3 Juan", aliases: ["3 juan", "3juan", "3 jn", "3jn"] },
  { n: 65, display: "Judas", aliases: ["judas", "jud"] },
  { n: 66, display: "Apocalipsis", aliases: ["apocalipsis", "ap", "apoc", "revelacion"] },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\./g, "")
    .trim()
    .replace(/\s+/g, " ");
}

const bookMap = new Map<string, BookEntry>();
for (const b of books) {
  for (const alias of b.aliases) bookMap.set(normalize(alias), b);
}

export interface ParsedReference {
  book: number;
  bookName: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

export function parseReference(ref: string): ParsedReference | null {
  const m = ref.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:\s*-\s*(\d+))?)?$/);
  if (!m) return null;
  const book = bookMap.get(normalize(m[1]));
  if (!book) return null;
  return {
    book: book.n,
    bookName: book.display,
    chapter: parseInt(m[2], 10),
    verseStart: m[3] ? parseInt(m[3], 10) : undefined,
    verseEnd: m[4] ? parseInt(m[4], 10) : undefined,
  };
}

export function referenceLabel(p: ParsedReference): string {
  let label = `${p.bookName} ${p.chapter}`;
  if (p.verseStart) {
    label += `:${p.verseStart}`;
    if (p.verseEnd && p.verseEnd !== p.verseStart) label += `-${p.verseEnd}`;
  }
  return label;
}

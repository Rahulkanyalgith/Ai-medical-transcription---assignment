export function cleanText(text) {

  const fillers = /\b(um|uh|you know|basically)\b/gi;

  return text
    .replace(fillers, "")
    .replace(/\s+/g, " ")
    .trim();
}
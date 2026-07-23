export function calculateReadingTime(
  text: string,
  wordsPerMinute = 300
): number {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "");
  return Math.max(1, Math.ceil(cleaned.length / wordsPerMinute));
}

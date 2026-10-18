/** Form annotations belong to submit events; explicitly annotated descendants can still track clicks. */
export function analyticsClickTarget<T extends { tagName: string }>(candidate: T | null): T | null {
  return candidate?.tagName === "FORM" ? null : candidate;
}

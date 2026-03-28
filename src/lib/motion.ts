/** Standard easing used throughout the app */
export const EASE_STANDARD = [0.25, 0.1, 0.25, 1] as const;

/** Slide-in animation for list items (opacity + y) */
export function itemAnimation(shouldReduceMotion: boolean | null) {
  if (shouldReduceMotion) return {};
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.18, ease: EASE_STANDARD },
  } as const;
}

/** Staggered fade-in from below */
export function staggeredEntry(
  shouldReduceMotion: boolean | null,
  delay: number,
) {
  return {
    initial: shouldReduceMotion ? undefined : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, delay },
  } as const;
}

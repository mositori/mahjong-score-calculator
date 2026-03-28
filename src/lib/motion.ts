/** Standard easing used throughout the app */
export const EASE_STANDARD = [0.25, 0.1, 0.25, 1] as const;

/** Slide-in animation for list items (opacity + y) */
export function itemAnimation(shouldReduceMotion: boolean | null) {
  if (shouldReduceMotion) return {};
  return {
    initial: { opacity: 0, y: 8 } as const,
    animate: { opacity: 1, y: 0 } as const,
    exit: { opacity: 0, y: -8 } as const,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
  };
}

/** Staggered fade-in from below */
export function staggeredEntry(
  shouldReduceMotion: boolean | null,
  delay: number,
) {
  return {
    initial: shouldReduceMotion ? undefined : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring' as const, stiffness: 300, damping: 25, delay },
  };
}

import { useEffect, useRef, useState } from "react";

/**
 * useCountUp
 *
 * Animates a displayed number from 0 up to `value` whenever `value`
 * changes (including on first mount). Works with plain numbers (128)
 * or strings that have a numeric prefix and any suffix ("94%",
 * "128", "$1,200" etc.) - the suffix is preserved as-is and only the
 * numeric part is animated.
 *
 * Usage:
 *   const animated = useCountUp(128);   -> "0" -> "128"
 *   const animated = useCountUp("94%"); -> "0%" -> "94%"
 *
 * @param {number|string} value     target value to count up to
 * @param {number} duration         animation length in ms (default 900)
 * @returns {string} the current animated value, ready to render directly
 */
export default function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  // Split "94%" -> target 94, suffix "%". Plain numbers get suffix "".
  const match = String(value).match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-cubic: fast start, gentle settle - reads naturally for counters
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (target - from) * eased);
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return `${display}${suffix}`;
}

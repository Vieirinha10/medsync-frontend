import { useId, useMemo } from 'react';

const MORPH_DURATION = 0.8;
const HOLD_DURATION = 1.6;

export default function StatMorph({ items }) {
  const normalizedItems = useMemo(
    () => items.filter((item) => item?.value && item?.label),
    [items],
  );
  const rawId = useId();
  const safeId = rawId.replace(/:/g, '');
  const animationName = `stat-morph-rotate-${safeId}`;
  const indicatorName = `stat-morph-indicator-${safeId}`;

  const count = Math.max(1, normalizedItems.length);
  const slot = MORPH_DURATION + HOLD_DURATION;
  const cycle = slot * count;
  const percentage = (seconds) => Math.min(100, (seconds / cycle) * 100).toFixed(4);
  const morphIn = percentage(MORPH_DURATION);
  const holdEnd = percentage(MORPH_DURATION + HOLD_DURATION);
  const morphOut = percentage((2 * MORPH_DURATION) + HOLD_DURATION);

  const keyframes = `
    @keyframes ${animationName} {
      0% { opacity: 0; filter: blur(7px); transform: translate(-50%, -50%) scale(.94); }
      ${morphIn}% { opacity: 1; filter: blur(0); transform: translate(-50%, -50%) scale(1); }
      ${holdEnd}% { opacity: 1; filter: blur(0); transform: translate(-50%, -50%) scale(1); }
      ${morphOut}%, 100% { opacity: 0; filter: blur(7px); transform: translate(-50%, -50%) scale(1.06); }
    }

    @keyframes ${indicatorName} {
      0%, ${morphOut}%, 100% { width: 6px; opacity: .28; }
      ${morphIn}%, ${holdEnd}% { width: 25px; opacity: 1; }
    }
  `;

  return (
    <div className="stat-morph">
      <style>{keyframes}</style>

      <div className="stat-morph-stage" aria-hidden="true">
        {normalizedItems.map((item, index) => (
          <div
            className="stat-morph-word"
            key={`${item.value}-${item.label}`}
            style={{
              animation: `${animationName} ${cycle}s ${(slot * index).toFixed(3)}s infinite ease-in-out both`,
            }}
          >
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="stat-morph-indicators" aria-hidden="true">
        {normalizedItems.map((item, index) => (
          <span
            key={item.label}
            style={{
              animation: `${indicatorName} ${cycle}s ${(slot * index).toFixed(3)}s infinite ease-in-out both`,
            }}
          />
        ))}
      </div>

      <ul className="stat-morph-accessible">
        {normalizedItems.map((item) => <li key={item.label}>{item.value} {item.label}</li>)}
      </ul>
    </div>
  );
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getResponsiveFrequencyScale = (width, height) => {
  if (width < 760) return 1;

  const aspectRatio = width / Math.max(height, 1);
  return 1 + clamp((aspectRatio - 1) * 0.52, 0, 0.42);
};

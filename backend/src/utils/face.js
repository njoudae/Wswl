export function computeEuclideanDistance(desc1, desc2) {
  if (!Array.isArray(desc1) || !Array.isArray(desc2) || desc1.length !== desc2.length) {
    return Number.POSITIVE_INFINITY;
  }
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    const diff = desc1[i] - desc2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export const FACE_MATCH_THRESHOLD = 0.6;

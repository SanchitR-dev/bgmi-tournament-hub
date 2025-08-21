export function calculateTotalPoints(rank, kills, pointSystem, pointPerKill = 1) {
  const placementScore = rank > 0 && rank <= pointSystem.length ? pointSystem[rank - 1] : 0;
  const killScore = kills * pointPerKill;
  return placementScore + killScore;
}

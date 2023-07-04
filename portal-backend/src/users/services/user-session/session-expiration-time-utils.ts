interface SessionExpirationProps {
  refreshTokenValidity: number;
  sessionExpirationOffset: number;
}

const MilliSecondsPerHour = 60 * 60 * 1000;

export function calSessionExpirationTime({
  refreshTokenValidity,
  sessionExpirationOffset,
}: SessionExpirationProps) {
  const sessionLife = refreshTokenValidity * MilliSecondsPerHour;
  const randomOffsetRange = sessionExpirationOffset * MilliSecondsPerHour;

  const randomOffset = Math.floor(randomOffsetRange * Math.random());
  const now = Date.now();
  return new Date(now + sessionLife + randomOffset);
}

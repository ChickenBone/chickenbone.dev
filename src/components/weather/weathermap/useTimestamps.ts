import { useState, useEffect } from 'react';

export function useTimestamps(layer: string) {
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    setTimestamps([]);
    fetch(`/api/weather/radar?layer=${layer}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.timestamps && data.timestamps.length > 0) {
          setTimestamps(data.timestamps);
        }
      })
      .finally(() => setIsLoading(false));
  }, [layer]);
  return { timestamps, isLoading };
}

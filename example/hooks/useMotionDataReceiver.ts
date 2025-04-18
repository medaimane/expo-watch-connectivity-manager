import {useCallback, useRef, useState} from 'react';
import {WCSensorData, WCSensorDataChunk} from 'expo-watch-connectivity-manager';

enum ChunksHint {
  Initial = 'Initial',
  Complete = 'Complete',
  Incomplete = 'Incomplete',
}

type Params = {
  onComplete: (data: WCSensorData[]) => Promise<void>;
};

export function useMotionDataReceiver({onComplete}: Params) {
  const totalChunksRef = useRef<number | null>(null);
  const chunksRef = useRef<{[key: number]: WCSensorData[]}>({});
  const currentSessionId = useRef<string | null>(null);

  const [trackingDataHint, setTrackingDataHint] = useState<ChunksHint>(ChunksHint.Initial);

  const combineChunks = useCallback(() => {
    // Sort chunk indices and combine data in order.
    const sortedIndices = Object.keys(chunksRef.current)
      .map(Number)
      .sort((a, b) => a - b);
    const combinedData = sortedIndices.reduce(
      (acc: WCSensorData[], key) => acc.concat(chunksRef.current[key]),
      [],
    );
    return combinedData;
  }, []);

  const onDataChunk = useCallback(
    async (chunk: WCSensorDataChunk) => {
      if (currentSessionId.current !== chunk.sessionId) {
        console.log(
          `New session detected. Resetting old data (old: ${currentSessionId.current}, new: ${chunk.sessionId}).`,
        );

        chunksRef.current = {};
        totalChunksRef.current = null;
        setTrackingDataHint(ChunksHint.Initial);
        currentSessionId.current = chunk.sessionId;
      }

      totalChunksRef.current = chunk.total;
      chunksRef.current[chunk.index] = chunk.data;
      console.log('Received chunk with index:', chunk.index);

      if (!chunk.done) {
        return;
      }

      // Check if we have received all chunks.
      const chunksComplete =
        totalChunksRef.current !== null &&
        Object.keys(chunksRef.current).length === totalChunksRef.current;

      setTrackingDataHint(chunksComplete ? ChunksHint.Complete : ChunksHint.Incomplete);
      const data = combineChunks();

      console.log('📀 Data combined: ', chunksComplete ? 'complete' : 'incomplete', data);

      // Call the completion callback.
      await onComplete(data);

      // Reset our state for the next transmission.
      chunksRef.current = {};
      totalChunksRef.current = null;
      currentSessionId.current = null;
      setTrackingDataHint(ChunksHint.Initial);
    },
    [onComplete],
  );

  return {
    trackingDataHint,
    onDataChunk,
  };
}

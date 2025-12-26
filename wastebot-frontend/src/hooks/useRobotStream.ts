import { useState, useEffect, useRef, useCallback } from 'react';
import { aiApi } from '../services/aiApi';
import api from '../services/api';
import { toast } from 'sonner';

interface UseRobotStreamOptions {
  robotId: number;
  enabled?: boolean;
  onStreamStart?: () => void;
  onStreamStop?: () => void;
}

export function useRobotStream({
  robotId,
  enabled = false,
  onStreamStart,
  onStreamStop,
}: UseRobotStreamOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const isStreamingRef = useRef(false);
  const cleanupCalledRef = useRef(false);

  // Check initial stream status
  useEffect(() => {
    if (enabled && robotId) {
      checkStreamStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [robotId, enabled]);

  // Cleanup on unmount or when disabled
  useEffect(() => {
    return () => {
      if (isStreamingRef.current && !cleanupCalledRef.current) {
        cleanupCalledRef.current = true;
        stopStream();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup when page unloads
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isStreamingRef.current) {
        // Use sendBeacon for cleanup on page unload
        const token = localStorage.getItem('token');
        const baseUrl = api.defaults.baseURL || 'http://localhost:8082';
        const url = `${baseUrl}/ai/robots/${robotId}/stop_streaming`;
        // Note: sendBeacon doesn't support custom headers, so token must be in URL
        if (token) {
          navigator.sendBeacon(`${url}?token=${token}`);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [robotId]);

  const checkStreamStatus = async () => {
    try {
      const shouldStream = await aiApi.shouldStream(robotId);
      if (shouldStream && !isStreamingRef.current) {
        // Stream is active but we haven't started it in this component
        setIsStreaming(true);
        isStreamingRef.current = true;
        setStreamUrl(aiApi.getStreamUrl(robotId));
      }
    } catch (error) {
      console.error('Error checking stream status:', error);
    }
  };

  const startStream = useCallback(async () => {
    if (isStreamingRef.current) {
      return;
    }

    try {
      setStreamError(null);
      const response = await aiApi.startStream(robotId);
      
      if (response.streaming) {
        setIsStreaming(true);
        isStreamingRef.current = true;
        setStreamUrl(aiApi.getStreamUrl(robotId));
        onStreamStart?.();
        toast.success('Stream started successfully');
      } else {
        throw new Error('Stream did not start');
      }
    } catch (error: any) {
      console.error('Error starting stream:', error);
      const errorMessage = error.response?.data?.message || 'Failed to start video stream';
      setStreamError(errorMessage);
      setIsStreaming(false);
      isStreamingRef.current = false;
      toast.error(errorMessage);
    }
  }, [robotId, onStreamStart]);

  const stopStream = useCallback(async () => {
    if (!isStreamingRef.current) {
      return;
    }

    try {
      await aiApi.stopStreaming(robotId);
      setIsStreaming(false);
      isStreamingRef.current = false;
      setStreamUrl('');
      setStreamError(null);
      onStreamStop?.();
      toast.success('Stream stopped successfully');
    } catch (error: any) {
      console.error('Error stopping stream:', error);
      const errorMessage = error.response?.data?.message || 'Failed to stop video stream';
      setStreamError(errorMessage);
      toast.error(errorMessage);
    }
  }, [robotId, onStreamStop]);

  const toggleStream = useCallback(() => {
    if (isStreamingRef.current) {
      stopStream();
    } else {
      startStream();
    }
  }, [startStream, stopStream]);

  return {
    isStreaming,
    streamError,
    streamUrl,
    startStream,
    stopStream,
    toggleStream,
  };
}


import { X, Play, Square } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { aiApi } from '../services/aiApi';
import { toast } from 'sonner';
import type { Robot } from '../App';

type CameraFeedModalProps = {
  robot: Robot;
  onClose: () => void;
  updateRobotStatus: (robotId: string, status: 'active' | 'idle' | 'error') => void;
};

export function CameraFeedModal({ robot, onClose, updateRobotStatus }: CameraFeedModalProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const videoRef = useRef<HTMLImageElement>(null);
  const streamUrlRef = useRef<string>('');
  const isStreamingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    isStreamingRef.current = isStreaming;
  }, [isStreaming]);

  useEffect(() => {
    // Check if stream should be active
    checkStreamStatus();

    // Cleanup function
    return () => {
      // Cleanup: stop streaming when component unmounts or modal closes
      if (isStreamingRef.current && videoRef.current) {
        // Clean up video source immediately
        videoRef.current.src = '';
        // Attempt to stop stream (fire and forget for cleanup)
        aiApi.stopStream(robot.id).catch(() => {
          // Ignore errors during cleanup
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkStreamStatus = async () => {
    try {
      const shouldStream = await aiApi.shouldStream(robot.id);
      if (shouldStream) {
        startStreaming();
      }
    } catch (error: any) {
      console.error('Error checking stream status:', error);
      // Don't show error for initial check - user hasn't requested stream yet
    }
  };

  const startStreaming = async () => {
    try {
      setStreamError(null);
      await aiApi.requestStream(robot.id);
      setIsStreaming(true);
      isStreamingRef.current = true;
      
      // Set up MJPEG stream URL
      streamUrlRef.current = aiApi.getStreamUrl(robot.id);
      if (videoRef.current) {
        videoRef.current.src = streamUrlRef.current;
      }
      
      updateRobotStatus(robot.id, 'active');
    } catch (error: any) {
      console.error('Error starting stream:', error);
      setIsStreaming(false);
      
      // Handle 503 errors gracefully
      if (error.response?.status === 503) {
        toast.error('Streaming service unavailable. Please try again later.', {
          duration: 5000,
        });
        setStreamError('Streaming service unavailable');
      } else {
        toast.error('Failed to start video stream', {
          duration: 5000,
        });
        setStreamError('Failed to start video stream');
      }
    }
  };

  const stopStreaming = async () => {
    try {
      await aiApi.stopStream(robot.id);
      setIsStreaming(false);
      isStreamingRef.current = false;
      setStreamError(null);
      
      if (videoRef.current) {
        videoRef.current.src = '';
      }
      
      updateRobotStatus(robot.id, 'idle');
    } catch (error: any) {
      console.error('Error stopping stream:', error);
      
      // Handle 503 errors gracefully
      if (error.response?.status === 503) {
        toast.error('Streaming service unavailable', {
          duration: 5000,
        });
      } else {
        toast.error('Failed to stop video stream', {
          duration: 5000,
        });
      }
      
      // Still update UI state even if API call failed
      setIsStreaming(false);
      isStreamingRef.current = false;
      setStreamError(null);
      if (videoRef.current) {
        videoRef.current.src = '';
      }
      updateRobotStatus(robot.id, 'idle');
    }
  };

  const toggleDetection = () => {
    if (isStreaming) {
      stopStreaming();
    } else {
      startStreaming();
    }
  };

  // Cleanup on modal close
  const handleClose = () => {
    if (isStreaming) {
      stopStreaming();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-gray-900 dark:text-white">{robot.name} - Live Camera Feed</h2>
            <p className="text-gray-600 dark:text-gray-400">{robot.location}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Camera Feed */}
        <div className="p-6">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {streamError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-400 mb-4">{streamError}</p>
                  <button
                    onClick={startStreaming}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {!isStreaming && !streamError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <div className="w-16 h-16 bg-gray-600/50 rounded-full" />
                  </div>
                  <p className="text-white">Camera Feed Not Active</p>
                  <p className="text-gray-400 mt-2">Click "Start Detection" to begin streaming</p>
                </div>
              </div>
            )}

            {/* MJPEG Stream */}
            {isStreaming && !streamError && (
              <img
                ref={videoRef}
                alt="Robot camera feed"
                className="w-full h-full object-contain"
                style={{ display: isStreaming ? 'block' : 'none' }}
                onError={() => {
                  setStreamError('Failed to load video stream');
                  setIsStreaming(false);
                  toast.error('Failed to load video stream', {
                    duration: 5000,
                  });
                }}
              />
            )}

            {/* Status indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-white text-xs">
                {isStreaming ? 'LIVE' : 'PAUSED'}
              </span>
            </div>

            {/* Recording info */}
            {isStreaming && (
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                <p className="text-white text-xs">Streaming from Robot {robot.id}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDetection}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  isStreaming
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isStreaming ? (
                  <>
                    <Square className="w-5 h-5" />
                    Stop Detection
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Detection
                  </>
                )}
              </button>
            </div>

            {/* Robot info */}
            <div className="text-right">
              <p className="text-gray-600 dark:text-gray-400">Model: {robot.model}</p>
              <p className="text-gray-600 dark:text-gray-400">Battery: {robot.battery}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

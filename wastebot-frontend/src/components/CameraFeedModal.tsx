import { X, Play, Square, Maximize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { aiApi } from '../services/aiApi';
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

  useEffect(() => {
    // Check if stream should be active
    checkStreamStatus();

    return () => {
      // Cleanup: stop streaming when component unmounts
      if (isStreaming) {
        stopStreaming();
      }
    };
  }, []);

  const checkStreamStatus = async () => {
    try {
      const shouldStream = await aiApi.shouldStream(robot.id);
      if (shouldStream) {
        startStreaming();
      }
    } catch (error) {
      console.error('Error checking stream status:', error);
    }
  };

  const startStreaming = async () => {
    try {
      setStreamError(null);
      await aiApi.requestStream(robot.id);
      setIsStreaming(true);
      
      // Set up MJPEG stream URL
      streamUrlRef.current = aiApi.getStreamUrl(robot.id);
      if (videoRef.current) {
        videoRef.current.src = streamUrlRef.current;
      }
      
      updateRobotStatus(robot.id, 'active');
    } catch (error: any) {
      console.error('Error starting stream:', error);
      setStreamError('Failed to start video stream');
      setIsStreaming(false);
    }
  };

  const stopStreaming = async () => {
    try {
      await aiApi.stopStream(robot.id);
      setIsStreaming(false);
      if (videoRef.current) {
        videoRef.current.src = '';
      }
      updateRobotStatus(robot.id, 'idle');
    } catch (error: any) {
      console.error('Error stopping stream:', error);
      setStreamError('Failed to stop video stream');
    }
  };

  const toggleDetection = () => {
    if (isStreaming) {
      stopStreaming();
    } else {
      startStreaming();
    }
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
            onClick={onClose}
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
                  <p className="text-red-400 mb-2">{streamError}</p>
                  <button
                    onClick={startStreaming}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
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
            {isStreaming && (
              <img
                ref={videoRef}
                alt="Robot camera feed"
                className="w-full h-full object-contain"
                style={{ display: isStreaming ? 'block' : 'none' }}
                onError={() => {
                  setStreamError('Failed to load video stream');
                  setIsStreaming(false);
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

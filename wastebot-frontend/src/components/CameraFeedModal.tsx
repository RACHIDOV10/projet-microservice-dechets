import { X, Play, Square } from 'lucide-react';
import { useRobotStream } from '../hooks/useRobotStream';
import type { Robot } from '../types/api';

type CameraFeedModalProps = {
  robot: Robot;
  onClose: () => void;
};

export function CameraFeedModal({ robot, onClose }: CameraFeedModalProps) {
  const {
    isStreaming,
    streamError,
    streamUrl,
    startStream,
    stopStream,
    toggleStream,
  } = useRobotStream({
    robotId: robot.id,
    enabled: true,
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-gray-900 dark:text-white">
              Robot {robot.macAddress} - Live Camera Feed
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{robot.region}</p>
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
                    onClick={startStream}
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
                  <p className="text-gray-400 mt-2">Click "Start Stream" to begin streaming</p>
                </div>
              </div>
            )}

            {/* MJPEG Stream */}
            {isStreaming && streamUrl && (
              <img
                src={streamUrl}
                alt="Robot camera feed"
                className="w-full h-full object-contain"
                onError={() => {
                  // Error handled by hook
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

            {/* Robot info */}
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
                onClick={toggleStream}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  isStreaming
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isStreaming ? (
                  <>
                    <Square className="w-5 h-5" />
                    Stop Stream
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Stream
                  </>
                )}
              </button>
            </div>

            {/* Robot info */}
            <div className="text-right">
              <p className="text-gray-600 dark:text-gray-400">Model: {robot.model}</p>
              <p className="text-gray-600 dark:text-gray-400">Region: {robot.region}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { X, Play, Square, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import type { Robot } from '../App';

type CameraFeedModalProps = {
  robot: Robot;
  onClose: () => void;
  updateRobotStatus: (robotId: string, status: 'active' | 'idle' | 'error') => void;
};

export function CameraFeedModal({ robot, onClose, updateRobotStatus }: CameraFeedModalProps) {
  const [isDetecting, setIsDetecting] = useState(robot.status === 'active');

  const toggleDetection = () => {
    if (isDetecting) {
      updateRobotStatus(robot.id, 'idle');
      setIsDetecting(false);
    } else {
      updateRobotStatus(robot.id, 'active');
      setIsDetecting(true);
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
            {/* Simulated camera feed with detection boxes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <div className="w-16 h-16 bg-green-500/30 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500/40 rounded-full" />
                  </div>
                </div>
                <p className="text-white">Camera Feed: {robot.ipPort}</p>
                <p className="text-gray-400 mt-2">
                  {isDetecting ? 'Detection Active' : 'Detection Paused'}
                </p>
              </div>
            </div>

            {/* Detection overlay boxes (simulated) */}
            {isDetecting && (
              <>
                <div className="absolute top-20 left-24 w-32 h-32 border-2 border-green-400 rounded-lg">
                  <span className="absolute -top-6 left-0 bg-green-400 text-black text-xs px-2 py-1 rounded">
                    Plastic Bottle 94%
                  </span>
                </div>
                <div className="absolute bottom-24 right-32 w-40 h-28 border-2 border-blue-400 rounded-lg">
                  <span className="absolute -top-6 left-0 bg-blue-400 text-black text-xs px-2 py-1 rounded">
                    Metal Can 87%
                  </span>
                </div>
              </>
            )}

            {/* Status indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${isDetecting ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-white text-xs">
                {isDetecting ? 'LIVE' : 'PAUSED'}
              </span>
            </div>

            {/* Recording info */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
              <p className="text-white text-xs">FPS: 30 | Resolution: 1920x1080</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDetection}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  isDetecting
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isDetecting ? (
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
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <Maximize2 className="w-5 h-5" />
                Fullscreen
              </button>
            </div>

            {/* Robot info */}
            <div className="text-right">
              <p className="text-gray-600 dark:text-gray-400">Model: {robot.model}</p>
              <p className="text-gray-600 dark:text-gray-400">Battery: {robot.battery}%</p>
            </div>
          </div>

          {/* Recent detections in this session */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-gray-900 dark:text-white mb-3">Recent Detections</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 py-2 border-b border-gray-200 dark:border-gray-600">
                <span>Plastic Bottle</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">2 seconds ago</span>
              </div>
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 py-2 border-b border-gray-200 dark:border-gray-600">
                <span>Aluminum Can</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">45 seconds ago</span>
              </div>
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 py-2">
                <span>Plastic Container</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">1 minute ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

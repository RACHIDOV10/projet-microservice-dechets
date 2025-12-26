import { Video, Play, Square, Edit, Trash2, Bot, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { robotApi } from '../services/robotApi';
import { aiApi } from '../services/aiApi';
import type { Robot } from '../types/api';
import { toast } from 'sonner';

type RobotsProps = {
  robots: Robot[];
  onRefresh: () => void;
  onOpenCameraFeed: (robot: Robot) => void;
};

export function Robots({ robots, onRefresh, onOpenCameraFeed }: RobotsProps) {
  const [streamingRobots, setStreamingRobots] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  // Check streaming status for all robots
  useEffect(() => {
    const checkStreamingStatus = async () => {
      const streaming = new Set<number>();
      for (const robot of robots) {
        try {
          const shouldStream = await aiApi.shouldStream(robot.id);
          if (shouldStream) {
            streaming.add(robot.id);
          }
        } catch (error) {
          // Ignore errors for individual robots
        }
      }
      setStreamingRobots(streaming);
    };

    if (robots.length > 0) {
      checkStreamingStatus();
      const interval = setInterval(checkStreamingStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [robots]);

  const getStatusColor = (status: boolean) => {
    return status
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const toggleRobotStatus = async (robot: Robot) => {
    if (loading[robot.id]) return;

    setLoading(prev => ({ ...prev, [robot.id]: true }));
    try {
      if (robot.status) {
        await robotApi.deactivate(robot.id);
        toast.success('Robot deactivated');
      } else {
        await robotApi.activate(robot.id);
        toast.success('Robot activated');
      }
      onRefresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update robot status';
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, [robot.id]: false }));
    }
  };

  const handleDelete = async (robot: Robot) => {
    if (!window.confirm(`Are you sure you want to remove robot ${robot.macAddress}?`)) {
      return;
    }

    setLoading(prev => ({ ...prev, [robot.id]: true }));
    try {
      await robotApi.delete(robot.id);
      toast.success('Robot deleted successfully');
      onRefresh();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete robot';
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, [robot.id]: false }));
    }
  };

  const isStreaming = (robotId: number) => streamingRobots.has(robotId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Robot Fleet Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor and control all waste-sorting robots</p>
      </div>

      {/* Desktop Table View */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Robot ID</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">MAC Address</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Region</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Model</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {robots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No robots found</p>
                  </td>
                </tr>
              ) : (
                robots.map((robot) => (
                  <tr key={robot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-mono">
                      {robot.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{robot.macAddress}</p>
                        {robot.description && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{robot.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(robot.status)}`}>
                          {robot.status ? 'Active' : 'Inactive'}
                        </span>
                        {isStreaming(robot.id) && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            Streaming
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{robot.region}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{robot.model}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenCameraFeed(robot)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Camera Feed"
                        >
                          <Video className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleRobotStatus(robot)}
                          disabled={loading[robot.id]}
                          className={`p-2 rounded-lg transition-colors ${
                            robot.status
                              ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                          } disabled:opacity-50`}
                          title={robot.status ? 'Deactivate' : 'Activate'}
                        >
                          {robot.status ? (
                            <Square className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(robot)}
                          disabled={loading[robot.id]}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Robot"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

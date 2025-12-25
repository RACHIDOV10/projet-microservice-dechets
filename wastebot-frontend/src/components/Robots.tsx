import { Video, Play, Square, Edit, Trash2, Battery, AlertTriangle } from 'lucide-react';
import type { Robot } from '../App';

type RobotsProps = {
  robots: Robot[];
  updateRobotStatus: (robotId: string, status: 'active' | 'idle' | 'error') => void;
  deleteRobot: (robotId: string) => void;
  openCameraFeed: (robot: Robot) => void;
};

export function Robots({ robots, updateRobotStatus, deleteRobot, openCameraFeed }: RobotsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'idle':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-600 dark:text-green-400';
    if (battery > 30) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const toggleRobotStatus = (robot: Robot) => {
    if (robot.status === 'active') {
      updateRobotStatus(robot.id, 'idle');
    } else if (robot.status === 'idle') {
      updateRobotStatus(robot.id, 'active');
    }
  };

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
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Robot Name</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Location</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Last Detection</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Battery</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {robots.map((robot) => (
                <tr key={robot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900 dark:text-white">{robot.name}</p>
                      <p className="text-gray-500 dark:text-gray-400">{robot.model}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(robot.status)}`}>
                      {robot.status === 'error' && <AlertTriangle className="w-4 h-4" />}
                      <span className="capitalize">{robot.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{robot.location}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{robot.lastDetectionTime}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Battery className={`w-5 h-5 ${getBatteryColor(robot.battery)}`} />
                      <span className={`${getBatteryColor(robot.battery)}`}>{robot.battery}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openCameraFeed(robot)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Camera Feed"
                      >
                        <Video className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toggleRobotStatus(robot)}
                        disabled={robot.status === 'error'}
                        className={`p-2 rounded-lg transition-colors ${
                          robot.status === 'error'
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : robot.status === 'active'
                            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                        title={robot.status === 'active' ? 'Stop Detection' : 'Start Detection'}
                      >
                        {robot.status === 'active' ? (
                          <Square className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit Robot"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
  if (window.confirm(`Are you sure you want to remove ${robot.name}?`)) {
    deleteRobot(robot.id);
  }
}}

                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove Robot"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

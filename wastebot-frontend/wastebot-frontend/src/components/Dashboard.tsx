import { Bot, Activity, Trash2, TrendingUp, Play, Square, PlusCircle } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { EventLog } from './EventLog';
import type { Robot, WasteEvent } from '../App';

type DashboardProps = {
  robots: Robot[];
  events: WasteEvent[];
  updateRobotStatus: (robotId: string, status: 'active' | 'idle' | 'error') => void;
  onNavigate: (page: string) => void;
};

export function Dashboard({ robots, events, updateRobotStatus, onNavigate }: DashboardProps) {
  const totalRobots = robots.length;
  const activeRobots = robots.filter(r => r.status === 'active').length;
  const wasteToday = 847; // Mock data
  const wasteWeek = 5234; // Mock data

  const startAllRobots = () => {
    robots.forEach(robot => {
      if (robot.status === 'idle') {
        updateRobotStatus(robot.id, 'active');
      }
    });
  };

  const stopAllRobots = () => {
    robots.forEach(robot => {
      if (robot.status === 'active') {
        updateRobotStatus(robot.id, 'idle');
      }
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor and manage your waste-sorting robot fleet</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Robots"
          value={totalRobots}
          icon={Bot}
          color="blue"
        />
        <StatsCard
          title="Active Robots"
          value={activeRobots}
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="Waste Today"
          value={`${wasteToday} kg`}
          icon={Trash2}
          color="purple"
        />
        <StatsCard
          title="Waste This Week"
          value={`${wasteWeek} kg`}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={startAllRobots}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            Start All Robots
          </button>
          <button
            onClick={stopAllRobots}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Square className="w-5 h-5" />
            Stop All Robots
          </button>
          <button
            onClick={() => onNavigate('add-robot')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Robot
          </button>
        </div>
      </div>

      {/* Recent Events */}
      <EventLog events={events} />
    </div>
  );
}

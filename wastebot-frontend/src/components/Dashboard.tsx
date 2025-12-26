import { useEffect, useState } from 'react';
import { Bot, Activity, Trash2, TrendingUp, Play, Square, PlusCircle } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { EventLog } from './EventLog';
import { wasteApi } from '../services/wasteApi';
import { robotApi } from '../services/robotApi';
import type { Robot } from '../types/api';
import type { WasteStats } from '../types/api';
import { toast } from 'sonner';

type WasteEvent = {
  id: string;
  robotId: string;
  robotName: string;
  wasteType: string;
  timestamp: string;
  location: string;
};

type DashboardProps = {
  robots: Robot[];
  events: WasteEvent[];
  updateRobotStatus: (robotId: number, activate: boolean) => Promise<void>;
  onNavigate: (page: string) => void;
};

export function Dashboard({ robots, events, updateRobotStatus, onNavigate }: DashboardProps) {
  const [wasteStats, setWasteStats] = useState<WasteStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWasteStats();
  }, []);

  const loadWasteStats = async () => {
    try {
      const stats = await wasteApi.getStats();
      setWasteStats(stats);
    } catch (error) {
      console.error('Error loading waste stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRobots = robots.length;
  const activeRobots = robots.filter(r => r.status).length;
  const wasteToday = wasteStats?.detected || 0;
  const wasteCollected = wasteStats?.collected || 0;

  const startAllRobots = async () => {
    try {
      for (const robot of robots) {
        if (!robot.status) {
          await updateRobotStatus(robot.id, true);
        }
      }
      toast.success('All robots activated');
    } catch (error) {
      toast.error('Failed to activate some robots');
    }
  };

  const stopAllRobots = async () => {
    try {
      for (const robot of robots) {
        if (robot.status) {
          await updateRobotStatus(robot.id, false);
        }
      }
      toast.success('All robots deactivated');
    } catch (error) {
      toast.error('Failed to deactivate some robots');
    }
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
          title="Detected Waste"
          value={loading ? '...' : wasteToday}
          icon={Trash2}
          color="purple"
        />
        <StatsCard
          title="Collected Waste"
          value={loading ? '...' : wasteCollected}
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

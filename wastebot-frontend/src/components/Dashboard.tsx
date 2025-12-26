import { useEffect, useState, useMemo } from 'react';
import { Bot, Activity, Trash2, TrendingUp, Play, Square, PlusCircle, Loader2 } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { EventLog } from './EventLog';
import { wasteApi } from '../services/wasteApi';
import type { Robot, WasteEvent } from '../App';
import type { WasteStats } from '../types/api';

type DashboardProps = {
  robots: Robot[];
  events: WasteEvent[];
  updateRobotStatus: (robotId: string, status: 'active' | 'idle' | 'error') => Promise<void>;
  onNavigate: (page: string) => void;
};

export function Dashboard({ robots, events, updateRobotStatus, onNavigate }: DashboardProps) {
  const [wasteStats, setWasteStats] = useState<WasteStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [updatingRobots, setUpdatingRobots] = useState(false);

  useEffect(() => {
    loadWasteStats();
  }, []);

  const loadWasteStats = async () => {
    try {
      const stats = await wasteApi.getStats();
      setWasteStats(stats);
    } catch (error) {
      console.error('Error loading waste stats:', error);
      // Continue with null stats - we'll handle it gracefully
    } finally {
      setLoadingStats(false);
    }
  };

  // Compute statistics from actual data
  const totalRobots = robots.length;
  const activeRobots = useMemo(
    () => robots.filter(r => r.status === 'active').length,
    [robots]
  );
  const idleRobots = useMemo(
    () => robots.filter(r => r.status === 'idle').length,
    [robots]
  );

  // Use API stats if available, otherwise fallback to computed values
  const wasteDetected = wasteStats?.detected ?? events.length;
  const wasteCollected = wasteStats?.collected ?? 0;

  const startAllRobots = async () => {
    setUpdatingRobots(true);
    try {
      for (const robot of robots) {
        if (robot.status === 'idle') {
          await updateRobotStatus(robot.id, 'active');
        }
      }
    } finally {
      setUpdatingRobots(false);
    }
  };

  const stopAllRobots = async () => {
    setUpdatingRobots(true);
    try {
      for (const robot of robots) {
        if (robot.status === 'active') {
          await updateRobotStatus(robot.id, 'idle');
        }
      }
    } finally {
      setUpdatingRobots(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage your waste-sorting robot fleet
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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
          subtitle={`${idleRobots} idle`}
        />
        <StatsCard
          title="Detected Waste"
          value={loadingStats ? '...' : wasteDetected}
          icon={Trash2}
          color="purple"
        />
        <StatsCard
          title="Collected Waste"
          value={loadingStats ? '...' : wasteCollected}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3 md:gap-4">
          <button
            onClick={startAllRobots}
            disabled={updatingRobots || idleRobots === 0}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 font-medium"
          >
            {updatingRobots ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            Start All Robots
          </button>
          <button
            onClick={stopAllRobots}
            disabled={updatingRobots || activeRobots === 0}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 font-medium"
          >
            {updatingRobots ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Square className="w-5 h-5" />
            )}
            Stop All Robots
          </button>
          <button
            onClick={() => onNavigate('add-robot')}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 font-medium"
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

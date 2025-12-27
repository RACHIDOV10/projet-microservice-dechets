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
    <div className="p-6 md:p-8 animate-fadeIn">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
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
      <div className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 mb-6 md:mb-8 transition-premium hover:shadow-premium-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full"></span>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3 md:gap-4">
          <button
            onClick={startAllRobots}
            disabled={updatingRobots || idleRobots === 0}
            className="flex items-center gap-2 px-5 md:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-premium hover:scale-105 hover:shadow-lg disabled:hover:scale-100 font-medium shadow-md"
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
            className="flex items-center gap-2 px-5 md:px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-premium hover:scale-105 hover:shadow-lg disabled:hover:scale-100 font-medium shadow-md"
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
            className="flex items-center gap-2 px-5 md:px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-premium hover:scale-105 hover:shadow-lg font-medium shadow-md"
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

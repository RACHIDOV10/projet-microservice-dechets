import { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { Robot, WasteEvent } from '../App';
import type { Waste } from '../types/api';

type StatisticsProps = {
  robots: Robot[];
  events: WasteEvent[];
  wastes: Waste[];
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

export function Statistics({ robots, events, wastes }: StatisticsProps) {

  // Compute waste statistics from real data
  const wasteByLocation = useMemo(() => {
    const locationMap = new Map<string, number>();
    
    wastes.forEach((waste) => {
      const location = waste.region || 'Unknown';
      locationMap.set(location, (locationMap.get(location) || 0) + 1);
    });

    return Array.from(locationMap.entries())
      .map(([location, count]) => ({ location, waste: count }))
      .sort((a, b) => b.waste - a.waste)
      .slice(0, 10); // Top 10 locations
  }, [wastes]);

  // Compute waste types distribution from real data
  const wasteTypes = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    wastes.forEach((waste) => {
      const category = waste.category || 'Unknown';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [wastes]);

  // Compute waste by robot
  const wasteByRobot = useMemo(() => {
    const robotMap = new Map<string, number>();
    
    wastes.forEach((waste) => {
      // Safely check for null robotId
      if (waste.robotId != null) {
        const robot = robots.find(r => {
          const robotIdStr = r.id.toString();
          const wasteRobotIdStr = waste.robotId!.toString();
          return robotIdStr === wasteRobotIdStr || r.id === waste.robotId;
        });
        const robotName = robot?.name || `Robot ${waste.robotId}`;
        robotMap.set(robotName, (robotMap.get(robotName) || 0) + 1);
      }
    });

    return Array.from(robotMap.entries())
      .map(([name, value]) => ({ name, waste: value }))
      .sort((a, b) => b.waste - a.waste)
      .slice(0, 10); // Top 10 robots
  }, [wastes, robots]);

  // Summary stats
  const totalWastes = wastes.length;
  const uniqueLocations = new Set(wastes.map(w => w.region)).size;
  const uniqueCategories = new Set(wastes.map(w => w.category)).size;
  const wastesWithRobots = wastes.filter(w => w.robotId).length;

  const hasData = wastes.length > 0;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Statistics & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed insights into waste sorting performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Waste Items</div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{totalWastes}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Unique Categories</div>
          <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{uniqueCategories}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Locations</div>
          <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{uniqueLocations}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Assigned to Robots</div>
          <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">{wastesWithRobots}</div>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Data Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Statistics will appear here once waste data is collected.
          </p>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Waste by Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-gray-900 dark:text-white mb-4 md:mb-6 text-lg font-semibold">
                Waste by Location
              </h2>
              {wasteByLocation.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={wasteByLocation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis
                      dataKey="location"
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="waste" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No location data available
                </div>
              )}
            </div>

            {/* Waste Types Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-gray-900 dark:text-white mb-4 md:mb-6 text-lg font-semibold">
                Waste Categories
              </h2>
              {wasteTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={wasteTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name = 'Unknown', percent = 0 }: PieLabelRenderProps) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {wasteTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No category data available
                </div>
              )}
            </div>
          </div>

          {/* Waste by Robot */}
          {wasteByRobot.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <h2 className="text-gray-900 dark:text-white mb-4 md:mb-6 text-lg font-semibold">
                Waste by Robot
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wasteByRobot}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="waste" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

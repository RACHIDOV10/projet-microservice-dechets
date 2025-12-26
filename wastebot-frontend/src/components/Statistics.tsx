import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieLabelRenderProps  } from 'recharts';
import { Calendar } from 'lucide-react';
import type { Robot, WasteEvent } from '../App';

type StatisticsProps = {
  robots: Robot[];
  events: WasteEvent[];
};

export function Statistics({ robots, events }: StatisticsProps) {
  const [dateRange, setDateRange] = useState('7days');

  // Mock data for charts
  const wasteByLocation = [
    { location: 'Warehouse A - Zone 1', waste: 2847 },
    { location: 'Warehouse A - Zone 2', waste: 2387 },
    { location: 'Warehouse B - Zone 1', waste: 1456 },
    { location: 'Warehouse B - Zone 2', waste: 987 }
  ];

  const wasteOverTime = [
    { date: 'Mon', wasteBot1: 420, wasteBot2: 380, wasteBot3: 250, wasteBot4: 180 },
    { date: 'Tue', wasteBot1: 450, wasteBot2: 390, wasteBot3: 280, wasteBot4: 200 },
    { date: 'Wed', wasteBot1: 380, wasteBot2: 420, wasteBot3: 240, wasteBot4: 190 },
    { date: 'Thu', wasteBot1: 490, wasteBot2: 410, wasteBot3: 290, wasteBot4: 210 },
    { date: 'Fri', wasteBot1: 470, wasteBot2: 430, wasteBot3: 270, wasteBot4: 195 },
    { date: 'Sat', wasteBot1: 510, wasteBot2: 450, wasteBot3: 310, wasteBot4: 220 },
    { date: 'Sun', wasteBot1: 440, wasteBot2: 400, wasteBot3: 260, wasteBot4: 185 }
  ];

  const wasteTypes = [
    { name: 'Plastic', value: 3245, color: '#3b82f6' },
    { name: 'Metal', value: 2156, color: '#10b981' },
    { name: 'Glass', value: 1543, color: '#f59e0b' },
    { name: 'Paper', value: 2891, color: '#8b5cf6' },
    { name: 'Organic', value: 1678, color: '#ef4444' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Statistics & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Detailed insights into waste sorting performance</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none w-48 px-4 py-2 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Robot</label>
            <select className="appearance-none w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="all">All Robots</option>
              {robots.map(robot => (
                <option key={robot.id} value={robot.id}>{robot.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Location</label>
            <select className="appearance-none w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="all">All Locations</option>
              <option value="warehouse-a">Warehouse A</option>
              <option value="warehouse-b">Warehouse B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Waste by Location */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-gray-900 dark:text-white mb-6">Waste by Location</h2>
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
                  color: '#fff'
                }}
              />
              <Bar dataKey="waste" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Waste Types Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-gray-900 dark:text-white mb-6">Waste Types Distribution</h2>
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
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Waste Over Time */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-gray-900 dark:text-white mb-6">Waste Collected Over Time (kg)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={wasteOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="wasteBot1" stroke="#3b82f6" strokeWidth={2} name="WasteBot-Alpha" />
            <Line type="monotone" dataKey="wasteBot2" stroke="#10b981" strokeWidth={2} name="WasteBot-Beta" />
            <Line type="monotone" dataKey="wasteBot3" stroke="#f59e0b" strokeWidth={2} name="WasteBot-Gamma" />
            <Line type="monotone" dataKey="wasteBot4" stroke="#8b5cf6" strokeWidth={2} name="WasteBot-Delta" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

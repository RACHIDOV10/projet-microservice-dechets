import { useState, useEffect } from 'react';
import { Trash2, Filter, Search, RefreshCw, Download } from 'lucide-react';
import { wasteApi } from '../services/wasteApi';
import { toast } from 'sonner';
import type { Waste } from '../types/api';
import type { Robot } from '../App';

type WasteManagementProps = {
  wastes: Waste[];
  robots: Robot[];
  onRefresh: () => void;
};

export function WasteManagement({ wastes: initialWastes, robots, onRefresh }: WasteManagementProps) {
  const [wastes, setWastes] = useState<Waste[]>(initialWastes);
  const [filteredWastes, setFilteredWastes] = useState<Waste[]>(initialWastes);
  const [selectedRobotId, setSelectedRobotId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWastes(initialWastes || []);
    applyFilters(initialWastes || []);
  }, [initialWastes]);

  const applyFilters = (wasteList: Waste[]) => {
    let filtered = [...wasteList];

    if (selectedRobotId !== 'all') {
      filtered = filtered.filter(waste => waste.robotId === selectedRobotId);
    }

    const trimmedQuery = searchQuery?.trim() || '';
    if (trimmedQuery) {
      filtered = filtered.filter(waste =>
        (waste.category || '').toLowerCase().includes(trimmedQuery.toLowerCase())
      );
    }

    setFilteredWastes(filtered);
  };

  useEffect(() => {
    applyFilters(wastes);
  }, [selectedRobotId, searchQuery, wastes]);

  // Aggregated statistics
  const totalWastes = filteredWastes.length;
  const categoryCounts: Record<string, number> = {};
  const regionCounts: Record<string, number> = {};
  filteredWastes.forEach(waste => {
    const category = waste.category || 'Unknown';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    const region = waste.region || 'Unknown';
    regionCounts[region] = (regionCounts[region] || 0) + 1;
  });
  const uniqueCategories = Object.keys(categoryCounts).length;
  const mostCommonCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const mostActiveRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const getRobotName = (robotId: string | null) => {
    if (!robotId) return 'Unassigned';
    const robot = robots.find(r => r.id.toString() === robotId.toString());
    return robot?.name || `Robot ${robotId}`;
  };

  const handleExportReport = () => {
    try {
      const rows = filteredWastes.map(w => ({
        ID: w.id,
        Category: w.category || 'Unknown',
        Region: w.region || 'Unknown',
        Robot: getRobotName(w.robotId),
        Timestamp: w.timestamp ? new Date(w.timestamp).toLocaleString() : '—',
      }));
      const csvContent = [
        Object.keys(rows[0] || {}).join(','),
        ...rows.map(r => Object.values(r).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `waste_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Waste Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor and manage detected waste items</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search by Category
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search waste categories..."
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="min-w-[180px]">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Filter by Robot
            </label>
            <select
              value={selectedRobotId}
              onChange={(e) => setSelectedRobotId(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Robots</option>
              {robots.map(robot => (
                <option key={robot.id} value={robot.id}>
                  {robot.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Waste Items</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalWastes}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Unique Categories</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{uniqueCategories}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Most Common Category</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{mostCommonCategory}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Most Active Region</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{mostActiveRegion}</div>
        </div>
      </div>

      {/* Optional Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Category</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Region</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Robot</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredWastes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Trash2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No waste items found</p>
                  </td>
                </tr>
              ) : (
                filteredWastes.map((waste) => (
                  <tr key={waste.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-mono text-sm">{waste.id?.substring(0, 8) || 'N/A'}...</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{waste.category || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{waste.region || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{getRobotName(waste.robotId)}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{waste.timestamp ? new Date(waste.timestamp).toLocaleString() : '—'}</td>
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

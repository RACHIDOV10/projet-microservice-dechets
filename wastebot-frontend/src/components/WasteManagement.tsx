import { useState, useEffect } from 'react';
import { Trash2, Filter, Search, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { wasteApi } from '../services/wasteApi';
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
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    setWastes(initialWastes);
    applyFilters(initialWastes);
  }, [initialWastes]);

  const applyFilters = (wasteList: Waste[]) => {
    let filtered = [...wasteList];

    // Filter by robot ID
    if (selectedRobotId !== 'all') {
      filtered = filtered.filter(waste => waste.robotId === selectedRobotId);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(waste => waste.status === statusFilter);
    }

    // Filter by search query (type)
    if (searchQuery.trim()) {
      filtered = filtered.filter(waste =>
        waste.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredWastes(filtered);
  };

  useEffect(() => {
    applyFilters(wastes);
  }, [selectedRobotId, statusFilter, searchQuery, wastes]);

  const handleMarkCollected = async (wasteId: string) => {
    try {
      await wasteApi.markCollected(wasteId);
      onRefresh();
    } catch (error) {
      console.error('Error marking waste as collected:', error);
      alert('Failed to update waste status');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      detected: { label: 'Detected', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
      collected: { label: 'Collected', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
      pending: { label: 'Pending', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
      in_progress: { label: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = status === 'collected' ? CheckCircle : Clock;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getRobotName = (robotId: string | null) => {
    if (!robotId) return 'Unassigned';
    const robot = robots.find(r => 
      r.id === robotId || 
      r.id === robotId.toString() ||
      r.id.toString() === robotId
    );
    return robot?.name || `Robot ${robotId}`;
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
              Search by Type
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search waste types..."
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

          <div className="min-w-[180px]">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="detected">Detected</option>
              <option value="collected">Collected</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Waste</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{filteredWastes.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Detected</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {filteredWastes.filter(w => w.status === 'detected').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Collected</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {filteredWastes.filter(w => w.status === 'collected').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Quantity</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {filteredWastes.reduce((sum, w) => sum + w.quantity, 0)}
          </div>
        </div>
      </div>

      {/* Waste Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">ID</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Type</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Quantity</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Robot</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredWastes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Trash2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No waste items found</p>
                  </td>
                </tr>
              ) : (
                filteredWastes.map((waste) => (
                  <tr key={waste.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-mono text-sm">
                      {waste.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {waste.type}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {waste.quantity}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {getRobotName(waste.robotId)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(waste.status)}
                    </td>
                    <td className="px-6 py-4">
                      {waste.status !== 'collected' && (
                        <button
                          onClick={() => handleMarkCollected(waste.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Mark Collected
                        </button>
                      )}
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


import { useState } from 'react';
import { Save, X } from 'lucide-react';
import type { Robot } from '../App';

type AddRobotProps = {
  onAddRobot: (robot: Omit<Robot, 'id'>) => void;
  onCancel: () => void;
};

export function AddRobot({ onAddRobot, onCancel }: AddRobotProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    ipPort: '',
    model: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRobot({
      ...formData,
      status: 'idle',
      lastDetectionTime: 'Never',
      battery: 100
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Add New Robot</h1>
        <p className="text-gray-600 dark:text-gray-400">Register a new waste-sorting robot to the fleet</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
              Robot Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., WasteBot-Echo"
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-gray-700 dark:text-gray-300 mb-2">
              Model *
            </label>
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a model</option>
              <option value="WSR-1500">WSR-1500</option>
              <option value="WSR-2000">WSR-2000</option>
              <option value="WSR-2500">WSR-2500</option>
              <option value="WSR-3000">WSR-3000</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Warehouse C - Zone 1"
            />
          </div>

          <div>
            <label htmlFor="ipPort" className="block text-gray-700 dark:text-gray-300 mb-2">
              IP Address : Port *
            </label>
            <input
              type="text"
              id="ipPort"
              name="ipPort"
              value={formData.ipPort}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 192.168.1.105:8080"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Brief description of the robot's purpose and capabilities..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Robot
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

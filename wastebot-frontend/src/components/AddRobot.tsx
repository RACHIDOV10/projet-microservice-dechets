import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { robotApi } from '../services/robotApi';
import { CreateRobotRequest } from '../types/api';
import { toast } from 'sonner';

type AddRobotProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

export function AddRobot({ onCancel, onSuccess }: AddRobotProps) {
  const { admin } = useAuth();
  const [formData, setFormData] = useState<Omit<CreateRobotRequest, 'adminId'>>({
    macAddress: '',
    region: '',
    status: false,
    description: '',
    model: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!admin) {
      toast.error('You must be logged in to create a robot');
      return;
    }

    setLoading(true);
    try {
      const adminIdNum = parseInt(admin.id);
      if (isNaN(adminIdNum)) {
        toast.error('Invalid admin ID');
        setLoading(false);
        return;
      }

      const robotData: CreateRobotRequest = {
        ...formData,
        adminId: adminIdNum,
      };

      await robotApi.create(robotData);
      toast.success('Robot created successfully');
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create robot';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
            <label htmlFor="macAddress" className="block text-gray-700 dark:text-gray-300 mb-2">
              MAC Address *
            </label>
            <input
              type="text"
              id="macAddress"
              name="macAddress"
              value={formData.macAddress}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., AA:BB:CC:DD:EE:FF"
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
            <label htmlFor="region" className="block text-gray-700 dark:text-gray-300 mb-2">
              Region *
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Warehouse C - Zone 1"
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="status" className="text-gray-700 dark:text-gray-300">
              Activate robot immediately
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Creating...' : 'Save Robot'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
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

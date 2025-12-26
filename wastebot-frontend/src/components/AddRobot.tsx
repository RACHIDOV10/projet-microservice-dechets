import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

type AddRobotProps = {
  onAddRobot: (robot: {
    macAddress: string;
    region: string;
    model?: string;
    description?: string;
  }) => Promise<void>;
  onCancel: () => void;
};

export function AddRobot({ onAddRobot, onCancel }: AddRobotProps) {
  const [formData, setFormData] = useState({
    macAddress: '',
    region: '',
    model: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const trimmedMacAddress = formData.macAddress?.trim() || '';
    const trimmedRegion = formData.region?.trim() || '';
    
    if (!trimmedMacAddress) {
      toast.error('MAC Address is required');
      return;
    }
    
    if (!trimmedRegion) {
      toast.error('Region is required');
      return;
    }

    // Safely trim optional fields
    const trimmedModel = formData.model?.trim() || '';
    const trimmedDescription = formData.description?.trim() || '';

    setIsSubmitting(true);
    try {
      await onAddRobot({
        macAddress: trimmedMacAddress,
        region: trimmedRegion,
        model: trimmedModel || undefined,
        description: trimmedDescription || undefined,
      });
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
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
            <label htmlFor="model" className="block text-gray-700 dark:text-gray-300 mb-2">
              Model
            </label>
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a model (optional)</option>
              <option value="WSR-1500">WSR-1500</option>
              <option value="WSR-2000">WSR-2000</option>
              <option value="WSR-2500">WSR-2500</option>
              <option value="WSR-3000">WSR-3000</option>
            </select>
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Creating...' : 'Save Robot'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
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

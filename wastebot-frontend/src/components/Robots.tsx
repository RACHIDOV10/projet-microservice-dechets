import { useState } from 'react';
import { Video, Play, Square, Trash2, AlertTriangle, Bot, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import type { Robot } from '../App';

type RobotsProps = {
  robots: Robot[];
  updateRobotStatus: (robotId: string, status: 'active' | 'idle' | 'error') => Promise<void>;
  deleteRobot: (robotId: string) => Promise<void>;
  openCameraFeed: (robot: Robot) => void;
};

export function Robots({ robots, updateRobotStatus, deleteRobot, openCameraFeed }: RobotsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [robotToDelete, setRobotToDelete] = useState<Robot | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'idle':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const toggleRobotStatus = async (robot: Robot) => {
    setUpdatingStatus(robot.id);
    try {
      const newStatus = robot.status === 'active' ? 'idle' : 'active';
      await updateRobotStatus(robot.id, newStatus);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteClick = (robot: Robot) => {
    setRobotToDelete(robot);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!robotToDelete) return;
    
    setDeleting(true);
    try {
      await deleteRobot(robotToDelete.id);
      setDeleteDialogOpen(false);
      setRobotToDelete(null);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Robot Fleet Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and control all waste-sorting robots
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <tr>
                   <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    ID
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Robot Name
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Location
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Model
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {robots.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        No robots found
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                        Add your first robot to get started
                      </p>
                    </td>
                  </tr>
                ) : (
                  robots.map((robot) => (
                    <tr
                      key={robot.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4 text-gray-700 dark:text-gray-300">
                        {robot.id}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {robot.name}
                          </p>
                          {robot.description && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                              {robot.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            robot.status
                          )}`}
                        >
                          {robot.status === 'error' && (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                          <span className="capitalize">{robot.status}</span>
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 dark:text-gray-300">
                        {robot.location}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-gray-700 dark:text-gray-300">
                        {robot.model}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openCameraFeed(robot)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-105"
                            title="View Camera Feed"
                          >
                            <Video className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleRobotStatus(robot)}
                            disabled={
                              robot.status === 'error' ||
                              updatingStatus === robot.id
                            }
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              robot.status === 'error' ||
                              updatingStatus === robot.id
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : robot.status === 'active'
                                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105'
                                : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:scale-105'
                            }`}
                            title={
                              robot.status === 'active'
                                ? 'Deactivate Robot'
                                : 'Activate Robot'
                            }
                          >
                            {updatingStatus === robot.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : robot.status === 'active' ? (
                              <Square className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(robot)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-105"
                            title="Delete Robot"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Robot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {robotToDelete?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

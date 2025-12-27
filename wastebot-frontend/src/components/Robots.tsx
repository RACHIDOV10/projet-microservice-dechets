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
      <div className="p-6 md:p-8 animate-fadeIn">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Robot Fleet Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Monitor and control all waste-sorting robots
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border-b border-white/10 dark:border-white/5">
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
                      className="hover:bg-white/30 dark:hover:bg-white/5 transition-premium border-b border-white/5 dark:border-white/5 last:border-0"
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
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold shadow-sm ${getStatusColor(
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
                            className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 dark:hover:bg-blue-500/20 rounded-xl transition-premium hover:scale-110 hover:shadow-md"
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
                            className={`p-2.5 rounded-xl transition-premium ${
                              robot.status === 'error' ||
                              updatingStatus === robot.id
                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : robot.status === 'active'
                                ? 'text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/20 hover:scale-110 hover:shadow-md'
                                : 'text-green-600 dark:text-green-400 hover:bg-green-500/20 dark:hover:bg-green-500/20 hover:scale-110 hover:shadow-md'
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
                            className="p-2.5 text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/20 rounded-xl transition-premium hover:scale-110 hover:shadow-md"
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

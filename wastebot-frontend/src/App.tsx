import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Robots } from './components/Robots';
import { Statistics } from './components/Statistics';
import { AddRobot } from './components/AddRobot';
import { Settings } from './components/Settings';
import { CameraFeedModal } from './components/CameraFeedModal';
import { Login } from './components/Login';
import { WasteManagement } from './components/WasteManagement';
import { tokenService } from './services/api';
import { robotApi } from './services/robotApi';
import { wasteApi } from './services/wasteApi';
import { getAdminIdFromToken, getAdminNameFromToken } from './utils/jwt';
import { toast } from 'sonner';
import type { Robot as RobotType } from './types/api';
import type { Waste } from './types/api';
import './styles/globals.css';

// Frontend Robot type (derived from backend)
export type Robot = {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  location: string;
  model: string;
  description: string;
};

export type WasteEvent = {
  id: string;
  robotId: string;
  robotName: string;
  wasteType: string;
  timestamp: string;
  location: string;
};

// Convert backend Robot to frontend Robot format
const convertRobot = (backendRobot: RobotType): Robot => {
  return {
    id: backendRobot.id.toString(),
    name: `Robot-${backendRobot.macAddress || backendRobot.id}`,
    status: backendRobot.status ? 'active' : 'idle',
    location: backendRobot.region || 'Unknown',
    model: backendRobot.model || 'Unknown',
    description: backendRobot.description || `Robot at ${backendRobot.region || 'Unknown'}`,
  };
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [loading, setLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = tokenService.getToken();
    if (token) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  // Load robots and wastes data
  const loadData = async () => {
    setLoading(true);
    try {
      const [robotsData, wastesData] = await Promise.all([
        robotApi.getAll(),
        wasteApi.getAll(),
      ]);
      
      setRobots(robotsData.map(r => convertRobot(r)));
      setWastes(wastesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle login success
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadData();
  };

  // Handle logout
  const handleLogout = () => {
    tokenService.removeToken();
    setIsAuthenticated(false);
    setRobots([]);
    setWastes([]);
  };

  // Update robot status (activate/deactivate)
  const updateRobotStatus = async (robotId: string, status: 'active' | 'idle' | 'error') => {
    try {
      const id = parseInt(robotId);
      if (status === 'active') {
        await robotApi.activate(id);
      } else if (status === 'idle') {
        await robotApi.deactivate(id);
      }
      
      // Update robot status in UI state without full reload
      setRobots(prevRobots =>
        prevRobots.map(robot =>
          robot.id === robotId
            ? { ...robot, status: status === 'active' ? 'active' : 'idle' }
            : robot
        )
      );
      
      toast.success(`Robot ${status === 'active' ? 'activated' : 'deactivated'} successfully`, {
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error updating robot status:', error);
      toast.error(error.response?.data?.message || 'Failed to update robot status', {
        duration: 5000,
      });
      throw error;
    }
  };

  // Add robot
  const addRobot = async (robot: {
    macAddress: string;
    region: string;
    model?: string;
    description?: string;
  }) => {
    try {
      // Get admin info from token
      const token = tokenService.getToken();
      const adminId = getAdminIdFromToken(token);
      const adminName = getAdminNameFromToken(token);

      if (!adminId) {
        toast.error('Failed to create robot: Admin information not found');
        throw new Error('Admin ID not found in token');
      }

      // Create robot with required fields
      await robotApi.create({
        macAddress: robot.macAddress,
        region: robot.region,
        adminId: adminId,
        model: robot.model,
        description: robot.description,
      });
      
      // Show success toast
      toast.success(`Robot created successfully by ${adminName || 'Admin'} (${adminId})`, {
        duration: 5000,
      });
      
      // Reset form by navigating away and back (handled by parent)
      await loadData();
      setCurrentPage('robots');
    } catch (error: any) {
      console.error('Error adding robot:', error);
      
      // Handle 500 errors gracefully
      if (error.response?.status === 500) {
        toast.error('Failed to create robot: Server error. Please try again later.', {
          duration: 5000,
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to create robot', {
          duration: 5000,
        });
      }
      throw error;
    }
  };

  // Delete robot
  const deleteRobot = async (robotId: string) => {
    try {
      const id = parseInt(robotId);
      await robotApi.delete(id);
      
      // Remove robot from UI state without page reload
      setRobots(prevRobots => prevRobots.filter(r => r.id !== robotId));
      
      toast.success('Robot deleted successfully', {
        duration: 5000,
      });
    } catch (error: any) {
      console.error('Error deleting robot:', error);
      toast.error(error.response?.data?.message || 'Failed to delete robot', {
        duration: 5000,
      });
      throw error;
    }
  };

  // Open camera feed
  const openCameraFeed = (robot: Robot) => {
    setSelectedRobot(robot);
    setShowCameraModal(true);
  };

  // Convert wastes to events for dashboard
  const getWasteEvents = (): WasteEvent[] => {
    return wastes.slice(0, 10).map((waste) => {
      // Safely match robot by ID - check for null first
      let robot = null;
      if (waste.robotId != null) {
        robot = robots.find(r => {
          const robotIdStr = r.id.toString();
          const wasteRobotIdStr = waste.robotId!.toString();
          return robotIdStr === wasteRobotIdStr || r.id === waste.robotId;
        });
      }
      
      // Safely handle timestamp
      const timestamp = waste.timestamp 
        ? new Date(waste.timestamp).toLocaleString()
        : new Date().toLocaleString();
      
      return {
        id: waste.id,
        robotId: waste.robotId || 'unknown',
        robotName: robot?.name || 'Unknown Robot',
        wasteType: waste.category || 'Unknown',
        timestamp: timestamp,
        location: robot?.location || waste.region || 'Unknown',
      };
    });
  };

  // Render page content
  const renderPage = () => {
    if (loading && robots.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            robots={robots}
            events={getWasteEvents()}
            updateRobotStatus={updateRobotStatus}
            onNavigate={setCurrentPage}
          />
        );
      case 'robots':
        return (
          <Robots
            robots={robots}
            updateRobotStatus={updateRobotStatus}
            deleteRobot={deleteRobot}
            openCameraFeed={openCameraFeed}
          />
        );
      case 'statistics':
        return <Statistics robots={robots} events={getWasteEvents()} wastes={wastes} />;
      case 'add-robot':
        return <AddRobot onAddRobot={addRobot} onCancel={() => setCurrentPage('robots')} />;
      case 'waste':
        return <WasteManagement wastes={wastes} robots={robots} onRefresh={loadData} />;
      case 'settings':
        return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return (
          <Dashboard
            robots={robots}
            events={getWasteEvents()}
            updateRobotStatus={updateRobotStatus}
            onNavigate={setCurrentPage}
          />
        );
    }
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto relative z-10">
          {renderPage()}
        </main>
        {showCameraModal && selectedRobot && (
          <CameraFeedModal
            robot={selectedRobot}
            onClose={() => setShowCameraModal(false)}
            updateRobotStatus={updateRobotStatus}
          />
        )}
      </div>
    </div>
  );
}

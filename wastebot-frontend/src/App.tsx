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

// Legacy types for backward compatibility
export type Robot = {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  location: string;
  lastDetectionTime: string;
  battery: number;
  model: string;
  ipPort: string;
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
const convertRobot = (backendRobot: RobotType, robotsList: Robot[]): Robot => {
  // Try to find existing robot to preserve UI-specific fields
  const existing = robotsList.find(r => r.id === backendRobot.id.toString());
  
  return {
    id: backendRobot.id.toString(),
    name: `Robot-${backendRobot.macAddress || backendRobot.id}`,
    status: backendRobot.status ? 'active' : 'idle',
    location: backendRobot.region || 'Unknown',
    lastDetectionTime: existing?.lastDetectionTime || 'Never',
    battery: existing?.battery || 100,
    model: backendRobot.model || existing?.model || 'WSR-2000',
    ipPort: existing?.ipPort || `${backendRobot.id}:8080`,
    description: backendRobot.description || existing?.description || `Robot at ${backendRobot.region || 'Unknown'}`,
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
      
      setRobots(robotsData.map(r => convertRobot(r, robots)));
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
      
      // Refresh robots
      await loadData();
    } catch (error) {
      console.error('Error updating robot status:', error);
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
    // Note: Delete endpoint not available in backend
    // This is a placeholder for future implementation
    console.warn('Delete robot functionality not available in backend');
  };

  // Open camera feed
  const openCameraFeed = (robot: Robot) => {
    setSelectedRobot(robot);
    setShowCameraModal(true);
  };

  // Convert wastes to events for dashboard
  const getWasteEvents = (): WasteEvent[] => {
    return wastes.slice(0, 10).map((waste) => {
      // Match robot by ID (handling both string and number comparisons)
      const robot = robots.find(r => 
        r.id === waste.robotId || 
        r.id === waste.robotId?.toString() ||
        r.id.toString() === waste.robotId
      );
      
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
        return <Statistics robots={robots} events={getWasteEvents()} />;
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
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">
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

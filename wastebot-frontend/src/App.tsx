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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { robotApi } from './services/robotApi';
import { wasteApi } from './services/wasteApi';
import type { Robot, Waste } from './types/api';
import './styles/globals.css';

function AppContent() {
  const { admin, isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Load robots and wastes data
  const loadData = async () => {
    setLoading(true);
    try {
      const [robotsData, wastesData] = await Promise.all([
        robotApi.getAll(),
        wasteApi.getAll(),
      ]);
      
      setRobots(robotsData);
      setWastes(wastesData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      // Error handling is done by toast in individual components
    } finally {
      setLoading(false);
    }
  };

  // Handle login success
  const handleLoginSuccess = () => {
    loadData();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setRobots([]);
    setWastes([]);
    setSelectedRobot(null);
    setShowCameraModal(false);
  };

  // Update robot status (activate/deactivate)
  const updateRobotStatus = async (robotId: number, activate: boolean) => {
    try {
      if (activate) {
        await robotApi.activate(robotId);
      } else {
        await robotApi.deactivate(robotId);
      }
      await loadData();
    } catch (error: any) {
      console.error('Error updating robot status:', error);
      throw error;
    }
  };

  // Add robot success handler
  const handleAddRobotSuccess = () => {
    loadData();
    setCurrentPage('robots');
  };

  // Open camera feed
  const openCameraFeed = (robot: Robot) => {
    setSelectedRobot(robot);
    setShowCameraModal(true);
  };

  // Close camera feed
  const closeCameraFeed = () => {
    setShowCameraModal(false);
    setSelectedRobot(null);
  };

  // Convert wastes to events for dashboard (if needed)
  const getWasteEvents = () => {
    return wastes.slice(0, 10).map((waste) => {
      const robot = robots.find(r => r.id.toString() === waste.robotId);
      return {
        id: waste.id,
        robotId: waste.robotId || 'unknown',
        robotName: robot ? `Robot ${robot.id}` : 'Unknown Robot',
        wasteType: waste.category,
        timestamp: typeof waste.timestamp === 'string' 
          ? new Date(waste.timestamp).toLocaleString()
          : waste.timestamp.toLocaleString(),
        location: waste.region,
      };
    });
  };

  // Render page content
  const renderPage = () => {
    if (loading && robots.length === 0 && wastes.length === 0) {
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
            onRefresh={loadData}
            onOpenCameraFeed={openCameraFeed}
          />
        );
      case 'statistics':
        return <Statistics robots={robots} events={getWasteEvents()} />;
      case 'add-robot':
        return (
          <AddRobot
            onCancel={() => setCurrentPage('robots')}
            onSuccess={handleAddRobotSuccess}
          />
        );
      case 'waste':
        return (
          <WasteManagement
            wastes={wastes}
            robots={robots}
            onRefresh={loadData}
          />
        );
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
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <Toaster />
      </>
    );
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
            onClose={closeCameraFeed}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

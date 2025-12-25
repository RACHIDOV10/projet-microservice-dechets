import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Robots } from './components/Robots';
import { Statistics } from './components/Statistics';
import { AddRobot } from './components/AddRobot';
import { Settings } from './components/Settings';
import { CameraFeedModal } from './components/CameraFeedModal';
import './styles/globals.css';


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

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const [robots, setRobots] = useState<Robot[]>([
    {
      id: '1',
      name: 'WasteBot-Alpha',
      status: 'active',
      location: 'Warehouse A - Zone 1',
      lastDetectionTime: '2 minutes ago',
      battery: 87,
      model: 'WSR-2000',
      ipPort: '192.168.1.101:8080',
      description: 'Primary sorting robot for plastic waste'
    },
    {
      id: '2',
      name: 'WasteBot-Beta',
      status: 'active',
      location: 'Warehouse A - Zone 2',
      lastDetectionTime: '5 minutes ago',
      battery: 92,
      model: 'WSR-2000',
      ipPort: '192.168.1.102:8080',
      description: 'Secondary sorting robot for metal waste'
    },
    {
      id: '3',
      name: 'WasteBot-Gamma',
      status: 'idle',
      location: 'Warehouse B - Zone 1',
      lastDetectionTime: '1 hour ago',
      battery: 45,
      model: 'WSR-1500',
      ipPort: '192.168.1.103:8080',
      description: 'Backup sorting robot'
    },
    {
      id: '4',
      name: 'WasteBot-Delta',
      status: 'error',
      location: 'Warehouse B - Zone 2',
      lastDetectionTime: '3 hours ago',
      battery: 12,
      model: 'WSR-2000',
      ipPort: '192.168.1.104:8080',
      description: 'Glass and paper sorting robot'
    }
  ]);

  const [events] = useState<WasteEvent[]>([
    {
      id: '1',
      robotId: '1',
      robotName: 'WasteBot-Alpha',
      wasteType: 'Plastic Bottle',
      timestamp: '2 minutes ago',
      location: 'Warehouse A - Zone 1'
    },
    {
      id: '2',
      robotId: '2',
      robotName: 'WasteBot-Beta',
      wasteType: 'Aluminum Can',
      timestamp: '5 minutes ago',
      location: 'Warehouse A - Zone 2'
    },
    {
      id: '3',
      robotId: '1',
      robotName: 'WasteBot-Alpha',
      wasteType: 'Plastic Container',
      timestamp: '8 minutes ago',
      location: 'Warehouse A - Zone 1'
    },
    {
      id: '4',
      robotId: '2',
      robotName: 'WasteBot-Beta',
      wasteType: 'Metal Scrap',
      timestamp: '12 minutes ago',
      location: 'Warehouse A - Zone 2'
    },
    {
      id: '5',
      robotId: '1',
      robotName: 'WasteBot-Alpha',
      wasteType: 'Plastic Bag',
      timestamp: '15 minutes ago',
      location: 'Warehouse A - Zone 1'
    }
  ]);

  const updateRobotStatus = (robotId: string, status: 'active' | 'idle' | 'error') => {
    setRobots(robots.map(robot => 
      robot.id === robotId ? { ...robot, status } : robot
    ));
  };

  const addRobot = (robot: Omit<Robot, 'id'>) => {
    const newRobot = {
      ...robot,
      id: (robots.length + 1).toString()
    };
    setRobots([...robots, newRobot]);
    setCurrentPage('robots');
  };

  const deleteRobot = (robotId: string) => {
    setRobots(robots.filter(robot => robot.id !== robotId));
  };

  const openCameraFeed = (robot: Robot) => {
    setSelectedRobot(robot);
    setShowCameraModal(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard robots={robots} events={events} updateRobotStatus={updateRobotStatus} onNavigate={setCurrentPage} />;
      case 'robots':
        return <Robots robots={robots} updateRobotStatus={updateRobotStatus} deleteRobot={deleteRobot} openCameraFeed={openCameraFeed} />;
      case 'statistics':
        return <Statistics robots={robots} events={events} />;
      case 'add-robot':
        return <AddRobot onAddRobot={addRobot} onCancel={() => setCurrentPage('robots')} />;
      case 'settings':
        return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return <Dashboard robots={robots} events={events} updateRobotStatus={updateRobotStatus} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} darkMode={darkMode} />
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

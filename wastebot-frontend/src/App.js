import React from 'react';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div>
      <Sidebar />
      <div className="content">
        <h1>Statistics Page</h1>
        {/* Ici tu pourras mettre ton dashboard dynamique */}
      </div>
    </div>
  );
}

export default App;

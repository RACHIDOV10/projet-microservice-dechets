import React from 'react';
import './Sidebar.css';

const Sidebar = () => (
    <aside className="sidebar">
        <h2>WasteBot</h2>
        <ul>
            <li>Dashboard</li>
            <li>Robots</li>
            <li className="active">Statistics</li>
            <li>Add Robot</li>
            <li>Settings</li>
        </ul>
    </aside>
);

export default Sidebar;

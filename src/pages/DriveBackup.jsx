import React from 'react';
import '../components/Dashboard.css';
import '../components/DriveBackup.css';
import Sidebar from '../components/Sidebar';
import DriveBackupComp from '../components/DriveBackupComp';

const DriveBackup = () => {
    return (
        <div className="app-shell">
            <Sidebar />
            <DriveBackupComp />
        </div>
    );
};

export default DriveBackup;

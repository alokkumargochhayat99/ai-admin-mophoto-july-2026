import React from 'react';
import '../components/Dashboard.css';
import '../components/DriveBackup.css';
import Sidebar from '../components/Sidebar';
import DriveEventDetailComp from '../components/DriveEventDetailComp';

const DriveEventDetail = () => {
    return (
        <div className="app-shell">
            <Sidebar />
            <DriveEventDetailComp />
        </div>
    );
};

export default DriveEventDetail;

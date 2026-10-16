import React from 'react';
import { STATUS_LABEL, STATUS_CLASS } from './driveStatus';

const DriveStatusPill = ({ status }) => {
    if (!status) return <span className="drv-pill drv-off">-</span>;
    return (
        <span className={`drv-pill ${STATUS_CLASS[status] || 'drv-off'}`}>
            {status === 'running' && <span className="drv-dot"></span>}
            {STATUS_LABEL[status] || status}
        </span>
    );
};

export default DriveStatusPill;

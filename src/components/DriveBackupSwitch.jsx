import React from 'react';
import './DriveBackup.css';

// ON/OFF switch used on Create and Edit event pages
const DriveBackupSwitch = ({ checked, onChange, children }) => (
    <div className="form-card">
        <div className="card-title">
            <div className="ic"><i className="bi bi-cloud-arrow-up"></i></div>
            Google Drive Backup
        </div>
        <div className="d-flex align-items-center justify-content-between gap-3">
            <div>
                <label className="field-label mb-0" htmlFor="drive-backup-toggle">Back up original photos to Google Drive</label>
                <div className="field-hint">
                    {checked
                        ? 'ON - original photos are uploaded to Drive every night (2 AM - 9 AM)'
                        : 'OFF - photos of this event will not be uploaded to Drive'}
                </div>
            </div>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="driveBackup"
                    checked={checked}
                    onChange={onChange}
                    id="drive-backup-toggle" />
            </div>
        </div>
        {children}
    </div>
);

export default DriveBackupSwitch;

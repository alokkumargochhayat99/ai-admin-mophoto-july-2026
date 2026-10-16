import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Header + mobile menu used by the Drive Backup pages
const PageShell = ({ title, children }) => {

    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="main-col">

            {/* mobile sidebar */}
            <div className={`offcanvas offcanvas-start mo-sidebar hide-desktop ${showMenu ? 'show' : ''}`} tabIndex="-1" style={{ width: '260px' }}>
                <div className="side-brand d-flex align-items-center justify-content-between">
                    <div className="display-font fw-bold" style={{ fontSize: '1.05rem' }}>Mo<span style={{ color: 'var(--mo-red)' }}>Photo</span></div>
                    <button className="btn-close" onClick={() => setShowMenu(false)}></button>
                </div>
                <nav className="nav flex-column mt-2">
                    <Link className="nav-link" to='/all-events'><i className="bi bi-calendar-event"></i>My Events</Link>
                    <Link className="nav-link" to='/create-events'><i className="bi bi-plus-square"></i>Create Event</Link>
                    <Link className="nav-link active" to='/drive-backup'><i className="bi bi-cloud-arrow-up"></i>Drive Backup</Link>
                </nav>
            </div>

            <header className="mo-header">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <button className="icon-btn hide-desktop" onClick={() => setShowMenu(true)}><i className="bi bi-list"></i></button>
                        <span className="brand">{title}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <div className="avatar-ring">CE</div>
                    </div>
                </div>
            </header>

            {children}

        </div>
    );
};

export default PageShell;

import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
    const { pathname } = useLocation();
    const onDrive = pathname.startsWith('/drive-backup');
    const onCreate = pathname.startsWith('/create-events');
    const onEvents = !onDrive && !onCreate;
    return (
        <>
            {/* <!-- ============ DESKTOP SIDEBAR ============ --> */}
            <aside className="desktop-sidebar show-desktop">
                <div className="side-brand d-flex align-items-center gap-2">
                    <div className="display-font fw-bold">Mo Photo</div>
                </div>
                <nav className="nav flex-column mt-3">
                    {/* <a className="nav-link" href="#"><i className="bi bi-grid-1x2-fill"></i>Dashboard</a> */}
                    <Link className={`nav-link ${onEvents ? 'active' : ''}`} to='/all-events'><i className="bi bi-calendar-event"></i>My Events</Link>
                    <Link className={`nav-link ${onCreate ? 'active' : ''}`} to='/create-events'><i className="bi bi-plus-square"></i>Create Event</Link>
                    <Link className={`nav-link ${onDrive ? 'active' : ''}`} to='/drive-backup'><i className="bi bi-cloud-arrow-up"></i>Drive Backup</Link>
                    {/* <a className="nav-link" href="#"><i className="bi bi-qr-code"></i>One QR<span className="badge-new">New</span></a>
                    <a className="nav-link" href="#"><i className="bi bi-whatsapp"></i>WhatsApp<span className="badge-new">Beta</span></a>
                    <a className="nav-link" href="#"><i className="bi bi-bar-chart-line"></i>Analytics</a>
                    <a className="nav-link" href="#"><i className="bi bi-lightning-charge"></i>Beam<span className="badge-new">New</span></a>
                    <a className="nav-link" href="#"><i className="bi bi-shop"></i>Photo Selling<span className="badge-new">New</span></a>
                    <a className="nav-link" href="#"><i className="bi bi-gear"></i>Settings</a> */}
                </nav>
                {/* <div className="side-footer-card">
                    <i className="bi bi-stars"></i>
                    <div className="fw-semibold mt-1">Creator Pass</div>
                    <div>10,000 free AI face-matched shares</div>
                    <button className="btn btn-sm w-100 mt-2">Get Pass</button>
                </div> */}
            </aside>
        </>
    )
}

export default Sidebar

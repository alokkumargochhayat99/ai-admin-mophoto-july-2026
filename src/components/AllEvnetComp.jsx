import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import DriveStatusPill from "./DriveStatusPill";

const AllEvnetComp = () => {

    const navigate = useNavigate();
    const [showMenu, setshowmenu] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // evnet function
    const getAllEvents = async () => {
        try {
            setLoading(true);

            const res = await axiosClient.get("/api/admin/event/list");

            console.log(res);

            if (res.data.success) {
                setEvents(res.data.events);
            }

        } catch (error) {
            console.error("Get Events Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // call api 
    useEffect(() => {
        getAllEvents();
    }, []);



    // handel menu 
    const handelMenu = () => {
        setshowmenu(true);
    }
    // close 
    const handelMenuClose = () => {
        setshowmenu(false);
    }

    return (
        <>
            <div className="main-col">

                {/* <!-- ============ MOBILE OFFCANVAS SIDEBAR ============ --> */}
                <div className={`offcanvas offcanvas-start mo-sidebar hide-desktop ${showMenu ? 'show' : ''}`} tabindex="-1" id="moSidebar" style={{ width: '260px' }}>
                    <div className="side-brand d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <div className="display-font fw-bold" style={{ fontSize: '1.05rem' }}>Mo<span style={{ color: 'var(--mo-red)' }}>Photo</span></div>
                        </div>
                        <button className="btn-close" data-bs-dismiss="offcanvas" onClick={handelMenuClose}></button>
                    </div>
                    <nav className="nav flex-column mt-2">
                        <Link className="nav-link active" to='/all-events'><i className="bi bi-calendar-event"></i>My Events</Link>
                        <Link className="nav-link" to='/create-events'><i className="bi bi-plus-square"></i>Create Event</Link>
                        <Link className="nav-link" to='/drive-backup'><i className="bi bi-cloud-arrow-up"></i>Drive Backup</Link>
                       
                    </nav>
                    {/* <div className="side-footer-card">
                        <i className="bi bi-stars" style={{ color: '#B87E00', fontSize: '1.1rem' }}></i>
                        <div className="fw-semibold mt-1" style={{ fontSize: '.78rem' }}>Creator Pass</div>
                        <div style={{ fontSize: '.66rem', color: 'var(--mo-muted)' }}>10,000 free AI face-matched shares</div>
                        <button className="btn btn-sm w-100 mt-2" style={{
                            background: 'var(--mo-red)',
                            color: '#fff',
                            fontWeight: 600,
                            borderRadius: 8
                        }}>Get Pass</button>
                    </div> */}
                </div>

                {/* <!-- ============ HEADER ============ --> */}
                <header className="mo-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <button className="icon-btn hide-desktop" data-bs-toggle="offcanvas" data-bs-target="#moSidebar"
                                onClick={handelMenu}><i className="bi bi-list"></i></button>
                            <span className="brand">My <span className="dot">Events</span></span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <button className="icon-btn"><i className="bi bi-search"></i></button>
                            <button className="icon-btn"><i className="bi bi-bell"></i><span className="badge-dot"></span></button>
                            <div className="avatar-ring">CE</div>
                        </div>
                    </div>
                </header>

                {/* <!-- ============ PAGE TITLE ============ --> */}
                <div className="page-head">
                    <h1>All Events</h1>
                    <div className="sub">Manage and track every event you've created</div>
                </div>

                {/* <!-- ============ TOTAL EVENTS SUMMARY CARD ============ --> */}
                <div className="summary-card">
                    <div className="d-flex align-items-center gap-3">
                        <div className="ic"><i className="bi bi-calendar-event"></i></div>
                        <div>
                            <div className="val">{events.length}</div>
                            <div className="lbl">Total Events</div>
                        </div>
                    </div>
                    <Link to='/create-events' className="btn-mo-sm"><i className="bi bi-plus-lg me-1"></i>New Event</Link>
                </div>

                {/* <!-- ============ TABLE CARD ============ --> */}
                <div className="table-card">
                    <div className="table-toolbar">
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input type="text" placeholder="Search event name or code..." />
                        </div>
                        <select className="form-select form-select-sm" style={{
                            width: 'auto',
                            borderRadius: 10,
                            borderColor: 'var(--mo-line)',
                            fontSize: '.82rem'
                        }}>
                            <option>All Status</option>
                            <option>Live</option>
                            <option>Upcoming</option>
                            <option>Closed</option>
                        </select>
                    </div>

                    <table className="mo-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Event Code</th>
                                <th>Couple Name</th>
                                <th>Status</th>
                                <th>Studio</th>
                                <th>Guest login</th>
                                <th>Drive Backup</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>

                            ) : events.length === 0 ? (

                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        No Events Found
                                    </td>
                                </tr>

                            ) : (

                                events.map((event) => (

                                    <tr key={event._id}>

                                        <td>
                                            <div className="d-flex align-items-center gap-2 mobile-row-top">


                                                <span className="ev-name">
                                                    {event.eventName}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="ev-code">
                                                {event.eventCode}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="ev-code">
                                                {event.coupleName}
                                            </span>
                                        </td>

                                        <td>

                                            <span
                                                className='ev-name'
                                            >
                                                {event.status}
                                            </span>

                                        </td>
                                        <td>
                                            <span className="ev-code">
                                                {event.studio.name}
                                            </span>
                                        </td>
                                        <td>
                                            {
                                                event.guestLoginEnabled
                                                    ?
                                                    <>
                                                        <span className="status-pill status-live">ON</span>
                                                    </>
                                                    :
                                                    <>
                                                        <span className="status-pill status-closed">OFF</span>
                                                    </>
                                            }
                                        </td>

                                        <td>
                                            {event.drive
                                                ? <DriveStatusPill status={event.drive.status} />
                                                : <span className="ev-code">-</span>}
                                        </td>

                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => navigate(`/admin/event/edit/${event._id}`)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                                Edit
                                            </button>
                                        </td>


                                    </tr>

                                ))

                            )}

                        </tbody>
                    </table>

                    {/* <!-- ============ PAGINATION ============ --> */}
                    <div className="table-footer">
                        <div className="count-info">Showing 1–6 of 18 events (v1 - Pagination Not Work)</div>
                        <div className="mo-pagination">
                            <button disabled><i className="bi bi-chevron-left"></i></button>
                            <button className="active">1</button>
                            <button>2</button>
                            <button>3</button>
                            <button><i className="bi bi-chevron-right"></i></button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AllEvnetComp

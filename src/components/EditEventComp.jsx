import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from '../api/axiosClient';
import DriveBackupSwitch from './DriveBackupSwitch';
import CopyLink from './CopyLink';

const EditEventComp = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [showMenu, setshowmenu] = useState(false);
    const [coverPreview, setCoverPreview] = useState("");

    // handel menu 
    const handelMenu = () => {
        setshowmenu(true);
    }
    // close 
    const handelMenuClose = () => {
        setshowmenu(false);
    }
    const initialFormData = {
        eventName: "",
        coupleName: "",
        weddingDate: "",
        guestPin: "",
        uploadMode: "both",
        showMode: "selfie_only",
        loginMode: "pin",
        guestLoginEnabled: true,
        photographerLoginEnabled: true,
        driveBackup: false,
        appPassword: "",
        coverImage: null,


        studio: {
            name: "",
            phone: "",
            whatsapp: "",
            instagram: "",
            location: ""
        }
    };

    const [formData, setFormData] = useState(initialFormData);

    const [loading, setLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    // drive info (folder link, errors) from the server
    const [drive, setDrive] = useState(null);
    const [folderBusy, setFolderBusy] = useState(false);

    // handle on chnage 
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // login mode change — face-login forces
    // upload/show mode to selfie-only camera flow
    const handleLoginModeChange = (e) => {

        const { value } = e.target;

        if (value === "face") {

            setFormData(prev => ({
                ...prev,
                loginMode: "face",
                uploadMode: "camera",
                showMode: "selfie_only",
                guestPin: ""
            }));

        } else {

            setFormData(prev => ({
                ...prev,
                loginMode: "pin"
            }));

        }

    };

    const isFaceLogin = formData.loginMode === "face";

    // toggle switches (guestLoginEnabled / photographerLoginEnabled)
    const handleToggle = (e) => {

        const { name, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));

    };

    // studio object 
    const handleStudioChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            studio: {
                ...prev.studio,
                [name]: value
            }
        }));

    };
    // handel img chnage 
    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setFormData(prev => ({
            ...prev,
            coverImage: file
        }));

        setCoverPreview(URL.createObjectURL(file));
    }


    // get events 
    const getEvent = async () => {

        try {

            setPageLoading(true);

            const res = await axiosClient.get(
                `/api/admin/event/${id}`
            );

            if (res.status === 200) {

                const event = res.data.event;

                setFormData({

                    eventName: event.eventName,

                    coupleName: event.coupleName,

                    weddingDate: event.weddingDate
                        ? event.weddingDate.split("T")[0]
                        : "",

                    guestPin: event.guestPin || "",

                    uploadMode: event.uploadMode,

                    showMode: event.showMode,

                    loginMode: event.loginMode || "pin",

                    guestLoginEnabled:
                        event.guestLoginEnabled !== false,

                    photographerLoginEnabled:
                        event.photographerLoginEnabled !== false,

                    // old events have no value = OFF
                    driveBackup: !!event.driveBackup,


                    appPassword: "",

                    coverImage: null,

                    studio: {
                        ...event.studio
                    }

                });

                setDrive(event.drive || null);

                // cover 
                if (event.coverImage) {

                    const imageUrl = `${import.meta.env.VITE_URL}/${event.coverImage}`;

                    setCoverPreview(imageUrl);

                }

            }

        } catch (err) {

            console.log(err);

        } finally {

            setPageLoading(false);

        }

    }
    // call get api 
    useEffect(() => {

        getEvent();

    }, [id]);

    // retry creating the Drive folder
    const handleRetryFolder = async () => {

        try {

            setFolderBusy(true);

            await axiosClient.post(`/api/admin/drive/event/${id}/ensure-folder`);

            await getEvent();

        } catch (err) {

            alert(err?.response?.data?.message || "Could not create the Drive folder");

            getEvent();

        } finally {

            setFolderBusy(false);

        }

    }

    // handel update 
    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const data = new FormData();

            data.append("eventName", formData.eventName);
            data.append("coupleName", formData.coupleName);
            data.append("weddingDate", formData.weddingDate);
            data.append("guestPin", formData.guestPin);
            data.append("uploadMode", formData.uploadMode);
            data.append("showMode", formData.showMode);
            data.append("loginMode", formData.loginMode);
            data.append("guestLoginEnabled", formData.guestLoginEnabled);
            data.append("photographerLoginEnabled", formData.photographerLoginEnabled);
            data.append("appPassword", formData.appPassword);
            data.append("driveBackup", formData.driveBackup);

            data.append(
                "studio",
                JSON.stringify(formData.studio)
            );

            if (formData.coverImage) {
                data.append("coverImage", formData.coverImage);
            }

            const res = await axiosClient.put(
                `/api/admin/event/update/${id}`,
                data
            );

            if (res.status === 200) {

                let msg = res.data.message;

                // Drive problems never block the update; just tell the admin
                if (res.data.driveWarning) {
                    msg += `\n\nGoogle Drive: ${res.data.driveWarning}\nYou can retry from this page.`;
                }

                alert(msg);

                navigate('/all-events');

            }

        } catch (err) {

            console.log(err);

            alert(
                err?.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

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

                <div className="form-shell">

                    {/* <!-- ============ PAGE TITLE ============ --> */}
                    <div className="page-head">
                        <h1>Edit Event</h1>
                        <div className="sub">Update event details for the guest photo-sharing page</div>
                    </div>

                    {pageLoading ? (

                        <div className="form-card text-center py-5">
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Loading event...
                        </div>

                    ) : (

                    <form onSubmit={handleUpdate} className='mt-4'>

                        {/* <!-- ============ EVENT DETAILS ============ --> */}
                        <div className="form-card">
                            <div className="card-title">
                                <div className="ic"><i className="bi bi-calendar-heart"></i></div>
                                Event Details
                            </div>

                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="field-label">Event Name</label>
                                    <input type="text" name="eventName" value={formData.eventName}
                                        onChange={handleChange}
                                        className="field-input" placeholder="e.g. Ritika & Aman — Sangeet Night" />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="field-label">Couple Name</label>
                                    <input type="text"
                                        name='coupleName'
                                        value={formData.coupleName}
                                        onChange={handleChange}
                                        className="field-input" placeholder="e.g. Ritika & Aman" />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="field-label">Wedding Date</label>
                                    <input
                                        name='weddingDate'
                                        value={formData.weddingDate}
                                        onChange={handleChange}
                                        type="date" className="field-input" />
                                </div>
                            </div>
                        </div>

                        {/* <!-- ============ ACCESS & PERMISSIONS ============ --> */}
                        <div className="form-card">
                            <div className="card-title">
                                <div className="ic"><i className="bi bi-shield-lock"></i></div>
                                Access &amp; Permissions
                            </div>

                            <div className="row g-3">

                                {/* <!-- ============ LOGIN MODE ============ --> */}
                                <div className="col-12">
                                    <label className="field-label">Login Mode</label>
                                    <div className="pill-group">
                                        <div className="pill-option">
                                            <input
                                                type="radio"
                                                name="loginMode"
                                                value="pin"
                                                checked={formData.loginMode === "pin"}
                                                onChange={handleLoginModeChange}
                                                id="lm-pin" />
                                            <label htmlFor="lm-pin"><i className="bi bi-key"></i> Login With Event ID &amp; PIN</label>
                                        </div>
                                        <div className="pill-option">
                                            <input
                                                type="radio"
                                                name="loginMode"
                                                value="face"
                                                checked={formData.loginMode === "face"}
                                                onChange={handleLoginModeChange}
                                                id="lm-face" />
                                            <label htmlFor="lm-face"><i className="bi bi-person-check"></i> Login With Face</label>
                                        </div>
                                    </div>
                                    {isFaceLogin && (
                                        <div className="field-hint">
                                            Face login events skip the PIN — guests join by scanning their selfie. Upload &amp; Show mode are locked to selfie-matching below.
                                        </div>
                                    )}
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="field-label">
                                        Guest PIN
                                        {formData.loginMode === "pin" && (
                                            <span className="req-hint"> *required</span>
                                        )}
                                    </label>
                                    <div className="pin-group">
                                        <input type="text"
                                            name='guestPin'
                                            value={formData.guestPin}
                                            onChange={handleChange}
                                            required={formData.loginMode === "pin"}
                                            disabled={isFaceLogin}
                                            className="field-input" maxlength="6" />
                                        <button type="button" className="btn-regen" disabled={isFaceLogin}><i className="bi bi-arrow-repeat"></i></button>
                                    </div>
                                    <div className="field-hint">
                                        {isFaceLogin
                                            ? "Not needed for face-login events"
                                            : "Guests enter this PIN to join the event"}
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="field-label">App Password <span className="opt">(admin access)</span></label>
                                    <div className="pwd-wrap">
                                        <input
                                            name='appPassword'
                                            value={formData.appPassword}
                                            onChange={handleChange}
                                            type="password" id="appPwd" className="field-input"
                                            placeholder="Leave blank to keep unchanged" />
                                        <i className="bi bi-eye toggle-eye" id="toggleAppPwd" role="button"></i>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 d-flex align-items-center justify-content-between">
                                    <div>
                                        <label className="field-label mb-0">Guest Login</label>
                                        <div className="field-hint">Turn off to block all guests from logging in</div>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            name="guestLoginEnabled"
                                            checked={formData.guestLoginEnabled}
                                            onChange={handleToggle}
                                            id="guest-login-toggle" />
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 d-flex align-items-center justify-content-between">
                                    <div>
                                        <label className="field-label mb-0">Photographer Login</label>
                                        <div className="field-hint">Turn off to block photographer app access for this event</div>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            name="photographerLoginEnabled"
                                            checked={formData.photographerLoginEnabled}
                                            onChange={handleToggle}
                                            id="photographer-login-toggle" />
                                    </div>
                                </div>

                                <div className="col-12 col-md-12">
                                    <label className="field-label">Guest Selfi Upload Mode</label>
                                    <div className="pill-group">
                                        <div className="pill-option">
                                            <input type="radio"

                                                name="uploadMode"

                                                value="camera"

                                                checked={formData.uploadMode === "camera"}

                                                onChange={handleChange} id="um-live" />
                                            <label htmlFor="um-live"><i className="bi bi-person-bounding-box"></i>Only Live Camera</label>
                                        </div>
                                        <div className="pill-option">
                                            <input
                                                type="radio"

                                                name="uploadMode"

                                                value="gallery"

                                                checked={formData.uploadMode === "gallery"}

                                                onChange={handleChange}
                                                disabled={isFaceLogin}
                                                id="um-selfie" />
                                            <label htmlFor="um-selfie"><i className="bi bi-images"></i>Only Gallery</label>
                                        </div>
                                        <div className="pill-option">
                                            <input
                                                type="radio"

                                                name="uploadMode"

                                                value="both"

                                                checked={formData.uploadMode === "both"}

                                                onChange={handleChange}
                                                disabled={isFaceLogin}
                                                id="um-both" />
                                            <label htmlFor="um-both"><i className="bi bi-check2-all"></i> Both</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="field-label">Show Mode</label>
                                    <div className="pill-group">
                                        <div className="pill-option">
                                            <input
                                                type="radio"

                                                name="showMode"

                                                value="all_photos"

                                                checked={formData.showMode === "all_photos"}

                                                onChange={handleChange}
                                                disabled={isFaceLogin}
                                                id="sm-selfie" />
                                            <label for="sm-selfie"><i className="bi bi-card-image"></i>All Photos</label>
                                        </div>
                                        <div className="pill-option">
                                            <input type="radio"

                                                name="showMode"

                                                value="selfie_only"

                                                checked={formData.showMode === "selfie_only"}

                                                onChange={handleChange} id="sm-all" />
                                            <label for="sm-all"><i className="bi bi-emoji-sunglasses"></i>Only User Selfi Matching</label>
                                        </div>
                                        <div className="pill-option">
                                            <input
                                                type="radio"

                                                name="showMode"

                                                value="all_photos_with_find_me"

                                                checked={formData.showMode === "all_photos_with_find_me"}

                                                onChange={handleChange}
                                                disabled={isFaceLogin}
                                                id="sm-all-find" />
                                            <label for="sm-all-find"><i className="bi bi-search-heart"></i>All Photos With Find Me</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- ============ GOOGLE DRIVE BACKUP ============ --> */}
                    <DriveBackupSwitch
                        checked={formData.driveBackup}
                        onChange={handleToggle}>

                        {drive && drive.folderLink && (
                            <div className="mt-3">
                                <div className="field-label">Drive folder link</div>
                                <CopyLink link={drive.folderLink} />
                            </div>
                        )}

                        {drive && drive.folderError && (
                            <div className="drv-alert drv-alert-red mt-3">
                                <i className="bi bi-exclamation-octagon-fill"></i>
                                <div>Drive folder problem: {drive.folderError}</div>
                            </div>
                        )}

                        {drive && drive.backup && (!drive.folderReady || drive.folderError) && (
                            <button type="button" className="btn-edit mt-3" onClick={handleRetryFolder} disabled={folderBusy}>
                                <i className="bi bi-folder-plus"></i>
                                {folderBusy ? 'Creating...' : 'Create / retry Drive folder'}
                            </button>
                        )}

                        {drive && drive.backup && (
                            <div className="mt-3">
                                <Link to={`/drive-backup/${id}`} className="drv-back mb-0">
                                    <i className="bi bi-bar-chart-line"></i>View backup progress
                                </Link>
                            </div>
                        )}

                    </DriveBackupSwitch>

                    {/* <!-- ============ STUDIO DETAILS ============ --> */}
                        <div className="form-card">
                            <div className="card-title">
                                <div className="ic"><i className="bi bi-camera-reels"></i></div>
                                Studio Details
                                <span className="req-hint">Shown on guest page</span>
                            </div>

                            <div className="studio-card">
                                <div className="studio-title"><i className="bi bi-camera"></i> Photography Studio</div>
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <label className="field-label">Studio Name</label>
                                        <div className="input-wrap">
                                            <i className="bi bi-building"></i>
                                            <input name="name"

                                                value={formData.studio.name}

                                                onChange={handleStudioChange} type="text" className="field-input with-icon" placeholder="e.g. Twm Films" />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="field-label">Phone Number</label>
                                        <div className="input-wrap">
                                            <i className="bi bi-telephone"></i>
                                            <input
                                                name="phone"

                                                value={formData.studio.phone}

                                                onChange={handleStudioChange}
                                                type="tel" className="field-input with-icon" placeholder="9876543210" />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="field-label">WhatsApp Number</label>
                                        <div className="input-wrap">
                                            <i className="bi bi-whatsapp"></i>
                                            <input type="tel" className="field-input with-icon" placeholder="+919938612840"
                                                name="whatsapp"

                                                value={formData.studio.whatsapp}

                                                onChange={handleStudioChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="field-label">Instagram Handle</label>
                                        <div className="input-wrap">
                                            <i className="bi bi-instagram"></i>
                                            <input type="text" className="field-input with-icon" placeholder="theweddingmotion.official"
                                                name="instagram"

                                                value={formData.studio.instagram}

                                                onChange={handleStudioChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="field-label">Location</label>
                                        <div className="input-wrap">
                                            <i className="bi bi-geo-alt"></i>
                                            <input type="text" className="field-input with-icon" placeholder="Bhubaneswar"
                                                name="location"

                                                value={formData.studio.location}

                                                onChange={handleStudioChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- ============ COVER IMAGE ============ --> */}
                        <div className="form-card">
                            <div className="card-title">
                                <div className="ic"><i className="bi bi-image"></i></div>
                                Cover Image
                            </div>
                            <label htmlFor="coverUpload" className="dropzone d-block">
                                {coverPreview ? (
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        style={{
                                            width: '100%',
                                            maxHeight: '220px',
                                            objectFit: 'cover',
                                            borderRadius: '10px'
                                        }}
                                    />
                                ) : (
                                    <>
                                        <div className="ic"><i className="bi bi-cloud-arrow-up"></i></div>
                                        <div className="txt">Click to upload cover image</div>
                                        <div className="sub">PNG or JPG, up to 5MB, recommended 1200×630</div>
                                    </>
                                )}
                            </label>
                            <input type="file" onChange={handleImage} id="coverUpload" accept="image/*" className="d-none" />
                        </div>

                        {/* <!-- ============ STICKY ACTION BAR ============ --> */}
                        <div class="action-bar form-shell">

                            <button type="submit" class="btn-mo" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Updating Event...
                                    </>
                                ) : (
                                    "Update Event"
                                )}
                            </button>
                        </div>

                    </form>

                    )}
                </div>

            </div>
        </>
    )
}

export default EditEventComp
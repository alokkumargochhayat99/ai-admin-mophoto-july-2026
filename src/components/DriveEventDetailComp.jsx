import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import PageShell from './PageShell';
import CopyLink from './CopyLink';
import DriveStatusPill from './DriveStatusPill';

const DriveEventDetailComp = () => {

    const { eventId } = useParams();

    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [busy, setBusy] = useState('');
    const [notice, setNotice] = useState('');

    const load = useCallback(async () => {
        try {
            const res = await axiosClient.get(`/api/admin/drive/event/${eventId}`);
            if (res.data && res.data.success) {
                setInfo(res.data);
            }
        } catch (err) {
            if (err?.response?.status === 404 || err?.response?.status === 400) {
                setNotFound(true);
            }
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        load();
        const timer = setInterval(load, 5000);
        return () => clearInterval(timer);
    }, [load]);

    const handleRetryFailed = async () => {
        try {
            setBusy('retry');
            setNotice('');
            const res = await axiosClient.post('/api/admin/drive/retry-failed', { eventId });
            setNotice(res.data.message || 'Done');
            await load();
        } catch (err) {
            alert(err?.response?.data?.message || 'Something went wrong');
        } finally {
            setBusy('');
        }
    };

    const handleFolder = async () => {
        try {
            setBusy('folder');
            setNotice('');
            await axiosClient.post(`/api/admin/drive/event/${eventId}/ensure-folder`);
            setNotice('Drive folder is ready');
            await load();
        } catch (err) {
            alert(err?.response?.data?.message || 'Could not create the Drive folder');
            load();
        } finally {
            setBusy('');
        }
    };

    const d = info?.drive;
    const ev = info?.event;

    return (
        <PageShell title={<>Drive <span className="dot">Backup</span></>}>

            <div className="page-head">
                <Link to="/drive-backup" className="drv-back"><i className="bi bi-arrow-left"></i>Back to Drive Backup</Link>
                <h1>{ev ? ev.eventName : 'Event'}</h1>
                {ev && <div className="sub">Event code {ev.eventCode}{ev.coupleName ? ` · ${ev.coupleName}` : ''}</div>}
            </div>

            {loading ? (
                <div className="drv-card text-center py-5"><span className="spinner-border spinner-border-sm me-2"></span>Loading...</div>
            ) : notFound || !d ? (
                <div className="drv-card text-center py-5">Event not found</div>
            ) : (
                <>
                    {d.folderError && (
                        <div className="drv-alert drv-alert-red">
                            <i className="bi bi-exclamation-octagon-fill"></i>
                            <div><b>Drive folder problem:</b> {d.folderError}</div>
                        </div>
                    )}

                    <div className="drv-card">
                        <div className="drv-card-top">
                            <div className="drv-lbl-lg">Backup status</div>
                            <DriveStatusPill status={d.status} />
                        </div>

                        {!d.backup ? (
                            <div className="drv-hint mt-3">
                                Drive backup is off for this event. Turn it on from <Link to={`/admin/event/edit/${eventId}`}>Edit Event</Link> to back up its photos.
                            </div>
                        ) : (
                            <>
                                <div className="drv-tiles">
                                    <div className="drv-tile"><div className="v">{d.total}</div><div className="l">Total photos</div></div>
                                    <div className="drv-tile ok"><div className="v">{d.uploaded}</div><div className="l">Uploaded</div></div>
                                    <div className="drv-tile warn"><div className="v">{d.pending + d.uploading}</div><div className="l">Pending</div></div>
                                    <div className={`drv-tile ${d.failed ? 'bad' : ''}`}><div className="v">{d.failed}</div><div className="l">Failed</div></div>
                                </div>

                                <div className="drv-progress-meta">
                                    <span>Progress</span>
                                    <span>{d.percent}%</span>
                                </div>
                                <div className="drv-progress"><div style={{ width: `${d.percent}%` }}></div></div>

                                {d.status === 'success' && (
                                    <div className="drv-alert drv-alert-green mt-3 mb-0">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <div><b>All photos of this event are on Drive</b></div>
                                    </div>
                                )}

                                {d.status === 'waiting' && (
                                    <div className="drv-hint mt-3">Pending photos will be uploaded in the next run (every night 2 AM – 9 AM), or press <b>Run now</b> on the Drive Backup page.</div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="drv-card">
                        <div className="drv-lbl-lg mb-2">Drive folder link</div>
                        {d.folderLink ? (
                            <>
                                <CopyLink link={d.folderLink} />
                                <div className="drv-hint mt-2">Anyone with this link can view the photos.</div>
                            </>
                        ) : (
                            <div className="drv-hint">
                                {d.backup ? 'Drive folder is not created yet.' : 'No folder (backup is off).'}
                            </div>
                        )}

                        <div className="drv-actions">
                            {d.backup && (!d.folderReady || d.folderError) && (
                                <button className="drv-btn drv-btn-run" onClick={handleFolder} disabled={busy === 'folder'}>
                                    <i className="bi bi-folder-plus"></i>{busy === 'folder' ? 'Creating...' : 'Create / retry folder'}
                                </button>
                            )}
                            {d.failed > 0 && (
                                <button className="drv-btn drv-btn-run" onClick={handleRetryFailed} disabled={busy === 'retry'}>
                                    <i className="bi bi-arrow-repeat"></i>{busy === 'retry' ? 'Please wait...' : `Retry failed (${d.failed})`}
                                </button>
                            )}
                        </div>
                        {notice && <div className="drv-notice">{notice}</div>}
                    </div>
                </>
            )}

        </PageShell>
    );
};

export default DriveEventDetailComp;

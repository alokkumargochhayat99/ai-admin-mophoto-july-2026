import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import PageShell from './PageShell';
import DriveStatusPill from './DriveStatusPill';
import { formatTime, percentOf } from './driveStatus';

const STOP_REASON = {
    'completed': 'Completed',
    'manual-stop': 'Stopped manually',
    'window-closed': 'Stopped at 9 AM (time window over)',
    'error': 'Stopped due to an error',
    'worker-restarted': 'Server restarted'
};

const DriveBackupComp = () => {

    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [busy, setBusy] = useState('');
    const [notice, setNotice] = useState('');

    const load = useCallback(async () => {
        try {
            const res = await axiosClient.get('/api/admin/drive/status');
            if (res.data && res.data.success) {
                setData(res.data);
                setLoadError('');
            }
        } catch (err) {
            if (err?.response?.status !== 401) {
                setLoadError(err?.response?.data?.message || 'Could not load Drive backup status');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const timer = setInterval(load, 5000);
        return () => clearInterval(timer);
    }, [load]);

    const act = async (name, fn) => {
        try {
            setBusy(name);
            setNotice('');
            const res = await fn();
            if (res?.data?.message) setNotice(res.data.message);
            await load();
        } catch (err) {
            alert(err?.response?.data?.message || 'Something went wrong');
        } finally {
            setBusy('');
        }
    };

    const handleStart = () => act('start', () => axiosClient.post('/api/admin/drive/start'));

    const handleStop = () => act('stop', () => axiosClient.post('/api/admin/drive/stop'));

    const handleAuto = async (e) => {
        const enabled = e.target.checked;
        setData((prev) => prev ? { ...prev, sync: { ...prev.sync, autoEnabled: enabled } } : prev);
        try {
            await axiosClient.put('/api/admin/drive/auto', { enabled });
        } catch (err) {
            alert(err?.response?.data?.message || 'Could not change auto backup');
        }
        load();
    };

    const sync = data?.sync;
    const summary = data?.summary;
    const events = data?.events || [];

    const running = !!sync?.running;
    const queued = !!sync?.queued;
    const stopping = !!sync?.stopRequested;

    const currentEvent = running && sync.currentEventId
        ? events.find((e) => e._id === sync.currentEventId)
        : null;

    const allDone = !!summary?.allDone && !running && !queued;

    const totals = summary?.totals || { total: 0, uploaded: 0, pending: 0, failed: 0 };
    const overall = percentOf(totals.uploaded, totals.total);

    let errorText = '';
    if (sync && !sync.configured) {
        errorText = 'Google Drive is not configured on the server.';
    } else if (sync && !running && sync.lastStopReason === 'error' && sync.lastError) {
        errorText = sync.lastError;
    }

    return (
        <PageShell title={<>Drive <span className="dot">Backup</span></>}>

            <div className="page-head">
                <h1>Drive Backup</h1>
                <div className="sub">Original photos of every event, backed up to Google Drive</div>
            </div>

            {loading && !data ? (
                <div className="drv-card text-center py-5">
                    <span className="spinner-border spinner-border-sm me-2"></span>Loading...
                </div>
            ) : (
                <>
                    {loadError && (
                        <div className="drv-alert drv-alert-red">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <div>{loadError}</div>
                        </div>
                    )}

                    {errorText && (
                        <div className="drv-alert drv-alert-red">
                            <i className="bi bi-exclamation-octagon-fill"></i>
                            <div>
                                <b>Backup problem:</b> {errorText}
                                {sync?.lastFinishedAt ? <span className="drv-alert-time"> ({formatTime(sync.lastFinishedAt)})</span> : null}
                            </div>
                        </div>
                    )}

                    {data && (
                        <div className="drv-card">

                            <div className="drv-card-top">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="drv-ic"><i className="bi bi-cloud-arrow-up-fill"></i></div>
                                    <div>
                                        <div className="drv-big">
                                            {summary.pendingEvents}<span className="drv-big-sub"> / {summary.enabledEvents}</span>
                                        </div>
                                        <div className="drv-lbl">Pending events</div>
                                    </div>
                                </div>

                                <div className={`drv-state ${running ? 'on' : queued ? 'queued' : ''}`}>
                                    <span className="drv-state-dot"></span>
                                    {running ? (stopping ? 'Stopping...' : 'Running') : queued ? 'Starting...' : 'Idle'}
                                </div>
                            </div>

                            {allDone ? (
                                <div className="drv-alert drv-alert-green mt-3 mb-0">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <div><b>All images backed up to Drive</b></div>
                                </div>
                            ) : (
                                <div className="drv-current">
                                    {running ? (
                                        <>
                                            <div className="drv-current-row">
                                                <span className="drv-current-lbl">Uploading now</span>
                                                <span className="drv-current-val">
                                                    {currentEvent
                                                        ? <>Event {currentEvent.eventCode} <span className="text-muted">· {currentEvent.eventName}</span></>
                                                        : sync.currentEventCode ? <>Event {sync.currentEventCode}</> : 'Getting ready...'}
                                                </span>
                                            </div>
                                            <div className="drv-current-row">
                                                <span className="drv-current-lbl">This run</span>
                                                <span className="drv-current-val">
                                                    {sync.runUploaded} uploaded{sync.runFailed ? <span className="text-danger"> · {sync.runFailed} failed</span> : null}
                                                    <span className="text-muted"> · {sync.ignoreWindow ? 'manual (no time limit)' : 'auto (till 9 AM)'}</span>
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="drv-current-row">
                                            <span className="drv-current-lbl">Last run</span>
                                            <span className="drv-current-val">
                                                {sync.lastFinishedAt
                                                    ? <>{formatTime(sync.lastFinishedAt)} <span className="text-muted">· {STOP_REASON[sync.lastStopReason] || '-'}</span></>
                                                    : 'Not run yet'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {totals.total > 0 && (
                                <div className="mt-3">
                                    <div className="drv-progress-meta">
                                        <span>{totals.uploaded} of {totals.total} photos on Drive</span>
                                        <span>{overall}%</span>
                                    </div>
                                    <div className="drv-progress"><div style={{ width: `${overall}%` }}></div></div>
                                    {totals.failed > 0 && <div className="drv-hint-red">{totals.failed} photo(s) failed. Open the event and press Retry failed.</div>}
                                </div>
                            )}

                            <div className="drv-controls">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="form-check form-switch m-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="drive-auto-toggle"
                                            checked={sync.autoEnabled}
                                            onChange={handleAuto} />
                                    </div>
                                    <label htmlFor="drive-auto-toggle" className="drv-auto-lbl">
                                        Auto backup
                                        <span>Every night 2 AM – 9 AM (IST)</span>
                                    </label>
                                </div>

                                <div className="d-flex gap-2">
                                    {(running || queued) ? (
                                        <button className="drv-btn drv-btn-stop" onClick={handleStop} disabled={busy === 'stop' || stopping}>
                                            <i className="bi bi-stop-circle"></i>{stopping ? 'Stopping...' : 'Stop'}
                                        </button>
                                    ) : null}
                                    {!(running && sync.ignoreWindow) && (
                                        <button
                                            className="drv-btn drv-btn-run"
                                            onClick={handleStart}
                                            disabled={busy === 'start' || queued || !sync.configured}
                                            title={!sync.configured ? 'Drive is not configured on the server' : ''}>
                                            <i className="bi bi-play-circle"></i>
                                            {busy === 'start' ? 'Starting...' : running ? 'Run without time limit' : 'Run now'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {notice && <div className="drv-notice">{notice}</div>}

                        </div>
                    )}

                    <div className="table-card">
                        <div className="drv-list-head">
                            <div className="drv-list-title">All Events</div>
                            <div className="drv-list-sub">Oldest first - backed up in this order</div>
                        </div>

                        <table className="mo-table">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Photos on Drive</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-4">No Events Found</td></tr>
                                ) : events.map((ev) => {
                                    const d = ev.drive;
                                    const pct = percentOf(d.uploaded, d.total);
                                    return (
                                        <tr key={ev._id}>
                                            <td>
                                                <div className="ev-name">{ev.eventName}</div>
                                                <div className="drv-sub">Code {ev.eventCode}{ev.coupleName ? ` · ${ev.coupleName}` : ''}</div>
                                            </td>
                                            <td>
                                                {d.backup && d.total > 0 ? (
                                                    <div className="drv-mini">
                                                        <div className="drv-mini-text">{d.uploaded} / {d.total}</div>
                                                        <div className="drv-progress sm"><div style={{ width: `${pct}%` }}></div></div>
                                                    </div>
                                                ) : <span className="drv-sub">{d.backup ? '0' : '-'}</span>}
                                            </td>
                                            <td><DriveStatusPill status={d.status} /></td>
                                            <td>
                                                <button className="btn-edit" onClick={() => navigate(`/drive-backup/${ev._id}`)}>
                                                    <i className="bi bi-eye"></i>Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

        </PageShell>
    );
};

export default DriveBackupComp;

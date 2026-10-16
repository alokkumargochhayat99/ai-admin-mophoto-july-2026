export const STATUS_LABEL = {
    running: 'Running',
    waiting: 'Waiting for upload',
    success: 'Success',
    failed: 'Failed',
    backup_off: 'Backup off',
    no_photos: 'No photos'
};

export const STATUS_CLASS = {
    running: 'drv-running',
    waiting: 'drv-waiting',
    success: 'drv-success',
    failed: 'drv-failed',
    backup_off: 'drv-off',
    no_photos: 'drv-off'
};

export const formatTime = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export const percentOf = (done, total) => (total ? Math.round((done / total) * 100) : 0);

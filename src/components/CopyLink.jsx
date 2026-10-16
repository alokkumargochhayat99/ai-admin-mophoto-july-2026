import React, { useState } from 'react';
import './DriveBackup.css';

const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // http pages / old browsers
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch {
            return false;
        }
    }
};

// Drive link with a copy icon
const CopyLink = ({ link }) => {

    const [copied, setCopied] = useState(false);

    if (!link) return null;

    const handleCopy = async () => {
        const ok = await copyText(link);
        if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        }
    };

    return (
        <div className="drv-link">
            <i className="bi bi-link-45deg"></i>
            <a href={link} target="_blank" rel="noreferrer" className="drv-link-text" title={link}>{link}</a>
            <button type="button" className={`drv-copy ${copied ? 'done' : ''}`} onClick={handleCopy} title="Copy link">
                <i className={`bi ${copied ? 'bi-check2' : 'bi-clipboard'}`}></i>
                <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
        </div>
    );
};

export default CopyLink;

import React from 'react';

const NotificationComponent = ({ isEnabled, channels, onToggleEnabled, onToggleChannel }) => {
    const channelList = [
        { key: 'email', label: 'Email notification' },
        { key: 'personalMessage', label: 'Personal Message' },
        { key: 'onScreen', label: 'On-screen Announcement' }
    ];

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '24px'
        }}>
            <div
                style={{
                    backgroundColor: '#f8f9fa',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 600,
                    userSelect: 'none'
                }}
                onClick={onToggleEnabled}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={onToggleEnabled}
                        onClick={(e) => e.stopPropagation()}
                        style={{ marginRight: '12px' }}
                    />
                    Send Notification
                </div>
                <span style={{ fontSize: '20px', color: '#666' }}>
          {isEnabled ? '−' : '+'}
        </span>
            </div>

            {isEnabled && (
                <div style={{ padding: '16px', backgroundColor: '#fff' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                    }}>
                        {channelList.map(ch => (
                            <label key={ch.key} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={channels[ch.key]}
                                    onChange={() => onToggleChannel(ch.key)}
                                    style={{ marginRight: '10px' }}
                                />
                                <span>{ch.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;
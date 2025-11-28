import React from 'react';

const VerificationComponent = ({verifies, openSections, onToggleSection, onToggleDocument}) => {
    return (<>
        <h3 style={{margin: '0 0 20px 0', color: '#333'}}>Specify Verification Purpose</h3>

        {verifies.map(section => {
            const selectedCount = section.documents.filter(d => d.isSelected).length;
            const total = section.documents.length;

            return (<div
                key={section.key}
                style={{
                    border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden'
                }}
            >
                <div
                    onClick={() => total > 0 && onToggleSection(section.key)}
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
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <input
                            type="checkbox"
                            checked={selectedCount === total && total > 0}
                            disabled
                            style={{marginRight: '12px'}}
                        />
                        {section.label}
                    </div>
                    <span style={{fontSize: '20px', color: '#666'}}>
                        {openSections[section.key] ? '−' : '+'}
                    </span>
                </div>

                {openSections[section.key] && (<div style={{padding: '16px', backgroundColor: '#fff'}}>
                    {section.documents.length === 0 ? (
                        <p style={{color: '#999', fontStyle: 'italic', margin: 0}}>
                            No documents required
                        </p>) : (<div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '12px'
                    }}>
                        {section.documents.map((doc, idx) => (<label
                            key={idx}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: doc.isDisabled ? 'not-allowed' : 'pointer',
                                opacity: doc.isDisabled ? 0.8 : 1
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={doc.isSelected}
                                onChange={() => onToggleDocument(section.key, idx)}
                                disabled={doc.isDisabled}
                                style={{marginRight: '8px'}}
                            />
                            <span style={{fontSize: '14px'}}>{doc.label}</span>
                        </label>))}
                    </div>)}
                </div>)}
            </div>);
        })}
    </>);
};

export default VerificationComponent;
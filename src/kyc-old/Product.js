import React, {useState} from 'react';

const VerificationForm = () => {
    const [verifies, setVerifies] = useState([
            {
                "key": "poi",
                "label": "Proof of Identity (POI)",
                "documents": [
                    {
                        "label": "Passport",
                        "isSelected": true,
                        "isDisabled": true
                    },
                    {
                        "label": "ID Card",
                        "isSelected": true,
                        "isDisabled": true
                    },
                    {
                        "label": "Driving Licence",
                        "isSelected": true,
                        "isDisabled": true
                    }
                ]
            },
            {
                "key": "poa",
                "label": "Proof of Address (POA)",
                "documents": [
                    {
                        "label": "AB",
                        "isSelected": false,
                        "isDisabled": false
                    },
                    {
                        "label": "DE",
                        "isSelected": true,
                        "isDisabled": true
                    },
                    {
                        "label": "Temp",
                        "isSelected": false,
                        "isDisabled": false
                    }
                ]
            },
            {
                "key": "selfie",
                "label": "Selfie",
                "documents": []
            }
        ]
    );

    const [openSections, setOpenSections] = useState({
        poi: true,
        poa: true,
        selfie: true
    });

    const toggleSection = (key) => {
        setOpenSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Sửa đúng: verifes là mảng → tìm section theo key
    const handleItemChange = (sectionKey, docIndex) => {
        setVerifies(prev => {
            return prev.map(section => {
                if (section.key !== sectionKey) return section;

                const item = section.documents[docIndex];

                // Nếu bị disable → không cho thay đổi
                if (item.isDisabled) {
                    return section;
                }

                // Tạo bản sao mới của documents
                const newDocuments = [...section.documents];
                newDocuments[docIndex] = {
                    ...item,
                    isSelected: !item.isSelected
                };

                return {
                    ...section,
                    documents: newDocuments
                };
            });
        });
    };

    const handleSave = () => {
        const payload = { verifies: {} };

        verifies.forEach(section => {
            const selectedLabels = section.documents
                .filter(doc => doc.isSelected)
                .map(doc => doc.label);

            if (selectedLabels.length > 0) {
                payload.verifies[section.key] = selectedLabels;
            }
        });

        console.log("Gửi về backend:", payload);
        alert("Lưu thành công!");
    };

    return (
        <div style={{maxWidth: '600px', margin: '40px auto', fontFamily: 'Segoe UI, Arial, sans-serif'}}>
            <h2>Xác minh tài liệu</h2>

            {verifies.map(section => {
                const selectedCount = section.documents.filter(d => d.isSelected).length;
                const totalCount = section.documents.length;
                const sectionKey = section.key;

                return (
                    <div
                        key={sectionKey}
                        style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '12px',
                            marginBottom: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* Header */}
                        <div
                            onClick={() => toggleSection(sectionKey)}
                            style={{
                                padding: '14px 16px',
                                backgroundColor: '#f9f9f9',
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
                                    checked={selectedCount === totalCount && totalCount > 0}
                                    disabled
                                    style={{marginRight: '12px'}}
                                />
                                {section.label} ({selectedCount}/{totalCount})
                            </div>
                            <span style={{fontSize: '20px', color: '#666'}}>
                                {openSections[sectionKey] ? '−' : '+'}
                            </span>
                        </div>

                        {/* Body */}
                        {openSections[sectionKey] && (
                            <div style={{padding: '16px'}}>
                                {totalCount === 0 ? (
                                    <p style={{color: '#999', margin: 0, fontStyle: 'italic'}}>
                                        Không có tài liệu nào
                                    </p>
                                ) : (
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                        {section.documents.map((item, idx) => {
                                            const isLocked = item.isDisabled; // Đã được server xác minh

                                            return (
                                                <label
                                                    key={idx}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: isLocked ? 'not-allowed' : 'pointer',
                                                        opacity: isLocked ? 0.75 : 1
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={item.isSelected}
                                                        onChange={() => handleItemChange(sectionKey, idx)}
                                                        disabled={isLocked}
                                                        style={{marginRight: '12px'}}
                                                    />
                                                    <span>
                                                        {item.label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            <div style={{textAlign: 'center', marginTop: '30px'}}>
                <button
                    onClick={handleSave}
                    style={{
                        padding: '12px 40px',
                        fontSize: '16px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(25,118,210,0.3)'
                    }}
                >
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default VerificationForm;
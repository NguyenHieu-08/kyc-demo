
import React, {useEffect, useState} from 'react';
import VerificationComponent from './VerificationComponent';
import BlockingRulesComponent from './BlockingRulesComponent';
import NotificationComponent from './NotificationComponent';

const KYCDocumentRequestModal = ({ isOpen, onClose, onCreate }) => {

    const verifiesFake = [
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
                    "label": "Utility Bill",
                    "isSelected": false,
                    "isDisabled": false
                },
                {
                    "label": "Rental Agreement",
                    "isSelected": true,
                    "isDisabled": true
                },
                {
                    "label": "Bank Statement",
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
    ];

    let rulesFake = {
        casinoBonus: false,
        sbBonus: false,
        blockCasino: true,
        blockSB: false,
        blockWithdrawals: false,
        betBuilder: false,
        blockBetBuilder: false
    }


    const [verifies, setVerifies ] = useState([...verifiesFake]);
    const [openSections, setOpenSections] = useState({});
    const [notification, setNotification] = useState({
        enabled: true,
        channels: { email: true, personalMessage: true, onScreen: true }
    });
    const [blockingPreset, setBlockingPreset] = useState('no-blocks');
    const [blockingRules, setBlockingRules] = useState({});

    useEffect(() => {
        if(verifiesFake) {
            setOpenSections(() => {
                const initial = {};
                verifiesFake.forEach(section => {
                    initial[section.key] = section.documents.length > 0;
                });
                return initial;
            });
        }
    }, []);

    useEffect(() => {
        if(rulesFake) {
            setBlockingRules(() => rulesFake);
        }
    }, []);

    const toggleSection = (key) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleDocument = (sectionKey, docIndex) => {
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

    const toggleBlockingRule = (keyOrObject) => {
        if (typeof keyOrObject === 'string') {

            setBlockingRules(prev => ({
                ...prev,
                [keyOrObject]: !prev[keyOrObject]
            }));
        } else if (typeof keyOrObject === 'object') {
            setBlockingRules(keyOrObject);

            rulesFake = {...keyOrObject};
        }
    };

    const handleCreate = () => {
        const payload = { verifies: {}, blockingRule: blockingRules };
        if (notification.enabled) {
            payload.notification = notification.channels;
        }
        verifies.forEach(section => {
            const selectedLabels = section.documents
                .filter(doc => doc.isSelected)
                .map(doc => doc.label);

            if (selectedLabels.length > 0) {
                payload.verifies[section.key] = selectedLabels;
            }
        });
        onCreate?.(payload);
        console.log("Gửi về backend:", payload);
        alert("Lưu thành công!");
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px', fontFamily: 'Segoe UI, Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: '8px', maxWidth: '900px',
                maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    backgroundColor: '#007bff', color: 'white', padding: '16px 20px',
                    fontSize: '18px', fontWeight: 'bold', borderRadius: '8px 8px 0 0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <span>Create new KYC Document Request</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ padding: '24px' }}>
                    <VerificationComponent
                        verifies={verifies}
                        openSections={openSections}
                        onToggleSection={toggleSection}
                        onToggleDocument={toggleDocument}
                    />

                    <BlockingRulesComponent
                        initial={rulesFake}
                        preset={blockingPreset}
                        rules={blockingRules}
                        onPresetChange={setBlockingPreset}
                        onToggleRule={toggleBlockingRule}
                    />

                    <NotificationComponent
                        isEnabled={notification.enabled}
                        channels={notification.channels}
                        onToggleEnabled={() => setNotification(prev => ({ ...prev, enabled: !prev.enabled }))}
                        onToggleChannel={(key) => setNotification(prev => ({
                            ...prev,
                            channels: { ...prev.channels, [key]: !prev.channels[key] }
                        }))}
                    />

                    <div style={{ textAlign: 'right', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                        <button onClick={onClose} style={{
                            padding: '10px 20px', marginRight: '12px',
                            backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
                        }}>Close</button>
                        <button onClick={handleCreate} style={{
                            padding: '10px 28px', backgroundColor: '#007bff', color: 'white',
                            border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                        }}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KYCDocumentRequestModal;
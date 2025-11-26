// BlockingRulesComponent.jsx
import React from 'react';

const BlockingRulesComponent = ({preset, rules, initial, onPresetChange, onToggleRule}) => {
    const ruleList = [
        {key: 'casinoBonus', label: 'Casino Bonus Ineligible'},
        {key: 'sbBonus', label: 'SB Bonus Ineligible'},
        {key: 'blockCasino', label: 'Block Casino'},
        {key: 'blockSB', label: 'Block SB/Wagering'},
        {key: 'blockWithdrawals', label: 'Block Withdrawals'},
        {key: 'betBuilder', label: 'Bet Builder Bonus Ineligible'},
        {key: 'blockBetBuilder', label: 'Block Bet Builder'}
    ];

    // Khi chọn preset → tự động bật/tắt các rule phù hợp
    const handlePresetChange = (value) => {
        onPresetChange(value);
        let newRules = {};
        if (value === 'friendly') {
            newRules = {
                casinoBonus: false,
                sbBonus: false,
                blockCasino: false,
                blockSB: true,
                blockWithdrawals: true,
                betBuilder: false,
                blockBetBuilder: false
            }
        } else if (value === 'no-blocks') {
            newRules = {
                casinoBonus: false,
                sbBonus: false,
                blockCasino: false,
                blockSB: false,
                blockWithdrawals: false,
                betBuilder: false,
                blockBetBuilder: false
            }
        }
        onToggleRule(newRules);
    };

    return (
        <div style={{margin: '30px 0'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                <h3 style={{margin: 0, color: '#333', fontSize: '16px', fontWeight: 600, minWidth: '160px'}}>
                    Specify Blocking Rules
                </h3>

                {/* Select Preset: No Blocks / Friendly */}
                <select
                    value={preset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        backgroundColor: 'white',
                        fontSize: '14px',
                        minWidth: '140px',
                        cursor: 'pointer'
                    }}
                >
                    <option value="no-blocks">No Blocks</option>
                    <option value="friendly">Friendly</option>
                </select>
            </div>

            {/* Bảng checkbox */}
            <div style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
                    <thead>
                    <tr style={{backgroundColor: '#e9ecef'}}>
                        {ruleList.map(rule => (
                            <th
                                key={rule.key}
                                style={{
                                    padding: '12px 8px',
                                    textAlign: 'center',
                                    fontWeight: 500,
                                    color: '#495057',
                                    borderRight: '1px solid #dee2e6'
                                }}
                            >
                                {rule.label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {ruleList.map(rule => {
                            const isDisabled = initial[rule.key] === true;

                            return (
                                <td
                                    key={rule.key}
                                    style={{
                                        padding: '16px 8px',
                                        textAlign: 'center',
                                        backgroundColor: 'white',
                                        borderRight: '1px solid #dee2e6'
                                    }}
                                >
                                    <label style={{cursor: isDisabled ? 'not-allowed' : 'pointer'}}>
                                        <input
                                            type="checkbox"
                                            checked={rules[rule.key] || false}
                                            disabled={isDisabled}
                                            onChange={() => onToggleRule(rule.key)}
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                opacity: isDisabled ? 0.5 : 1,
                                                cursor: isDisabled ? 'not-allowed' : 'pointer'
                                            }}
                                        />
                                    </label>
                                </td>
                            );
                        })}
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlockingRulesComponent;
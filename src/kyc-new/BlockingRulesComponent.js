import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchBlockingRulesStart} from "./shard/KYCSlice";
import COMMON from "./constant/common";

const BlockingRulesComponent = forwardRef((props, ref) => {

    const [specialBlockingRule, setSpecialBlockingRule] = useState(COMMON.DEFAULT_SPECIFY_BLOCKING_RULES);
    const [blockingRules, setBlockingRules] = useState({});
    const dispatch = useDispatch();
    const {blockingRuleData} = useSelector(
        (state) => state.kyc
    );

    useEffect(() => {
        if (blockingRuleData && Object.keys(blockingRuleData).length > 0) {
            // TODO: Not be able to delete id
            const rules = {...blockingRuleData}
            delete rules.id;

            setBlockingRules({...rules});
        }
    }, [blockingRuleData]);

    useImperativeHandle(ref, () => ({
        getBlockingRules: () => blockingRules
    }));


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
    const handldSpecialBlockingRuleChange = (value) => {
        const specialRule = value ? parseInt(value) : COMMON.DEFAULT_SPECIFY_BLOCKING_RULES;
        setSpecialBlockingRule(specialRule);
        dispatch(fetchBlockingRulesStart(specialRule));
    };

    // Toggle từng rule (chỉ cho phép nếu không bị disabled)
    const handleToggleRule = (key) => {
        const rule = blockingRules[key];
        if (rule && !rule.isDisabled) {
            setBlockingRules((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    value: !prev[key].value,
                },
            }));
        }
    };

    return (
        <div className="blocking-rules">
            <div className="blocking-rules__header">
                <h3>Specify Blocking Rules</h3>
                <select
                    value={specialBlockingRule}
                    onChange={(e) => handldSpecialBlockingRuleChange(e.target.value)}
                >
                    <option value="1">No Blocks</option>
                    <option value="2">Friendly</option>
                </select>
            </div>

            <div className="blocking-rules__table-wrapper">
                <table>
                    <thead>
                    <tr>
                        {ruleList.map((rule) => (
                            <th key={rule.key}>{rule.label}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {ruleList.map((rule) => {
                            const blockingRule = blockingRules[rule.key] || { value: false, isDisabled: false };

                            return (
                                <td key={rule.key}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={blockingRule.value}
                                            disabled={blockingRule.isDisabled}
                                            onChange={() => handleToggleRule(rule.key)}
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
});

export default BlockingRulesComponent;
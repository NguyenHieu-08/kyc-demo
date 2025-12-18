import React, {forwardRef, useEffect, useImperativeHandle, useState, useMemo, useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchBlockingRulesStart} from "./shard/KYCSlice";
import COMMON from "./constant/common";

const BlockingRulesComponent = forwardRef((props, ref) => {

    const [specialBlockingRule, setSpecialBlockingRule] = useState(COMMON.DEFAULT_SPECIFY_BLOCKING_RULES);
    const [blockingRules, setBlockingRules] = useState({});
    const dispatch = useDispatch();
    // Chỉ subscribe vào blockingRuleData, không subscribe vào toàn bộ state.kyc
    const blockingRuleData = useSelector(
        (state) => state.kyc.blockingRuleData
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
    }), [blockingRules]);

    // Memoize ruleList để tránh tạo array mới mỗi lần render
    const ruleList = useMemo(() => [
        {key: 'casinoBonus', label: 'Casino Bonus Ineligible'},
        {key: 'sbBonus', label: 'SB Bonus Ineligible'},
        {key: 'blockCasino', label: 'Block Casino'},
        {key: 'blockSB', label: 'Block SB/Wagering'},
        {key: 'blockWithdrawals', label: 'Block Withdrawals'},
        {key: 'betBuilder', label: 'Bet Builder Bonus Ineligible'},
        {key: 'blockBetBuilder', label: 'Block Bet Builder'}
    ], []);

    // Khi chọn preset → tự động bật/tắt các rule phù hợp
    const handldSpecialBlockingRuleChange = useCallback((value) => {
        const specialRule = value ? parseInt(value) : COMMON.DEFAULT_SPECIFY_BLOCKING_RULES;
        setSpecialBlockingRule(specialRule);
        dispatch(fetchBlockingRulesStart(specialRule));
    }, [dispatch]);

    // Toggle từng rule (chỉ cho phép nếu không bị disabled)
    const handleToggleRule = useCallback((key) => {
        setBlockingRules((prev) => {
            const rule = prev[key];
            if (rule && !rule.isDisabled) {
                return {
                    ...prev,
                    [key]: {
                        ...prev[key],
                        value: !prev[key].value,
                    },
                };
            }
            return prev;
        });
    }, []);

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

BlockingRulesComponent.displayName = 'BlockingRulesComponent';

export default React.memo(BlockingRulesComponent);
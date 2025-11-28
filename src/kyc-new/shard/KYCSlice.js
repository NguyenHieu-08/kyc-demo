import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    blockingRuleData: {},
    loading: false,
    error: null,
    notificationData: {},
    notificationLoading: false,
    notificationError: null,
};

const KYCSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers: {
        fetchBlockingRulesStart(state, action) {
            state.loading = true;
            state.error = null;
        },
        fetchBlockingRulesSuccess(state, action) {
            const apiData = action.payload;
            state.loading = false;
            state.blockingRuleData = Object.fromEntries(
                Object.entries(apiData).map(([key, value]) => [
                    key,
                    {
                        value: Boolean(value),
                        isDisabled: value === true,
                    },
                ])
            );
        },
        fetchBlockingRulesFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },


        // Notification
        fetchNotificationStart(state, action) {
            state.notificationLoading = true;
            state.error = null;
        },
        fetchNotificationSuccess(state, action) {
            state.notificationLoading = false;
            const data = action.payload || [];
            let result = {
                enabled: false,
                channels: []
            };
            if (Object.keys(data).length > 0) {
                result = {
                    enabled: data.some(item => item.isSelected === true),
                    channels: [...data].map(item => ({
                        ...item,
                        isDisabled: item.isSelected === true
                    }))
                };
            }
            state.notificationData = {...result}
        },
        fetchNotificationFailure(state, action) {
            state.notificationLoading = false;
            state.notificationError = action.payload;
        }

    },
});

export const {
    fetchBlockingRulesStart,
    fetchBlockingRulesSuccess,
    fetchBlockingRulesFailure,

    fetchNotificationStart,
    fetchNotificationSuccess,
    fetchNotificationFailure

} = KYCSlice.actions;

export default KYCSlice.reducer;
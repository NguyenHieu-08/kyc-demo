
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { KYCSaga } from './kyc-new/shard';
import kycReducer from './kyc-new/shard';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        kyc: kycReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware),
});

function* rootSaga() {
    yield KYCSaga();
}

sagaMiddleware.run(rootSaga);
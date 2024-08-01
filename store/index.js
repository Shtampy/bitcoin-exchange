import { configureStore } from '@reduxjs/toolkit';
import { coinReducer } from './reducers/coinReducer';

const store = configureStore({
    reducer:{
        coin: coinReducer,
    },
})
export default store;

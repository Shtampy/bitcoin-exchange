import { createSlice } from "@reduxjs/toolkit";

const initialValue = localStorage.getItem('favCoins') ? JSON.parse(localStorage.getItem('favCoins')) : [];

const coinSlice = createSlice({
    name:"coin",
    initialState:{
        favCoins: initialValue
    },
    reducers:{
        setFavCoins(state,action){
            state.favCoins = action.payload;
        },
        resetFavCoins(state,action){
            state.favCoins = [];
        }
    }
});
const coinActions = coinSlice.actions;
const coinReducer = coinSlice.reducer;

export { coinActions, coinReducer };
 
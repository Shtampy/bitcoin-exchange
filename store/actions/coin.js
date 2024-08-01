import { coinActions } from "../reducers/coinReducer";

export const deleteAllFavCoins = () => (dispatch) => {
    dispatch(coinActions.resetFavCoins());
    localStorage.removeItem('favCoins');
}
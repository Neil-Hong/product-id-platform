import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        co2_token: null,
        loading: false,
    },
    reducers: {
        setCo2Token: (state, actions) => {
            state.co2_token = actions.payload;
        },
        changeLoading: (state, actions) => {
            state.loading = actions.payload;
        },
    },
});

export const { setCo2Token, changeLoading } = productSlice.actions;
export default productSlice.reducer;

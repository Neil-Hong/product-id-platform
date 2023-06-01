import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        loggedIn: false,
        username: "",
        tag: "manageaccount",
        businessName: "",
    },
    reducers: {
        userLogIn: (state, actions) => {
            state.loggedIn = true;
            state.username = actions.payload;
        },
        userLogOut: (state, actions) => {
            state.loggedIn = false;
        },
        tagChosed: (state, actions) => {
            state.tag = actions.payload;
        },
        updateBusinessName: (state, actions) => {
            state.businessName = actions.payload;
        },
    },
});

export const { userLogIn, userLogOut, tagChosed, updateBusinessName } = userSlice.actions;
export default userSlice.reducer;

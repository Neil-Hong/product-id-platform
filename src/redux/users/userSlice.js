import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        loggedIn: false,
        username: "",
        tag: "manageaccount",
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
    },
});

export const { userLogIn, userLogOut, tagChosed } = userSlice.actions;
export default userSlice.reducer;

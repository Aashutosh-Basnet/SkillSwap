import {createSlice} from "@reduxjs/tookit";

export const messageSlice = createSlice({
    name: 'message',
    initialState: {
        messages: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        addmessage: () => {
            console.log('message added!');
        }
    }
});

export const {addmessage} = messageSlice.actions;

export default messageSlice.reducer;


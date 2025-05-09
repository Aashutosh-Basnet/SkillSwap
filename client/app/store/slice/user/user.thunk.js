import {createAsyncThunk} from "@redux/toolkit";

export const fetchUserId = createAsyncThunk("users/fetchById", async () => {
    console.log("fetched user id");
});
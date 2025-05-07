import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {

  },
})

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: false,
    },
    reducers: {
        login: () => {
          console.log('logged in')
        }
    },
    extraReducers: (builder) => {
      builder.addCase(fetchUserById.pending, (state, action) => {
        state.entities.push(action.payload);
      });
      builder.addCase(fetchUserById.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      });
      builder.addCase(fetchUserById.rejected, (state, action) => {
        state.entities.push(action.payload);
      });
    }
})

export const {} = userSlice.actions;

export default userSlice.reducer;
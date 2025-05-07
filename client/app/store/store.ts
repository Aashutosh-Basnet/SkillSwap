import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import userSlice from "./slice/user/user.slice";
import messageReducer from "./slice/message/message.slice";
import socketReducer from "./slice/socket/socket.slice";

const makeStore = () =>
  configureStore({
    reducer: {
      userSlice,
      messageReducer,
      socketReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ["socketReducer.socket"],
        },
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore);

export {makeStore};
import { configureStore } from "@reduxjs/toolkit";

import contentReducer from "@redux/slices/contentSlice";
import modalReducer from "@redux/slices/modalSlice";
import projectReducer from "@redux/slices/projectSlice";
import profileReducer from "@redux/slices/profileSlice";
import authReducer from "@redux/slices/authSlice";
import badgeReducer from "./slices/badgeSlice";
import inboxReducer from "./slices/inboxSlice";
import dashboardReducer from "./slices/dashboardSlice";

import { enableMapSet } from "immer";

enableMapSet();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    project: projectReducer,
    profile: profileReducer,
    content: contentReducer,
    badge: badgeReducer,
    inbox: inboxReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import studyTimeReducer from "./reducers/StudyTimeReducer";
import generalReducer from "./reducers/GeneralReducer";

export const store = configureStore({
  reducer: {
    studyTime: studyTimeReducer,
    general: generalReducer
  },
});
export default store;

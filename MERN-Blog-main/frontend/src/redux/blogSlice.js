import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: [], // ✅ fixed: empty array instead of null
    yourBlog: [], // ✅ fixed: empty array instead of null
  },
  reducers: {
    //actions
    setBlog: (state, action) => {
      state.blog = action.payload;
    },
    setYourBlog: (state, action) => {
      state.yourBlog = action.payload;
    },
  },
});

export const { setBlog, setYourBlog } = blogSlice.actions;
export default blogSlice.reducer;

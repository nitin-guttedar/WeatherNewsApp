import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NewsState {
  categories: Record<string, boolean>;
}

const initialState: NewsState = {
  categories: {
    Technology: true,
    Sports: true,
    Politics: true,
    Entertainment: true,
    Business: true,
    Health: true,
  },
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      state.categories[category] = !state.categories[category];
    },
  },
});

export const { toggleCategory } = newsSlice.actions;
export default newsSlice.reducer;

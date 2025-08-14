import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WeatherState {
  unit: 'C' | 'F';
}

const initialState: WeatherState = {
  unit: 'C',
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setUnit: (state, action: PayloadAction<'C' | 'F'>) => {
      state.unit = action.payload;
    },
  },
});

export const { setUnit } = weatherSlice.actions;
export default weatherSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LiveTick = {
  t: number;
  p: number;
};

export interface AreaSplineState {
  data: Array<[number, number]>;
}

const initialState: AreaSplineState = {
  data: []
};

const MAX_LINE_POINTS = 500;

export const areaSplineSlice = createSlice({
    name: "areaSpline",
    initialState,
    reducers: {
        areaSplineUpdateReducer: (state, action: PayloadAction<LiveTick[]>) => {
            const points = action.payload
                .filter(({ t, p }) => Number.isFinite(t) && Number.isFinite(p))
                .map(({ t, p }): [number, number] => [t, p]);

            state.data.push(...points);
            if (state.data.length > MAX_LINE_POINTS) {
                state.data.splice(0, state.data.length - MAX_LINE_POINTS);
            }
        },
    },
});

export const { areaSplineUpdateReducer } = areaSplineSlice.actions;
export default areaSplineSlice.reducer;
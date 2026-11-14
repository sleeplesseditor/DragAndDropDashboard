import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LiveTick = {
  t: number;
  p: number;
  v?: number;
};

export interface AreaSplineState {
  data: Array<[number, number]>;
  volumeData: Array<[number, number]>;
  twoPaneData: {
    priceData: Array<[number, number]>;
    volumeData: Array<[number, number]>;
  };
}

const initialState: AreaSplineState = {
  data: [],
  volumeData: [],
  twoPaneData: {
    priceData: [],
    volumeData: []
  }
};

const MAX_LINE_POINTS = 500;
export const TWO_PANE_BUCKET_MS = 5000;
const MAX_TWO_PANE_POINTS = 120;

export const areaSplineSlice = createSlice({
    name: "areaSpline",
    initialState,
    reducers: {
        areaSplineUpdateReducer: (state, action: PayloadAction<LiveTick[]>) => {
            const points = action.payload
                .filter(({ t, p }) => Number.isFinite(t) && Number.isFinite(p))
                .map(({ t, p }): [number, number] => [t, p]);
            const volumePoints = action.payload
                .filter(
                    (tick): tick is LiveTick & { v: number } =>
                        Number.isFinite(tick.t) &&
                        typeof tick.v === "number" &&
                        Number.isFinite(tick.v)
                )
                .map(({ t, v }): [number, number] => [t, v]);

            state.data.push(...points);
            state.data.sort(([timestampA], [timestampB]) => timestampA - timestampB);
            if (state.data.length > MAX_LINE_POINTS) {
                state.data.splice(0, state.data.length - MAX_LINE_POINTS);
            }
            state.volumeData.push(...volumePoints);
            if (state.volumeData.length > MAX_LINE_POINTS) {
                state.volumeData.splice(0, state.volumeData.length - MAX_LINE_POINTS);
            }

            action.payload.forEach(({ t, p, v }) => {
                if (!Number.isFinite(t) || !Number.isFinite(p)) return;

                const bucketTimestamp = Math.floor(t / TWO_PANE_BUCKET_MS) * TWO_PANE_BUCKET_MS;
                const priceIndex = state.twoPaneData.priceData.findIndex(
                    ([timestamp]) => timestamp === bucketTimestamp
                );
                if (priceIndex >= 0) {
                    state.twoPaneData.priceData[priceIndex] = [bucketTimestamp, p];
                } else {
                    state.twoPaneData.priceData.push([bucketTimestamp, p]);
                }

                if (typeof v !== "number" || !Number.isFinite(v)) return;

                const volumeIndex = state.twoPaneData.volumeData.findIndex(
                    ([timestamp]) => timestamp === bucketTimestamp
                );
                if (volumeIndex >= 0) {
                    const existingVolume = state.twoPaneData.volumeData[volumeIndex];
                    if (existingVolume) {
                        state.twoPaneData.volumeData[volumeIndex] = [
                            bucketTimestamp,
                            existingVolume[1] + v
                        ];
                    }
                } else {
                    state.twoPaneData.volumeData.push([bucketTimestamp, v]);
                }
            });

            if (state.twoPaneData.priceData.length > MAX_TWO_PANE_POINTS) {
                state.twoPaneData.priceData.splice(
                    0,
                    state.twoPaneData.priceData.length - MAX_TWO_PANE_POINTS
                );
            }
            if (state.twoPaneData.volumeData.length > MAX_TWO_PANE_POINTS) {
                state.twoPaneData.volumeData.splice(
                    0,
                    state.twoPaneData.volumeData.length - MAX_TWO_PANE_POINTS
                );
            }
        },
    },
});

export const { areaSplineUpdateReducer } = areaSplineSlice.actions;
export default areaSplineSlice.reducer;
import {
    liveDataSliceUpdateReducer,
    type LiveTick,
} from "@modules/liveData/slice";

const isLiveTick = (value: unknown): value is LiveTick => {
    if (typeof value !== "object" || value === null) return false;

    return "t" in value &&
        "p" in value &&
        typeof value.t === "number" &&
        Number.isFinite(value.t) &&
        typeof value.p === "number" &&
        Number.isFinite(value.p) &&
        (!("v" in value) ||
            (typeof value.v === "number" && Number.isFinite(value.v)));
};

const handleUpdateAreaSplineData = (
    data: unknown[],
    dispatch: (action: ReturnType<typeof liveDataSliceUpdateReducer>) => unknown
) => {
    const ticks = data.filter(isLiveTick);
    
    if (ticks.length > 0) {
        dispatch(liveDataSliceUpdateReducer(ticks));
    }
}

export {
    handleUpdateAreaSplineData
}
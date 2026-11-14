import {
    areaSplineUpdateReducer,
    type LiveTick,
} from "@modules/area-spline/slice";

const isLiveTick = (value: unknown): value is LiveTick => {
    if (typeof value !== "object" || value === null) return false;

    return "t" in value &&
        "p" in value &&
        typeof value.t === "number" &&
        Number.isFinite(value.t) &&
        typeof value.p === "number" &&
        Number.isFinite(value.p);
};

const handleUpdateAreaSplineData = (
    data: unknown[],
    dispatch: (action: ReturnType<typeof areaSplineUpdateReducer>) => unknown
) => {
    const ticks = data.filter(isLiveTick);
    
    if (ticks.length > 0) {
        dispatch(areaSplineUpdateReducer(ticks));
    }
}

export {
    handleUpdateAreaSplineData
}
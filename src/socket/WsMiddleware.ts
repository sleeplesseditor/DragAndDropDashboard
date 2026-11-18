import type { Middleware } from "@reduxjs/toolkit";
import { Connection } from "@socket/Connection";
import { handleUpdateAreaSplineData } from "@modules/area-spline/handlers";
import { selectionSlice } from "@modules/selection/slice";

type FinnhubTrade = {
    s: string;
    p: number;
};

const isFinnhubTrade = (value: unknown): value is FinnhubTrade => {
    if (typeof value !== "object" || value === null) return false;

    return "s" in value &&
        typeof value.s === "string" &&
        "p" in value &&
        typeof value.p === "number" &&
        Number.isFinite(value.p);
};

export const createWsMiddleware = (connection: Connection): Middleware => {
    return (store) => {
        connection.onReceive((data) => {
            const parsedData = JSON.parse(data)

            if(parsedData === "subscribed") {
                console.log('Subscription acknowledged', parsedData, store)
                // handleSubscriptionAcknowledge(parsedData, store);
                return;
            }

            if (parsedData?.type === "trade" && Array.isArray(parsedData.data)) {
                handleUpdateAreaSplineData(parsedData.data, store.dispatch)

                parsedData.data.filter(isFinnhubTrade).forEach(({ s, p }) => {
                    store.dispatch(selectionSlice.actions.updateCurrentPrice({
                        symbol: s,
                        currentPrice: p
                    }));
                });
            }
        })

        return (next) => (action) => next(action)
    }
}
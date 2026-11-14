import { configureStore } from "@reduxjs/toolkit";
import { Connection } from "@socket/Connection";
import { ConnectionStatus } from "@socket/types/ConnectionStatus";
import { WsConnectionProxy } from "@socket/WsConnectionProxy";
import { changeConnectionStatus, subscriptionSlice } from "@socket/slice";
import { selectionSlice } from "@modules/selection/slice";
import { createWsMiddleware } from "@socket/WsMiddleware";
import { areaSplineSlice } from "@modules/area-spline/slice";

const connectionProxy = new WsConnectionProxy(
    import.meta.env["VITE_FINNHUB_API_URL"] + import.meta.env["VITE_FINNHUB_API_KEY"]
)

const connection = new Connection(connectionProxy);

function createStore() {
    const store = configureStore({
        reducer: {
            areaSpline: areaSplineSlice.reducer,
            selection: selectionSlice.reducer,
            subscriptions: subscriptionSlice.reducer
        },
        middleware: (getDefaultMiddleware) => 
            getDefaultMiddleware({
                thunk: {
                    extraArgument: { connection }
                }
            }).concat(createWsMiddleware(connection))
    });

    connection.onConnect(() => {
        store.dispatch(changeConnectionStatus(ConnectionStatus.Connected))
        console.log('Connected');
    });

    connection.onClose(() => {
        store.dispatch(changeConnectionStatus(ConnectionStatus.Disconnected))
        console.log('Disconnected – will auto-reconnect')
    });

    return store;
}

let storeInstance: ReturnType<typeof createStore> | null = null;

export const getStore = () => {
    if(!storeInstance) {
        storeInstance = createStore()
    }
    return storeInstance
};

export default getStore;

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
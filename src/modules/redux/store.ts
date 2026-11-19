import { configureStore } from "@reduxjs/toolkit";
import { Connection } from "@socket/Connection";
import { ConnectionStatus } from "@socket/types/ConnectionStatus";
import { WsConnectionProxy } from "@socket/WsConnectionProxy";
import { changeConnectionStatus, subscriptionSlice } from "@socket/slice";
import { selectionSlice } from "@modules/selection/slice";
import { createWsMiddleware } from "@socket/WsMiddleware";
import { liveDataSlice } from "@modules/liveData/slice";

const connectionProxy = new WsConnectionProxy(
    "wss://ws.finnhub.io?token=" + import.meta.env["VITE_FINNHUB_API_KEY"]
)

const connection = new Connection(connectionProxy);

function createStore() {
    const store = configureStore({
        reducer: {
            liveData: liveDataSlice.reducer,
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

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
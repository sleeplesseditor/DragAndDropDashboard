import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Connection } from '@socket/Connection';
import { ConnectionStatus } from '@socket/types/ConnectionStatus';
import type { RootState } from '@modules/redux/store';

const CHECK_CONNECTION_TIMEOUT_IN_MS = 100;
export const SUBSCRIPTION_TIMEOUT_IN_MS = 2000
export const DEFAULT_TIMEFRAME = "1m";

const waitForConnection = (getState: () => RootState): Promise<void> => {
    return new Promise((resolve) => {
        console.log('WAITING FOR CONNECTION')
        const checkConnection = () => {
            if(getState().subscriptions.wsConnectionStatus === ConnectionStatus.Connected) {
                resolve()
            } else {
                setTimeout(checkConnection, CHECK_CONNECTION_TIMEOUT_IN_MS)
            }
        }
        checkConnection();
    });
}

export const bootstrapApp = createAsyncThunk("app/bootstrap",
    async(_, {dispatch, getState, extra}) => {
        const { connection } = extra as { connection: Connection}
        connection.connect();
        await waitForConnection(getState as () => RootState);
        // const currencyPairs = await dispatch(refDataLoad()).unwrap();
        // dispatch(selectCurrencyPair({ currencyPair: currencyPairs[0] }));
        dispatch({ type: "selection/setStockSymbol", payload: { symbol: "AAPL" } });

        // currencyPairs.forEach((currencyPair: string) => {
        //     setTimeout(() => {
        //         dispatch(tickerSubscribeToSymbol({ symbol: currencyPair }));
        //         dispatch(candlesSubscribeToSymbol({ symbol: currencyPair, timeframe: DEFAULT_TIMEFRAME }));
        //     }, SUBSCRIPTION_TIMEOUT_IN_MS)
        // });

        // return currencyPairs[0]; 
        return
    }
)


export const appBootstrapSlice = createSlice({
    name: 'app/bootstrap',
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(bootstrapApp.fulfilled, (_state, _action) => {
            console.log('Bootstrap App successfully')
        })
    }
});

export const {} = appBootstrapSlice.actions;
export default appBootstrapSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Connection } from '@socket/Connection';
import { ConnectionStatus } from '@socket/types/ConnectionStatus';
import type { RootState } from '@modules/redux/store';
import { fetchQuote } from '@modules/selection/slice';

const CHECK_CONNECTION_TIMEOUT_IN_MS = 100;
export const SUBSCRIPTION_TIMEOUT_IN_MS = 2000
export const DEFAULT_TIMEFRAME = "1m";

const waitForConnection = (getState: () => RootState): Promise<void> => {
    return new Promise((resolve) => {
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
        const symbol = (getState() as RootState).selection.symbol;
        dispatch(fetchQuote({ symbol }));

        connection.send(JSON.stringify({
            type: "subscribe",
            symbol,
        }));

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
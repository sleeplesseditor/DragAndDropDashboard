import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ConnectionStatus } from "@socket/types/ConnectionStatus";
import { SubscriptionActionType } from "@socket/types/ActionTypes";
import { Connection } from "./Connection";
import RootState from "@modules/redux/store";

export type requestSubscribeToChannelAck = {
    channel: string
    event?: string
    key?: string
    prec?: string
    symbol?: string
}

export interface SubscriptionStatus {
    [channelId: number]: {
        channel: string
        isStale: boolean
        lastUpdate?: number
        request: requestSubscribeToChannelAck
    }
    wsConnectionStatus: ConnectionStatus
};

const initialState: SubscriptionStatus = {
    wsConnectionStatus: ConnectionStatus.Disconnected
};

const createSubscribeThunk = () => createAsyncThunk(
    "subscriptions/subscribeToChannel",
    async ({ channel, request }: { channel: string, request: requestSubscribeToChannelAck }, { extra }) => {
        const { connection } = extra as { connection: Connection }
        const msg = JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'});

        connection.send(msg)
        return msg

        
    // createAsyncThunk(actionType, async ({ symbol, timeframe, prec }: SubscribePayload, { extra }) => {
    //     const { connection } = extra as { connection: Connection }
    //     const msg: SubscribeMsg = {
    //         event: "subscribe",
    //         channel,
    //     }

    //     switch (channel) {
    //         case Channel.TICKER:
    //         case Channel.TRADES:
    //             msg.symbol = `t${symbol}`
    //             break
    //         case Channel.CANDLES:
    //             msg.key = `trade:${timeframe}:t${symbol}`
    //             break
    //         case Channel.BOOK:
    //             msg.prec = prec
    //             msg.symbol = `t${symbol}`
    //             break  
    //         default:
    //             console.warn("Unhandled channel:", channel)
    //     }

    //     connection.send(msg)
    //     return msg
});

// export const selectCurrencyPair = createAsyncThunk(
//     "selection/selectCurrencyPair",
//     async ({ currencyPair }: { currencyPair: string }, { dispatch, getState, rejectWithValue }) => {
//         try {
//             const state = getState() as RootState;
//             const previousPair = state.selection.currencyPair;

//             if (previousPair && previousPair !== currencyPair) {
//                 const unsubPromises = Object.entries(state.subscriptions).filter(([chanId]) => {
//                     const sub = state.subscriptions[Number(chanId)]
//                     return sub?.channel === Channel.TRADES || sub?.channel === Channel.BOOK
//                 })
//                 .map(async ([channelId]) => {
//                     try {
//                         return await dispatch(unsubscribeFromTradesAndBook(channelId)).unwrap();
//                     } catch (error) {
//                         console.warn(`Failed to unsubscribe from channel ${channelId}:`, error);
//                         return null;
//                     }
//                 })
//                 // Promise.allSettled waits for all operations to complete regardless of
//                 // individual failures, ensuring cleanup always happens.
//                 await Promise.allSettled(unsubPromises);
//             };

//             dispatch(selectionSlice.actions.setCurrencyPair({ currencyPair }))
//             return new Promise<void>((resolve) => {
//                 setTimeout(() => {
//                     dispatch(tradeSubscribeToSymbol({ symbol: currencyPair }));
//                     dispatch(bookSubscribeToSymbol({ symbol: currencyPair, prec: "R0" }));
//                     resolve()
//                 }, SUBSCRIPTION_TIMEOUT_IN_MS)
//             })
//         } catch (error) {
//             return rejectWithValue(error instanceof Error ? error.message : "Unknown error")
//         }
//     }
// )

export const testCall = createAsyncThunk(
    "subscriptions/testCall",
    async (_, { extra, getState }) => {
        const state = getState() as typeof RootState;

        console.log("Current state in testCall:", state);

        const { connection } = extra as { connection: Connection }
        const msg = JSON.stringify({'type':'subscribe', 'symbol': state?.selection?.symbol});

        connection.send(msg)
        return msg
    }
);

export const subscriptionSlice = createSlice({
    name: "subscriptions",
    initialState,
    reducers: {
        changeConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
            state.wsConnectionStatus = action.payload
        },
        subscribeToChannelAcknowledge: (state, 
            action: PayloadAction<{
                channelId: number
                channel: any
                request: requestSubscribeToChannelAck
            }>
        ) => {
            const { channelId, channel, request } = action.payload;
            state[channelId] = { channel, request, isStale: false };
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(tickerSubscribeToSymbol.fulfilled, (_state, action) => {
    //             console.log(`Subscribed to ticker ${JSON.stringify(action.payload)}`)
    //         })
    //         .addCase(candlesSubscribeToSymbol.fulfilled, (_state, action) => {
    //             console.log(`Subscribed to candle ${JSON.stringify(action.payload)}`)
    //         })
    //         .addCase(tradeSubscribeToSymbol.fulfilled, (_state, action) => {
    //             console.log(`Subscribed to trade ${JSON.stringify(action.payload)}`)
    //         })
    //         .addCase(bookSubscribeToSymbol.fulfilled, (_state, action) => {
    //             console.log(`Subscribed to book ${JSON.stringify(action.payload)}`)
    //         })
    // }
})

export const { changeConnectionStatus, subscribeToChannelAcknowledge } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ConnectionStatus } from "@socket/types/ConnectionStatus";
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

export const testCall = createAsyncThunk(
    "subscriptions/testCall",
    async (_, { extra, getState }) => {
        const state = getState() as any;

        console.log("Current state in testCall:", state);

        const { connection } = extra as { connection: Connection }
        const msg = JSON.stringify({'type':'subscribe', 'symbol': state.selection?.symbol});

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
})

export const { changeConnectionStatus, subscribeToChannelAcknowledge } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
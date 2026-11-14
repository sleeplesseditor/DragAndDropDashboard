import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@modules/redux/store";
import type { Connection } from "@socket/Connection";
import forexSymbols from "@helpers/forexSymbols.json";
import usStockSymbols from "@helpers/stockSymbols.json";

export type Exchange = "US Stocks" | "Forex";

interface StockSymbolState {
  exchange: Exchange;
  symbol: string
}

const initialState: StockSymbolState = {
    exchange: "US Stocks",
    symbol: usStockSymbols[0].value,
};

export const selectStockSymbol = createAsyncThunk(
    "selection/selectStockSymbol",
    async ({ symbol }: { symbol: string }, { dispatch, getState, extra }) => {
        const previousSymbol = (getState() as RootState).selection.symbol;
        if (previousSymbol === symbol) return;

        const { connection } = extra as { connection: Connection };
        if (previousSymbol) {
            connection.send(JSON.stringify({
                type: "unsubscribe",
                symbol: previousSymbol,
            }));
        }

        dispatch(selectionSlice.actions.setStockSymbol({ symbol }));
        connection.send(JSON.stringify({
            type: "subscribe",
            symbol,
        }));
    }
)

export const selectExchange = createAsyncThunk(
    "selection/selectExchange",
    async ({ exchange }: { exchange: Exchange }, { dispatch, getState }) => {
        const state = getState() as RootState;
        if (state.selection.exchange === exchange) return;

        const options = exchange === "US Stocks" ? usStockSymbols : forexSymbols;
        const nextSymbol = options[0]?.value;
        if (!nextSymbol) {
            throw new Error(`No symbols configured for ${exchange}`);
        }

        dispatch(selectionSlice.actions.setExchange({ exchange }));
        await dispatch(selectStockSymbol({ symbol: nextSymbol })).unwrap();
    }
)

export const selectionSlice = createSlice({
    name: "selection",
    initialState,
    reducers: {
        setStockSymbol: (state, action: PayloadAction<{ symbol: string }>) => {
            const { symbol } = action.payload
            state.symbol = symbol;
        },
        setExchange: (state, action: PayloadAction<{ exchange: string }>) => {
            const { exchange } = action.payload
            state.exchange = exchange;
        }
    },
})

export default selectionSlice.reducer;
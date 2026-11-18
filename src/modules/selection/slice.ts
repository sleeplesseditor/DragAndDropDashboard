import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@modules/redux/store";
import type { Connection } from "@socket/Connection";
import forexSymbols from "@helpers/forexSymbols.json";
import usStockSymbols from "@helpers/stockSymbols.json";

export type Exchange = "US Stocks" | "Forex" | string;

export type Quote = {
    change: number | undefined,
    currentPrice: number | undefined,
    highPrice: number | undefined,
    lowPrice: number | undefined,
    openingPrice: number | undefined,
    percentChange: number | undefined,
    previousClosePrice: number | undefined
}

interface StockSymbolState {
  exchange: Exchange;
  quote: Quote;
  symbol: string
}

const initialState: StockSymbolState = {
    exchange: "US Stocks",
    quote: {
        change: undefined,
        currentPrice: undefined,
        highPrice: undefined,
        lowPrice: undefined,
        openingPrice: undefined,
        percentChange: undefined,
        previousClosePrice: undefined
    },
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

        // Used for testing – change back to symbol when done
        dispatch(selectionSlice.actions.setStockSymbol({ symbol: "BINANCE:BTCUSDT" }));
        connection.send(JSON.stringify({
            type: "subscribe",
            symbol: "BINANCE:BTCUSDT",
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

export const fetchQuote = createAsyncThunk(
    "selection/fetchQuote",
    async ({ symbol }: { symbol: string }, { dispatch, getState }) => {
        // const previousSymbol = (getState() as RootState).selection.symbol;
        // if (previousSymbol === symbol) return;

        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${import.meta.env["VITE_FINNHUB_API_KEY"]}`);

        const quoteData = await res.json();

        const formattedQuoteData = {
            currentPrice: quoteData.c,
            openingPrice: quoteData.o,
            highPrice: quoteData.h,
            lowPrice: quoteData.l,
            previousClosePrice: quoteData.pc,
            change: quoteData.d,
            percentChange: quoteData.dp,
        };


        await dispatch(selectionSlice.actions.setQuote({ quote: formattedQuoteData }));
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
        },
        setQuote: (state, action: PayloadAction<{ quote: Quote}>) => {
            const { quote } = action.payload;
            state.quote = quote;
        },
        updateCurrentPrice: (
            state,
            action: PayloadAction<{ symbol: string; currentPrice: number }>
        ) => {
            const { symbol, currentPrice } = action.payload;
            if (state.symbol !== symbol) return;

            state.quote.currentPrice = currentPrice;
        }
    },
})

export default selectionSlice.reducer;
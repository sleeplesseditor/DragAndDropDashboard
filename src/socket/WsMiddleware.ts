import type { Middleware } from "@reduxjs/toolkit";
import { Connection } from "@socket/Connection";
import {handleUpdateAreaSplineData} from "@modules/area-spline/handlers";

export const createWsMiddleware = (connection: Connection): Middleware => {
    return (store) => {
        connection.onReceive((data) => {
            const parsedData = JSON.parse(data)

            console.log('Received data from WebSocket:', parsedData, store)
            
            if(parsedData === "subscribed") {
                console.log('Subscription acknowledged', parsedData, store)
                // handleSubscriptionAcknowledge(parsedData, store);
                return;
            }

            if (parsedData?.type === "trade" && Array.isArray(parsedData.data)) {
                handleUpdateAreaSplineData(parsedData.data, store.dispatch)
            }
        })

        return (next) => (action) => next(action)
    }
}
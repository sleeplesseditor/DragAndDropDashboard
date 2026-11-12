import type { Middleware } from "@reduxjs/toolkit"
import { Connection } from "@socket/Connection";

export const createWsMiddleware = (connection: Connection): Middleware => {
    return (store) => {
        connection.onReceive((data) => {
            const parsedData = JSON.parse(data)
            
            if(parsedData === "subscribed") {
                console.log('Subscription acknowledged', parsedData, store)
                // handleSubscriptionAcknowledge(parsedData, store);
            }

            if (Array.isArray(parsedData)) {
                const [channelId] = parsedData
                const subscriptions = store.getState().subscriptions
                const subscription = store.getState().subscriptions[channelId]
                console.log(subscriptions)
                console.log("/***********************/")
                console.log(subscription)
            }
        })

        return (next) => (action) => next(action)
    }
}
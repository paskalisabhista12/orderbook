import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { getStompClient } from "./stompClient";

export function useStompClient() {
    const [client, setClient] = useState<Client | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const stompClient = getStompClient();

        // Keep existing handlers (don’t overwrite others!)
        const prevOnConnect = stompClient.onConnect;
        stompClient.onConnect = (frame) => {
            setConnected(true);
            if (prevOnConnect) prevOnConnect(frame);
        };

        const prevOnDisconnect = stompClient.onDisconnect;
        stompClient.onDisconnect = (frame) => {
            setConnected(false);
            if (prevOnDisconnect) prevOnDisconnect(frame);
        };

        if (!stompClient.active) {
            stompClient.activate();
        }

        setClient(stompClient);

        return () => {
            setConnected(false);
        };
    }, []);

    return { client, connected };
}

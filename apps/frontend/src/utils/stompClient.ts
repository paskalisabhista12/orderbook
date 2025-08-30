import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient: Client | null = null;

export function getStompClient() {
    if (!stompClient) {
        const socket = new SockJS("http://localhost:8080/ws");
        stompClient = new Client({
            webSocketFactory: () => socket as unknown as WebSocket,
            reconnectDelay: 5000,
        });
        stompClient.activate();
    }
    return stompClient;
}

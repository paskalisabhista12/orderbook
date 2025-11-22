package com.orderbook.backend.factory;

import com.orderbook.backend.service.OrderBookService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderBookFactory {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    public OrderBookFactory(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    
    public OrderBookService create(String ticker, int prevPrice) {
        return new OrderBookService(ticker, prevPrice, messagingTemplate);
    }
}

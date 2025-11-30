package com.orderbook.backend.factory;

import com.orderbook.backend.service.OrderBookService;
import com.orderbook.backend.service.TradeHistoryService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderBookFactory {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final TradeHistoryService tradeHistoryService;
    
    public OrderBookFactory(SimpMessagingTemplate messagingTemplate,
            TradeHistoryService tradeHistoryService) {
        this.messagingTemplate = messagingTemplate;
        this.tradeHistoryService = tradeHistoryService;
    }
    
    public OrderBookService create(String ticker, int prevPrice) {
        return new OrderBookService(
                ticker,
                prevPrice,
                messagingTemplate,
                tradeHistoryService
        );
    }
}

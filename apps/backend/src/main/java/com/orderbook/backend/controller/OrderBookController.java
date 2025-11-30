package com.orderbook.backend.controller;

import com.orderbook.backend.config.registry.OrderBookRegistry;
import com.orderbook.backend.dto.OrderBookResponse;
import com.orderbook.backend.model.TradeEvent;
import com.orderbook.backend.service.OrderBookService;
import com.orderbook.backend.service.TradeHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
public class OrderBookController {
    
    private final OrderBookRegistry orderBookRegistry;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private TradeHistoryService tradeHistoryService;
    
    public OrderBookController(OrderBookRegistry orderBookRegistry) {
        this.orderBookRegistry = orderBookRegistry;
    }
    
    /**
     * WebSocket: request snapshot for a specific ticker
     */
    @MessageMapping("/snapshot")
    public void snapshot(String ticker) {
        
        OrderBookService book = orderBookRegistry.get(ticker);
        if (book == null) {
            throw new RuntimeException("Ticker not found: " + ticker);
        }
        
        OrderBookResponse snapshot = book.getSnapshot();
        
        // Send to: /topic/orderbook/{ticker}
        messagingTemplate.convertAndSend("/topic/orderbook/" + ticker,
                snapshot);
    }
    
    
    /**
     * WebSocket: get recent trades of a specific ticker
     */
    @MessageMapping("/recent-trades")
    @SendTo("/topic/trades/snapshot")
    public List<TradeEvent> getRecentTrades() {
        return new ArrayList<>(tradeHistoryService.getTradeHistory());
    }
}

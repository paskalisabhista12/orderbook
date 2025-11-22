package com.orderbook.backend.controller;

import com.orderbook.backend.config.registry.OrderBookRegistry;
import com.orderbook.backend.dto.OrderBookResponse;
import com.orderbook.backend.model.TradeEvent;
import com.orderbook.backend.service.OrderBookService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class OrderBookController {
    
    private final OrderBookRegistry orderBookRegistry;
    
    public OrderBookController(OrderBookRegistry orderBookRegistry) {
        this.orderBookRegistry = orderBookRegistry;
    }
    
    /**
     * WebSocket: request snapshot for a specific ticker
     */
    @MessageMapping("/snapshot")
    @SendTo("/topic/orderbook")
    public OrderBookResponse snapshot(String ticker) {
        
        OrderBookService book = orderBookRegistry.get(ticker);
        if (book == null) {
            throw new RuntimeException("Ticker not found: " + ticker);
        }
        
        return book.getSnapshot();
    }
    
    /**
     * WebSocket: get recent trades of a specific ticker
     */
    @MessageMapping("/recent-trades")
    @SendTo("/topic/trades/snapshot")
    public List<TradeEvent> getRecentTrades(String ticker) {
        
        OrderBookService book = orderBookRegistry.get(ticker);
        if (book == null) {
            throw new RuntimeException("Ticker not found: " + ticker);
        }
        
        return book.getRecentTrades();
    }
}

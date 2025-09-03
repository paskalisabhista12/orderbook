package com.orderbook.backend.controller;

import com.orderbook.backend.dto.OrderBookResponse;
import com.orderbook.backend.model.TradeEvent;
import com.orderbook.backend.service.OrderBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class OrderBookController {
    
    @Autowired
    private final SimpMessagingTemplate messagingTemplate;
    private final OrderBookService orderBookService;
    
    
    public OrderBookController(SimpMessagingTemplate messagingTemplate, OrderBookService orderBookService) {
        this.messagingTemplate = messagingTemplate;
        this.orderBookService = orderBookService;
    }
    
    @MessageMapping("/snapshot")
    @SendTo("/topic/orderbook")
    public OrderBookResponse snapshot() {
        return orderBookService.getSnapshot();
    }
    
    @MessageMapping("/recent-trades")
    @SendTo("/topic/trades/snapshot")
    public List<TradeEvent> getRecentTrades() {
        return orderBookService.getRecentTrades();
    }
}


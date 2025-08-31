package com.orderbook.backend.controller;

import com.orderbook.backend.dto.OrderBookResponse;
import com.orderbook.backend.model.Order;
import com.orderbook.backend.service.OrderBookService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class OrderBookController {
    
    private final OrderBookService orderBookService;
    
    public OrderBookController(OrderBookService orderBookService) {
        this.orderBookService = orderBookService;
    }
    
    @MessageMapping("/snapshot")
    @SendTo("/topic/orderbook")
    public OrderBookResponse snapshot() {
        return orderBookService.getSnapshot();
    }
}


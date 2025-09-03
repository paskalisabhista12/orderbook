package com.orderbook.backend.controller;

import com.orderbook.backend.dto.OrderBookResponse;
import com.orderbook.backend.model.Order;
import com.orderbook.backend.service.OrderBookService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderBookService orderBookService;
    private final SimpMessagingTemplate messagingTemplate;
    
    public OrderController(OrderBookService orderBookService, SimpMessagingTemplate messagingTemplate) {
        this.orderBookService = orderBookService;
        this.messagingTemplate = messagingTemplate;
    }
    
    @PostMapping
    public ResponseEntity<OrderBookResponse> createOrder(@RequestBody Order order) {
        // Add order to order book
        orderBookService.addOrder(order);
        
        // Prepare snapshot for response
        OrderBookResponse snapshot = orderBookService.getSnapshot();
        
        // ✅ After sending response, notify WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/orderbook", snapshot);
        
        // Return HTTP response
        return ResponseEntity.ok(snapshot);
    }
    
    @PostMapping("/random-generate")
    public ResponseEntity<OrderBookResponse> generateRandomOrderBook() {
        OrderBookResponse snapshot = orderBookService.fillRandomOrderBook(5);
        // ✅ notify websocket subscribers too
        messagingTemplate.convertAndSend("/topic/orderbook", snapshot);
        
        return ResponseEntity.ok(snapshot);
    }
}


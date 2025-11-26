package com.orderbook.backend.controller;

import com.orderbook.backend.config.registry.OrderBookRegistry;
import com.orderbook.backend.dto.OrderBookResponse;
import com.orderbook.backend.model.Order;
import com.orderbook.backend.service.OrderBookService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final OrderBookRegistry orderBookRegistry;
    
    public OrderController(SimpMessagingTemplate messagingTemplate, OrderBookRegistry orderBookRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.orderBookRegistry = orderBookRegistry;
    }
    
    @PostMapping
    public ResponseEntity<OrderBookResponse> createOrder(@RequestParam String ticker, @RequestBody Order order) {
        
        OrderBookService orderBookService = orderBookRegistry.get(ticker);
        
        orderBookService.addOrder(order);
        OrderBookResponse snapshot = orderBookService.getSnapshot();
        
        messagingTemplate.convertAndSend("/topic/orderbook/" + ticker,
                snapshot);
        
        return ResponseEntity.ok(snapshot);
    }
    
    @PostMapping("/random-generate")
    public ResponseEntity<OrderBookResponse> randomGenerate(@RequestParam String ticker) {
        
        String tickr = ticker.toUpperCase();
        
        OrderBookService orderBookService = orderBookRegistry.get(tickr);
        
        OrderBookResponse snapshot = orderBookService.fillRandomOrderBook(5);
        
        messagingTemplate.convertAndSend("/topic/orderbook/" + tickr,
                snapshot);
        
        return ResponseEntity.ok(snapshot);
    }
}

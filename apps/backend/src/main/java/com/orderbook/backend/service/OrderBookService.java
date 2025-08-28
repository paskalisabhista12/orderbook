package com.orderbook.backend.service;
import com.orderbook.backend.model.Order;
import com.orderbook.backend.model.OrderBookSnapshot;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.PriorityQueue;

@Service
@Getter
public class OrderBookService {
    
    private final PriorityQueue<Order> buyOrders = new PriorityQueue<>(
            (o1, o2) -> Double.compare(o2.getPrice(), o1.getPrice()));
    
    private final PriorityQueue<Order> sellOrders = new PriorityQueue<>(Comparator.comparingDouble(Order::getPrice));
    
    public synchronized void addOrder(Order order) {
        if (order.getSide() == Order.Side.BUY) {
            buyOrders.offer(order);
        } else {
            sellOrders.offer(order);
        }
        matchOrders();
    }
    
    private void matchOrders() {
        while (!buyOrders.isEmpty() && !sellOrders.isEmpty()) {
            Order bestBuy = buyOrders.peek();
            Order bestSell = sellOrders.peek();
            
            if (bestBuy.getPrice() >= bestSell.getPrice()) {
                int tradedQty = Math.min(bestBuy.getLot(), bestSell.getLot());
                System.out.printf("Trade executed: %d @ %d", tradedQty, bestSell.getPrice());
                
                buyOrders.poll();
                sellOrders.poll();
            } else {
                break;
            }
        }
    }
    
    public OrderBookSnapshot getSnapshot() {
        return new OrderBookSnapshot(
                new ArrayList<>(buyOrders),
                new ArrayList<>(sellOrders)
        );
    }
}

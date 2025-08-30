package com.orderbook.backend.service;
import com.orderbook.backend.dto.OrderBookResponse;
import com.orderbook.backend.model.Order;
import com.orderbook.backend.model.OrderBookSnapshot;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Getter
public class OrderBookService {
    
    private final PriorityQueue<Order> buyOrders = new PriorityQueue<>(
            (o1, o2) -> {
                int cmp = Double.compare(o2.getPrice(), o1.getPrice());
                if (cmp == 0) {
                    return Long.compare(o1.getTimestamp(), o2.getTimestamp());
                }
                return cmp;
            }
    );
    
    private final PriorityQueue<Order> sellOrders = new PriorityQueue<>(
            (o1, o2) -> {
                int cmp = Double.compare(o1.getPrice(), o2.getPrice());
                if (cmp == 0) {
                    return Long.compare(o1.getTimestamp(), o2.getTimestamp());
                }
                return cmp;
            }
    );
    
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
            
            // No match possible
            if (bestBuy.getPrice() < bestSell.getPrice()) {
                break;
            }
            
            // Match found
            int tradedQty = Math.min(bestBuy.getLot(), bestSell.getLot());
            double tradePrice = bestSell.getPrice(); // Usually last trade price = taker's price or ask price
            
            System.out.printf("Trade executed: %d @ %.2f%n", tradedQty, tradePrice);
            
            // Update quantities
            bestBuy.setLot(bestBuy.getLot() - tradedQty);
            bestSell.setLot(bestSell.getLot() - tradedQty);
            
            // Remove orders that are fully filled
            if (bestBuy.getLot() == 0) {
                buyOrders.poll();
            }
            if (bestSell.getLot() == 0) {
                sellOrders.poll();
            }
        }
    }
    
    /**
     * Returns aggregated snapshot for buy side
     */
    public List<OrderBookSnapshot> getBidSnapshot() {
        return aggregateOrders(buyOrders, true);
    }
    
    /**
     * Returns aggregated snapshot for sell side
     */
    public List<OrderBookSnapshot> getAskSnapshot() {
        return aggregateOrders(sellOrders, false);
    }
    
    private List<OrderBookSnapshot> aggregateOrders(PriorityQueue<Order> queue, boolean isBid) {
        Map<Double, Integer> aggregation = new HashMap<>();
        
        for (Order order : queue) {
            aggregation.merge(order.getPrice(), order.getLot(), Integer::sum);
        }
        
        return aggregation.entrySet().stream()
                .map(e -> new OrderBookSnapshot(e.getKey(), e.getValue()))
                .sorted((s1, s2) -> {
                    if (isBid) {
                        return Double.compare(s2.getPrice(), s1.getPrice()); // highest first
                    } else {
                        return Double.compare(s1.getPrice(), s2.getPrice()); // lowest first
                    }
                })
                .toList();
    }
    
    public OrderBookResponse getSnapshot() {
        List<OrderBookSnapshot> bids = getBidSnapshot();
        List<OrderBookSnapshot> asks = getAskSnapshot();
        return new OrderBookResponse(bids, asks);
    }
    
}

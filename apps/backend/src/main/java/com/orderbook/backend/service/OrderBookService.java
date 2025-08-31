package com.orderbook.backend.service;

import com.orderbook.backend.dto.OrderBookResponse;
import com.orderbook.backend.model.Order;
import com.orderbook.backend.model.OrderBookSnapshot;
import com.orderbook.backend.utils.IDXPriceValidator;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

@Service
@Getter
public class OrderBookService {
    
    private final PriorityQueue<Order> buyOrders = new PriorityQueue<>((o1, o2) -> {
        int cmp = Double.compare(o2.getPrice(),
                o1.getPrice());
        if (cmp == 0) {
            return Long.compare(o1.getTimestamp(),
                    o2.getTimestamp());
        }
        return cmp;
    });
    
    private final PriorityQueue<Order> sellOrders = new PriorityQueue<>((o1, o2) -> {
        int cmp = Double.compare(o1.getPrice(),
                o2.getPrice());
        if (cmp == 0) {
            return Long.compare(o1.getTimestamp(),
                    o2.getTimestamp());
        }
        return cmp;
    });
    
    private final String ticker = "BMRI";
    
    // Market stats
    private final int prev = 4730; // assume yesterday’s close (in real app, load from DB)
    private int open = prev;
    private int high = open;
    private int low = open;
    private int lastPrice = open;
    
    private long totalLot = 0;   // accumulated traded volume
    private long totalValue = 0; // accumulated traded value
    private long totalFreq = 0;  // number of trades
    
    public synchronized void addOrder(Order order) {
        int referencePrice;
        referencePrice = this.prev;
        
        // Validate order price before adding
        if (!IDXPriceValidator.isValidPrice(order.getPrice(),
                referencePrice)) {
            throw new IllegalArgumentException("Invalid order price: " + order.getPrice() +
                    ". Must follow IDX tick size and within daily price limits.");
        }
        
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
            
            // no crossing -> stop
            if (bestBuy.getPrice() < bestSell.getPrice()) {
                break;
            }
            
            int tradedQty = Math.min(bestBuy.getLot(),
                    bestSell.getLot());
            
            // Use resting order’s price
            int tradePrice;
            if (bestBuy.getTimestamp() < bestSell.getTimestamp()) {
                tradePrice = bestBuy.getPrice();
            } else {
                tradePrice = bestSell.getPrice();
            }
            
            // Update OHLC
            if (totalFreq == 0) { // first trade
                this.open = tradePrice;
                this.high = tradePrice;
                this.low = tradePrice;
            }
            this.lastPrice = tradePrice;
            if (tradePrice > this.high)
                this.high = tradePrice;
            if (tradePrice < this.low)
                this.low = tradePrice;
            
            // Market stats
            this.totalLot += tradedQty;
            this.totalValue += (long) tradedQty * tradePrice * 100;
            this.totalFreq++;
            
            // Adjust orders
            bestBuy.setLot(bestBuy.getLot() - tradedQty);
            bestSell.setLot(bestSell.getLot() - tradedQty);
            
            if (bestBuy.getLot() == 0)
                buyOrders.poll();
            if (bestSell.getLot() == 0)
                sellOrders.poll();
        }
    }
    
    
    /**
     * Returns aggregated snapshot for buy side
     */
    public List<OrderBookSnapshot> getBidSnapshot() {
        return aggregateOrders(buyOrders,
                true);
    }
    
    /**
     * Returns aggregated snapshot for sell side
     */
    public List<OrderBookSnapshot> getAskSnapshot() {
        return aggregateOrders(sellOrders,
                false);
    }
    
    private List<OrderBookSnapshot> aggregateOrders(PriorityQueue<Order> queue, boolean isBid) {
        // price -> [totalLot, freq]
        Map<Integer, int[]> aggregation = new HashMap<>();
        
        for (Order order : queue) {
            aggregation.compute(order.getPrice(),
                    (price, arr) -> {
                        if (arr == null) {
                            return new int[]{order.getLot(), 1}; // lot, freq
                        } else {
                            arr[0] += order.getLot();
                            arr[1] += 1;
                            return arr;
                        }
                    });
        }
        
        return aggregation.entrySet()
                .stream()
                .map(e -> new OrderBookSnapshot(e.getKey(),
                        e.getValue()[0],
                        e.getValue()[1]))
                .sorted((s1, s2) -> {
                    if (isBid) {
                        return Double.compare(s2.getPrice(),
                                s1.getPrice());
                    } else {
                        return Double.compare(s1.getPrice(),
                                s2.getPrice());
                    }
                })
                .toList();
    }
    
    public OrderBookResponse getSnapshot() {
        List<OrderBookSnapshot> bids = getBidSnapshot();
        List<OrderBookSnapshot> asks = getAskSnapshot();
        
        int change = this.lastPrice - this.prev;
        double percent = (this.prev != 0) ? (change * 100.0 / this.prev) : 0.0;
        
        return new OrderBookResponse(this.prev,
                change,
                percent,
                this.open,
                this.high,
                this.low,
                this.lastPrice,
                formatLot(this.totalLot),
                formatValue(this.totalValue),
                formatFreq(this.totalFreq),
                bids,
                asks);
    }
    
    // Helpers for formatting
    private String formatLot(long lot) {
        if (lot >= 1_000_000)
            return String.format("%.2f M",
                    lot / 1_000_000.0);
        if (lot >= 1_000)
            return String.format("%.2f K",
                    lot / 1_000.0);
        return String.valueOf(lot);
    }
    
    private String formatValue(long value) {
        if (value >= 1_000_000_000)
            return String.format("%.2f B",
                    value / 1_000_000_000.0);
        if (value >= 1_000_000)
            return String.format("%.2f M",
                    value / 1_000_000.0);
        if (value >= 1_000)
            return String.format("%.2f K",
                    value / 1_000.0);
        return String.valueOf(value);
    }
    
    private String formatFreq(long freq) {
        if (freq >= 1_000)
            return String.format("%.2f K",
                    freq / 1_000.0);
        return String.valueOf(freq);
    }
}

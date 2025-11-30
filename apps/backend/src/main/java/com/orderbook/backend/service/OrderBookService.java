package com.orderbook.backend.service;

import com.orderbook.backend.dto.OrderBookResponse;
import com.orderbook.backend.model.Order;
import com.orderbook.backend.model.OrderBookSnapshot;
import com.orderbook.backend.model.Side;
import com.orderbook.backend.model.TradeEvent;
import com.orderbook.backend.utils.IDXPriceValidator;
import lombok.Getter;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.*;

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
    private final SimpMessagingTemplate messagingTemplate;
    private final TradeHistoryService tradeHistoryService;
    private String ticker;
    // Market stats
    private int prev; // assume yesterday’s close (in real app, load from DB)
    private int open;
    private int high;
    private int low;
    private int lastPrice;
    private long totalLot = 0;   // accumulated traded volume
    private long totalValue = 0; // accumulated traded value
    private long totalFreq = 0;  // number of trades
    
    public OrderBookService(String ticker, int prev, SimpMessagingTemplate template,
            TradeHistoryService tradeHistoryService) {
        this.ticker = ticker;
        this.prev = prev;
        this.open = prev;
        this.high = prev;
        this.low = prev;
        this.lastPrice = prev;
        this.messagingTemplate = template;
        this.tradeHistoryService = tradeHistoryService;
    }
    
    
    public synchronized void addOrder(Order order) {
        int referencePrice;
        referencePrice = this.prev;
        
        // Validate order price before adding
        if (!IDXPriceValidator.isValidPrice(order.getPrice(),
                referencePrice)) {
            throw new IllegalArgumentException("Invalid order price: " + order.getPrice() +
                    ". Must follow IDX tick size and within daily price limits.");
        }
        
        if (order.getSide() == Side.BUY) {
            buyOrders.offer(order);
        } else {
            sellOrders.offer(order);
        }
        
        matchOrders(order.getSide());
    }
    
    
    private void matchOrders(Side side) {
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
            this.lastPrice = tradePrice;
            
            executeTrade(side,
                    tradedQty,
                    tradePrice);
            
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
    
    public OrderBookResponse fillRandomOrderBook(int depth) {
        Random random = new Random();
        int lastPrice = this.lastPrice;
        int tick = getTickSize(lastPrice);
        
        // Generate bids (below lastPrice)
        for (int i = depth; i > 0; i--) {
            int price = lastPrice - i * tick;
            if (price > 0) {
                Order bid = new Order();
                bid.setSide(Side.valueOf("BUY"));
                bid.setPrice(price);
                bid.setLot(random.nextInt(50) + 1); // 1–50 lots
                buyOrders.offer(bid);
            }
        }
        
        // Generate asks (above lastPrice)
        for (int i = 1; i <= depth; i++) {
            int price = lastPrice + i * tick;
            Order ask = new Order();
            ask.setSide(Side.valueOf("SELL"));
            ask.setPrice(price);
            ask.setLot(random.nextInt(50) + 1);
            sellOrders.offer(ask);
        }
        
        return this.getSnapshot();
    }
    
    
    public OrderBookResponse getSnapshot() {
        List<OrderBookSnapshot> bids = getBidSnapshot();
        List<OrderBookSnapshot> asks = getAskSnapshot();
        
        int change = this.lastPrice - this.prev;
        double percent = (this.prev != 0) ? (change * 100.0 / this.prev) : 0.0;
        
        return new OrderBookResponse(this.ticker,
                this.prev,
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
    
    private int getTickSize(int price) {
        if (price < 200)
            return 1;
        if (price < 500)
            return 2;
        if (price < 2000)
            return 5;
        if (price < 5000)
            return 10;
        if (price < 10000)
            return 25;
        return 50;
    }
    
    private void executeTrade(Side side, int tradedLot, int tradedPrice) {
        int change = this.lastPrice - this.prev;
        double percent = (this.prev != 0) ? (change * 100.0 / this.prev) : 0.0;
        
        // Create TradeEvent
        TradeEvent tradeEvent = new TradeEvent(tradedPrice,
                tradedLot,
                side,
                System.currentTimeMillis(),
                this.ticker,
                change,
                percent);
        
        System.out.println(tradeEvent.toString());
        // Save trade to history
        tradeHistoryService.pushTradeEvent(tradeEvent);
        System.out.println("XXXXXXXXXXXXXXXXXX");
        
        // Send to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/trades",
                tradeEvent);
    }
    
    public List<TradeEvent> getRecentTrades() {
        return new ArrayList<>(tradeHistoryService.getTradeHistory());
    }
    
    
}

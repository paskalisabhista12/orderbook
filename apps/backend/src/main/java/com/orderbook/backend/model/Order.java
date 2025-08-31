package com.orderbook.backend.model;

import lombok.Data;

@Data
public class Order {
    private int price;
    private int lot;
    private Side side;
    private long timestamp; // for FIFO
    
    public Order(int price, int lot, Side side) {
        this.price = price;
        this.lot = lot;
        this.side = side;
        this.timestamp = System.nanoTime(); // high-resolution time for ordering
    }
    
    public enum Side {BUY, SELL}
}

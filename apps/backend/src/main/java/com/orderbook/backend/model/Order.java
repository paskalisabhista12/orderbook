package com.orderbook.backend.model;

import lombok.Data;

@Data
public class Order {
    private double price;
    private int lot;
    private Side side;
    private long timestamp; // for FIFO
    
    public enum Side { BUY, SELL }
    
    public Order(double price, int lot, Side side) {
        this.price = price;
        this.lot = lot;
        this.side = side;
        this.timestamp = System.nanoTime(); // high-resolution time for ordering
    }
}

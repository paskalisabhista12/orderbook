package com.orderbook.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderBookSnapshot {
    private double price;
    private int totalLot;
    private int freq; // number of orders at this price
}


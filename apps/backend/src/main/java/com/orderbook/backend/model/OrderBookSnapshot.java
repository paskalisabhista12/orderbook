package com.orderbook.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderBookSnapshot {
    private double price;
    private int totalLot;
}

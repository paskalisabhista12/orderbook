package com.orderbook.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradeEvent {
    private int price;
    private int lot;
    private Side side;git
    private long timestamp;
    private String ticker;
    private int change;
    private double percent;
}
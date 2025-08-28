package com.orderbook.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    public enum Side { BUY, SELL }
    
    private Side side;
    private int price;
    private int lot;
}

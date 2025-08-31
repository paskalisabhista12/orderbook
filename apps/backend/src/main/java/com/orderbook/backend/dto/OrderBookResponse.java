package com.orderbook.backend.dto;

import com.orderbook.backend.model.OrderBookSnapshot;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class OrderBookResponse {
    private String ticker;
    private int prev;       // previous close price
    private int change;     // price change (lastPrice - prev)
    private double percent; // percentage change
    private int open;
    private int high;
    private int low;
    private int lastPrice;
    
    private String lot;       // total lots traded
    private String value;   // total value traded (in B, adjust type if needed)
    private String freq;      // total trade frequency
    
    private List<OrderBookSnapshot> bids;
    private List<OrderBookSnapshot> asks;
}

package com.orderbook.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class OrderBookSnapshot {
    private List<Order> bids;
    private List<Order> asks;
}

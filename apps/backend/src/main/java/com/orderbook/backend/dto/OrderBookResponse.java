package com.orderbook.backend.dto;

import com.orderbook.backend.model.OrderBookSnapshot;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class OrderBookResponse {
    private List<OrderBookSnapshot> bids;
    private List<OrderBookSnapshot> asks;
}


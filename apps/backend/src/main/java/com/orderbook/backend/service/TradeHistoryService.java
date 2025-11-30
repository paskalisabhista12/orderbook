package com.orderbook.backend.service;

import com.orderbook.backend.model.TradeEvent;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.Deque;
import java.util.LinkedList;

@Service
public class TradeHistoryService {
    
    private static final int MAX_TRADES = 100;
    private final Deque<TradeEvent> tradeHistory = new LinkedList<>();
    
    public synchronized void pushTradeEvent(TradeEvent tradeEvent){
        tradeHistory.addFirst(tradeEvent); // newest first
        if (tradeHistory.size() > MAX_TRADES) {
            tradeHistory.removeLast(); // remove oldest
        }
    }
    
    public synchronized Deque<TradeEvent> getTradeHistory() {
        return new LinkedList<>(tradeHistory);
    }
}

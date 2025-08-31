package com.orderbook.backend.utils;

public class IDXPriceValidator {
    
    /**
     * Check if an order price is valid according to IDX rules
     *
     * @param orderPrice   price submitted by client
     * @param reference    reference price (usually previous closing price or opening reference)
     * @return true if valid, false otherwise
     */
    public static boolean isValidPrice(int orderPrice, int reference) {
        if (orderPrice <= 0 || reference <= 0) return false;
        
        int tickSize = getTickSize(orderPrice);
        if ((orderPrice % tickSize) != 0) {
            return false; // not aligned with tick size
        }
        
        int[] limits = getPriceLimits(reference);
        int lowerLimit = limits[0];
        int upperLimit = limits[1];
        
        return orderPrice >= lowerLimit && orderPrice <= upperLimit;
    }
    
    /**
     * Get tick size based on price
     */
    private static int getTickSize(int price) {
        if (price < 200) return 1;
        if (price < 500) return 2;
        if (price < 2000) return 5;
        if (price < 5000) return 10;
        return 25;
    }
    
    /**
     * Get daily price limits (ARA/ARB) based on reference price
     *
     * @param reference previous close price
     * @return int[]{lowerLimit, upperLimit}
     */
    private static int[] getPriceLimits(int reference) {
        double percentage;
        
        if (reference < 200) {
            percentage = 0.35; // 35%
        } else if (reference <= 5000) {
            percentage = 0.25; // 25%
        } else {
            percentage = 0.20; // 20%
        }
        
        int upperLimit = (int) Math.round(reference * (1 + percentage));
        int lowerLimit = (int) Math.round(reference * (1 - percentage));
        
        // Align limits with tick size
        int tickSize = getTickSize(reference);
        upperLimit = (upperLimit / tickSize) * tickSize;
        lowerLimit = (lowerLimit / tickSize) * tickSize;
        
        return new int[]{lowerLimit, upperLimit};
    }
}

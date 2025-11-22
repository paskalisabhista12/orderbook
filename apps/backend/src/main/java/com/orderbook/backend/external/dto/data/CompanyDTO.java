package com.orderbook.backend.external.dto.data;

import lombok.Data;

@Data
public class CompanyDTO {
    private String ticker;
    private String name;
    private int prevPrice;
}

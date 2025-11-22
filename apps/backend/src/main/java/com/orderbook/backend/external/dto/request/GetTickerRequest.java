package com.orderbook.backend.external.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetTickerRequest {
    private String search;
    private Integer page;
    private Integer size;
}

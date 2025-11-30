package com.orderbook.backend.external.common;

import lombok.Data;

@Data
public class PaginationDTO {
    private int count;
    private int max_page;
    private int page;
    private int size;
    private String next;
    private String previous;
}

package com.orderbook.backend.external.datafeed.dto.response;

import com.orderbook.backend.external.common.PaginationDTO;
import com.orderbook.backend.external.datafeed.dto.data.CompanyDTO;
import lombok.Data;

import java.util.List;

@Data
public class GetTickerResponse {
    private boolean success;
    private String message;
    private List<CompanyDTO> data;
    private PaginationDTO pagination;
}

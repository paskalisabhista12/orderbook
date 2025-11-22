package com.orderbook.backend.external.dto.response;

import com.orderbook.backend.external.dto.data.CompanyDTO;
import com.orderbook.backend.external.dto.common.PaginationDTO;
import lombok.Data;

import java.util.List;

@Data
public class GetTickerResponse {
    private boolean success;
    private String message;
    private List<CompanyDTO> data;
    private PaginationDTO pagination;
}

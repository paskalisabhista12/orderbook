package com.orderbook.backend.config.registry;

import com.orderbook.backend.external.dto.data.CompanyDTO;
import com.orderbook.backend.external.dto.request.GetTickerRequest;
import com.orderbook.backend.external.dto.response.GetTickerResponse;
import com.orderbook.backend.external.service.DataFeedService;
import com.orderbook.backend.factory.OrderBookFactory;
import com.orderbook.backend.service.OrderBookService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class OrderBookRegistry {
    
    private final OrderBookFactory factory;
    private final DataFeedService dataFeedService;
    
    private final Map<String, OrderBookService> books = new ConcurrentHashMap<>();
    
    public OrderBookRegistry(OrderBookFactory factory, DataFeedService dataFeedService) {
        this.factory = factory;
        this.dataFeedService = dataFeedService;
    }
    
    // Run automatically after Spring finishes creating this bean
    @PostConstruct
    public void init() {
        log.info("Initializing OrderBookRegistry... fetching tickers from API");
        
        GetTickerRequest req = GetTickerRequest.builder()
                .page(1)
                .size(10000)
                .build();
        
        GetTickerResponse apiResponse = dataFeedService.getTickers(req)
                .onErrorResume(err -> {
                    log.error("Failed to fetch tickers at startup: {}",
                            err.getMessage());
                    return Mono.just(new GetTickerResponse()); // return empty response
                })
                .block();
        
        if (apiResponse != null && apiResponse.getData() != null) {
            for (CompanyDTO company : apiResponse.getData()) {
                log.info("Adding {} to OrderBookService",
                        company.toString());
                books.put(company.getTicker(),
                        factory.create(company.getTicker(),
                                company.getPrevPrice()));
            }
        }
        
        log.info("OrderBookRegistry initialized with {} tickers",
                books.size());
    }
    
    public OrderBookService getOrCreate(String ticker, int prevPrice) {
        return books.computeIfAbsent(ticker,
                t -> factory.create(t,
                        prevPrice));
    }
    
    public OrderBookService get(String ticker) {
        return books.get(ticker);
    }
    
    public Collection<OrderBookService> getAll() {
        return books.values();
    }
}


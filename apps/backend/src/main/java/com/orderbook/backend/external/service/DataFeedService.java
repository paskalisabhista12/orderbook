package com.orderbook.backend.external.service;

import com.orderbook.backend.external.dto.request.GetTickerRequest;
import com.orderbook.backend.external.dto.response.GetTickerResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataFeedService {
    
    private final WebClient webClient;
    
    public Mono<GetTickerResponse> getTickers(GetTickerRequest req) {
        return webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/core/get-ticker");
                    
                    if (req.getSearch() != null) builder.queryParam("search", req.getSearch());
                    if (req.getPage() != null) builder.queryParam("page", req.getPage());
                    if (req.getSize() != null) builder.queryParam("size", req.getSize());
                    
                    return builder.build();
                })
                .retrieve()
                .onStatus(HttpStatusCode::isError, this::handleError)
                .bodyToMono(GetTickerResponse.class)
                .timeout(Duration.ofSeconds(3))
                .doOnSubscribe(sub -> log.info("Calling /core/get-ticker"))
                .doOnError(err -> log.error("Error calling /core/get-ticker: {}", err.getMessage()));
    }
    
    private Mono<? extends Throwable> handleError(org.springframework.web.reactive.function.client.ClientResponse response) {
        return response.bodyToMono(String.class)
                .flatMap(body -> {
                    String message = "API error " + response.statusCode() + " -> " + body;
                    log.error(message);
                    return Mono.error(new RuntimeException(message));
                });
    }
}

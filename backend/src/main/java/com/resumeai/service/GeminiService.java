package com.resumeai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {
    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${app.gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // List of models to try in priority order
    private static final List<String> MODEL_CANDIDATES = List.of(
            "gemini-2.5-flash",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-2.0-flash"
    );

    public GeminiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String generateContent(String prompt) {
        Exception lastException = null;

        for (String model : MODEL_CANDIDATES) {
            for (int attempt = 1; attempt <= 2; attempt++) {
                try {
                    String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
                    
                    Map<String, Object> requestBody = Map.of(
                            "contents", new Object[]{
                                    Map.of("parts", new Object[]{
                                            Map.of("text", prompt)
                                    })
                            },
                            "generationConfig", Map.of(
                                    "temperature", 0.3,
                                    "maxOutputTokens", 8192
                            )
                    );
                    
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
                    
                    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
                    JsonNode root = objectMapper.readTree(response.getBody());
                    
                    String text = root.path("candidates").get(0)
                            .path("content").path("parts").get(0)
                            .path("text").asText();

                    log.info("Gemini API call succeeded using model: {}", model);
                    return text;
                } catch (HttpClientErrorException.TooManyRequests e) {
                    log.warn("Gemini model {} hit rate limit (429), waiting 3s before retry...", model);
                    lastException = e;
                    try { Thread.sleep(3000); } catch (InterruptedException ignored) {}
                } catch (Exception e) {
                    log.warn("Gemini model {} failed (attempt {}): {}", model, attempt, e.getMessage());
                    lastException = e;
                    break; // try next model
                }
            }
        }

        log.error("All Gemini model candidates failed.");
        throw new RuntimeException("AI service busy/rate-limited. Please retry in 30 seconds: " + (lastException != null ? lastException.getMessage() : "Rate limited"));
    }
}

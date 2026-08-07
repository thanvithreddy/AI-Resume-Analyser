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

    // Currently active Gemini models (each has an independent free rate-limit pool)
    private static final List<String> MODEL_CANDIDATES = List.of(
            "gemini-2.0-flash",
            "gemini-2.0-flash-lite",
            "gemini-1.5-flash-8b",
            "gemini-2.0-flash-exp"
    );

    public GeminiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String generateContent(String prompt) {
        Exception lastException = null;

        for (String model : MODEL_CANDIDATES) {
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
                log.warn("Gemini model {} hit 429 rate limit, switching to next candidate...", model);
                lastException = e;
                // Continue to next model in candidate list immediately! Each model has its own quota pool.
            } catch (Exception e) {
                log.warn("Gemini model {} failed: {}", model, e.getMessage());
                lastException = e;
            }
        }

        log.error("All Gemini model candidates failed.");
        throw new RuntimeException("Gemini AI free rate limit exceeded. Please wait 30 seconds and click Analyze again.");
    }
}

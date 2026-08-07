package com.resumeai.controller;

import com.resumeai.dto.AnalysisResponse;
import com.resumeai.service.AnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@Tag(name = "Resume Analysis")
@SecurityRequirement(name = "Bearer Authentication")
public class AnalysisController {
    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload resume and analyze against job description")
    public ResponseEntity<AnalysisResponse> analyze(
            @RequestParam("resume") MultipartFile resume,
            @RequestParam("jobDescription") String jobDescription) throws Exception {
        return ResponseEntity.ok(analysisService.analyzeResume(resume, jobDescription));
    }

    @GetMapping("/history")
    @Operation(summary = "Get user's analysis history")
    public ResponseEntity<List<AnalysisResponse>> getHistory() {
        return ResponseEntity.ok(analysisService.getUserHistory());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific analysis result")
    public ResponseEntity<AnalysisResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getAnalysisById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a specific analysis result")
    public ResponseEntity<java.util.Map<String, String>> deleteById(@PathVariable Long id) {
        analysisService.deleteAnalysis(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Analysis deleted successfully"));
    }
}

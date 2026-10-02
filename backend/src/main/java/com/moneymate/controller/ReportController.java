package com.moneymate.controller;

import com.moneymate.dto.ApiResponse;
import com.moneymate.dto.ReportResponse;
import com.moneymate.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ReportResponse>> getReport(
            Principal principal,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        ReportResponse report = reportService.generateReport(principal.getName(), year, month);
        return ResponseEntity.ok(ApiResponse.success("Report generated successfully", report));
    }
}

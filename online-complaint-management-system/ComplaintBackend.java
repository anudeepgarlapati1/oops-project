package com.example.complaint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@SpringBootApplication
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:5500"})
public class ComplaintBackend {

    public static void main(String[] args) {
        SpringApplication.run(ComplaintBackend.class, args);
    }

    // --- Models ---
    static class Complaint {
        private String id;
        private String title;
        private String description;
        private String category;
        private String submitter;
        private String status;
        private LocalDateTime submittedAt;

        public Complaint() {}

        public Complaint(String id, String title, String description, String category, String submitter, String status, LocalDateTime submittedAt) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.category = category;
            this.submitter = submitter;
            this.status = status;
            this.submittedAt = submittedAt;
        }

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getSubmitter() { return submitter; }
        public void setSubmitter(String submitter) { this.submitter = submitter; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDateTime getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    }

    static class Category {
        private String id;
        private String name;

        public Category() {}

        public Category(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    static class NewComplaintRequest {
        private String title;
        private String description;
        private String category;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }

    static class UpdateStatusRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    // --- Data ---
    private final List<Category> categories = List.of(
            new Category("tech", "Technical Support"),
            new Category("billing", "Billing Inquiry"),
            new Category("general", "General Feedback"),
            new Category("feature", "Feature Request")
    );

    private final List<String> validStatuses = List.of("Pending", "Resolved", "In Progress");

    private final List<Complaint> complaints = new CopyOnWriteArrayList<>(List.of(
            new Complaint("c001", "Internet Disconnection", "My internet keeps dropping.", "Technical Support", "user123", "Pending", LocalDateTime.parse("2023-10-26T10:00:00")),
            new Complaint("c002", "Incorrect Charge on Bill", "I was charged twice this month.", "Billing Inquiry", "jane_doe", "Resolved", LocalDateTime.parse("2023-10-25T14:30:00")),
            new Complaint("c003", "Website UI Improvement", "The navigation is confusing.", "Feature Request", "admin", "In Progress", LocalDateTime.parse("2023-10-24T09:15:00"))
    ));

    private final AtomicLong complaintIdCounter = new AtomicLong(3);

    // --- Endpoints ---
    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categories;
    }

    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return complaints.stream()
                    .filter(c -> c.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }
        return complaints;
    }

    @PostMapping("/complaints")
    public ResponseEntity<Complaint> createComplaint(@RequestBody NewComplaintRequest request) {
        if (request.getTitle() == null || request.getTitle().isEmpty() ||
            request.getDescription() == null || request.getDescription().isEmpty() ||
            request.getCategory() == null || request.getCategory().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        boolean categoryExists = categories.stream()
                .anyMatch(cat -> cat.getName().equalsIgnoreCase(request.getCategory()));
        if (!categoryExists) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String id = String.format("c%03d", complaintIdCounter.incrementAndGet());
        Complaint newComplaint = new Complaint(
                id,
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                "anonymous_user",
                "Pending",
                LocalDateTime.now()
        );

        complaints.add(newComplaint);
        return new ResponseEntity<>(newComplaint, HttpStatus.CREATED);
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(@PathVariable String id, @RequestBody UpdateStatusRequest request) {
        if (request.getStatus() == null || request.getStatus().isEmpty() ||
            !validStatuses.contains(request.getStatus())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Optional<Complaint> existingComplaint = complaints.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst();

        if (existingComplaint.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Complaint complaintToUpdate = existingComplaint.get();
        complaintToUpdate.setStatus(request.getStatus());
        return new ResponseEntity<>(complaintToUpdate, HttpStatus.OK);

    }
}

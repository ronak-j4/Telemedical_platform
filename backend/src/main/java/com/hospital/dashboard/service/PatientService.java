package com.hospital.dashboard.service;

import com.hospital.dashboard.exception.InvalidRequestException;
import com.hospital.dashboard.exception.ResourceNotFoundException;
import com.hospital.dashboard.model.Patient;
import com.hospital.dashboard.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository repository;

    public PatientService(PatientRepository repository) {
        this.repository = repository;
    }

    public List<Patient> getAll() {
        return repository.findAll();
    }

    public Patient getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id " + id));
    }

    public Patient create(Patient patient) {
        validate(patient);
        return repository.save(patient);
    }

    public Patient update(Long id, Patient patient) {
        validate(patient);
        getById(id); // 404 if missing
        repository.update(id, patient);
        patient.setPatientId(id);
        return patient;
    }

    public void delete(Long id) {
        getById(id); // 404 if missing
        repository.deleteById(id);
    }

    /** Basic application-level checks; Oracle constraints remain the final integrity layer. */
    private void validate(Patient p) {
        if (isBlank(p.getFirstName())) throw new InvalidRequestException("firstName is required");
        if (isBlank(p.getLastName())) throw new InvalidRequestException("lastName is required");
        if (p.getDob() == null) throw new InvalidRequestException("dob is required");
        if (isBlank(p.getCity())) throw new InvalidRequestException("city is required");
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}

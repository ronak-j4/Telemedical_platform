package com.hospital.dashboard.service;

import com.hospital.dashboard.exception.InvalidRequestException;
import com.hospital.dashboard.exception.ResourceNotFoundException;
import com.hospital.dashboard.model.Doctor;
import com.hospital.dashboard.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository repository;

    public DoctorService(DoctorRepository repository) {
        this.repository = repository;
    }

    public List<Doctor> getAll() {
        return repository.findAll();
    }

    public Doctor getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id " + id));
    }

    public Doctor create(Doctor doctor) {
        validate(doctor);
        return repository.save(doctor);
    }

    public Doctor update(Long id, Doctor doctor) {
        validate(doctor);
        getById(id);
        repository.update(id, doctor);
        doctor.setDoctorId(id);
        return doctor;
    }

    public void delete(Long id) {
        getById(id);
        repository.deleteById(id);
    }

    private void validate(Doctor d) {
        if (isBlank(d.getFirstName())) throw new InvalidRequestException("firstName is required");
        if (isBlank(d.getLastName())) throw new InvalidRequestException("lastName is required");
        if (d.getDob() == null) throw new InvalidRequestException("dob is required");
        if (d.getDateJoined() == null) throw new InvalidRequestException("dateJoined is required");
        if (isBlank(d.getLicenseNumber())) throw new InvalidRequestException("licenseNumber is required");
        if (d.getExperience() == null || d.getExperience() < 0) {
            throw new InvalidRequestException("experience must be >= 0");
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}

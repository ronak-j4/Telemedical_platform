package com.hospital.dashboard.service;

import com.hospital.dashboard.exception.InvalidRequestException;
import com.hospital.dashboard.exception.ResourceNotFoundException;
import com.hospital.dashboard.model.Prescription;
import com.hospital.dashboard.repository.GenericTableRepository;
import com.hospital.dashboard.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository repository;
    private final GenericTableRepository genericRepository;

    public PrescriptionService(PrescriptionRepository repository, GenericTableRepository genericRepository) {
        this.repository = repository;
        this.genericRepository = genericRepository;
    }

    public List<Prescription> getAll() {
        return repository.findAll();
    }

    public Prescription getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id " + id));
    }

    public Prescription create(Prescription p) {
        validate(p);
        return repository.save(p);
    }

    public Prescription update(Long id, Prescription p) {
        validate(p);
        getById(id);
        repository.update(id, p);
        p.setPrescriptionId(id);
        return p;
    }

    @Transactional
    public void delete(Long id) {
        getById(id);
        genericRepository.deleteByColumn("prescription_medicine", "prescription_id", id);
        genericRepository.deleteByColumn("prescription_test", "prescription_id", id);
        repository.deleteById(id);
    }

    private void validate(Prescription p) {
        if (p.getConsultationId() == null) throw new InvalidRequestException("consultationId is required");
        if (p.getPrescriptionDate() == null) throw new InvalidRequestException("prescriptionDate is required");
        if (p.getDosage() == null || p.getDosage().trim().isEmpty()) throw new InvalidRequestException("dosage is required");
    }
}

package com.hospital.dashboard.model;

import java.time.LocalDate;

/**
 * Maps to the PRESCRIPTION table.
 * NOTE: real Oracle columns are p_date and dosage - there is no doctor_id,
 * patient_id, or notes column (those live on/via CONSULTATION instead).
 * The JSON field prescriptionDate maps to the SQL column p_date.
 */
public class Prescription {

    private Long prescriptionId;
    private Long consultationId;
    private LocalDate prescriptionDate;
    private String dosage;

    public Prescription() { }

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public Long getConsultationId() { return consultationId; }
    public void setConsultationId(Long consultationId) { this.consultationId = consultationId; }

    public LocalDate getPrescriptionDate() { return prescriptionDate; }
    public void setPrescriptionDate(LocalDate prescriptionDate) { this.prescriptionDate = prescriptionDate; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
}

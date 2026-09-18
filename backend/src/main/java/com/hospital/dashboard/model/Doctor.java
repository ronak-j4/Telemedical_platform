package com.hospital.dashboard.model;

import java.time.LocalDate;

/** Maps to the DOCTOR table. NOTE: the real Oracle column is license_no (not license_number) -
 *  see DoctorRepository; the JSON/Java field name licenseNumber is kept for a cleaner API. */
public class Doctor {

    private Long doctorId;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String gender;
    private LocalDate dateJoined;
    private String licenseNumber;
    private Integer experience;

    public Doctor() { }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getDateJoined() { return dateJoined; }
    public void setDateJoined(LocalDate dateJoined) { this.dateJoined = dateJoined; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }
}

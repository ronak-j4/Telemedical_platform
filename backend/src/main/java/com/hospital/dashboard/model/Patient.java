package com.hospital.dashboard.model;

import java.time.LocalDate;

/** Maps to the PATIENT table. JSON field names are camelCase; SQL columns are snake_case. */
public class Patient {

    private Long patientId;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String gender;
    private String city;
    private String area;
    private String pincode;

    public Patient() { }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}

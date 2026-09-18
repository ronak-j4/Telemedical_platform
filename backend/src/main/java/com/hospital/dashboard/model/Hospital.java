package com.hospital.dashboard.model;

/**
 * Maps to the HOSPITAL table.
 * NOTE: the real Oracle column is "name" (not hospital_name) - kept as the
 * cleaner hospitalName in JSON, see HospitalRepository. There is no single
 * "address" column; it is split into street / area / pincode.
 */
public class Hospital {

    private Long hospitalId;
    private String hospitalName;
    private String street;
    private String area;
    private String city;
    private String pincode;

    public Hospital() { }

    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}

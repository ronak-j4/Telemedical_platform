package com.hospital.dashboard.repository;

import com.hospital.dashboard.model.Patient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Optional;

@Repository
public class PatientRepository {

    private final JdbcTemplate jdbcTemplate;

    public PatientRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final RowMapper<Patient> ROW_MAPPER = (rs, rowNum) -> {
        Patient p = new Patient();
        p.setPatientId(rs.getLong("patient_id"));
        p.setFirstName(rs.getString("first_name"));
        p.setLastName(rs.getString("last_name"));
        p.setDob(rs.getDate("dob") != null ? rs.getDate("dob").toLocalDate() : null);
        p.setGender(rs.getString("gender"));
        p.setCity(rs.getString("city"));
        p.setArea(rs.getString("area"));
        p.setPincode(rs.getString("pincode"));
        return p;
    };

    public List<Patient> findAll() {
        return jdbcTemplate.query("SELECT * FROM patient ORDER BY patient_id", ROW_MAPPER);
    }

    public Optional<Patient> findById(Long id) {
        return jdbcTemplate.query("SELECT * FROM patient WHERE patient_id = ?", ROW_MAPPER, id).stream().findFirst();
    }

    public Patient save(Patient p) {
        Long id = jdbcTemplate.queryForObject("SELECT seq_patient.NEXTVAL FROM dual", Long.class);
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO patient (patient_id, first_name, last_name, dob, gender, city, area, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            ps.setLong(1, id);
            ps.setString(2, p.getFirstName());
            ps.setString(3, p.getLastName());
            ps.setDate(4, p.getDob() != null ? java.sql.Date.valueOf(p.getDob()) : null);
            ps.setString(5, p.getGender());
            ps.setString(6, p.getCity());
            ps.setString(7, p.getArea());
            ps.setString(8, p.getPincode());
            return ps;
        });
        p.setPatientId(id);
        return p;
    }

    public int update(Long id, Patient p) {
        return jdbcTemplate.update(
                "UPDATE patient SET first_name = ?, last_name = ?, dob = ?, gender = ?, city = ?, area = ?, pincode = ? WHERE patient_id = ?",
                p.getFirstName(), p.getLastName(),
                p.getDob() != null ? java.sql.Date.valueOf(p.getDob()) : null,
                p.getGender(), p.getCity(), p.getArea(), p.getPincode(), id);
    }

    public int deleteById(Long id) {
        return jdbcTemplate.update("DELETE FROM patient WHERE patient_id = ?", id);
    }
}

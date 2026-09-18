package com.hospital.dashboard.repository;

import com.hospital.dashboard.model.Hospital;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Optional;

@Repository
public class HospitalRepository {

    private final JdbcTemplate jdbcTemplate;

    public HospitalRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final String SELECT_ALL = "SELECT hospital_id, name, street, area, city, pincode FROM hospital";

    private static final RowMapper<Hospital> ROW_MAPPER = (rs, rowNum) -> {
        Hospital h = new Hospital();
        h.setHospitalId(rs.getLong("hospital_id"));
        h.setHospitalName(rs.getString("name"));
        h.setStreet(rs.getString("street"));
        h.setArea(rs.getString("area"));
        h.setCity(rs.getString("city"));
        h.setPincode(rs.getString("pincode"));
        return h;
    };

    public List<Hospital> findAll() {
        return jdbcTemplate.query(SELECT_ALL + " ORDER BY hospital_id", ROW_MAPPER);
    }

    public Optional<Hospital> findById(Long id) {
        return jdbcTemplate.query(SELECT_ALL + " WHERE hospital_id = ?", ROW_MAPPER, id).stream().findFirst();
    }

    public Hospital save(Hospital h) {
        Long id = jdbcTemplate.queryForObject("SELECT seq_hospital.NEXTVAL FROM dual", Long.class);
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO hospital (hospital_id, name, street, area, city, pincode) VALUES (?, ?, ?, ?, ?, ?)");
            ps.setLong(1, id);
            ps.setString(2, h.getHospitalName());
            ps.setString(3, h.getStreet());
            ps.setString(4, h.getArea());
            ps.setString(5, h.getCity());
            ps.setString(6, h.getPincode());
            return ps;
        });
        h.setHospitalId(id);
        return h;
    }

    public int update(Long id, Hospital h) {
        return jdbcTemplate.update(
                "UPDATE hospital SET name = ?, street = ?, area = ?, city = ?, pincode = ? WHERE hospital_id = ?",
                h.getHospitalName(), h.getStreet(), h.getArea(), h.getCity(), h.getPincode(), id);
    }

    public int deleteById(Long id) {
        return jdbcTemplate.update("DELETE FROM hospital WHERE hospital_id = ?", id);
    }
}

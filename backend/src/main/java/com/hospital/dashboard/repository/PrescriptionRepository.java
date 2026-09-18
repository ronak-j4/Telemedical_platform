package com.hospital.dashboard.repository;

import com.hospital.dashboard.model.Prescription;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.util.List;
import java.util.Optional;

@Repository
public class PrescriptionRepository {

    private final JdbcTemplate jdbcTemplate;

    public PrescriptionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final String SELECT_ALL = "SELECT prescription_id, consultation_id, p_date, dosage FROM prescription";

    private static final RowMapper<Prescription> ROW_MAPPER = (rs, rowNum) -> {
        Prescription p = new Prescription();
        p.setPrescriptionId(rs.getLong("prescription_id"));
        p.setConsultationId(rs.getLong("consultation_id"));
        p.setPrescriptionDate(rs.getDate("p_date") != null ? rs.getDate("p_date").toLocalDate() : null);
        p.setDosage(rs.getString("dosage"));
        return p;
    };

    public List<Prescription> findAll() {
        return jdbcTemplate.query(SELECT_ALL + " ORDER BY prescription_id", ROW_MAPPER);
    }

    public Optional<Prescription> findById(Long id) {
        return jdbcTemplate.query(SELECT_ALL + " WHERE prescription_id = ?", ROW_MAPPER, id).stream().findFirst();
    }

    public Prescription save(Prescription p) {
        Long id = jdbcTemplate.queryForObject("SELECT seq_prescription.NEXTVAL FROM dual", Long.class);
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO prescription (prescription_id, consultation_id, p_date, dosage) VALUES (?, ?, ?, ?)");
            ps.setLong(1, id);
            ps.setLong(2, p.getConsultationId());
            ps.setDate(3, p.getPrescriptionDate() != null ? Date.valueOf(p.getPrescriptionDate()) : null);
            ps.setString(4, p.getDosage());
            return ps;
        });
        p.setPrescriptionId(id);
        return p;
    }

    public int update(Long id, Prescription p) {
        return jdbcTemplate.update(
                "UPDATE prescription SET consultation_id = ?, p_date = ?, dosage = ? WHERE prescription_id = ?",
                p.getConsultationId(),
                p.getPrescriptionDate() != null ? Date.valueOf(p.getPrescriptionDate()) : null,
                p.getDosage(), id);
    }

    public int deleteById(Long id) {
        return jdbcTemplate.update("DELETE FROM prescription WHERE prescription_id = ?", id);
    }
}

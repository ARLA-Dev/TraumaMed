package com.arlainc.traumamed.repositories;

import com.arlainc.traumamed.models.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    @Query("SELECT new com.arlainc.traumamed.models.ConsultaPacienteDTO(c.cedula, c.id, c.peso, c.fecha, p.paciente, p.nacionalidad) " +
            "FROM Consulta c JOIN Paciente p ON c.cedula = p.cedula " +
            "ORDER BY c.id DESC, c.fecha DESC")
    List<Object[]> findAllOrderByFechaDescWithPaciente();

    @Query("SELECT c FROM Consulta c WHERE c.cedula = :cedula")
    List<Consulta> findByCedula(@Param("cedula") String cedula);

    @Query("SELECT c.recipe, c.indicaciones FROM Consulta c WHERE c.id = :idConsulta")
    Object[] findDetalleConsultaById(Long idConsulta);

    @Query("SELECT c.nota_evolutiva FROM Consulta c WHERE c.id = :idConsulta")
    Object[] findNotaConsultaById(Long idConsulta);

    @Query("SELECT COUNT(c) FROM Consulta c WHERE YEAR(c.fecha) = YEAR(CURRENT_DATE)")
    long countConsultasThisYear();

    @Query(value = "WITH meses AS (\n" +
            "    SELECT TO_CHAR(date_trunc('month', NOW() - INTERVAL '1 year') + (interval '1 month' * n), 'YYYY-MM') AS mes\n" +
            "    FROM generate_series(0, 12, 1) n\n" +
            ")\n" +
            "SELECT m.mes, COALESCE(COUNT(c.fecha), 0) AS cantidad\n" +
            "FROM meses m\n" +
            "LEFT JOIN consultas c ON TO_CHAR(c.fecha, 'YYYY-MM') = m.mes\n" +
            "GROUP BY m.mes\n" +
            "ORDER BY m.mes;\n", nativeQuery = true)
    List<Object[]> contarConsultasPorMesUltimoAnio();

}




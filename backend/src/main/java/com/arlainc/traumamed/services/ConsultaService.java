package com.arlainc.traumamed.services;

import com.arlainc.traumamed.models.Consulta;
import java.util.List;

public interface ConsultaService {

    List<Object[]> findAllOrderByFechaDescWithPaciente();

    List<Consulta> obtenerConsultasPorCedula(String cedula);

    Consulta crearConsulta(Consulta consulta);

    Object[] obtenerDetalleConsulta(Long idConsulta);

    Object[] obtenerNotaConsulta(Long idConsulta);
    long contarTotalConsultas();
    long contarConsultasThisYear();

    List<Object[]> contarConsultasPorMesUltimoAnio();
}

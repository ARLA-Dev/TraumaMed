package com.arlainc.femisys.services;

import com.arlainc.femisys.models.Paciente;
import java.util.List;
import java.util.Map;

public interface PacienteService {
    List<Paciente> obtenerPacientesActivos();
    Paciente crearPaciente(Paciente paciente);
    public void marcarPacienteComoBorradoPorCedula(String cedula);
    Paciente buscarPorCedula(String cedula);
    void modificarPaciente(String cedula, Paciente paciente);
    Map<String, Object> obtenerPacienteConsultaPorCedula(String cedula);
    long contarPacientesNoBorrados();
}
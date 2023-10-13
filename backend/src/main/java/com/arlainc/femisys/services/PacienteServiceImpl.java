package com.arlainc.femisys.services;

import com.arlainc.femisys.models.Paciente;
import com.arlainc.femisys.repositories.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PacienteServiceImpl implements PacienteService{

    private final PacienteRepository pacienteRepository;

    @Autowired
    public PacienteServiceImpl(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @Override
    public List<Paciente> obtenerPacientesActivos() {
        return pacienteRepository.findByBorrado(0);
    }

    @Override
    public Paciente crearPaciente(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    @Override
    public void marcarPacienteComoBorradoPorCedula(String cedula) {
        Paciente paciente = pacienteRepository.findByCedula(cedula);
        if (paciente != null) {
            paciente.setBorrado(1);
            pacienteRepository.save(paciente);
        }
    }

    @Override
    public Paciente buscarPorCedula(String cedula) {
        return pacienteRepository.findByCedula(cedula);
    }

    @Override
    public void modificarPaciente(String cedula, Paciente paciente) {
        Paciente pacienteExistente = buscarPorCedula(cedula);

        if (pacienteExistente != null) {
            // Actualizar los datos del paciente existente con los valores del paciente proporcionado
            pacienteExistente.setPaciente(paciente.getPaciente());
            pacienteExistente.setDireccion(paciente.getDireccion());
            pacienteExistente.setTelefono(paciente.getTelefono());
            pacienteExistente.setFecha_nacimiento(paciente.getFecha_nacimiento());
            pacienteExistente.setLugar_nacimiento(paciente.getLugar_nacimiento());
            pacienteExistente.setEstado_civil(paciente.getEstado_civil());
            pacienteExistente.setNacionalidad(paciente.getNacionalidad());
            pacienteExistente.setAntecedentes(paciente.getAntecedentes());
            pacienteExistente.setSexo(paciente.getSexo());
            pacienteExistente.setEmail(paciente.getEmail());

            // No se actualiza el campo "borrado"
            pacienteRepository.save(pacienteExistente);
        }
    }
    @Override
    public Map<String, Object> obtenerPacienteConsultaPorCedula(String cedula) {
        Optional<Map<String, Object>> pacienteConsulta = pacienteRepository.obtenerPacienteConsultaPorCedula(cedula);
        return pacienteConsulta.orElse(null);
    }

    @Override
    public long contarPacientesNoBorrados() {
        return pacienteRepository.countPacientesNoBorrados();
    }
}

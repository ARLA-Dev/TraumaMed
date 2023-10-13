package com.arlainc.traumamed.models;

import lombok.Data;

import java.util.Date;

@Data
public class ConsultaPacienteDTO {

    private String cedula;
    private int id;
    private double peso;
    private Date fecha;
    private String paciente;
    private String nacionalidad;

    public ConsultaPacienteDTO(String cedula, int id, double peso, Date fecha, String paciente, String nacionalidad) {
        this.cedula = cedula;
        this.id = id;
        this.peso = peso;
        this.fecha = fecha;
        this.paciente = paciente;
        this.nacionalidad = nacionalidad;
    }
}

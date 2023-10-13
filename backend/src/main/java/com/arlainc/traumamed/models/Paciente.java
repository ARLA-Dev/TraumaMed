package com.arlainc.traumamed.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "pacientes")
@Data
public class Paciente {

    @Column(name = "paciente")
    private String paciente;

    @Id
    @Column(name = "cedula")
    private String cedula;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "fecha_nacimiento")
    private Date fecha_nacimiento;

    @Column(name = "lugar_nacimiento")
    private String lugar_nacimiento;

    @Column(name = "estado_civil")
    private String estado_civil;

    @Column(name = "nacionalidad")
    private String nacionalidad;

    @Column(name = "antecedentes")
    private String antecedentes;

    @Column(name = "sexo")
    private String sexo;

    @Column(name = "email")
    private String email;

    @Column(name = "borrado")
    private int borrado;
}


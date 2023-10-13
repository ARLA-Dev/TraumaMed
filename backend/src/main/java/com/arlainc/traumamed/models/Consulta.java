package com.arlainc.traumamed.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "consultas")
@Data
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "cedula")
    private String cedula;

    @Column(name = "peso")
    private double peso;

    @Column(name = "fecha")
    private Date fecha;

    @Column(name = "nota_evolutiva")
    private String nota_evolutiva;

    @Column(name = "recipe")
    private String recipe;

    @Column(name = "indicaciones")
    private String indicaciones;
}

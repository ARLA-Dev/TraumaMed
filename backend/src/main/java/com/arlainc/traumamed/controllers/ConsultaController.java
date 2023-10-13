package com.arlainc.traumamed.controllers;

import com.arlainc.traumamed.models.Consulta;
import com.arlainc.traumamed.services.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    private final ConsultaService consultaService;

    @Autowired
    public ConsultaController(ConsultaService consultaService) {
        this.consultaService = consultaService;
    }

    @GetMapping
    public ResponseEntity<List<Object[]>> obtenerConsultasOrdenadasPorFecha() {
        List<Object[]> consultas = consultaService.findAllOrderByFechaDescWithPaciente();
        return ResponseEntity.ok(consultas);
    }

    @GetMapping("/{cedula}")
    public List<Consulta> obtenerConsultasPorCedula(@PathVariable String cedula) {
        return consultaService.obtenerConsultasPorCedula(cedula);
    }

    @PostMapping
    public ResponseEntity<Consulta> crearConsulta(@RequestBody Consulta nuevaConsulta) {
        Consulta consultaCreada = consultaService.crearConsulta(nuevaConsulta);
        return new ResponseEntity<>(consultaCreada, HttpStatus.CREATED);
    }

    @GetMapping("/detalle/{idConsulta}")
    public ResponseEntity<Object[]> obtenerDetalleConsulta(@PathVariable Long idConsulta) {
        Object[] detalleConsulta = consultaService.obtenerDetalleConsulta(idConsulta);
        if (detalleConsulta != null) {
            return ResponseEntity.ok(detalleConsulta);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/nota/{idConsulta}")
    public ResponseEntity<Object[]> obtenerNotaConsulta(@PathVariable Long idConsulta) {
        Object[] notaConsulta = consultaService.obtenerNotaConsulta(idConsulta);
        if (notaConsulta != null) {
            return ResponseEntity.ok(notaConsulta);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/total")
    public ResponseEntity<Long> obtenerTotalConsultas() {
        long totalConsultas = consultaService.contarTotalConsultas();
        return ResponseEntity.ok(totalConsultas);
    }

    @GetMapping("/total/anual")
    public ResponseEntity<Long> obtenerTotalConsultasThisYear() {
        long totalConsultasThisYear = consultaService.contarConsultasThisYear();
        return ResponseEntity.ok(totalConsultasThisYear);
    }

    @GetMapping("/total/anual/mensual")
    public ResponseEntity<List<Object[]>> obtenerConsultasPorMesUltimoAnio() {
        List<Object[]> consultasPorMes = consultaService.contarConsultasPorMesUltimoAnio();
        return ResponseEntity.ok(consultasPorMes);
    }

}

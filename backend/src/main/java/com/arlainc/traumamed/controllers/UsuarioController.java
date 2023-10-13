package com.arlainc.traumamed.controllers;

import com.arlainc.traumamed.models.Usuario;
import com.arlainc.traumamed.services.UsuarioServiceImpl;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.arlainc.traumamed.auth.TokenJWTConfig.SECRET_KEY;

@RestController
public class UsuarioController {

    @Autowired
    UsuarioServiceImpl usuarioService;

    @GetMapping("api/usuarios")
    public List<Usuario> obtenerUsuarios() {

        List<Usuario> usuarios = usuarioService.findAll();
        return usuarios;

    }

    @GetMapping("api/usuarios/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable(value="id") Long id) {
        Optional<Usuario> usuario = usuarioService.findById(id);
        if(usuario.isPresent()) {
            return ResponseEntity.ok().body(usuario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("api/usuarios/usuario/{username}")
    public ResponseEntity<Usuario> obtenerUsuarioPorUsername(@PathVariable(value="username") String username) {
        Optional<Usuario> usuario = usuarioService.findByUsername(username);
        if(usuario.isPresent()) {
            return ResponseEntity.ok().body(usuario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("api/usuarios/recuperar_clave/{username}")
    public ResponseEntity<Usuario> obtenerUsuarioPorUsernameOlvidado(@PathVariable(value="username") String username) {
        Optional<Usuario> usuario = usuarioService.getUserByUsername(username);
        if(usuario.isPresent()) {
            return ResponseEntity.ok().body(usuario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("api/usuarios")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario usuarioCreado = usuarioService.save(usuario);
        return ResponseEntity.ok().body(usuarioCreado);
    }

    @PutMapping("api/usuarios/recuperar_clave/{username}")
    public ResponseEntity<String> recuperarClave(@PathVariable(value = "username") String username, @RequestBody Map<String, String> request) {
        String respuesta = request.get("respuesta");
        String nuevaClave = request.get("nuevaClave");

        if (usuarioService.recuperarClave(username, respuesta, nuevaClave)) {
            return ResponseEntity.ok("Contraseña actualizada correctamente");
        }
        return ResponseEntity.badRequest().body("No se pudo actualizar la contraseña");
    }

    @GetMapping("api/usuarios/current")
    public ResponseEntity<Map<String, Object>> obtenerUsuarioActual(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = extractUsernameFromToken(token);
        Optional<Usuario> usuario = usuarioService.findByUsername(username);

        if (usuario.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("username", usuario.get().getUsername());
            response.put("nombre", usuario.get().getNombre());
            response.put("pregunta", usuario.get().getPregunta());

            return ResponseEntity.ok().body(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private String extractUsernameFromToken(String token) {

        String username = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();

        return username;
    }

    @PutMapping("api/usuarios/current")
    public ResponseEntity<String> modificarUsuarioActual(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, String> request) {
        String token = authorizationHeader.replace("Bearer ", "");
        String username = extractUsernameFromToken(token);
        boolean resultado = usuarioService.modificarUsuarioActual(username, request);

        if (resultado) {
            return ResponseEntity.ok("Usuario actual modificado correctamente");
        } else {
            return ResponseEntity.badRequest().body("La contraseña antigua no coincide");
        }
    }
}


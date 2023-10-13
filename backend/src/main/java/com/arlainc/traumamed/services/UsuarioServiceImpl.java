package com.arlainc.traumamed.services;

import com.arlainc.traumamed.models.Usuario;
import com.arlainc.traumamed.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class UsuarioServiceImpl implements  UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<Usuario> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Usuario save(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRespuesta(passwordEncoder.encode(usuario.getRespuesta()));
        return repository.save(usuario);
    }

    @Override
    public Optional<Usuario> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Override
    public Optional<Usuario> getUserByUsername(String username) {
        return repository.findByUsername(username)
                .map(usuario -> {
                    Usuario usuarioReducido = new Usuario();
                    usuarioReducido.setId(usuario.getId());
                    usuarioReducido.setPregunta(usuario.getPregunta());
                    usuarioReducido.setUsername(usuario.getUsername());
                    return usuarioReducido;
                });
    }

    private boolean verificarRespuesta(Usuario usuario, String respuesta) {
        return passwordEncoder.matches(respuesta, usuario.getRespuesta());
    }

    @Transactional
    @Override
    public boolean recuperarClave(String username, String respuesta, String nuevaClave) {
        Optional<Usuario> usuarioOptional = findByUsername(username);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            if (verificarRespuesta(usuario, respuesta)) {
                String claveEncriptada = passwordEncoder.encode(nuevaClave);
                repository.actualizarClave(username, claveEncriptada);
                return true;
            }
        }
        return false;
    }

    @Transactional
    @Override
    public boolean modificarUsuarioActual(String username, Map<String, String> request) {
        Optional<Usuario> usuarioOptional = findByUsername(username);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            String passwordOld = request.get("password_old");
            String pregunta = request.get("pregunta");
            String respuesta = request.get("respuesta");
            String password = request.get("password");

            if (passwordEncoder.matches(passwordOld, usuario.getPassword())) {
                usuario.setPregunta(pregunta);
                usuario.setRespuesta(passwordEncoder.encode(respuesta));
                usuario.setPassword(passwordEncoder.encode(password));
                repository.save(usuario);
                return true;
            }
        }
        return false;
    }
}

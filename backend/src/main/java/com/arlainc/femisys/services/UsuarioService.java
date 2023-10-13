package com.arlainc.femisys.services;

import com.arlainc.femisys.models.Usuario;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UsuarioService {

    List<Usuario> findAll();

    Optional<Usuario> findById(Long id);

    Usuario save(Usuario usuario);

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> getUserByUsername(String username);

    public boolean recuperarClave(String username, String respuesta, String nuevaClave);

    boolean modificarUsuarioActual(String username, Map<String, String> request);
}

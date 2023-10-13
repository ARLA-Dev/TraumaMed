package com.arlainc.traumamed.repositories;

import com.arlainc.traumamed.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findAll();

    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> getUserByUsername(String username);
    @Modifying
    @Query("UPDATE Usuario u SET u.password = :nuevaClave WHERE u.username = :username")
    void actualizarClave(@Param("username") String username, @Param("nuevaClave") String nuevaClave);
}


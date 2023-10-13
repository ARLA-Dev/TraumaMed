package com.arlainc.femisys.repositories;

import com.arlainc.femisys.models.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface UserRepository extends CrudRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    @Query("select u from Usuario u where u.username=?1")
    Optional<Usuario> getUserByUsername(String username);
}

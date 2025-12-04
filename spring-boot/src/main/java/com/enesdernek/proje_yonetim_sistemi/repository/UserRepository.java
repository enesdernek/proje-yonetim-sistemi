package com.enesdernek.proje_yonetim_sistemi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);
	
	boolean existsByUsername(String username);

	@Query(value="SELECT * FROM users ORDER BY user_id DESC",nativeQuery=true)
	List<User> getAllUsersPagedByUserIdDesc(Pageable pageable);
	
	void deleteByUserId(Long userId);
	
	Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);


}

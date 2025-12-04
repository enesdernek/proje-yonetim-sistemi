package com.enesdernek.proje_yonetim_sistemi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.Connection;

import jakarta.transaction.Transactional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

	boolean existsByUserIdAndConnectedUserId(Long userId, Long connectedUserId);
	
	long countByUserIdOrConnectedUserId(Long userId1, Long userId2);

	@Query(value = "SELECT * FROM connections c WHERE c.user_id = :userId OR c.connected_user_id = :userId ORDER BY connection_id DESC", nativeQuery = true)
	List<Connection> findAllByUserOrConnectedUserPagedByConnectionIdDesc(@Param("userId") Long userId,Pageable pageable);
	
    @Query(value = "SELECT * FROM connections c WHERE (c.user_id = :authUserId AND c.connected_user_id = :otherUserId) OR (c.user_id = :otherUserId AND c.connected_user_id = :authUserId)", nativeQuery = true)
    Optional<Connection> findConnectionBetweenUsers(@Param("authUserId") Long authUserId, @Param("otherUserId") Long otherUserId);
    
    @Transactional
    void deleteByUserIdOrConnectedUserId(Long userId, Long connectedUserId);
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
            "FROM Connection c " +
            "WHERE (c.userId = :userId1 AND c.connectedUserId = :userId2) " +
            "   OR (c.userId = :userId2 AND c.connectedUserId = :userId1)")
     boolean existsConnectionBetweenUsers(@Param("userId1") Long userId1,
                                          @Param("userId2") Long userId2);
    

}

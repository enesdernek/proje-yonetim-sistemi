package com.enesdernek.proje_yonetim_sistemi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

	@Query(
		    value = "SELECT p.* FROM projects p " +
		            "JOIN project_members pm ON p.project_id = pm.project_id " +
		            "WHERE pm.user_id = :userId " +
		            "ORDER BY p.project_id DESC",
		    countQuery = "SELECT COUNT(*) FROM projects p " +
		                 "JOIN project_members pm ON p.project_id = pm.project_id " +
		                 "WHERE pm.user_id = :userId",
		    nativeQuery = true
		)
		Page<Project> findAllByUserIdPaged(@Param("userId") Long userId, Pageable pageable);
	
	@Query(
		    value = "SELECT COUNT(*) FROM project_members pm WHERE pm.user_id = :userId",
		    nativeQuery = true
		)
		Long countProjectsByUserId(Long userId);

}

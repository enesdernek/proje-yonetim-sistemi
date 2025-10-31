package com.enesdernek.proje_yonetim_sistemi.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

	@Query(value = "SELECT * FROM tasks WHERE project_id = :projectId ORDER BY task_id DESC", countQuery = "SELECT COUNT(*) FROM tasks WHERE project_id = :projectId", nativeQuery = true)
	List<Task> getTasksByProjectIdPaged(Long projectId, Pageable pageable);

	@Query(
		    value = """
		        SELECT * FROM tasks 
		        WHERE project_id = :projectId 
		          AND assigned_user_id = :userId 
		        ORDER BY task_id DESC
		        """,
		    countQuery = """
		        SELECT COUNT(*) FROM tasks 
		        WHERE project_id = :projectId 
		          AND assigned_user_id = :userId
		        """,
		    nativeQuery = true
		)
	Page<Task> getTasksByProjectIdAndProjectMemberId(@Param("projectId") Long projectId,
			@Param("userId") Long userId, Pageable pageable);

	@Query(value = "SELECT COUNT(*) FROM tasks WHERE project_id = :projectId", nativeQuery = true)
	long countTasksByProjectId(@Param("projectId") Long projectId);

}

package com.enesdernek.proje_yonetim_sistemi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectRole;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long>{

	boolean existsByProjectAndUser(Project project, User user);
	
	Optional<ProjectMember> findByMemberIdAndProject_ProjectId(Long memberId,Long projectId);
	
	Optional<ProjectMember> findByUser_UserIdAndProject_ProjectId(Long userId,Long projectId);
	
	List<ProjectMember> getAllByProject_ProjectId(@Param("projectId") Long projectId);
	
	Optional<ProjectMember> deleteByUser_UserIdAndProject_ProjectId(Long deletedUserId,Long projectId);
	
	long countByProject_ProjectIdAndRole(Long projectId, ProjectRole role);
		
	@Query(
		    value = "DELETE FROM project_members WHERE user_id = :userId AND project_id = :projectId",
		    nativeQuery = true
		)
	@Modifying

	void deleteMember(@Param("userId") Long userId, @Param("projectId") Long projectId);
	
	long countByUser_UserId(Long userId);


}

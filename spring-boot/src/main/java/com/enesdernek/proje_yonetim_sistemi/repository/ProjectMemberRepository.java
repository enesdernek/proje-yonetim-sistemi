package com.enesdernek.proje_yonetim_sistemi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.Project;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectMember;
import com.enesdernek.proje_yonetim_sistemi.entity.User;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long>{

	boolean existsByProjectAndUser(Project project, User user);

}

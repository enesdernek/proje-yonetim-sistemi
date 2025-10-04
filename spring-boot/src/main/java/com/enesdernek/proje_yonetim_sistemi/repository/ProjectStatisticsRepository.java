package com.enesdernek.proje_yonetim_sistemi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.ProjectStatistics;

@Repository
public interface ProjectStatisticsRepository extends JpaRepository<ProjectStatistics, Long>{

}

package com.enesdernek.proje_yonetim_sistemi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>{

}

package com.enesdernek.proje_yonetim_sistemi.mapper;

import com.enesdernek.proje_yonetim_sistemi.dto.TaskDto;
import com.enesdernek.proje_yonetim_sistemi.dto.TaskDtoIU;
import com.enesdernek.proje_yonetim_sistemi.entity.Task;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class,ProjectMapper.class,ProjectMemberMapper.class})
public interface TaskMapper {

    TaskDto toDto(Task task);
    
    Task toEntity(TaskDtoIU taskDtoIU);

    List<TaskDto> toDtoList(List<Task> tasks);

    List<Task> toEntityList(List<TaskDtoIU> taskDtos);
}

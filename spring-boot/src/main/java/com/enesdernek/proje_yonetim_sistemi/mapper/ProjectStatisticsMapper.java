package com.enesdernek.proje_yonetim_sistemi.mapper;

import com.enesdernek.proje_yonetim_sistemi.dto.ProjectStatisticsDto;
import com.enesdernek.proje_yonetim_sistemi.entity.ProjectStatistics;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProjectMapper.class})
public interface ProjectStatisticsMapper {

    ProjectStatisticsDto toDto(ProjectStatistics statistics);

    ProjectStatistics toEntity(ProjectStatisticsDto statisticsDto);

    List<ProjectStatisticsDto> toDtoList(List<ProjectStatistics> statisticsList);

    List<ProjectStatistics> toEntityList(List<ProjectStatisticsDto> statisticsDtos);
}

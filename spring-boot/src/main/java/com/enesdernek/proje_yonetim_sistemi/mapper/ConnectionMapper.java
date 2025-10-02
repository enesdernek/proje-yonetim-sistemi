package com.enesdernek.proje_yonetim_sistemi.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionDtoIU;
import com.enesdernek.proje_yonetim_sistemi.entity.Connection;

@Mapper(componentModel = "spring")
public interface ConnectionMapper {
	
	ConnectionDto toDto(Connection connection);
	
	Connection toEntity(ConnectionDtoIU connectionDtoIU);
	
	List<ConnectionDto> toDtoList(List<Connection>connections);
	
	List<Connection> toEntityList(List<ConnectionDtoIU> connectionDtoIUs);

}

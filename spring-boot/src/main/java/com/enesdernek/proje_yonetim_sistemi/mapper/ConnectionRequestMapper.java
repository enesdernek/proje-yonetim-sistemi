package com.enesdernek.proje_yonetim_sistemi.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDto;
import com.enesdernek.proje_yonetim_sistemi.dto.ConnectionRequestDtoIU;
import com.enesdernek.proje_yonetim_sistemi.entity.ConnectionRequest;

@Mapper(componentModel = "spring")
public interface ConnectionRequestMapper {
	
	ConnectionRequestDto toDto(ConnectionRequest reuqest);
	
	ConnectionRequest toEntity(ConnectionRequestDtoIU connectionRequestDtoIU);
	
	List<ConnectionRequestDto> toDtoList(List<ConnectionRequest>reuqests);
	
	List<ConnectionRequest> toEntityList(List<ConnectionRequestDtoIU> connectionRequestDtoIUs);

}

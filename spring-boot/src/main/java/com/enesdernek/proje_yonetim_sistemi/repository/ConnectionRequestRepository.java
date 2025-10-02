package com.enesdernek.proje_yonetim_sistemi.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.enesdernek.proje_yonetim_sistemi.entity.ConnectionRequest;
import com.enesdernek.proje_yonetim_sistemi.entity.ConnectionRequestStatus;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long>{
	
    boolean existsBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, ConnectionRequestStatus status);

    @Query(value="SELECT * FROM connection_requests WHERE sender_id = :userId ORDER BY request_id DESC",nativeQuery=true)
    List<ConnectionRequest>getAllUsersSendedConnectionRequestsPagedByRequestIdDesc(Long userId,Pageable pageable);
    
    @Query(value="SELECT * FROM connection_requests WHERE receiver_id = :userId ORDER BY request_id DESC",nativeQuery=true)
    List<ConnectionRequest>getAllUsersReceivedConnectionRequestsPagedByRequestIdDesc(Long userId,Pageable pageable);

}

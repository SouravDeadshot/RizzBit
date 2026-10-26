package com.rizzbit.repository;

import com.rizzbit.model.GeofenceZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeofenceZoneRepository extends JpaRepository<GeofenceZone, String> {
    List<GeofenceZone> findByActiveTrue();
}

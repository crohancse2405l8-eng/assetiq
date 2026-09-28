CREATE DATABASE IF NOT EXISTS assetiq_dev;
USE assetiq_dev;

CREATE TABLE IF NOT EXISTS assets (
    assetId VARCHAR(50) NOT NULL,
    name VARCHAR(120) NOT NULL,
    equipmentType VARCHAR(80) NOT NULL,
    manufacturer VARCHAR(80) NOT NULL,
    model VARCHAR(80) NOT NULL,
    location VARCHAR(120) NOT NULL,
    status VARCHAR(40) NOT NULL,
    installDate DATE NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (assetId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS maintenance_reports (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    assetId VARCHAR(50) NOT NULL,
    symptom VARCHAR(255) NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    partsUsed VARCHAR(255) DEFAULT NULL,
    outcome VARCHAR(255) NOT NULL,
    technicianNotes TEXT NULL,
    timestamp DATETIME NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_maintenance_event (assetId, timestamp, symptom),
    KEY idx_maintenance_reports_asset (assetId),
    CONSTRAINT fk_maintenance_reports_asset FOREIGN KEY (assetId) REFERENCES assets(assetId)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

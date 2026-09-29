CREATE DATABASE IF NOT EXISTS assetiq
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE assetiq;

CREATE TABLE IF NOT EXISTS assets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  asset_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  location VARCHAR(255) NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_assets_asset_id (asset_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS maintenance_reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  asset_id VARCHAR(64) NOT NULL,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  symptom TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  action TEXT NOT NULL,
  parts_used TEXT NOT NULL,
  outcome TEXT NOT NULL,
  technician_notes TEXT NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_maintenance_reports_asset_timestamp (asset_id, `timestamp`, id),
  CONSTRAINT fk_maintenance_reports_asset
    FOREIGN KEY (asset_id)
    REFERENCES assets (asset_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

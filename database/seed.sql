USE assetiq;

-- Synthetic demo asset only; no maintenance history is fabricated.
INSERT IGNORE INTO assets (asset_id, name, `type`, location)
VALUES ('HVAC-204', 'Demo HVAC unit', 'HVAC', 'Synthetic demo location');
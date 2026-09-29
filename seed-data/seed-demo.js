const path = require('path');
const { createRequire } = require('module');
const backendRequire = createRequire(path.resolve(__dirname, '../backend/package.json'));
backendRequire('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
const mysql = backendRequire('mysql2/promise');

const DB_NAME = process.env.DB_NAME || 'assetiq';

const assets = [
  {
    assetId: 'HVAC-201',
    name: 'Rooftop AC Unit 201',
    equipmentType: 'Rooftop Packaged Unit',
    manufacturer: 'Trane',
    model: 'RTU-18',
    location: 'North Warehouse',
    status: 'Operational',
    installDate: '2021-03-15'
  },
  {
    assetId: 'HVAC-202',
    name: 'Split System 202',
    equipmentType: 'Split AC',
    manufacturer: 'Carrier',
    model: 'Infinity 24',
    location: 'South Office',
    status: 'Operational',
    installDate: '2022-05-02'
  },
  {
    assetId: 'HVAC-203',
    name: 'Air Handler 203',
    equipmentType: 'Air Handler',
    manufacturer: 'Daikin',
    model: 'AHU-36',
    location: 'Server Room',
    status: 'Operational',
    installDate: '2020-11-08'
  },
  {
    assetId: 'HVAC-204',
    name: 'Clinic RTU 204',
    equipmentType: 'Rooftop Packaged Unit',
    manufacturer: 'York',
    model: 'YVAA-18',
    location: 'Medical Clinic Roof',
    status: 'Needs Attention',
    installDate: '2019-09-14'
  },
  {
    assetId: 'HVAC-205',
    name: 'Retail Cooling Unit 205',
    equipmentType: 'Split AC',
    manufacturer: 'LG',
    model: 'Art Cool 30',
    location: 'Retail Front',
    status: 'Operational',
    installDate: '2023-02-18'
  },
  {
    assetId: 'HVAC-206',
    name: 'Process Cooling Unit 206',
    equipmentType: 'Process Air Conditioner',
    manufacturer: 'Mitsubishi',
    model: 'PUC-22',
    location: 'Production Floor',
    status: 'Operational',
    installDate: '2021-06-25'
  },
  {
    assetId: 'HVAC-207',
    name: 'Office Mini Split 207',
    equipmentType: 'Mini Split',
    manufacturer: 'Fujitsu',
    model: 'AOU-12',
    location: 'Executive Suite',
    status: 'Operational',
    installDate: '2022-12-11'
  },
  {
    assetId: 'HVAC-208',
    name: 'Warehouse Fan Coil 208',
    equipmentType: 'Fan Coil Unit',
    manufacturer: 'Johnson Controls',
    model: 'FCU-10',
    location: 'Loading Dock',
    status: 'Operational',
    installDate: '2021-07-03'
  },
  {
    assetId: 'HVAC-209',
    name: 'Plant AHU 209',
    equipmentType: 'Air Handler',
    manufacturer: 'Nortek',
    model: 'AHU-40',
    location: 'Plant West Wing',
    status: 'Operational',
    installDate: '2018-08-21'
  },
  {
    assetId: 'HVAC-210',
    name: 'Office RTU 210',
    equipmentType: 'Rooftop Packaged Unit',
    manufacturer: 'American Standard',
    model: 'Silver 16',
    location: 'East Campus',
    status: 'Operational',
    installDate: '2020-04-10'
  },
  {
    assetId: 'HVAC-211',
    name: 'Data Center Cooling 211',
    equipmentType: 'Computer Room AC',
    manufacturer: 'Liebert',
    model: 'CRAC-18',
    location: 'Server Floor',
    status: 'Needs Attention',
    installDate: '2017-05-19'
  },
  {
    assetId: 'HVAC-212',
    name: 'Classroom Split 212',
    equipmentType: 'Split AC',
    manufacturer: 'Panasonic',
    model: 'CU-9',
    location: 'North Classroom',
    status: 'Operational',
    installDate: '2021-10-15'
  },
  {
    assetId: 'HVAC-213',
    name: 'Lab Exhaust Unit 213',
    equipmentType: 'Exhaust Ventilation Unit',
    manufacturer: 'Greenheck',
    model: 'EV-20',
    location: 'Research Lab',
    status: 'Operational',
    installDate: '2022-09-02'
  },
  {
    assetId: 'HVAC-214',
    name: 'Valet Cooling Unit 214',
    equipmentType: 'Split AC',
    manufacturer: 'Bosch',
    model: 'BOVA 24',
    location: 'Auto Service Bay',
    status: 'Operational',
    installDate: '2019-12-06'
  },
  {
    assetId: 'HVAC-215',
    name: 'Training Room Unit 215',
    equipmentType: 'Packaged Terminal AC',
    manufacturer: 'LG',
    model: 'PTAC-12',
    location: 'Training Center',
    status: 'Operational',
    installDate: '2024-01-10'
  },
  {
    assetId: 'HVAC-216',
    name: 'Mechanical Room Unit 216',
    equipmentType: 'Air Handler',
    manufacturer: 'Trane',
    model: 'AHS-32',
    location: 'Mechanical Room',
    status: 'Operational',
    installDate: '2020-08-09'
  },
  {
    assetId: 'HVAC-217',
    name: 'Lobby AC 217',
    equipmentType: 'Split AC',
    manufacturer: 'Honeywell',
    model: 'LUX-18',
    location: 'Lobby',
    status: 'Operational',
    installDate: '2018-03-19'
  },
  {
    assetId: 'HVAC-218',
    name: 'Boiler Room Unit 218',
    equipmentType: 'Fan Coil Unit',
    manufacturer: 'SAB',
    model: 'FCU-14',
    location: 'Boiler Room',
    status: 'Operational',
    installDate: '2020-02-14'
  },
  {
    assetId: 'HVAC-219',
    name: 'Back Office Split 219',
    equipmentType: 'Split AC',
    manufacturer: 'Haier',
    model: 'Mini Flex 18',
    location: 'Back Office',
    status: 'Operational',
    installDate: '2022-06-17'
  },
  {
    assetId: 'HVAC-220',
    name: 'Atrium Cooling Unit 220',
    equipmentType: 'Rooftop Packaged Unit',
    manufacturer: 'Daikin',
    model: 'RTU-20',
    location: 'Atrium Roof',
    status: 'Operational',
    installDate: '2023-11-13'
  }
];

const reports = [
  {
    assetId: 'HVAC-203',
    symptom: 'Reduced airflow',
    diagnosis: 'Dirty filter restricting airflow',
    action: 'Replaced air filter',
    partsUsed: 'Air filter',
    outcome: 'Airflow restored',
    technicianNotes: 'Routine filter replacement during seasonal maintenance. Customer reported improved airflow immediately after service.',
    timestamp: '2024-02-15 09:00:00'
  },
  {
    assetId: 'HVAC-204',
    symptom: 'AC not cooling',
    diagnosis: 'Low refrigerant',
    action: 'Recharged refrigerant',
    partsUsed: 'None',
    outcome: 'Temporary improvement',
    technicianNotes: 'Customer mentioned the problem had occurred before.',
    timestamp: '2024-01-14 08:15:00'
  },
  {
    assetId: 'HVAC-204',
    symptom: 'AC stopped cooling again',
    diagnosis: 'Refrigerant leak near coil joint',
    action: 'Recharged refrigerant',
    partsUsed: 'None',
    outcome: 'Working temporarily',
    technicianNotes: 'Similar issue to previous visit.',
    timestamp: '2024-03-12 10:40:00'
  },
  {
    assetId: 'HVAC-204',
    symptom: 'Reduced cooling',
    diagnosis: 'Leak around coil joint',
    action: 'Sealed coil joint',
    partsUsed: 'Sealant',
    outcome: 'Working normally',
    technicianNotes: 'Third cooling-related complaint.',
    timestamp: '2024-06-08 09:20:00'
  },
  {
    assetId: 'HVAC-205',
    symptom: 'Thermostat cycling',
    diagnosis: 'Thermostat calibration drift',
    action: 'Recalibrated thermostat',
    partsUsed: 'Thermostat calibration kit',
    outcome: 'Stable temperature control',
    technicianNotes: 'Customer reported cycling during peak heat periods.',
    timestamp: '2023-11-22 14:10:00'
  },
  {
    assetId: 'HVAC-205',
    symptom: 'Uneven airflow',
    diagnosis: 'Blower wheel obstructed by debris',
    action: 'Cleaned blower wheel and housing',
    partsUsed: 'Cleaning brush',
    outcome: 'Balanced airflow restored',
    technicianNotes: 'Dust buildup found in intake side. No electrical faults observed.',
    timestamp: '2024-07-03 11:45:00'
  },
  {
    assetId: 'HVAC-206',
    symptom: 'Fan noise during startup',
    diagnosis: 'Fan motor bearing wear',
    action: 'Inspected and lubricated motor assembly',
    partsUsed: 'Motor lubricant',
    outcome: 'Noise reduced to normal levels',
    technicianNotes: 'Unit still within acceptable operating range; no replacement needed at this time.',
    timestamp: '2024-04-18 16:25:00'
  },
  {
    assetId: 'HVAC-209',
    symptom: 'Drain line backing up',
    diagnosis: 'Algae growth in condensate drain',
    action: 'Cleared condensate line and flushed drain',
    partsUsed: 'Drain cleaner',
    outcome: 'Drain function restored',
    technicianNotes: 'Follow-up inspection scheduled for next month.',
    timestamp: '2023-09-06 07:50:00'
  },
  {
    assetId: 'HVAC-209',
    symptom: 'Temperature sensor fault',
    diagnosis: 'Sensor drift causing inaccurate readings',
    action: 'Replaced temperature sensor',
    partsUsed: 'Temperature sensor',
    outcome: 'Control readings stable',
    technicianNotes: 'Replacement resolved offset readings.',
    timestamp: '2024-05-19 13:05:00'
  },
  {
    assetId: 'HVAC-210',
    symptom: 'Cooling capacity below setpoint',
    diagnosis: 'Low refrigerant charge',
    action: 'Checked refrigerant levels and adjusted charge',
    partsUsed: 'Refrigerant',
    outcome: 'Capacity returned to normal',
    technicianNotes: 'No signs of external leak at this inspection.',
    timestamp: '2024-02-12 12:30:00'
  },
  {
    assetId: 'HVAC-211',
    symptom: 'High room temperature',
    diagnosis: 'Condenser coil fouling',
    action: 'Cleaned condenser coil',
    partsUsed: 'Coil cleaner',
    outcome: 'Cooling recovery improved',
    technicianNotes: 'Unit was operating near limit during hot weather.',
    timestamp: '2023-06-11 10:20:00'
  },
  {
    assetId: 'HVAC-211',
    symptom: 'Intermittent cooling loss',
    diagnosis: 'Compressor contactor degradation',
    action: 'Replaced contactor',
    partsUsed: 'Contactor',
    outcome: 'Compressor start reliability restored',
    technicianNotes: 'Intermittent cycling had increased in the last two weeks.',
    timestamp: '2024-01-26 15:00:00'
  },
  {
    assetId: 'HVAC-211',
    symptom: 'Cooling performance dropping',
    diagnosis: 'Electrical connection resistance at condenser terminal',
    action: 'Tightened and cleaned terminal connections',
    partsUsed: 'Terminal cleaner',
    outcome: 'Voltage drop resolved',
    technicianNotes: 'Connection corrosion noted during inspection.',
    timestamp: '2024-08-17 08:40:00'
  },
  {
    assetId: 'HVAC-213',
    symptom: 'Inconsistent airflow',
    diagnosis: 'Loose blower motor electrical connection',
    action: 'Tightened and secured electrical connection',
    partsUsed: 'Electrical connector',
    outcome: 'Stable airflow restored',
    technicianNotes: 'Minor arcing signs observed at connection. Insulated terminals.',
    timestamp: '2023-12-04 09:15:00'
  },
  {
    assetId: 'HVAC-214',
    symptom: 'Excess vibration',
    diagnosis: 'Loose compressor mounting bracket',
    action: 'Re-secured compressor mount and inspected isolators',
    partsUsed: 'Mounting hardware',
    outcome: 'Vibration within normal range',
    technicianNotes: 'Noise was audible during startup but not after repair.',
    timestamp: '2023-08-09 07:20:00'
  },
  {
    assetId: 'HVAC-214',
    symptom: 'Reduced filtration efficiency',
    diagnosis: 'Dirty intake filter',
    action: 'Replaced intake filter',
    partsUsed: 'Air filter',
    outcome: 'Airflow normal after replacement',
    technicianNotes: 'Customer had delayed the last service visit.',
    timestamp: '2024-06-29 10:55:00'
  },
  {
    assetId: 'HVAC-216',
    symptom: 'Poor airflow in occupied zone',
    diagnosis: 'Supply duct restriction and dirty coil',
    action: 'Cleaned coil and removed blockage in supply run',
    partsUsed: 'Coil cleaner',
    outcome: 'Airflow improved',
    technicianNotes: 'Blocking debris was found near the main supply plenum.',
    timestamp: '2024-03-22 12:05:00'
  },
  {
    assetId: 'HVAC-217',
    symptom: 'Temperature swings',
    diagnosis: 'Thermostat sensor drift',
    action: 'Adjusted thermostat calibration',
    partsUsed: 'Calibration tool',
    outcome: 'Setpoint stabilization improved',
    technicianNotes: 'Customer described short cycling during occupied hours.',
    timestamp: '2023-04-12 08:00:00'
  },
  {
    assetId: 'HVAC-217',
    symptom: 'Reduced cooling output',
    diagnosis: 'Evaporator coil contamination',
    action: 'Coil cleaning and drain check',
    partsUsed: 'Coil cleaning solution',
    outcome: 'Cooling capacity recovered',
    technicianNotes: 'Visible dust buildup found on evaporator coil face.',
    timestamp: '2024-09-02 13:40:00'
  },
  {
    assetId: 'HVAC-219',
    symptom: 'Routine performance check',
    diagnosis: 'Normal wear; no active fault',
    action: 'Completed preventive maintenance',
    partsUsed: 'Inspection checklist',
    outcome: 'Unit operating within normal range',
    technicianNotes: 'Quarterly inspection found no corrective action required beyond routine service.',
    timestamp: '2024-01-09 09:00:00'
  }
];

function getDatabaseConfig() {
  if (!process.env.DB_USER) {
    throw new Error('DB_USER must be configured, matching the backend database settings.');
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    database: DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    dateStrings: true,
  };
}

function createDatabaseConnection() {
  return mysql.createConnection(getDatabaseConfig());
}

async function seedAsset(connection, asset) {
  await connection.execute(
    `INSERT INTO assets (asset_id, name, \`type\`, location)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), \`type\` = VALUES(\`type\`), location = VALUES(location)`,
    [asset.assetId, asset.name, asset.equipmentType, asset.location],
  );
}

async function seedReport(connection, report) {
  const [existing] = await connection.execute(
    'SELECT id FROM maintenance_reports WHERE asset_id = ? AND `timestamp` = ? AND symptom = ?',
    [report.assetId, report.timestamp, report.symptom],
  );

  if (existing.length > 1) {
    throw new Error(`Duplicate maintenance rows already exist for ${report.assetId} at ${report.timestamp}.`);
  }

  const values = [
    report.diagnosis,
    report.action,
    report.partsUsed,
    report.outcome,
    report.technicianNotes,
  ];

  if (existing.length === 1) {
    await connection.execute(
      `UPDATE maintenance_reports
       SET diagnosis = ?, action = ?, parts_used = ?, outcome = ?, technician_notes = ?
       WHERE id = ?`,
      [...values, existing[0].id],
    );
    return;
  }

  await connection.execute(
    `INSERT INTO maintenance_reports
      (asset_id, \`timestamp\`, symptom, diagnosis, action, parts_used, outcome, technician_notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [report.assetId, report.timestamp, report.symptom, ...values],
  );
}

async function assertSeededData(connection) {
  for (const asset of assets) {
    const [rows] = await connection.execute(
      'SELECT asset_id, name, `type`, location FROM assets WHERE asset_id = ?',
      [asset.assetId],
    );
    const row = rows[0];
    if (rows.length !== 1 || row.name !== asset.name || row.type !== asset.equipmentType || row.location !== asset.location) {
      throw new Error(`Asset verification failed for ${asset.assetId}.`);
    }
  }

  for (const report of reports) {
    const [rows] = await connection.execute(
      `SELECT symptom, diagnosis, action, parts_used, outcome, technician_notes,
              DATE_FORMAT(\`timestamp\`, '%Y-%m-%d %H:%i:%s') AS report_timestamp
       FROM maintenance_reports
       WHERE asset_id = ? AND \`timestamp\` = ? AND symptom = ?`,
      [report.assetId, report.timestamp, report.symptom],
    );
    const row = rows[0];
    if (
      rows.length !== 1 ||
      row.diagnosis !== report.diagnosis ||
      row.action !== report.action ||
      row.parts_used !== report.partsUsed ||
      row.outcome !== report.outcome ||
      row.technician_notes !== report.technicianNotes ||
      row.report_timestamp !== report.timestamp
    ) {
      throw new Error(`Maintenance report verification failed for ${report.assetId} at ${report.timestamp}.`);
    }
  }

  const assetIds = assets.map((asset) => asset.assetId);
  const placeholders = assetIds.map(() => '?').join(', ');
  const [noHistoryAssets] = await connection.execute(
    `SELECT a.asset_id, a.name
     FROM assets a
     LEFT JOIN maintenance_reports r ON r.asset_id = a.asset_id
     WHERE a.asset_id IN (${placeholders}) AND r.id IS NULL
     ORDER BY a.asset_id`,
    assetIds,
  );
  const expectedNoHistory = assets
    .filter((asset) => !reports.some((report) => report.assetId === asset.assetId))
    .map((asset) => asset.assetId);
  const actualNoHistory = noHistoryAssets.map((asset) => asset.asset_id);
  if (JSON.stringify(actualNoHistory) !== JSON.stringify(expectedNoHistory)) {
    throw new Error('No-history demo asset verification failed.');
  }

  console.log(`Verified ${assets.length} assets and ${reports.length} dated reports in ${DB_NAME}.`);
  console.log(`Assets without history: ${noHistoryAssets.map((asset) => asset.asset_id).join(', ') || 'none'}`);
}

async function seedDatabase() {
  const connection = await createDatabaseConnection();

  try {
    await connection.beginTransaction();
    for (const asset of assets) await seedAsset(connection, asset);
    for (const report of reports) await seedReport(connection, report);
    await connection.commit();
    await assertSeededData(connection);

    const [history] = await connection.execute(
      `SELECT \`timestamp\`, symptom, diagnosis, action, parts_used, outcome, technician_notes
       FROM maintenance_reports WHERE asset_id = ? ORDER BY \`timestamp\` ASC`,
      ['HVAC-204'],
    );
    console.log('HVAC-204 verified history:', JSON.stringify(history, null, 2));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

async function main() {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { assets, reports, createDatabaseConnection };

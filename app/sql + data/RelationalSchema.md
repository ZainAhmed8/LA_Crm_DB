## Main Relational Schema:
Report(record_no: INT [PK], user_id: INT [FK to User.user_id], date_rptd: DATE, date_occ:
DATE, time_occ: DATE, station_code: INT [FK to Station.station_cd], dist_no: INT, part: INT,
crm_cd: INT [FK to Crime.crm_cd], mo_code: INT, vict_age: INT, vict_sex: VARCHAR(1),
vict_descent: VARCHAR(1), premise_cd: INT [FK to Premise.premise_cd], weapon_cd: INT
[FK to Weapon.weapon_cd], status: VARCHAR(2) [FK to Status.status_cd], crm_cd1: INT,
crm_cd2: INT, crm_cd3: INT, crm_cd4: INT, location: VARCHAR(100), cross_street:
VARCHAR(100), latitude: Decimal, longitude: Decimal)
Crime(crm_cd: INT [PK], crm_desc)
Weapon(weapon_cd: INT [PK], weapon_desc)
Premise(premise_cd: INT [PK], premise_desc)
Station(station_cd: INT[PK], station_name)
Status(status_cd: INT[PK], status_desc)
User(user_id: INT[PK], first_name, last_name)
Research(research_id: INT[PK], user_id: INT [FK to User.user_id], age_filter: INT, sex_filter:
VARCHAR(1), descent_filter: VARCHAR(1), station_filter: INT, weapon_filter: INT,
crime_cd_filter: INT, latitude_filter: Decimal, longitude_filter: Decimal, notes:
VARCHAR(560))
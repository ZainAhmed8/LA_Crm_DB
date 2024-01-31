## Trigger:
```sql
DELIMITER //
CREATE TRIGGER UpdateReportStatusToIC AFTER UPDATE ON Report
FOR EACH ROW
BEGIN
    IF OLD.status <> 'IC' THEN
        UPDATE Report
        SET status = 'IC'
        WHERE record_no = NEW.record_no;
    END IF;
END;
//
DELIMITER ;
```

## Stored Procedure:
```sql
DELIMITER //
CREATE PROCEDURE CompareDists(IN distNo1 INT, IN distNo2 INT)
BEGIN
    DECLARE varCrmCd INT;
    DECLARE varTotalCrm INT;
    DECLARE varAvgVictAge DECIMAL(5, 2);
    DECLARE varDist VARCHAR(10);
    DECLARE varCrmDesc VARCHAR(255);
    DECLARE varRiskLevel VARCHAR(20);
    DECLARE done INT DEFAULT 0;

    DECLARE crm_cur CURSOR FOR
        SELECT 'District 1' AS district, r.crm_cd, c.crm_desc, COUNT(*) AS totalCrimes,
        AVG(r.vict_age) AS avgVictAge
        FROM Report r JOIN Crime c ON r.crm_cd = c.crm_cd
        WHERE r.dist_no = distNo1
        GROUP BY r.crm_cd
        UNION ALL
        SELECT 'District 2' AS district, r.crm_cd, c.crm_desc, COUNT(*) AS totalCrimes,
        AVG(r.vict_age) AS avgVictAge
        FROM Report r JOIN Crime c ON r.crm_cd = c.crm_cd
        WHERE r.dist_no = distNo2
        GROUP BY r.crm_cd;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    DROP TABLE IF EXISTS CrimeCompare;

    CREATE TABLE CrimeCompare (
        district VARCHAR(10),
        crmCd INT,
        crmDesc VARCHAR(255),
        totalCrimes INT,
        avgVictAge DECIMAL(5,2),
        riskLevel VARCHAR(20)
    );

    OPEN crm_cur;
    cloop: LOOP
    FETCH crm_cur INTO varDist, varCrmCd, varCrmDesc, varTotalCrm, varAvgVictAge;

    IF done = 1 THEN
        LEAVE cloop;
    END IF;

    IF varTotalCrm > 50 THEN
        SET varRiskLevel = 'Higher Risk';
    ELSE
        SET varRiskLevel = 'Lower Risk';
    END IF;

    INSERT INTO CrimeCompare (district, crmCd, crmDesc, totalCrimes, avgVictAge, riskLevel)
    VALUES (varDist, varCrmCd, varCrmDesc, varTotalCrm, varAvgVictAge, varRiskLevel);

    END LOOP;
    
    CLOSE crm_cur;
    
    SELECT district, crmCd, crmDesc, totalCrimes, avgVictAge, riskLevel
    FROM (SELECT district, crmCd, crmDesc, totalCrimes, avgVictAge, riskLevel
    FROM CrimeCompare
    WHERE totalCrimes > (SELECT AVG(totalCrimes) FROM CrimeCompare)
    UNION
    SELECT district, crmCd, crmDesc, totalCrimes, avgVictAge, riskLevel
    FROM CrimeCompare
    WHERE avgVictAge < (SELECT AVG(avgVictAge) FROM CrimeCompare)) AS total
    ORDER BY district, totalCrimes DESC, crmCd;
END;
//
DELIMITER ;
```
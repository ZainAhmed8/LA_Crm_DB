import mysql.connector
import numpy as np
import pandas as pd
import datetime

# CONSTANT VARIABLE DECL
DATA_SOURCE_PATH = '../data/crime_data.csv'
MYSQL_USER = 'root'
MYSQL_PASS = '1234567890'
MYSQL_HOST = '127.0.0.1'
MYSQL_DB = 'cs411'


def connect_db():
    try:
        cnx = mysql.connector.connect(user=MYSQL_USER,
                                      password=MYSQL_PASS,
                                      host=MYSQL_HOST,
                                      database=MYSQL_DB)
        return cnx
    except mysql.connector.Error as err:
        print(err)
        exit(-1)


def insert_record(cnx, table_name, column_list,
                  record_dict):  # modify for your particular table schema
    cols = ','.join(column_list)
    record = {}
    for col in column_list:
        record[col] = record_dict[col]
    record = record.values()
    value_list = ','.join(
        [f'"{str(i)}"' if str(i) != 'nan' else 'NULL' for i in record])
    # print(f'insert into {table_name} ({cols}) values ({value_list})')
    with cnx.cursor() as cursor:
        cursor.execute(
            f'insert into {table_name} ({cols}) values ({value_list})')
    cnx.commit()


def main():
    df = pd.read_csv(DATA_SOURCE_PATH)
    df.columns = [
        'record_no', 'date_rptd', 'date_occ', 'time_occ', 'station_cd',
        'station_name', 'dist_no', 'part', 'crm_cd', 'crm_desc', 'mo_code',
        'vict_age', 'vict_sex', 'vict_descent', 'premise_cd', 'premise_desc',
        'weapon_cd', 'weapon_desc', 'status_cd', 'status_desc', 'crm_cd1',
        'crm_cd2', 'crm_cd3', 'crm_cd4', 'location', 'cross_street',
        'latitude', 'longitude'
    ]
    num_records = float('inf')
    cnx = connect_db()
    seen = set()
    for record in df.itertuples():
        if num_records:
            record_dict = record._asdict()
            record_dict['date_rptd'] = (datetime.datetime.strptime(
                record_dict['date_rptd'],
                '%m/%d/%Y %H:%M:%S %p')).strftime('%Y-%m-%d %H:%M:%S')
            record_dict['date_occ'] = (datetime.datetime.strptime(
                record_dict['date_occ'],
                '%m/%d/%Y %H:%M:%S %p')).strftime('%Y-%m-%d %H:%M:%S')
            column_list = [
                'record_no', 'date_rptd', 'date_occ', 'time_occ', 'station_cd',
                'dist_no', 'part', 'crm_cd', 'mo_code', 'vict_age', 'vict_sex',
                'vict_descent', 'premise_cd', 'weapon_cd', 'status_cd',
                'crm_cd1', 'crm_cd2', 'crm_cd3', 'crm_cd4', 'location',
                'cross_street', 'latitude', 'longitude'
            ]
            # column_list = ['weapon_cd', 'weapon_desc']
            primary_key = 'record_no'
            table_name = 'Report'
            if str(record_dict[primary_key]) != 'nan' and (
                    record_dict[primary_key]) not in seen:
                insert_record(cnx, table_name, column_list, record_dict)
                seen.add(record_dict[primary_key])
                num_records -= 1
    cnx.close()


if __name__ == "__main__":
    main()

import certifi
import time
import sys
from datetime import timedelta, date
import datetime
import os

from variables import COUNTRIES, MONGO_URL
import json
import threading
import numpy
from sportmonks import SportMonksAPI
from pymongo import MongoClient
import pandas as pd
import boto3
from fixture_formatter import FixtureFormatter
s3 = boto3.client('s3')
bucket = "footyamigo-fixtures"

formatter = FixtureFormatter()

ca = certifi.where()

client = MongoClient(MONGO_URL, tlsCAFile=ca)
database = client.footyamigo
fixtures_col = database.fixtures

bucket = "footyamigo-fixtures"
nan = None


def upload_fixture(fixture):
    try:
        formatted_fixture = eval(str(formatter.format(fixture)))

        fixture_id = fixture.get("id")

        fixtures_col.update_one(
            {'fixture_id': fixture_id}, formatted_fixture, upsert=True)

    except Exception as e:
        print("\n", fixture["id"], e, "\n")


SAVE_TO_S3 = True


def save_to_s3(fixture, date):
    try:
        key = f"{date}/{fixture['id']}.json"
        return s3.put_object(Body=json.dumps(fixture), Bucket=bucket, Key=key)
    except Exception as e:
        print(e, key)



def save_data_for_date(date):
    sportmonks_date = date.strftime("%Y-%m-%d")
    s3_date = date.strftime("%Y/%m/%d")
    page = 1
    while True: 
        res = api.get_fixtures_by_date(sportmonks_date, page)
        print(
            f"\nPage {res['current_page']} out of {res['total_pages']}", s3_date)
        for fixture in res["data"]:
            if SAVE_TO_S3:
                save_to_s3(fixture, s3_date)
            upload_fixture(fixture)
            sys.stdout.write('\r'+str(fixture["id"]) + " success")

        if res["total_pages"] == res["current_page"]:
            break
        else:
            page += 1


api = SportMonksAPI()
one_day = timedelta(days=1)

_date = date.today()
NO_OF_THREADS = 5
days = 7
end_date = _date + timedelta(days=days)
while _date< end_date:
    dates = []
    for j in range(NO_OF_THREADS):
        dates.append(_date)
        _date += one_day
    tasks = []
    for d in dates:
        # self.convert_strategy_and_find_fixtures(strategy)
        t = threading.Thread(target=save_data_for_date,
                                args=(d,))
        tasks.append(t)
        t.start()
    for t in tasks:
        t.join()


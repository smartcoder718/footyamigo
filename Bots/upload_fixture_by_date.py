import certifi
import time
import sys
import datetime
import os

from variables import MONGO_URL
import json

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
fixtures_table = database.fixtures


nan = None


def upload_fixture(fixture):
    try:
        formatted_fixture = eval(str(formatter.format(fixture)))

        fixture_id = fixture.get("id")

        fixtures_table.update_one(
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

date = datetime.datetime(2021, 11, 1)
save_data_for_date(date)

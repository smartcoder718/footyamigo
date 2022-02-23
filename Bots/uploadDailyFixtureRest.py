import requests
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


def upload_fixtures(ids):
    include = ",".join(["goals",
                         "cards",
                         "corners",
                         "stats",
                        #  "probability",
                         "localTeam",
                         "visitorTeam",
                        #  "odds",
                         "league.country",
                         "events"])
    res = requests.get(
        "https://xqpq30njwk.execute-api.us-east-1.amazonaws.com/v1/fixtures?ids="+ids+"&include="+include)
    print(res.text)


def fire_and_forget(fixture_ids):
    print("Task started for", fixture_ids)
    threading.Thread(target=upload_fixtures,
                     args=(fixture_ids, )).start()


def save_data_for_date(date):
    sportmonks_date = date.strftime("%Y-%m-%d")
    s3_date = date.strftime("%Y/%m/%d")
    page = 1
    while True:
        res = api.get_fixtures_by_date(sportmonks_date, page, [])
        print(
            f"\nPage {res['current_page']} out of {res['total_pages']}", s3_date)
        fixtures = res["data"]
        i = 0

        while True:
            chunk = fixtures[i:i+30]
            if not len(chunk):
                break
            ids = [fixture["id"] for fixture in chunk]
            ids = map(str, ids)
            ids = ",".join(ids)
            fire_and_forget(ids)
            print("waiting 3 seconds")
            time.sleep(3)

            i += 30

        if res["total_pages"] == res["current_page"]:
            break
        else:
            page += 1


api = SportMonksAPI()
one_day = timedelta(days=1)

_date = date.today()
_date = date(2011, 1, 1)
# _date = _date - timedelta(days=2)
NO_OF_THREADS = 1
days = 365*(2021-2005)
end_date = _date + timedelta(days=days)
while _date <= end_date:
    dates = []
    for j in range(NO_OF_THREADS):
        if _date <= end_date:
            dates.append(_date)
        _date += one_day
    tasks = []

    for d in dates:
        save_data_for_date(d)
        # self.convert_strategy_and_find_fixtures(strategy)
    #     t = threading.Thread(target=save_data_for_date,
    #                          args=(d,))
    #     tasks.append(t)
    #     t.start()
    # for t in tasks:
    #     t.join()

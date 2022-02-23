from numpy import nan
from variables import COUNTRIES, MONGO_URL
from fieldtypes import result_fields, meanable
from pymongo import MongoClient, DESCENDING
from math import isnan
import json
import pandas as pd
from numpy import float64
import datetime
import time
import threading
import warnings
from collections import defaultdict
import certifi
import requests
import sys
ca = certifi.where()
warnings.simplefilter(action='ignore', category=FutureWarning)
client = MongoClient(MONGO_URL, tlsCAFile=ca)
footyamigo = client["footyamigo"]
fixtures_table = footyamigo["fixtures"]


def send_fixture_ids_for_aggregation(fixture_ids):
    url = "https://cqj2b71nbh.execute-api.us-east-1.amazonaws.com/default/fixture-stats-aggregator"
    payload = {
        "fixture_ids": fixture_ids,
        "type": "woolala"
    }
    # print(json.dumps(payload))
    # res = requests.post(url, json=json.dumps(payload),  headers={'Content-Type': 'application/x-www-form-urlencoded'})
    # res = requests.post(url, data=json.dumps(payload), headers={'Content-Type': 'application/x-www-form-urlencoded'})
    res = requests.post(url, json=payload, timeout=35)
    print(res.json())


CHUNK_SIZE = 5


def fire_and_forget(fixture_ids):
    print("Task started for", fixture_ids)
    threading.Thread(target=send_fixture_ids_for_aggregation,
                     args=(fixture_ids, )).start()


one_day = datetime.timedelta(hours=24)

today = datetime.date.today()
date = datetime.datetime(
    year=today.year, 
    month=today.month,
    day=today.day,
)

for x in range(1):
    # "home": {"$exists": False}
    fixtures = fixtures_table.find(
        {"date": date, "status": {"$nin": ["CANCL"]}}, {"fixture_id": 1})
    fixture_ids = [f["fixture_id"] for f in fixtures]
    print(len(fixture_ids), "FOUND for", date)

    while fixture_ids:
        ids_chunk = fixture_ids[:CHUNK_SIZE]
        # self.convert_strategy_and_find_fixtures(strategy)
        fire_and_forget(ids_chunk)
        time.sleep(1)
        del fixture_ids[:CHUNK_SIZE]

    date += one_day

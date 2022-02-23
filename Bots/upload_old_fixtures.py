import time
import sys
import certifi
import datetime
from sportmonks import SportMonksAPI
import os
from variables import MONGO_URL
import json
ca = certifi.where()


import numpy
from pymongo import MongoClient
import pandas as pd

from fixture_formatter import FixtureFormatter

formatter = FixtureFormatter()

client = MongoClient(MONGO_URL, tlsCAFile=ca)
database = client.footyamigo
fixtures_col = database.fixtures

bucket = "footyamigo-fixtures"
nan = None


def upload_fixture(fixture, key):
    try:
        formatted_fixture = eval(str(formatter.format(fixture)))
        fixture_id = fixture.get("id")
        fixtures_col.update_one({'fixture_id': fixture_id}, formatted_fixture, upsert=True)
        sys.stdout.write('\r'+f"Fixture ID: {key} upload success")
        #print(fixture_id, "success")
    except Exception as e:
        print("\n", key, e, "\n")

yesterday = (datetime.datetime.now() - datetime.timedelta(days=1))

old_games = fixtures_col.find(
    {
        "status": {"$in": ["LIVE", "HT", "PEN_LIVE"]},
        "date": {"$lt": yesterday},
    }, {"fixture_id": 1, "_id":-1})

fixture_ids = [f["fixture_id"] for f in old_games]

api = SportMonksAPI()
page = 1
while fixture_ids:
    ids_chunk = fixture_ids[:100]
    res = api.get_fixtures_by_ids(ids_chunk,page)
    for fixture in res["data"]:
        upload_fixture(fixture, fixture["id"])
    del fixture_ids[:100]
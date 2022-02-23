import certifi
import time
import sys
import datetime
import os
from variables import COUNTRIES, MONGO_URL
import json
import numpy
from sportmonks import SportMonksAPI
from pymongo import MongoClient
import pandas as pd
from fixture_formatter import FixtureFormatter

formatter = FixtureFormatter()

ca = certifi.where()

client = MongoClient(MONGO_URL, tlsCAFile=ca)
database = client.footyamigo
fixtures_col = database.fixtures

bucket = "footyamigo-fixtures"
nan = None


def upload_fixture(fixture, key):
    try:
        formatted_fixture = eval(str(formatter.format(fixture)))
        fixture_id = fixture.get("id")
        fixtures_col.update_one(
            {'fixture_id': fixture_id},  formatted_fixture, upsert=True)
        response = {
            "statusCode": 200,
            "body": f"Fixture ID: {key} upload success"
        }

        sys.stdout.write('\r'+str(key) + " success")
        #print(fixture_id, "success")
        return response
    except Exception as e:
        print("\n", key, e, "\n")


api = SportMonksAPI()

res = api.get_fixtures_by_team_id(team_id=238093, season_id=18110)
for fixture in res["data"]:
    print(upload_fixture(fixture, fixture["id"]))

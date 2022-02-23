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

picks_table = database.picks
nan = None

# for fixture_id in picks_table.distinct("fixture_id", {"home_name": {"$exists": False}}):
#     fixture = fixtures_table.find_one({"fixture_id": fixture_id}, {
#                                       "home_name": 1, "away_name": 1})
#     res= picks_table.update_many({'fixture_id': fixture_id}, {"$set": {
#                             "home_name": fixture["home_name"], "away_name": fixture["away_name"]}})
#     print(res)
from itertools import product
with open("hit_rates.csv", "a") as writer:
  for a, b ,c , d ,e,f ,g, h in product(range(1,40), range(1,40), range(50,100), range(2,15), range(2,15), range(40,100), range(50,100), range(50,100) ):
    condition = {
      "$and": [
        {
          "home.played_overall": {
            "$gte": a,
            "$lte": 60
          }
        },
        {
          "away.played_overall": {
            "$gte": b,
            "$lte": 60
          }
        },
        {
          "home.o25_goals_overall_per": {
            "$gte": c,
            "$lte": 100
          }
        },
        {
          "home.total_goals_overall_avg": {
            "$gte": d,
            "$lte": 15
          }
        },
        {
          "away.total_goals_overall_avg": {
            "$gte": e,
            "$lte": 15
          }
        },
        {
          "probability.o25_goals_probability": {
            "$gte": f,
            "$lte": 100
          }
        },
        {
          "home.scored_o05_home_per": {
            "$gte": g,
            "$lte": 100
          }
        },
        {
          "away.scored_o05_away_per": {
            "$gte": h,
            "$lte": 100
          }
        }
      ]
    }

    fixtures_found = fixtures_table.count_documents(condition)
    # condition.update(outcome_condition)
    hits_found = fixtures_table.count_documents({**condition, "result.o25_goals": True})
    hit_rate = round(hits_found/(fixtures_found or 1)*100, 2)
    print(fixtures_found, hits_found, hit_rate, [a,b,c,d,e,f,g,h])
    writer.write(f"{fixtures_found}, {hits_found}, {hit_rate}, {[a,b,c,d,e,f,g,h]}")
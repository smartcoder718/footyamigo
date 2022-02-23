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
import sys
ca = certifi.where()
warnings.simplefilter(action='ignore', category=FutureWarning)
client = MongoClient(MONGO_URL, tlsCAFile=ca)
footyamigo = client["footyamigo"]
fixtures_table = footyamigo["fixtures"]


def pretty(d, indent=0):
    for key, value in d.items():
        print('\t' * indent + str(key))
        if isinstance(value, dict):
            pretty(value, indent+1)
        else:
            print('\t' * (indent+1) + str(value))


def get_avg(value, total):
    return round(float(value/total), 2) if total else None


def get_fixtures(team_ids, timestamp, season_id):
    fixtures = fixtures_table.aggregate([
        {
            "$match":  {
                "$or": [
                    {"home_id": {"$in": team_ids}},
                    {"away_id": {"$in": team_ids}}
                ],
                "timestamp": {
                    "$lt": timestamp
                },
                "season_id": season_id,
                "status": {"$in": ['FT', 'FT_PEN']},
            },
        },
        {
            "$project": {
                "home_id": 1,
                "away_id": 1,
                "timestamp": 1,
                "season_id": 1,
                "status": 1,
                "fixture_id": 1,
                "result": 1,
            }
        },
        {
            "$sort": {
                "timestamp": -1
            }
        }
    ]

        # {"pre_odds": -1, "live_odds": -1, "peak_odds": -
        #     1, "stats": -1, "probability": -1, "weather": -1}
    )
    formatted = []
    for fixture in fixtures:

        result = fixture.pop("result")
        result.update(fixture)
        formatted.append(result)
    df = pd.DataFrame(list(formatted))
    # print(df["timestamp"])
    # print(*list(df.columns), sep="\n")
    for key, value in result_fields.items():
        try:
            df[key] = df[key].astype(value)
        except:
            pass

    return df


def round_if_not_nan(number, multiplier, decimal=0):
    if not pd.isna(number):
        return round(float(number*multiplier), decimal)


def make_aggregate(df, team_id, fixture_id, last_x, team, limit):
    if df.empty:
        return
    per_maps = {
        "won": ["home_win", "away_win"],
        "drawn": ["draw", "draw"],
        "lost": ["away_win", "home_win"],
        "fts": ["home_fts", "away_fts"],
        "goal_difference": ["home_goal_difference", "away_goal_difference"],
        "btts": ["btts", "btts"],
        "o05_goals_1h": ["o05_goals_1h", "o05_goals_1h"],
        "o15_goals_1h": ["o15_goals_1h", "o15_goals_1h"],
        "o05_goals_2h": ["o05_goals_2h", "o05_goals_2h"],
        "o15_goals_2h": ["o15_goals_2h", "o15_goals_2h"],
        "clean_sheets": ["home_clean_sheets", "away_clean_sheets"],
        "most_goals_1h": ["most_goals_1h", "most_goals_1h"],  # NEW
        "most_goals_2h": ["most_goals_2h", "most_goals_2h"],  # NEW
        "goals_after_75":  ["goals_after_75", "goals_after_75"],
        "goals_before_30":  ["goals_before_30", "goals_before_30"],
        "btts_o25": ["btts_o25", "btts_o25"],
        "o05_goals": ["o05_goals", "o05_goals"],
        "o15_goals": ["o15_goals", "o15_goals"],
        "o25_goals": ["o25_goals", "o25_goals"],
        "o35_goals": ["o35_goals", "o35_goals"],
        "o55_corners": ["o55_corners", "o55_corners"],
        "o65_corners": ["o65_corners", "o65_corners"],
        "o75_corners": ["o75_corners", "o75_corners"],
        "o85_corners": ["o85_corners", "o85_corners"],
        "o95_corners": ["o95_corners", "o95_corners"],
        "o105_corners": ["o105_corners", "o105_corners"],
        "o115_corners": ["o115_corners", "o115_corners"],
        "o125_corners": ["o125_corners", "o125_corners"],
        "o25_cards": ["o25_cards", "o25_cards"],
        "o35_cards": ["o35_cards", "o35_cards"],
        "o45_cards": ["o45_cards", "o45_cards"],
        "o55_cards": ["o55_cards", "o55_cards"],
        "o65_cards": ["o65_cards", "o65_cards"],
        "btts_o25": ["btts_o25", "btts_o25"],
        "o25_corners_1h": ["o25_corners_1h", "o25_corners_1h"],
        "o35_corners_1h": ["o35_corners_1h", "o35_corners_1h"],
        "o45_corners_1h": ["o45_corners_1h", "o45_corners_1h"],
        "o55_corners_1h": ["o55_corners_1h", "o55_corners_1h"],
        "won_at_ht": ["home_win_ht", "away_win_ht"],
        "drawn_at_ht": ["draw_ht", "draw_ht"],
        "lost_at_ht": ["away_win_ht", "home_win_ht"],
        "corners_between_35_45": ["corners_between_35_45", "corners_between_35_45"],
        "corners_between_80_90": ["corners_between_80_90", "corners_between_80_90"],
        "goals_between_35_45": ["goals_between_35_45", "goals_between_35_45"],
        "goals_between_80_90": ["goals_between_80_90", "goals_between_80_90"],
        "no_goals": ["no_goals", "no_goals"],
        "no_goals_1h": ["no_goals_1h", "no_goals_1h"],
        "no_goals_2h": ["no_goals_2h", "no_goals_2h"],
        "btts_or_o25": ["btts_or_o25", "btts_or_o25"],
        "goals_between_0_15": ["goals_between_0_15", "goals_between_0_15"],
        "goals_between_0_15_for": ["goals_between_0_15_home", "goals_between_0_15_away"],
        "goals_between_0_15_against": ["goals_between_0_15_away", "goals_between_0_15_home"],
        "corners_between_0_10": ["corners_between_0_10", "corners_between_0_10"],
        "corners_between_0_10_for": ["corners_between_0_10_home", "corners_between_0_10_away"],
        "corners_between_0_10_against": ["corners_between_0_10_away", "corners_between_0_10_home"],
        "scored_o05": ["o05_home_goals", "o05_away_goals"],
        "scored_o15": ["o15_home_goals", "o15_away_goals"],
        "scored_o25": ["o25_home_goals", "o25_away_goals"],
        "scored_o05_1h": ["o05_home_goals_1h", "o05_away_goals_1h"],
        "scored_o15_1h": ["o15_home_goals_1h", "o15_away_goals_1h"],
        "scored_o05_2h": ["o05_home_goals_2h", "o05_away_goals_2h"],
        "scored_o15_2h": ["o15_home_goals_2h", "o15_away_goals_2h"],
        "scored_after_70": ["home_goals_after_70", "away_goals_after_70"],
        "conceded_after_70": ["away_goals_after_70", "home_goals_after_70"],
        "goals_after_70": ["goals_after_70", "goals_after_70"],
        "scored_first": ["home_scored_first", "away_scored_first"],
        "conceded_o05": ["o05_away_goals", "o05_home_goals"],
        "conceded_o15": ["o15_away_goals", "o15_home_goals"],
        "conceded_o25": ["o25_away_goals", "o25_home_goals"],
        "conceded_o05_1h": ["o05_away_goals_1h", "o05_home_goals_1h"],
        "conceded_o15_1h": ["o15_away_goals_1h", "o15_home_goals_1h"],
        "conceded_o05_2h": ["o05_away_goals_2h", "o05_home_goals_2h"],
        "conceded_o15_2h": ["o15_away_goals_2h", "o15_home_goals_2h"],
        "btts_1h": ["btts_1h", "btts_1h"],
        "btts_2h": ["btts_2h", "btts_2h"],
        "o05_cards_for": ["o05_home_cards", "o05_away_cards"],
        "o15_cards_for": ["o15_home_cards", "o15_away_cards"],
        "o25_cards_for": ["o25_home_cards", "o25_away_cards"],
        "o35_cards_for": ["o35_home_cards", "o35_away_cards"],
        "o05_cards_for_1h": ["o05_home_cards_1h", "o05_away_cards_1h"],
        "o15_cards_for_1h": ["o15_home_cards_1h", "o15_away_cards_1h"],
        "o05_cards_against_1h": ["o05_away_cards_1h", "o05_home_cards_1h"],
        "o15_cards_against_1h": ["o15_away_cards_1h", "o15_home_cards_1h"],
        "o05_cards_for_2h": ["o05_home_cards_2h", "o05_away_cards_2h"],
        "o15_cards_for_2h": ["o15_home_cards_2h", "o15_away_cards_2h"],
        "o05_cards_against_2h": ["o05_away_cards_2h", "o05_home_cards_2h"],
        "o15_cards_against_2h": ["o15_away_cards_2h", "o15_home_cards_2h"],
        "o05_cards_against": ["o05_away_cards", "o05_home_cards"],
        "o15_cards_against": ["o15_away_cards", "o15_home_cards"],
        "o25_cards_against": ["o25_away_cards", "o25_home_cards"],
        "o35_cards_against": ["o35_away_cards", "o35_home_cards"],
    }
    avg_maps = {
        "points": ["home_points", "away_points"],
        "scored": ["home_goals", "away_goals"],
        "scored_1h": ["home_goals_1h", "away_goals_1h"],
        "scored_2h": ["home_goals_2h", "away_goals_2h"],
        "conceded": ["away_goals", "home_goals"],
        "conceded_1h": ["away_goals_1h", "home_goals_1h"],
        "conceded_2h": ["away_goals_2h", "home_goals_2h"],
        "corners_for": ["home_corners", "away_corners"],
        "corners_against": ["away_corners", "home_corners"],
        "cards_for": ["home_cards", "away_cards"],
        "cards_against": ["away_cards", "home_cards"],
        "cards_total": ["total_cards", "total_cards"],
        "cards_for_1h": ["home_cards_1h", "away_cards_1h"],
        "cards_against_1h": ["away_cards_1h", "home_cards_1h"],
        "cards_total_1h": ["cards_1h", "cards_1h"],
        "cards_for_2h": ["home_cards_2h", "away_cards_2h"],
        "cards_against_2h": ["away_cards_2h", "home_cards_2h"],
        "cards_total_2h": ["cards_2h", "cards_2h"],
        "corners_for_1h": ["home_corners_1h", "away_corners_1h"],
        "corners_against_1h": ["away_corners_1h", "home_corners_1h"],
        "corners_total_1h": ["corners_1h", "corners_1h"],
        "corners_for_2h": ["home_corners_2h", "away_corners_2h"],
        "corners_against_2h": ["away_corners_2h", "home_corners_2h"],
        "corners_total_2h": ["corners_2h", "corners_2h"],
        "corners_total": ["total_corners", "total_corners"],
        "offsides": ["offsides", "offsides"],
        "offsides_for": ["home_offsides", "away_offsides"],
        "offsides_against": ["away_offsides", "home_offsides"],
        "total_goals": ["total_goals", "total_goals"],
    }
    df = df.loc[(df['home_id'] == team_id) | (df['away_id'] == team_id)]
    df = df[:limit]
    df_home = df.loc[df['home_id'] == team_id]
    df_away = df.loc[df['away_id'] == team_id]
    #averagble_columns = [key for key, datatype in df.dtypes.items() if isinstance(datatype, float) or isinstance(datatype, int)]
    df_home_sum = df_home.sum()
    df_away_sum = df_away.sum()
    df_avg = df.mean()
    df_home_avg = df_home.mean()
    df_away_avg = df_away.mean()
    df_home_count = df_home.count()
    df_away_count = df_away.count()
    first_corner_total_avg = round(df_avg["first_total_corner"], 2)
    first_corner_against_avg = get_avg(df_home_sum["first_away_corner"] + df_away_sum["first_home_corner"],
                                       df_home_count["first_away_corner"] + df_away_count["first_home_corner"])
    first_corner_for_avg = get_avg(df_home_sum["first_home_corner"] + df_away_sum["first_away_corner"],
                                   df_home_count["first_home_corner"] + df_away_count["first_away_corner"])
    first_goal_total_avg = round(df_avg["first_total_goal"], 2)
    first_goal_against_avg = get_avg(df_home_sum["first_away_goal"] + df_away_sum["first_home_goal"],
                                     df_home_count["first_away_goal"] + df_away_count["first_home_goal"])
    first_goal_for_avg = get_avg(df_home_sum["first_home_goal"] + df_away_sum["first_away_goal"],
                                 df_home_count["first_home_goal"] + df_away_count["first_away_goal"])

    goal_timings_for = pd.concat(
        [df_home["goal_timings_home"], df_away["goal_timings_away"]])
    goal_timings_for = [
        j for i in goal_timings_for for j in i]
    goal_timings_against = pd.concat(
        [df_home["goal_timings_away"], df_away["goal_timings_home"]])
    goal_timings_against = [
        j for i in goal_timings_against for j in i]

    goal_timings_all = goal_timings_for + goal_timings_against
    goal_timings_mean = get_avg(sum(goal_timings_all), len(goal_timings_all))
    corner_timings_for = pd.concat(
        [df_home["corner_timings_home"], df_away["corner_timings_away"]])
    corner_timings_for = [
        j for i in corner_timings_for for j in i]
    corner_timings_against = pd.concat(
        [df_home["corner_timings_away"], df_away["corner_timings_home"]])
    corner_timings_against = [
        j for i in corner_timings_against for j in i]
    corner_timings_all = corner_timings_for + corner_timings_against
    corner_timings_mean = get_avg(
        sum(corner_timings_all), len(corner_timings_all))

    data = {
        "team_id": team_id,
        "fixture_id": fixture_id,
        "type": last_x,
        "team": team,
        "played_home": len(df_home),
        "played_away": len(df_away),
        "played_overall": len(df),
        "first_corner_total_avg": first_corner_total_avg,
        "first_corner_against_avg": first_corner_against_avg,
        "first_corner_for_avg": first_corner_for_avg,
        "first_goal_total_avg": first_goal_total_avg,
        "first_goal_against_avg": first_goal_against_avg,
        "first_goal_for_avg": first_goal_for_avg,
        "goal_timings_for": goal_timings_for,
        "goal_timings_against": goal_timings_against,
        "goal_timings_all": goal_timings_all,
        "goal_timings_mean": goal_timings_mean,
        "corner_timings_for": corner_timings_for,
        "corner_timings_against": corner_timings_against,
        "corner_timings_all": corner_timings_all,
        "corner_timings_mean": corner_timings_mean

    }
    for key, (h, a) in per_maps.items():
        if h in df_home_sum and a in df_away_sum:
            data[key+"_home"] = df_home_sum[h]
            data[key+"_away"] = df_away_sum[a]
            data[key+"_overall"] = data[key+"_home"] + data[key+"_away"]

            data[key+"_home_per"] = round_if_not_nan(df_home_avg[h], 100)
            data[key+"_away_per"] = round_if_not_nan(df_away_avg[a], 100)
            data[key +
                 "_overall_per"] = round_if_not_nan(pd.concat([df_home[h], df_away[a]]).mean(), 100)

    for key, (h, a) in avg_maps.items():
        if h in df_home_sum and a in df_away_sum:
            data[key+"_home"] = df_home_sum[h]
            data[key+"_away"] = df_away_sum[a]
            data[key+"_overall"] = data[key+"_home"] + data[key+"_away"]
            data[key+"_home_avg"] = round_if_not_nan(df_home_avg[h], 1, 2)
            data[key+"_away_avg"] = round_if_not_nan(df_away_avg[a], 1, 2)
            data[key +
                 "_overall_avg"] = round_if_not_nan(pd.concat([df_home[h], df_away[a]]).mean(), 1, 2)

    del data["goal_difference_home_per"]
    del data["goal_difference_away_per"]
    del data["goal_difference_overall_per"]

    return data


def find_fixture_and_aggregate(fixture_id):
    fixture = fixtures_table.find_one(
        {"fixture_id": fixture_id}, {"home_id": 1, "away_id": 1, "season_id": 1, "timestamp": 1, "fixture_id": 1})
    #print("Aggregating", fixture_id)
    teams = {"home": fixture["home_id"], "away": fixture["away_id"]}
    team_ids = list(teams.values())
    df = get_fixtures(team_ids,
                      season_id=fixture["season_id"], timestamp=fixture["timestamp"])

    limits = {'last_5': 5, 'last_7': 7,
              'last_10': 10, 'last_25': 25}

    upload = {
        "home": None,
        "away": None
    }
    for team, team_id in teams.items():
        upload[team] = make_aggregate(df=df, team_id=team_id, fixture_id=fixture_id,
                                      last_x="all", team=team, limit=100)
        for last_x, limit in limits.items():
            if not upload[team]:
                continue
            data = make_aggregate(df=df, team_id=team_id, fixture_id=fixture_id,
                                  last_x=last_x, team=team, limit=limit)
            upload[team][last_x] = data

    #data = pd.DataFrame(upload).to_json()
    # with open("laora.json", "w") as f:
    #     f.write(data)

    # exit()
    #insert_data = json.loads(data)
    insert_data = eval(str(upload))

    fixtures_table.update_one(
        {"fixture_id": fixture_id}, {"$set": insert_data,  "$unset": {"aggregate_stats": 1}})
    sys.stdout.write('\r'+str(fixture_id) + " done")
    #print(upload_aggregates(aggregates, fixture_id))


CHUNK_SIZE = 20


one_day = datetime.timedelta(hours=24)

date = datetime.datetime(2021, 10, 28)

for x in range(10):
    fixtures = fixtures_table.find(
        {"date": date, "status": {"$nin": ["CANCL"]}, "home": {"$exists": False}}, {"fixture_id": 1})
    fixture_ids = [f["fixture_id"] for f in fixtures]
    print(len(fixture_ids), "FOUND for", date)
    while fixture_ids:
        begin = time.time()
        ids_chunk = fixture_ids[:CHUNK_SIZE]
        tasks = []
        for _id in ids_chunk:
            # self.convert_strategy_and_find_fixtures(strategy)
            t = threading.Thread(target=find_fixture_and_aggregate,
                                 args=(_id,))
            tasks.append(t)
            t.start()
        for t in tasks:
            t.join()

        end = time.time()
        del fixture_ids[:CHUNK_SIZE]
        print("\n", len(fixture_ids), "REMAINING for", date)
        print(f"Done in {end - begin}")
    date += one_day

import certifi
from dotenv import dotenv_values
from pymongo import MongoClient
from collections.abc import MutableMapping
import pandas as pd
from numpy import nan
import pymongo


def flatten(d, parent_key='', sep='_'):
    items = []
    for k, v in d.items():
        new_key = parent_key + sep + k if parent_key else k
        if isinstance(v, MutableMapping):
            items.extend(flatten(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)


class FixtureFormatter:

    def __init__(self):
        pass

    @staticmethod
    def __format_goals(fixture, important):
        home_id = fixture["home_id"]
        away_id = fixture["away_id"]
        goals = fixture["goals_json"]
        if goals:
            df = pd.DataFrame(goals)
        else:
            df = pd.DataFrame(columns=['minute', 'team_id'])
        df["team_id"] = df["team_id"].astype(int)
        df_home = df[df['team_id'] == home_id]
        df_away = df[df['team_id'] == away_id]
        df_1h = df[df['minute'] <= 45]
        df_2h = df[df['minute'] > 45]
        df_home_1h = df_1h.merge(df_home)
        df_home_2h = df_2h.merge(df_home)
        df_away_1h = df_1h.merge(df_away)
        df_away_2h = df_2h.merge(df_away)
        goal_timings_all = df['minute'].tolist()
        goal_timings_home = df_home['minute'].tolist()
        goal_timings_away = df_away['minute'].tolist()
        goal_timings_mean = round(df['minute'].mean(), 2)
        home_goals = important.get("home_goals") or len(df_home)
        away_goals = important.get("away_goals") or len(df_away)
        goals_1h = len(df_1h)
        goals_2h = len(df_2h)
      
        no_goals = df.empty
        no_goals_1h = df_1h.empty
        no_goals_2h = df_2h.empty
        home_goals_1h = len(df_home_1h)
        away_goals_1h = len(df_away_1h)
        home_goals_2h = len(df_home_2h)
        away_goals_2h = len(df_away_2h)
        no_home_goals = not home_goals
        no_away_goals = not away_goals
        ft_score = fixture["scores"]["ft_score"]
        ht_score = fixture["scores"]["ht_score"]
        if ft_score:
            try:
                home_goals, away_goals = map(int,ft_score.split(""))
            except:
                pass
        if ht_score:
            try:
                home_goals_1h, away_goals_1h = map(int,ht_score.split(""))
                home_goals_2h, away_goals_2h = (home_goals - home_goals_1h),  (away_goals - away_goals_1h), 
            except:
                pass
            
        goals = home_goals + away_goals
        btts = (not no_home_goals) and (not no_away_goals)
        btts_1h = (not df_home_1h.empty) and (not df_away_1h.empty)
        btts_2h = (not df_home_2h.empty) and (not df_away_2h.empty)

        overs = dict()
        for i in range(0, 6):
            overs[f"o{i}5_goals"] = goals > i

        for i in range(2):
            overs[f"o{i}5_1h_goals"] = goals_1h > i
            overs[f"o{i}5_2h_goals"] = goals_2h > i

        for i in range(3):
            overs[f"o{i}5_home_goals"] = home_goals > i
            overs[f"o{i}5_away_goals"] = away_goals > i

        for i in range(2):
            overs[f"o{i}5_1h_home_goals"] = home_goals_1h > i
            overs[f"o{i}5_2h_home_goals"] = home_goals_2h > i
            overs[f"o{i}5_1h_away_goals"] = away_goals_1h > i
            overs[f"o{i}5_2h_away_goals"] = away_goals_2h > i

        btts_or_o25 = btts or overs["o25_goals"]
        btts_o25 = btts and overs["o25_goals"]
        home_goal_difference = home_goals - away_goals
        away_goal_difference = away_goals - home_goals
        home_fts = not home_goals
        away_fts = not away_goals
        home_clean_sheets = not away_goals
        away_clean_sheets = not home_goals
        home_scored_first = len(df_home) and df.iloc[0]["team_id"] == home_id
        away_scored_first = len(df_away) and df.iloc[0]["team_id"] == away_id
        home_win = home_goals > away_goals
        away_win = away_goals > home_goals
        draw = home_goals == away_goals
        home_points = 3 if home_win else (1 if draw else 0)
        away_points = 3 if away_win else (1 if draw else 0)
        draw_ht = home_goals_1h == away_goals_1h
        home_win_ht = home_goals_1h > away_goals_1h
        away_win_ht = home_goals_1h < away_goals_1h

        goals_between_85_90 = not df[(
            df["minute"] >= 85) & (df["minute"] <= 90)].empty
        goals_between_75_90 = not df[(
            df["minute"] >= 75) & (df["minute"] <= 90)].empty
        goals_between_35_45 = not df[(
            df["minute"] >= 35) & (df["minute"] <= 45)].empty
        goals_between_80_90 = not df[(
            df["minute"] >= 80) & (df["minute"] <= 90)].empty
        goals_between_40_45 = not df[(
            df["minute"] >= 40) & (df["minute"] <= 45)].empty
        goals_between_0_15 = not df[(df["minute"] >= 0) & (
            df["minute"] <= 15)].empty
        goals_between_0_10 = not df[(df["minute"] >= 0) & (
            df["minute"] <= 10)].empty
        goals_between_0_15_home = not df_home[(
            df_home["minute"] >= 0) & (df_home["minute"] <= 15)].empty
        goals_between_0_15_away = not df_away[(
            df_away["minute"] >= 0) & (df_away["minute"] <= 15)].empty
        goals_after_70 = not df[(df["minute"] > 70)].empty
        home_goals_after_70 = not df_home[(df_home["minute"] > 70)].empty
        away_goals_after_70 = not df_away[(df_away["minute"] > 70)].empty
        first_total_goal = goal_timings_all[0] if goal_timings_all else None
        first_home_goal = goal_timings_home[0] if goal_timings_home else None
        first_away_goal = goal_timings_away[0] if goal_timings_away else None

        return {
            'goal_timings_all': goal_timings_all,
            'goal_timings_home': goal_timings_home,
            'goal_timings_away': goal_timings_away,
            'home_goals': home_goals,
            'away_goals': away_goals,
            'total_goals': goals,
            'goals_1h': goals_1h,
            'goals_2h': goals_2h,
            'no_goals': no_goals,
            'no_goals_1h': no_goals_1h,
            'no_goals_2h': no_goals_2h,
            'home_goals_1h': home_goals_1h,
            'away_goals_1h': away_goals_1h,
            'home_goals_2h': home_goals_2h,
            'away_goals_2h': away_goals_2h,
            'no_home_goals': no_home_goals,
            'no_away_goals': no_away_goals,
            'btts': btts,
            'btts_1h': btts_1h,
            'btts_2h': btts_2h,
            'btts_or_o25': btts_or_o25,
            'btts_o25': btts_o25,
            'home_goal_difference': home_goal_difference,
            'away_goal_difference': away_goal_difference,
            'home_fts': home_fts,
            'away_fts': away_fts,
            'home_clean_sheets': home_clean_sheets,
            'away_clean_sheets': away_clean_sheets,
            'home_scored_first': home_scored_first,
            'away_scored_first': away_scored_first,
            'home_win': home_win,
            'away_win': away_win,
            'draw': draw,
            'home_points': home_points,
            'away_points': away_points,
            'draw_ht': draw_ht,
            'home_win_ht': home_win_ht,
            'away_win_ht': away_win_ht,
            'home_goals': home_goals,
            'away_goals': away_goals,
            'goals_between_85_90': goals_between_85_90,
            'goals_between_75_90': goals_between_75_90,
            'goals_between_35_45': goals_between_35_45,
            'goals_between_80_90': goals_between_80_90,
            'goals_between_40_45': goals_between_40_45,
            'goals_between_0_15': goals_between_0_15,
            'goals_between_0_10': goals_between_0_10,
            'goals_between_0_15_home': goals_between_0_15_home,
            'goals_between_0_15_away': goals_between_0_15_away,
            'goals_after_70': goals_after_70,
            'home_goals_after_70': home_goals_after_70,
            'away_goals_after_70': away_goals_after_70,
            'first_total_goal': first_total_goal,
            'first_home_goal': first_home_goal,
            'first_away_goal': first_away_goal,
            'goal_timings_mean': goal_timings_mean,
            **overs
        }

    @staticmethod
    def __format_corners(fixture, important):
        home_id = fixture["home_id"]
        away_id = fixture["away_id"]
        corners = fixture["corners_json"]
        if corners:
            df = pd.DataFrame(corners)
        else:
            df = pd.DataFrame(columns=['minute', 'team_id', 'comment'])
        df = df[~df["comment"].str.startswith("Race to")]
        df = df[df['team_id'].notnull()]
        df["team_id"] = df["team_id"].astype(int)
        df_home = df[df['team_id'] == home_id]
        df_away = df[df['team_id'] == away_id]

        df_1h = df[df['minute'] <= 45]
        df_2h = df[df['minute'] > 45]
        df_home_1h = df_1h.merge(df_home)
        df_home_2h = df_2h.merge(df_home)
        df_away_1h = df_1h.merge(df_away)
        df_away_2h = df_2h.merge(df_away)
        corner_timings_all = df['minute'].tolist()
        corner_timings_home = df_home['minute'].tolist()
        corner_timings_away = df_away['minute'].tolist()
        corner_timings_mean = round(df['minute'].mean(), 2)
        home_corners = important.get("home_corners") or len(df_home)
        away_corners = important.get("away_corners") or len(df_away)
        corners = len(df)
        corners_1h = len(df_1h)
        corners_2h = len(df_2h)
        no_corners = df.empty

        home_corners_1h = len(df_home_1h)
        away_corners_1h = len(df_away_1h)
        home_corners_2h = len(df_home_2h)
        away_corners_2h = len(df_away_2h)
        ht_corner = f"{home_corners_1h}-{away_corners_1h}"
        ft_corner = f"{home_corners}-{away_corners}"

        overs = dict()
        for i in range(5, 13):
            overs[f"o{i}5_corners"] = corners > i

        for i in range(6):
            overs[f"o{i}5_1h_corners"] = corners_1h > i
            overs[f"o{i}5_2h_corners"] = corners_2h > i

        for i in range(2, 8):
            overs[f"o{i}5_home_corners"] = home_corners > i
            overs[f"o{i}5_away_corners"] = away_corners > i

        for i in range(1, 5):
            overs[f"o{i}5_1h_home_corners"] = home_corners_1h > i
            overs[f"o{i}5_2h_home_corners"] = home_corners_2h > i
            overs[f"o{i}5_1h_away_corners"] = away_corners_1h > i
            overs[f"o{i}5_2h_away_corners"] = away_corners_2h > i

        corners_between_85_90 = not df[(
            df["minute"] >= 85) & (df["minute"] <= 90)].empty
        corners_between_75_90 = not df[(
            df["minute"] >= 75) & (df["minute"] <= 90)].empty
        corners_between_35_45 = not df[(
            df["minute"] >= 35) & (df["minute"] <= 45)].empty
        corners_between_80_90 = not df[(
            df["minute"] >= 80) & (df["minute"] <= 90)].empty
        corners_between_40_45 = not df[(
            df["minute"] >= 40) & (df["minute"] <= 45)].empty
        corners_between_0_15 = not df[(
            df["minute"] >= 0) & (df["minute"] <= 15)].empty
        corners_between_0_10 = not df[(
            df["minute"] >= 0) & (df["minute"] <= 10)].empty

        corners_between_0_10_home = not df_home[(
            df_home["minute"] >= 0) & (df_home["minute"] <= 10)].empty
        corners_between_0_10_away = not df_away[(
            df_away["minute"] >= 0) & (df_away["minute"] <= 10)].empty

        first_total_corner = corner_timings_all[0] if corner_timings_all else None
        first_home_corner = corner_timings_home[0] if corner_timings_home else None
        first_away_corner = corner_timings_away[0] if corner_timings_away else None

        return {
            'corner_timings_all': corner_timings_all,
            'corner_timings_home': corner_timings_home,
            'corner_timings_away': corner_timings_away,
            'home_corners': home_corners,
            'away_corners': away_corners,
            'ht_corner': ht_corner,
            'ft_corner': ft_corner,
            'total_corners': corners,
            'corners_1h': corners_1h,
            'corners_2h': corners_2h,
            'no_corners': no_corners,
            'home_corners_1h': home_corners_1h,
            'away_corners_1h': away_corners_1h,
            'home_corners_2h': home_corners_2h,
            'away_corners_2h': away_corners_2h,
            'home_corners': home_corners,
            'away_corners': away_corners,
            'corners_between_85_90': corners_between_85_90,
            'corners_between_75_90': corners_between_75_90,
            'corners_between_35_45': corners_between_35_45,
            'corners_between_80_90': corners_between_80_90,
            'corners_between_40_45': corners_between_40_45,
            'corners_between_0_15': corners_between_0_15,
            'corners_between_0_10': corners_between_0_10,
            'corners_between_0_10_home': corners_between_0_10_home,
            'corners_between_0_10_away': corners_between_0_10_away,

            'first_total_corner': first_total_corner,
            'first_home_corner': first_home_corner,
            'first_away_corner': first_away_corner,
            'corner_timings_mean': corner_timings_mean,
            **overs
        }

    @staticmethod
    def __format_cards(fixture, important):
        home_id = fixture["home_id"]
        away_id = fixture["away_id"]
        cards = fixture["cards_json"]
        if cards:
            df = pd.DataFrame(cards)
        else:
            df = pd.DataFrame(columns=['minute', 'team_id', 'type'])
        df["team_id"] = df["team_id"].astype(int)
        df_home = df[df['team_id'] == home_id]
        df_away = df[df['team_id'] == away_id]

        df_1h = df[df['minute'] <= 45]
        df_2h = df[df['minute'] > 45]
        df_home_1h = df_1h.merge(df_home)
        df_home_2h = df_2h.merge(df_home)
        df_away_1h = df_1h.merge(df_away)
        df_away_2h = df_2h.merge(df_away)

        home_yellow_cards = important.get("home_yellow_cards") or len(
            df_home[df_home["type"] == "yellowcard"])
        home_yellow_red_cards = important.get("home_yellow_red_cards") or len(
            df_home[df_home["type"] == "yellowredcard"])
        home_red_cards = important.get("home_red_cards") or len(
            df_home[df_home["type"] == "redcard"])
        away_yellow_cards = important.get("away_yellow_cards") or len(
            df_away[df_away["type"] == "yellowcard"])
        away_red_cards = important.get("away_red_cards") or len(
            df_away[df_away["type"] == "redcard"])
        away_yellow_red_cards = important.get("away_yellow_red_cards") or len(
            df_away[df_away["type"] == "yellowredcard"])
        home_cards = home_yellow_cards + home_red_cards * 2 - home_yellow_red_cards
        away_cards = away_yellow_cards + away_red_cards * 2 - away_yellow_red_cards

        cards = len(df)
        cards_1h = len(df_1h)
        cards_2h = len(df_2h)
        no_cards = df.empty

        home_cards_1h = len(df_home_1h)
        away_cards_1h = len(df_away_1h)
        home_cards_2h = len(df_home_2h)
        away_cards_2h = len(df_away_2h)

        overs = dict()

        for i in range(2, 7):
            overs[f"o{i}5_cards"] = cards > i

        for i in range(3):
            overs[f"o{i}5_1h_cards"] = cards_1h > i
            overs[f"o{i}5_2h_cards"] = cards_2h > i

        for i in range(4):
            overs[f"o{i}5_home_cards"] = home_cards > i
            overs[f"o{i}5_away_cards"] = away_cards > i

        for i in range(3):
            overs[f"o{i}5_home_yellow_cards"] = home_yellow_cards > i
            overs[f"o{i}5_away_yellow_cards"] = away_yellow_cards > i
            overs[f"o{i}5_home_red_cards"] = home_red_cards > i
            overs[f"o{i}5_away_red_cards"] = away_red_cards > i

        for i in range(2):
            overs[f"o{i}5_1h_home_cards"] = home_cards_1h > i
            overs[f"o{i}5_2h_home_cards"] = home_cards_2h > i
            overs[f"o{i}5_1h_away_cards"] = away_cards_1h > i
            overs[f"o{i}5_2h_away_cards"] = away_cards_2h > i

        return {
            'home_yellow_cards': home_yellow_cards,
            'home_red_cards': home_red_cards,
            'away_yellow_cards': away_yellow_cards,
            'away_red_cards': away_red_cards,
            'home_cards': home_cards,
            'away_cards': away_cards,
            'total_cards': cards,
            'cards_1h': cards_1h,
            'cards_2h': cards_2h,
            'no_cards': no_cards,
            'home_cards_1h': home_cards_1h,
            'away_caxrds_1h': away_cards_1h,
            'home_cards_2h': home_cards_2h,
            'away_cards_2h': away_cards_2h,
            'home_cards': home_cards,
            'away_cards': away_cards,

            **overs
        }

    def __format_stats(self, fixture):
        stats = dict()
        stats["home"] = self.__format_stat(
            fixture, fixture['home_id'])
        stats["away"] = self.__format_stat(
            fixture, fixture['away_id'])

        return stats

    def __format_important_stats(self, fixture):

        stats = flatten(fixture["stats"], sep="_")

        return stats

    def format(self, fixture):
        data = dict()
        important = self.__format_important_stats(fixture)
        goals_data = self.__format_goals(fixture, important)
        corners_data = self.__format_corners(fixture, important)
        cards_data = self.__format_cards(fixture, important)

        result = {
            **goals_data,
            **corners_data,
            **cards_data,
            'fixture_id': fixture['id']
            # **important
        }
        data['fixture_id'] = fixture['id']
        data.update({

            'result': result,
            'result_updated': True,
        })

        response = {
            "$set": data,
        }

        return response


formatter = FixtureFormatter()

config = dotenv_values(".env")
MONGO_URL = config["MONGO_URL"]
ca = certifi.where()

client = MongoClient(MONGO_URL, tlsCAFile=ca)
footyamigo = client["footyamigo"]
fixtures_table = footyamigo["fixtures"]
# old_fixtures = fixtures_table.find({"result_updated": {"$ne": True}, "status": {"$in": ['FT', 'FT_PEN']}},
#                                    {"home": 0, "away": 0, "probability": 0,  "pre_odds": 0, "live_odds": 0, "peak_odds": 0}).sort('fixture_id', pymongo.DESCENDING)

old_fixtures = fixtures_table.find({"home_id": {"$in": [238093]}, "away_id": {"$in": [238093]}},
                                   {"home": 0, "away": 0, "probability": 0,  "pre_odds": 0, "live_odds": 0, "peak_odds": 0}).sort('fixture_id', pymongo.DESCENDING)

for fixture in old_fixtures:
    fixture_id = fixture["fixture_id"]
    formatted_fixture = eval(str(formatter.format(fixture)))
    print(fixture_id)
    fixtures_table.update_one(
        {'fixture_id': fixture_id}, formatted_fixture, upsert=True)

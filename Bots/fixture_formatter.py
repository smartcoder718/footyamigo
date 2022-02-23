from collections.abc import MutableMapping
import pandas as pd
import datetime
from variables import FLAGS, MARKETS, PREMATCH_ODDS_MAP_NEW, INPLAY_ODDS_MAP_NEW, STATUS, FLAGS
from collections import defaultdict
import json


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

    def __init__(self, is_live=False):
        self.is_live = is_live
        pass

    def __fixture_info(self, fixture):
        fixture_info = dict()

        fixture_info['id'] = fixture['id']
        fixture_info['league_id'] = fixture['league_id']

        fixture_info['season_id'] = fixture['season_id']
        fixture_info['stage_id'] = fixture['stage_id']
        fixture_info['round_id'] = fixture['round_id']
        fixture_info['group_id'] = fixture['group_id']
        fixture_info['aggregate_id'] = fixture['aggregate_id']
        fixture_info['venue_id'] = fixture['venue_id']
        fixture_info['referee_id'] = fixture['referee_id']
        fixture_info['home_id'] = fixture['localteam_id']
        fixture_info['away_id'] = fixture['visitorteam_id']
        fixture_info['winner_id'] = fixture['winner_team_id']
        if "localTeam" in fixture and "visitorTeam" in fixture:
            fixture_info['home_name'] = fixture['localTeam']['data']['name']
            fixture_info['home_logo'] = fixture['localTeam']['data']['logo_path']
            fixture_info['away_name'] = fixture['visitorTeam']['data']['name']
            fixture_info['away_logo'] = fixture['visitorTeam']['data']['logo_path']
            fixture_info['fixture_name'] = '%s v %s' % (
                fixture_info['home_name'], fixture_info['away_name'])
        if "league" in fixture:
            league = fixture['league']['data']
            fixture_info['league_name'] = league["name"]
            country = league["country"]["data"]
            fixture_info['country_id'] = league["country_id"]
            fixture_info['country_name'] = country['name']
            fixture_info['iso'] = country['extra']["iso2"].lower(
            ) if country.get("extra") else None
            fixture_info['flag_emoji'] = FLAGS.get(fixture_info['iso'], None)
        fixture_info['home_position'] = fixture['standings']['localteam_position']
        fixture_info['away_position'] = fixture['standings']['visitorteam_position']

        fixture_info['home_formation'] = fixture['formations']['localteam_formation']
        fixture_info['away_formation'] = fixture['formations']['visitorteam_formation']
        fixture_info['weather'] = fixture['weather_report']
        fixture_info['status'] = fixture['time']['status']
        fixture_info['status_words'] = STATUS.get(
            fixture['time']['status'], fixture['time']['status'])
        fixture_info['minute'] = fixture['time']['minute']
        fixture_info['extra_minute'] = fixture['time']['extra_minute']
        fixture_info['second'] = fixture['time']['second']
        fixture_info['added_time'] = fixture['time']['added_time']
        fixture_info['injury_time'] = fixture['time']['injury_time']
        if fixture['time']['status'] == "HT":
            fixture_info["is_ht"] = True
        elif fixture['time']['status'] in ["FT", "FT_PEN"]:
            fixture_info["is_ft"] = True

        fixture_info["is_live"] = fixture['time']['status'] in [
            "LIVE", "HT", "PEN_LIVE", "BREAK", "ET"]

        starting_at = fixture['time']['starting_at']
        date_time_format = '%Y-%m-%d %H:%M:%S'
        date_format = '%Y-%m-%d'
        fixture_info['date_time'] = datetime.datetime.strptime(
            starting_at["date_time"], date_time_format)
        fixture_info['date'] = datetime.datetime.strptime(
            starting_at["date"], date_format)
        fixture_info['time'] = starting_at['time']
        fixture_info['timestamp'] = starting_at['timestamp']

        return fixture_info

    @staticmethod
    def __format_goals(fixture, important):
        home_id = fixture["localteam_id"]
        away_id = fixture["visitorteam_id"]
        if "goals" not in fixture:
            return None
        goals = fixture["goals"]["data"]
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

        home_goals_1h = len(df_home_1h)
        away_goals_1h = len(df_away_1h)
        home_goals_2h = len(df_home_2h)
        away_goals_2h = len(df_away_2h)

        ft_score = fixture["scores"]["ft_score"]
        ht_score = fixture["scores"]["ht_score"]
        if ft_score:
            try:
                home_goals, away_goals = map(int, ft_score.split("-"))
            except:
                pass
        if ht_score:
            try:
                home_goals_1h, away_goals_1h = map(int, ht_score.split("-"))
                home_goals_2h, away_goals_2h = (
                    home_goals - home_goals_1h),  (away_goals - away_goals_1h),
            except Exception as e:
                print(e)
                pass

        no_home_goals = home_goals == 0
        no_away_goals = away_goals == 0

        goals = home_goals + away_goals
        goals_1h = None if not ht_score else home_goals_1h + away_goals_1h
        goals_2h = None if not ht_score else home_goals_2h + away_goals_2h

        most_goals_1h = None if not ht_score else goals_1h > goals_2h
        most_goals_2h = None if not ht_score else goals_2h > goals_1h
        no_goals = goals == 0
        no_goals_1h = None if not ht_score else goals_1h == 0
        no_goals_2h = None if not ht_score else goals_2h == 0

        btts = (home_goals and away_goals) > 0
        btts_1h = None if not ht_score else (
            home_goals_1h and away_goals_1h) > 0
        btts_2h = None if not ht_score else (
            home_goals_2h and away_goals_2h) > 0
        btts_no = not btts
        btts_1h_btts_2h = None if not ht_score else btts_1h and btts_2h
        overs = dict()

        for i in range(0, 6):
            overs[f"o{i}5_goals"] = goals > i
            overs[f"u{i}5_goals"] = goals <= i

        for i in range(3):
            overs[f"o{i}5_home_goals"] = home_goals > i
            overs[f"o{i}5_away_goals"] = away_goals > i

            overs[f"u{i}5_home_goals"] = home_goals <= i
            overs[f"u{i}5_away_goals"] = away_goals <= i

        if ht_score:
            for i in range(3):
                overs[f"o{i}5_goals_1h"] = goals_1h > i
                overs[f"o{i}5_goals_2h"] = goals_2h > i

                overs[f"u{i}5_goals_1h"] = goals_1h <= i
                overs[f"u{i}5_goals_2h"] = goals_2h <= i

                overs[f"o{i}5_home_goals_1h"] = home_goals_1h > i
                overs[f"o{i}5_home_goals_2h"] = home_goals_2h > i
                overs[f"o{i}5_away_goals_1h"] = away_goals_1h > i
                overs[f"o{i}5_away_goals_2h"] = away_goals_2h > i

                overs[f"u{i}5_home_goals_1h"] = home_goals_1h <= i
                overs[f"u{i}5_home_goals_2h"] = home_goals_2h <= i
                overs[f"u{i}5_away_goals_1h"] = away_goals_1h <= i
                overs[f"u{i}5_away_goals_2h"] = away_goals_2h <= i

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
        home_win_o25 = home_win and overs["o25_goals"]
        draw_o25 = draw and overs["o25_goals"]
        away_win_o25 = away_win and overs["o25_goals"]

        home_win_btts = home_win and btts
        draw_btts = draw and btts
        away_win_btts = away_win and btts

        home_win_or_draw = home_win or draw
        home_win_or_away_win = home_win or away_win
        away_win_or_draw = away_win or draw

        home_points = 3 if home_win else (1 if draw else 0)
        away_points = 3 if away_win else (1 if draw else 0)
        draw_ht = None if not ht_score else home_goals_1h == away_goals_1h
        home_win_ht = None if not ht_score else home_goals_1h > away_goals_1h
        away_win_ht = None if not ht_score else home_goals_1h < away_goals_1h

        home_win_ht_home_win = None if not ht_score else home_win_ht and home_win
        home_win_ht_draw = None if not ht_score else home_win_ht and draw
        home_win_ht_away_win = None if not ht_score else home_win_ht and away_win

        draw_ht_home_win = None if not ht_score else draw_ht and home_win
        draw_ht_draw = None if not ht_score else draw_ht and draw
        draw_ht_away_win = None if not ht_score else draw_ht and away_win

        away_win_ht_home_win = None if not ht_score else away_win_ht and home_win
        away_win_ht_draw = None if not ht_score else away_win_ht and draw
        away_win_ht_away_win = None if not ht_score else away_win_ht and away_win

        ht_score = fixture['scores']['ht_score']
        ft_score = fixture['scores']['ft_score']
        et_score = fixture['scores']['et_score']
        ps_score = fixture['scores']['ps_score']
        home_goals = fixture['scores']['localteam_score']
        away_goals = fixture['scores']['visitorteam_score']
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
        goals_between_5_15 = not df[(df["minute"] >= 5) & (
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

        goals_before_30 = not df[(df["minute"] < 30)].empty
        home_goals_before_30 = not df_home[(df_home["minute"] < 30)].empty
        away_goals_before_30 = not df_away[(df_away["minute"] < 30)].empty

        goals_after_75 = not df[(df["minute"] > 75)].empty
        home_goals_after_75 = not df_home[(df_home["minute"] > 75)].empty
        away_goals_after_75 = not df_away[(df_away["minute"] > 75)].empty

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
            'ht_score': ht_score,
            'ft_score': ft_score,
            'et_score': et_score,
            'ps_score': ps_score,
            'home_goals': home_goals,
            'away_goals': away_goals,
            'goals_between_85_90': goals_between_85_90,
            'goals_between_75_90': goals_between_75_90,
            'goals_between_35_45': goals_between_35_45,
            'goals_between_80_90': goals_between_80_90,
            'goals_between_40_45': goals_between_40_45,
            'goals_between_0_15': goals_between_0_15,
            'goals_between_5_15': goals_between_5_15,
            'goals_between_5_15_no': not goals_between_5_15,
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
            'most_goals_1h': most_goals_1h,
            'most_goals_2h': most_goals_2h,
            'goals_before_30': goals_before_30,
            'home_goals_before_30': home_goals_before_30,
            'away_goals_before_30': away_goals_before_30,
            'goals_after_75': goals_after_75,
            'home_goals_after_75': home_goals_after_75,
            'away_goals_after_75': away_goals_after_75,
            'btts_no': btts_no,
            'btts_1h_btts_2h': btts_1h_btts_2h,
            'home_win_o25': home_win_o25,
            'draw_o25': draw_o25,
            'away_win_o25': away_win_o25,
            'home_win_btts': home_win_btts,
            'draw_btts': draw_btts,
            'away_win_btts': away_win_btts,
            'home_win_or_draw': home_win_or_draw,
            'home_win_or_away_win': home_win_or_away_win,
            'away_win_or_draw': away_win_or_draw,
            'home_win_ht_home_win': home_win_ht_home_win,
            'home_win_ht_draw': home_win_ht_draw,
            'home_win_ht_away_win': home_win_ht_away_win,
            'draw_ht_home_win': draw_ht_home_win,
            'draw_ht_draw': draw_ht_draw,
            'draw_ht_away_win': draw_ht_away_win,
            'away_win_ht_home_win': away_win_ht_home_win,
            'away_win_ht_draw': away_win_ht_draw,
            'away_win_ht_away_win': away_win_ht_away_win,
            **overs
        }

    @staticmethod
    def __format_probability(fixture):
        probability = dict()
        hmap = {
            "home_win_probability": "home",
            "draw_probability": "draw",
            "away_win_probability": "away",
            "btts_probability": "btts",
            "o25_goals_probability": "over_2_5",
            "u25_goals_probability": "under_2_5",
            "o35_goals_probability": "over_3_5",
            "u35_goals_probability": "under_3_5",
            "o05_home_goals_probability": "HT_over_0_5",
            "uo5_home_goals_probability": "HT_under_0_5",
            "o05_away_goals_probability": "AT_over_0_5",
            "uo5_away_goals_probability": "AT_under_0_5",
            "o15_home_goals_probability": "HT_over_1_5",
            "u15_home_goals_probability": "HT_under_1_5",
            "o15_away_goals_probability": "AT_over_1_5",
            "u15_away_goals_probability": "AT_under_1_5",
        }
        try:
            predictions = fixture['probability']['data']['predictions']
            probability = {
                key: predictions[value] for key, value in hmap.items()
            }
            return probability
        except:
            return None

    @staticmethod
    def __format_corners(fixture, important):
        home_id = fixture["localteam_id"]
        away_id = fixture["visitorteam_id"]
        corners = fixture["corners"]["data"]
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
        corners = home_corners + away_corners
        corners_1h = len(df_1h)
        corners_2h = len(df_2h)
        no_corners = corners == 0

        home_corners_1h = len(df_home_1h)
        away_corners_1h = len(df_away_1h)
        home_corners_2h = len(df_home_2h)
        away_corners_2h = len(df_away_2h)
        if fixture["scores"]["ft_score"]:
            ft_corner = f"{home_corners}-{away_corners}"
        else:
            ft_corner = None
        if fixture["scores"]["ht_score"]:
            ht_corner = f"{home_corners_1h}-{away_corners_1h}"
        else:
            ht_corner = None
        most_corners_1h = corners_1h > corners_2h
        most_corners_2h = corners_2h > corners_1h
        most_corners_no = corners_2h == corners_1h

        overs = dict()
        for i in range(5, 13):
            overs[f"o{i}5_corners"] = corners > i

            overs[f"u{i}5_corners"] = corners <= i

        for i in range(6):
            overs[f"o{i}5_corners_1h"] = corners_1h > i
            overs[f"o{i}5_corners_2h"] = corners_2h > i

            overs[f"u{i}5_corners_1h"] = corners_1h <= i
            overs[f"u{i}5_corners_2h"] = corners_2h <= i

        for i in range(2, 8):
            overs[f"o{i}5_home_corners"] = home_corners > i
            overs[f"o{i}5_away_corners"] = away_corners > i

            overs[f"u{i}5_home_corners"] = home_corners <= i
            overs[f"u{i}5_away_corners"] = away_corners <= i

        for i in range(1, 5):
            overs[f"o{i}5_home_corners_1h"] = home_corners_1h > i
            overs[f"o{i}5_home_corners_2h"] = home_corners_2h > i
            overs[f"o{i}5_away_corners_1h"] = away_corners_1h > i
            overs[f"o{i}5_away_corners_2h"] = away_corners_2h > i

            overs[f"u{i}5_home_corners_1h"] = home_corners_1h <= i
            overs[f"u{i}5_home_corners_2h"] = home_corners_2h <= i
            overs[f"u{i}5_away_corners_1h"] = away_corners_1h <= i
            overs[f"u{i}5_away_corners_2h"] = away_corners_2h <= i

        corners_between_85_90 = not df[(
            df["minute"] >= 85) & (df["minute"] <= 90)].empty
        corners_between_75_90 = not df[(
            df["minute"] >= 75) & (df["minute"] <= 90)].empty
        corners_between_31_45 = not df[(
            df["minute"] >= 31) & (df["minute"] <= 45)].empty
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

        corners_after_75 = not df[(df["minute"] > 75)].empty
        home_corners_after_75 = not df_home[(df_home["minute"] > 75)].empty
        away_corners_after_75 = not df_away[(df_away["minute"] > 75)].empty

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
            'most_corners_1h': most_corners_1h,
            'most_corners_2h': most_corners_2h,
            'most_corners_no': most_corners_no,
            'corners_after_75': corners_after_75,
            'home_corners_after_75': home_corners_after_75,
            'away_corners_after_75': away_corners_after_75,
            'corners_between_31_45': corners_between_31_45,
            **overs
        }

    @staticmethod
    def __format_cards(fixture, important):
        home_id = fixture["localteam_id"]
        away_id = fixture["visitorteam_id"]
        cards = fixture["cards"]["data"]
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

        cards = home_cards + away_cards
        cards_1h = len(df_1h)
        cards_2h = len(df_2h)
        no_cards = cards == 0

        home_cards_1h = len(df_home_1h)
        away_cards_1h = len(df_away_1h)
        home_cards_2h = len(df_home_2h)
        away_cards_2h = len(df_away_2h)

        overs = dict()

        for i in range(2, 7):
            overs[f"o{i}5_cards"] = cards > i

        for i in range(3):
            overs[f"o{i}5_cards_1h"] = cards_1h > i
            overs[f"o{i}5_cards_2h"] = cards_2h > i

        for i in range(4):
            overs[f"o{i}5_home_cards"] = home_cards > i
            overs[f"o{i}5_away_cards"] = away_cards > i

        for i in range(3):
            overs[f"o{i}5_home_yellow_cards"] = home_yellow_cards > i
            overs[f"o{i}5_away_yellow_cards"] = away_yellow_cards > i
            overs[f"o{i}5_home_red_cards"] = home_red_cards > i
            overs[f"o{i}5_away_red_cards"] = away_red_cards > i

        for i in range(2):
            overs[f"o{i}5_home_cards_1h"] = home_cards_1h > i
            overs[f"o{i}5_home_cards_2h"] = home_cards_2h > i
            overs[f"o{i}5_away_cards_1h"] = away_cards_1h > i
            overs[f"o{i}5_away_cards_2h"] = away_cards_2h > i

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
            'away_cards_1h': away_cards_1h,
            'home_cards_2h': home_cards_2h,
            'away_cards_2h': away_cards_2h,
            'home_cards': home_cards,
            'away_cards': away_cards,

            **overs
        }

    def __format_live_odd(self, fixture):
        try:
            inplayOdds = fixture['inplayOdds']["data"]
            formatted_odds = {
                'season_id': fixture['season_id'],
                'fixture_id': fixture['id'],
                'home_id': fixture['localteam_id'],
                'away_id': fixture['visitorteam_id'],
                'type': 'liveodds'
            }

            data = defaultdict(dict)
            team_as_key = set([1, 28076, 28098, 28182, 31355, 136696391])
            team_and_handicap_as_key = set(
                [28080, 31387, 136703838, 1256989856])
            order_as_key = set([63, 31369, 1256989855, 975926, 14234105])
            order_and_team_as_key = set([13343, 136703850, 136703868])
            order_and_description_as_key = set([136703863, 1265635605])

            for market in inplayOdds:
                market_id = str(market['market_id'])
                name = MARKETS.get(market_id, market_id)
                market_id = int(market_id)
                name = name.replace('Alternative ', '')

                for odd in market['values']:
                    info = odd.get('info')
                    order = odd.get('order')
                    value = odd.get('value')
                    team = odd.get('team') or "Draw"
                    description = odd.get('description')
                    handicap = odd.get('handicap')
                    if market_id in team_as_key:
                        key = team
                    elif market_id in team_and_handicap_as_key:
                        key = f"{team} - {handicap}"
                    elif market_id in order_as_key:
                        key = order
                    elif market_id in order_and_team_as_key:
                        key = f"{team} - {order}"
                    elif market_id in order_and_description_as_key:
                        key = f"{description} - {order}"
                    else:
                        key = info

                    data[name][key] = value
            # print(data)
            # print("\n\nLIVE ODDS", dict(data))
            for market_name in data:
                for k, v in data[market_name].items():
                    # print(market_name, k)
                    key = INPLAY_ODDS_MAP_NEW.get((market_name, k,))
                    if key:
                        formatted_odds[key] = float(v) if v else None

            formatted_odds["home"] = {
                "ft_result":  formatted_odds.get("home_win"),
                "ht_result":  formatted_odds.get("home_win_ht"),
                "dnb":  formatted_odds.get("dnb_home")
            }
            formatted_odds["away"] = {
                "ft_result":  formatted_odds.get("away_win"),
                "ht_result":  formatted_odds.get("away_win_ht"),
                "dnb":  formatted_odds.get("dnb_away")
            }
            if self.is_live:
                underdog = None
                underdog_playing_home = None
                favorite = None
                favorite_playing_away = None
                favorite_playing_home = None
                underdog_playing_away = None

                home_win = formatted_odds.get("home_win", 0)
                away_win = formatted_odds.get("away_win", 0)
                if home_win > away_win:
                    underdog = "home"
                    underdog_playing_home = "home"
                    favorite = "away"
                    favorite_playing_away = "away"
                elif home_win < away_win:
                    underdog = "away"
                    underdog_playing_away = "away"
                    favorite = "home"
                    favorite_playing_home = "home"
                self.underdog = underdog
                self.underdog_playing_home = underdog_playing_home
                self.favorite = favorite
                self.favorite_playing_away = favorite_playing_away
                self.underdog_playing_away = underdog_playing_away
                self.favorite_playing_home = favorite_playing_home

            return formatted_odds
        except Exception as e:
            print(e)
            pass

        return None

    def __format_peak_odd(self, fixture):
        peak_odd = self.__format_live_odd(fixture=fixture)
        if peak_odd:
            peak_odd['type'] = 'peakodds'
            return peak_odd

    def __format_pre_odd_re(self, fixture: dict):
        formatted_odds = {
            "season_id": fixture['season_id'],
            "fixture_id": fixture['id'],
            "home_id": fixture['localteam_id'],
            "away_id": fixture['visitorteam_id'],
            "type": "preodds"
        }

        data = dict()
        pre_odds = fixture['odds']['data'] if fixture['odds']['data'] else []
        if not pre_odds:
            return None
        order_as_key = set([63, 31369, 1256989855, 975926, 14234105])
        for market in pre_odds:
            market_id = market['id']
            name = market['name']
            name = name.replace("Alternative ", "")

            if name not in data:
                data[name] = dict()

            try:
                bet365 = [x for x in market['bookmaker']
                          ['data'] if x['name'] == 'bet365'][0]
            except:
                bet365 = None

            if bet365:
                i = 0
                for odd in bet365["odds"]["data"]:
                    label = odd.get('label') or ""
                    value = odd.get('value')
                    total = odd.get('total')
                    extra = odd.get('extra')
                    handicap = odd.get('handicap')
                    handicap = f" {handicap}" if handicap else ""
                    key = label
                    key += f" - {total}" if total else f" - {extra}" if extra else ""
                    key += handicap
                    if market_id in order_as_key:
                        key = str(i)

                    data[name][key] = value
                    i += 1
        # print(data)
        # print("\n\PRE ODDS", dict(data))
        for market_name in data:
            for k, v in data[market_name].items():
                # print(market_name, k, )
                key = PREMATCH_ODDS_MAP_NEW.get((market_name, k,))
                if key:
                    formatted_odds[key] = float(v) if v else None
        return formatted_odds

    @staticmethod
    def __format_stat(fixture, team_id):
        stats = fixture["stats"]["data"]
        if stats:
            df = pd.DataFrame(map(flatten, stats))
        else:
            df = pd.DataFrame(columns=['team_id'])
        df["team_id"] = df["team_id"].astype(int)
        df = df[df['team_id'] == team_id]

        hmap = {
            "possession": "possessiontime",
            "passes": "passes_total",
            "shots_on_target": "shots_ongoal",
            "shots_off_target": "shots_offgoal",
            "shots": "shots_total",
            "shots_inside_box": "shots_insidebox",
            "shots_outside_box": "shots_outsidebox",
            "attacks": "attacks_attacks",
            "dangerous_attacks": "attacks_dangerous_attacks"
        }
        if df.empty:
            return {}
        stat = df.iloc[0]
        stat = stat.to_dict()

        for key, value in hmap.items():
            stat[key] = stat.pop(value, None)

        return stat

    # @staticmethod
    # def get_each_minute(data, elapsed):
    #     analyses = {int(i["minute"]): int(i["amount"])
    #                 for i in data["analyses"]}
    #     stack = [0]*elapsed
    #     count = 0
    #     for i in range(elapsed):
    #         if analyses.get(i):
    #             count = analyses[i]
    #         stack[i] = count
    #     return stack
    @staticmethod
    def get_each_minute(data, elapsed):
        analyses = {int(i["minute"]): int(i["amount"])
                    for i in data["analyses"]}
        stack = [0]*elapsed
        count = 0
        for i in range(elapsed):
            if analyses.get(i):
                count = analyses[i]
            stack[i] = count
        return stack
        non_cummulative = stack[:1]
        for i in range(1, elapsed):
            non_cummulative.append(stack[i] - stack[i-1])

        # print(data,non_cummulative)
        return non_cummulative

    @staticmethod
    def get_non_cummulative_sum(stack, elapsed):
        non_cummulative = stack[:1]
        for i in range(1, elapsed):
            non_cummulative.append(stack[i] - stack[i-1])
        return non_cummulative

    @staticmethod
    def get_cummulative_sum(data, elapsed):
        analyses = {int(i["minute"]): int(i["amount"])
                    for i in data["analyses"]}
        stack = [0]*elapsed
        count = 0
        for i in range(elapsed):
            if analyses.get(i):
                count = analyses[i]
            stack[i] = count

        # print(data,non_cummulative)
        return stack

    def get_momentum(self, team_trends, elapsed):

        # shots_on_target = minute_data.get("shots_on_target") or [0]*elapsed
        # shots_off_target = minute_data.get("shots_off_target") or [0]*elapsed
        # dangerous_attacks = minute_data["dangerous_attacks"] or [0]*elapsed
        # possession = minute_data["possession"] or [0]*elapsed
        shots_on_target = team_trends.get("on_target")
        shots_on_target = self.get_cummulative_sum(
            shots_on_target, elapsed) if shots_on_target else [0]*elapsed

        shots_off_target = team_trends.get("off_target")
        shots_off_target = self.get_cummulative_sum(
            shots_off_target, elapsed) if shots_off_target else [0]*elapsed

        dangerous_attacks = team_trends.get("dangerous_attacks")
        dangerous_attacks = self.get_cummulative_sum(
            dangerous_attacks, elapsed) if dangerous_attacks else [0]*elapsed

        possession = team_trends.get("possession")
        possession = self.get_cummulative_sum(
            possession, elapsed) if possession else [0]*elapsed

        momentum_team = []

        for i in range(elapsed):
            on_target_count = shots_on_target[i]
            off_target_count = shots_off_target[i]
            dang_attacks_count = dangerous_attacks[i]
            possession_count = possession[i]
            if i > 10:
                on_target_count -= shots_on_target[i-10]
                off_target_count -= shots_off_target[i-10]
                dang_attacks_count -= dangerous_attacks[i-10]
            minute_momentum = (on_target_count*12 + off_target_count *
                               8 + dang_attacks_count * 2 + possession_count//5)
            momentum_team.append(minute_momentum)

        # data = {
        #     "analyses": [{"minute": minute, "amount":  amount} for minute, amount in enumerate(momentum_team)]
        # }
        # # print(data)
        # formatted = self.get_each_minute(data, elapsed)
        # print(formatted)
        return momentum_team
        non_cummulative = self.get_non_cummulative_sum(momentum_team, elapsed)
        print(momentum_team, non_cummulative)
        return non_cummulative
        return [0]*elapsed

    def get_team_data(self, df, team_id, elapsed):
        df_team = df[df["team_id"] == team_id]
        team_trends = {i["type"]: i for i in df_team.to_dict("records")}
        items = {"possession": "possession", "attacks": "attacks", "dangerous_attacks": "dangerous_attacks", "on_target": "shots_on_target",
                 "off_target": "shots_off_target", "corners": "corners", "goals": "goals", "yellowcards": "yellowcards", "redcards": "redcards"}

        minute_data = {items[item]:
                       self.get_each_minute(team_trends[item], elapsed) if item in team_trends else None for item in items}
        has_keys = set(["dangerous_attacks",
                       "possession"]) & set(team_trends.keys())
        # "on_target", "off_target",
        if len(has_keys) == 2:
            momentum = self.get_momentum(team_trends, elapsed)
            minute_data.update({"momentum": momentum})
        on_target = minute_data.get("shots_on_target")
        off_target = minute_data.get("shots_off_target")
        if on_target and off_target:
            minute_data["shots"] = [x+y for x, y in zip(on_target, off_target)]
        return json.loads(json.dumps(minute_data))

    # def get_team_data(self, df, team_id, elapsed):
    #     df_team = df[df["team_id"] == team_id]
    #     team_trends = {i["type"]: i for i in df_team.to_dict("records")}
    #     items = {"possession": "possession", "attacks": "attacks", "dangerous_attacks": "dangerous_attacks", "on_target": "shots_on_target",
    #              "off_target": "shots_off_target", "corners": "corners", "goals": "goals", "yellowcards": "yellowcards", "redcards": "redcards"}

    #     minute_data = {items[item]: dict(
    #         enumerate(self.get_each_minute(team_trends[item], elapsed))) if item in team_trends else None for item in items}
    #     has_keys = set(["dangerous_attacks",
    #                    "possession"]) & set(team_trends.keys())
    #     # "on_target", "off_target",
    #     if len(has_keys) == 2:
    #         momentum = dict(enumerate(
    #             self.get_momentum(minute_data, elapsed)))
    #         minute_data.update({"momentum": momentum})
    #     return json.loads(json.dumps(minute_data))

    def __format_minute_stats(self, fixture):
        home_id = fixture["localteam_id"]
        away_id = fixture["visitorteam_id"]
        trends = fixture["trends"]["data"]
        df = pd.DataFrame(trends)

        if "team_id" in df:
            df["team_id"] = df["team_id"].astype(int)
            try:
                time = fixture["time"]
                minute = time["minute"] or 0
                added_time = time["added_time"] or 0
                injury_time = time["injury_time"] or 0
                extra_minute = time["extra_minute"] or 0
                elapsed = minute+added_time+injury_time+extra_minute
                stats_each_minute = {
                    "home": self.get_team_data(df, home_id, elapsed),
                    "away": self.get_team_data(df, away_id, elapsed)
                }

                return stats_each_minute
            except Exception as e:
                print("LAORA TRENDS", e)

    def __format_stats(self, fixture):
        stats = dict()
        stats["home"] = self.__format_stat(
            fixture, fixture['localteam_id'])

        stats["away"] = self.__format_stat(
            fixture, fixture['visitorteam_id'])

        if stats["home"]:
            stats["home"].update({
                "league_position": fixture['standings']['localteam_position'],
                "timer": fixture['time']['minute'],
            })
        if stats["away"]:
            stats["away"].update({
                "league_position": fixture['standings']['visitorteam_position'],
                "timer": fixture['time']['minute'],

            })
        stats["combined"] = {}
        if stats["home"] and stats["away"]:
            for item in stats["home"]:
                stats["combined"][item] = (stats["home"].get(
                    item) or 0) + (stats["away"].get(item) or 0)

        winning_team = None
        losing_team = None
        home_goals = stats["home"].get("goals", 0)
        away_goals = stats["away"].get("goals", 0)
        if home_goals > away_goals:
            winning_team = "home"
            losing_team = "away"
        elif home_goals < away_goals:
            winning_team = "away"
            losing_team = "home"
        self.winning_team = winning_team
        self.losing_team = losing_team
        # stats["winning_team"] = stats.get(winning_team)
        # stats["losing_team"] = stats.get(losing_team)

        return stats

    def __format_favorite_underdog_winning_losing(self, data):
        formatted = dict()
        teams = ["winning_team", "losing_team", "underdog",
                 "underdog_playing_home",
                 "favorite",
                 "favorite_playing_away",
                 "underdog_playing_away",
                 "favorite_playing_home"]
        instance = self.__dict__
        # print(instance)
        for team in teams:
            # print(data.get(instance[team]), "TTETTET")
            formatted[team] = data.get(instance.get(team))

        # print("HAHAHAH", formatted)
        # if data.get("live_odds"):
        #     for team in teams:
        #         pre_odds[team] = data["live_odds"].get(instance[team])
        # if data.get("pre_odds"):
        #     for team in teams:
        #         live_odds[team] = data["pre_odds"].get(instance[team])
        return formatted

    @staticmethod
    def __format_important_stat(df, team):
        items = dict()
        if not df.empty:
            stat = df.iloc[0]
            corners = stat['corners'] if stat['corners'] else 0
            offsides = stat['offsides'] if stat['offsides'] else 0
            goals = stat['goals'] if stat['goals'] else 0
            yellow_cards = stat['yellowcards'] if stat['yellowcards'] else 0
            yellow_red_cards = stat['yellowredcards'] if stat['yellowredcards'] else 0
            # yellow_cards += yellow_red_cards
            red_cards = stat['redcards'] if stat['redcards'] else 0
            cards = yellow_cards + red_cards
            items.update({
                f"{team}_corners": corners,
                f"{team}_offsides": offsides,
                f"{team}_goals": goals,
                f"{team}_yellow_cards": yellow_cards,
                f"{team}_yellow_red_cards": yellow_red_cards,
                f"{team}_red_cards": red_cards,
                f"{team}_corners": corners,
                f"{team}_cards": cards
            })
        else:
            return {
                f"{team}_corners": None,
                f"{team}_offsides": None,
                f"{team}_goals": None,
                f"{team}_yellow_cards": None,
                f"{team}_yellow_red_cards": None,
                f"{team}_red_cards": None,
                f"{team}_corners": None,
                f"{team}_cards": None
            }

        return items

    def __format_important_stats(self, fixture):
        home_id = fixture["localteam_id"]
        away_id = fixture["visitorteam_id"]
        if not "stats" in fixture:
            return {}
        stats = fixture["stats"]["data"]
        if stats:
            df = pd.DataFrame(map(flatten, stats))
        else:
            df = pd.DataFrame(columns=['team_id'])

        df["team_id"] = df["team_id"].astype(int)
        df_home = df[df['team_id'] == home_id]
        df_away = df[df['team_id'] == away_id]
        both_items = dict()
        home_items = self.__format_important_stat(df_home, "home")
        away_items = self.__format_important_stat(df_away, "away")
        both_items.update(home_items)
        both_items.update(away_items)
        if (not df_away.empty) and (not df_home.empty):
            both_items["offsides"] = home_items["home_offsides"] + \
                away_items["away_offsides"]
        else:
            both_items["offsides"] = None
        return both_items

    def format(self, fixture):
        # data = dict()
        important = self.__format_important_stats(fixture)
        data = self.__fixture_info(fixture=fixture)

        goals = fixture.get('goals')
        corners = fixture.get('corners')
        cards = fixture.get('cards')
        events = fixture.get('events')

        if corners:
            corners = corners["data"]
            data.update({
                'corners_json': corners})
            if not self.is_live:
                corners_data = self.__format_corners(fixture, important)

        if goals:
            goals = goals["data"]
            data.update({
                'goals_json': goals})
            if not self.is_live:
                goals_data = self.__format_goals(fixture, important)

        if cards:
            cards = cards["data"]
            data.update({
                'cards_json': cards})
            if not self.is_live:
                cards_data = self.__format_cards(fixture, important)

        if events:
            events = events["data"]
            data.update({
                'events_json': events})

        if "probability" in fixture:
            probability = self.__format_probability(fixture)
            data.update({
                'probability': probability})

        if "inplayOdds" in fixture:
            live_odds = self.__format_live_odd(fixture)

        if "odds" in fixture:
            pre_odds = self.__format_pre_odd_re(fixture)

        if "stats" in fixture:
            stats = self.__format_stats(fixture)

        if "trends" in fixture:
            stats_minute = self.__format_minute_stats(fixture)
            if stats_minute:
                data.update({
                    'stats_minute': stats_minute})
                if 'home' in stats_minute and 'away' in stats_minute:
                    if 'momentum' in stats_minute["home"] and 'momentum' in stats_minute["away"]:
                        home_momentum = stats_minute['home']['momentum']
                        away_momentum = stats_minute['away']['momentum']
                        data.update({"momentum": {
                            'home': home_momentum,
                            'away': away_momentum,
                        }})

                        if "stats" in fixture and stats:
                            if home_momentum and len(home_momentum):
                                # max_min = max(home_momentum)
                                stats["home"].update(
                                    {"momentum": home_momentum[-1]})
                            if away_momentum and len(away_momentum):
                                # max_min = max(away_momentum)
                                stats["away"].update(
                                    {"momentum": away_momentum[-1]})
        if "inplayOdds" in fixture:
            if live_odds:
                live_odds.update(
                    self.__format_favorite_underdog_winning_losing(live_odds))
                data.update({
                    'live_odds': live_odds})

        if "odds" in fixture:
            if pre_odds:
                pre_odds.update(
                    self.__format_favorite_underdog_winning_losing(pre_odds))
                data.update({
                    'pre_odds': pre_odds})

        if "stats" in fixture:
            if stats:
                stats.update(
                    self.__format_favorite_underdog_winning_losing(stats))
                data.update({
                    'stats': stats})
        if "trends" in fixture:
            if stats_minute:
                stats_minute.update(
                    self.__format_favorite_underdog_winning_losing(stats_minute))
                data.update({
                    'stats_minute': stats_minute})

        keys = fixture.keys()
        if not self.is_live and "goals" in keys and "corners" in keys and "cards" in keys and "stats" in keys:
            result = {
                **goals_data,
                **corners_data,
                **cards_data,
                'fixture_id': fixture['id']
                # **important
            }
            data.update({
                'result': result
            })

            if fixture["time"]["status"] in ["FT", "FT_PEN"]:
                data.update({
                    'result_updated': True
                })
        data['fixture_id'] = fixture['id']

        response = {
            "$set": data,
        }
        if "inplayOdds" in fixture:
            peak_odds = self.__format_peak_odd(fixture)
            response["$max"] = flatten({"peak_odds": peak_odds}, sep=".")

        return response

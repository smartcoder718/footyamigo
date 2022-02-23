import json
from dotenv import dotenv_values

from datetime import datetime
import collections

config = dotenv_values(".env")

comparators = {
    "<": "$lt",
    ">": "$gt",
    "=": "$eq",
    "!=": "$ne",
    "<=": "$lte",
    ">=": "$gte",
}


def flatten(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = parent_key + sep + k if parent_key else k
        if isinstance(v, collections.MutableMapping):
            items.extend(flatten(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)


class StartegyFormatter:

    def __init__(self):
        config = dotenv_values(".env")

    @ staticmethod
    def gen_condition(field, operator, value):
        sign = comparators[operator]
        return {field: {sign: float(value)
                        }}

    @ staticmethod
    def gen_between_condition(field, values):
        x = values[0]
        y = values[1]
        return {field: {"$gte": x, "$lte": y}}

    def __condition_for_probability(self, rule):
        table_name = "probability"
        column_name = rule["code"]
        field = f"{table_name}.{column_name}"
        return [self.gen_between_condition(field, rule["values"])], [field]

    def __condition_for_team(self, rule, team):
        table_name = team
        column_name = rule[rule["location"]]
        field = f"{table_name}.{column_name}"
        return self.gen_between_condition(field, rule["values"]), field

    def __condition_for_odds(self, rule):
        table_name = "pre_odds"
        column_name = rule["code"]
        operator = rule["comparator"]
        value = rule["value"]
        field = f"{table_name}.{column_name}"
        return (
            [self.gen_condition(field, operator, value)], [field]
        )

    def __condition_for_aggregate_stats(self, rule):
        if rule["team"] in ["home", "away"]:
            condition, field = self.__condition_for_team(rule, rule["team"])
            conditions = [condition]
            fields = [field]
        else:
            condition_1, field_1 = self.__condition_for_team(
                rule, "home")
            condition_2, field_2 = self.__condition_for_team(rule, "away")
            conditions = [condition_1, condition_2]
            fields = [field_1, field_2]

        return conditions, fields

    def __query_for_pre_match_rules(self, strategy):
        pre_match_conditions = []
        pre_match_fields = []
        for rule in strategy["strategy_prematch_rules"]:
            if rule["category"] == "probability":
                conditions, fields = self.__condition_for_probability(rule)
            elif rule["category"] == "odds":
                conditions, fields = self.__condition_for_odds(rule)
            else:
                conditions, fields = self.__condition_for_aggregate_stats(rule)
            pre_match_conditions += conditions
            pre_match_fields += fields
        return pre_match_conditions, pre_match_fields
        # return " \nAND\n ".join(pre_match_conditions), pre_match_fields

    @ staticmethod
    def __has_team(code, category):
        if category == "odds":
            if code in {"dnb", "ht_result", "ft_result"}:
                return True
        else:
            return True

    def __parse_single_rule(self, code, category, table_name, team):
        name_map = {"liveodds": "live_odds",
                    "preodds": "pre_odds", "livestats": "stats"}
        table_name = name_map[table_name]
        if category == "statistics" or self.__has_team(code, category):
            return f"{table_name}.{team}.{code}"
        else:
            return f"{table_name}.{code}"

    def __parse_rule(self,
                     first_code, second_code, first_category, second_category, first_table_name, second_table_name, comparator, value, first_team, second_team):

        name_map = {"liveodds": "live_odds",
                    "preodds": "pre_odds", "livestats": "stats"}

        symbol = comparators[comparator]

        value = float(value)
        if first_category == "statistics" or self.__has_team(first_code, first_category):
            table_name = name_map[first_table_name]
            field_1 = f"{table_name}.home.{first_code}"
            field_2 = f"{table_name}.away.{first_code}"
            fields = [field_1, field_2]
            if first_team == "sum_of_teams":
                field_combined = {"$add": [f"${field_1}", f"${field_2}"]}
                conditions = [
                    {"$expr": {symbol: [field_combined, value]}}]
                return conditions, fields
            elif first_team == "either_team":
                conditions = [{"$or": [
                    self.gen_condition(
                        field_1, comparator, value),
                    self.gen_condition(
                        field_2, comparator, value)]
                }]
                return conditions, fields

        first_field = self.__parse_single_rule(
            code=first_code, category=first_category, table_name=first_table_name, team=first_team)
        fields = [first_field]
        if second_category == "numeric":
            second_field = value
        else:
            second_field = self.__parse_single_rule(
                code=second_code, category=second_category, table_name=second_table_name, team=second_team)
            fields.append(second_field)
            second_field = "$" + second_field

        conditions = [{"$expr": {symbol: ["$"+first_field, second_field]}}]
        return conditions, fields

    def __query_for_in_play_rules(self, strategy):
        in_play_conditions = []
        in_play_fields = []
        for rule in strategy["strategy_inplay_rules"]:
            first_code = rule["first_code"]
            second_code = rule["second_code"]
            first_category = rule["first_category"]
            first_table_name = rule["first_table_name"]
            second_table_name = rule["second_table_name"]
            second_category = rule["second_category"]
            comparator = rule["comparator"]
            value = rule["value"]
            first_team = rule["first_team"]
            second_team = rule["second_team"]
            conditions, fields = self.__parse_rule(
                first_code, second_code, first_category, second_category, first_table_name, second_table_name, comparator, value, first_team, second_team)
            in_play_conditions += conditions
            in_play_fields += fields
        return in_play_conditions, in_play_fields

    @ staticmethod
    def __query_for_in_play_timer(strategy):
        timer = strategy["timer"]
        from_minute = timer["from"]
        to_minute = timer["to"]
        time = timer["time"]
        minute = timer["minute"]

        time_map = {
            "disabled": {"minute": {"$ne": -1}},
            "atMinuteX": {"minute": {"$eq": minute}},
            "xMinutesAgo": {"minute": {"$eq": {"$sub": ["$minute", minute]}}},
            "betweenMinutesXandY": {"minute": {"$gte": from_minute, "$lte": to_minute}},
            "pastXminutes": {"minute": {"$gte": {"$sub": ["$minute", minute]}}},
            "sinceMinuteX": {"minute": {"$gte": minute}},
            "untilMinuteX": {"minute": {"$lte": minute}},
            "during1stHalf": {"minute": {"$lte": 45}},
            "during2ndHalf": {"minute": {"$gt": 45}},
            "atHalfTime": {"minute": {"$eq": 45}},
            "atFullTime": {"minute": {"$eq": 90}},
        }
        return time_map[time]

    @ staticmethod
    def __query_for_leagues(strategy):

        return {"league_id": {"$in": strategy["leagues"]}}

    def format(self, strategy):
        #picks = list(picks_table.find({"strategy_id": strategy["id"]}, {"fixture_id": 1}))
        pre_match_conditions, pre_match_fields = self.__query_for_pre_match_rules(
            strategy)

        fields = pre_match_fields
        league_conditions = [self.__query_for_leagues(strategy)]
        conditions = pre_match_conditions
        if strategy["type"] == "in-play":

            in_play_conditions, in_play_fields = self.__query_for_in_play_rules(
                strategy)

            timer_conditions = [self.__query_for_in_play_timer(strategy)]
            extra_conditions = [
                {"status": {"$in": ['LIVE', 'HT', 'PEN_LIVE', 'BREAK', 'ET']}}
            ]
            conditions += timer_conditions + extra_conditions + in_play_conditions
            fields += in_play_fields
        WHERE = conditions

        # if picks:
        #     pick_ids = [x["fixture_id"] for x in picks]
        #     WHERE += [
        #         {"id": {"$nin": pick_ids}}
        #     ]

        query = [
            {
                "$match": {"$and": WHERE}},

        ]
        return query


formatter = StartegyFormatter()
with open("./strategy.json") as f:
    strategy = f.read()

strategy = json.loads(strategy)
formatted = formatter.format(strategy)
print(json.dumps(formatted, indent=2))

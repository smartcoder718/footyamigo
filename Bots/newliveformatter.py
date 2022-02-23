# from collections import defaultdict
# fixture = {}
# inplayOdds = fixture['inplayOdds']
# formatted_odds = {
#     'season_id': fixture['season_id'],
#     'fixture_id': fixture['id'],
#     'home_id': fixture['localteam_id'],
#     'away_id': fixture['visitorteam_id'],
#     'type': 'liveodds'
# }

# data = defaultdict(dict)

# for market in inplayOdds:
#     marker_id = market['market_id']
#     name = market.get(marker_id, str(marker_id))
#     name = name.replace('Alternative ', '')
#     if 'Double Chance' in name:
#         data[name] = {
#             'Home or Draw': market['values'][0]['value'],
#             'Draw or Away': market['values'][1]['value'],
#             'Home or Away': market['values'][2]['value']
#         }
#     else:
#       for odd in market['values']:
#         team = odd['team']
#         value = odd['value']
#         info = odd['info']
#         substrings = ["over", "under", "exactly"]
#         description = (odd["description"] or "").lower()
#         label = team or description or info
#         if not team and not description and description not in  substrings:
#           label = info
#         data[name][label] = value

#     for key in IN_PLAY_ODDS_MAP:
#       odd = IN_PLAY_ODDS_MAP[key]
#       market = odd["market"]
#       info = odd["info"]
#       if data.get("market"):
#         formatted_odds[key] = data[market].get(info)
#       else:
#         formatted_odds[key] = None

# return formatted_odds
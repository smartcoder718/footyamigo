import requests

API_ENDPOINT = 'https://soccer.sportmonks.com/api/v2.0/'
API_TOKEN = '6CfQCuzlLWAPdqS1ATOdam08KAbgO59PAUgMGOaR8CHPIkje92sm2WYwPUEz'



def get_pre_match_includes():
    return [
        "goals",
        "cards",
        "corners",
        "stats",
        "probability",
        "localTeam",
        "visitorTeam",
        "odds",
        "league.country",
        "events"
    ]


class SportMonksAPI:

    @classmethod
    def get_fixtures_by_date_range(cls):
        _url = API_ENDPOINT + 'fixtures/between/{start_date}/{end_date}'
        _url = _url.format(start_date='2021-11-15', end_date='2021-11-16')

        r = requests.get(url=_url, params={'api_token': API_TOKEN})

        if r.status_code == 200:
            response = r.json()
            print(response)

    @classmethod
    def get_fixtures_by_ids(cls, ids: list, page: int = 1):
        _url = 'fixtures/multi/{ids}'

        url = API_ENDPOINT + _url
        url = url.format(ids=",".join(map(str, ids)))

        includes = get_pre_match_includes()

        r = requests.get(url=url, params={
                         'api_token': API_TOKEN, 'page': page, 'include': ','.join(includes)})

        if r.status_code == 200:
            response = r.json()
            # print(response)

            if 'pagination' not in response['meta']:
                response['meta']['pagination'] = {
                    'current_page': 1,
                    'total_pages': 1
                }

            pagination = response['meta']['pagination']

            return {
                'data': response['data'],
                'current_page': pagination['current_page'],
                'total_pages': pagination['total_pages']
            }
        else:
            print(r.text)

    @classmethod
    def get_fixtures_by_date(cls, date: str, page: int = 1):
        _url = 'fixtures/date/{date}'

        url = API_ENDPOINT + _url
        url = url.format(date=date)

        includes = get_pre_match_includes()

        r = requests.get(url=url, params={
                         'api_token': API_TOKEN, 'page': page, 'include': ','.join(includes)})

        if r.status_code == 200:
            response = r.json()
            # print(response)

            if 'pagination' not in response['meta']:
                response['meta']['pagination'] = {
                    'current_page': 1,
                    'total_pages': 1
                }

            pagination = response['meta']['pagination']

            return {
                'data': response['data'],
                'current_page': pagination['current_page'],
                'total_pages': pagination['total_pages']
            }

    @classmethod
    def get_leagues(cls, page: int = 1):
        _url = 'leagues/'
        url = API_ENDPOINT + _url

        includes = ["country"]

        r = requests.get(url=url, params={
                         'api_token': API_TOKEN, 'page': page, 'include': ','.join(includes)})
      
        if r.status_code == 200:
            response = r.json()
            # print(response)

            if 'pagination' not in response['meta']:
                response['meta']['pagination'] = {
                    'current_page': 1,
                    'total_pages': 1
                }

            pagination = response['meta']['pagination']

            return {
                'data': response['data'],
                'current_page': pagination['current_page'],
                'total_pages': pagination['total_pages']
            }

    
    @classmethod
    def get_fixtures_by_team_id(cls, team_id: int, season_id: int, page: int = 1):
        _url = f'teams/{team_id}'

        url = API_ENDPOINT + _url

        includes = []
        teams = ["visitorResults", "localResults"]
        for team in teams:
            for stat in get_pre_match_includes():
                includes.append(team + "." + stat)
        # print(*includes, sep="\n")
        r = requests.get(url=url, params={
                         'api_token': API_TOKEN, 'page': page, 'include': ','.join(includes), 'seasons': season_id})

        if r.status_code == 200:
            response = r.json()
            # print(response)
            data = []
            for team in teams:
                data.extend(response["data"][team]["data"])

            return {
                'data': data,
                'current_page': 1,
                'total_pages': 1
            }

    def get_fixtures_live(cls, page: int = 1):
        _url = 'livescores/now'
        url = API_ENDPOINT + _url

        includes = [
            "goals",
            "cards",
            "corners",
            "stats",
            "inplayOdds",
            "events",
            "trends"
        ]

        r = requests.get(url=url, params={
                         'api_token': API_TOKEN, 'page': page, 'include': ','.join(includes)})

        if r.status_code == 200:
            response = r.json()
            # print(response)

            if 'pagination' not in response.get('meta'):
                response['meta']['pagination'] = {
                    'current_page': 1,
                    'total_pages': 1
                }

            pagination = response['meta']['pagination']

            return {
                'data': response['data'],
                'current_page': pagination['current_page'],
                'total_pages': pagination['total_pages']
            }
# api  = SportMonksAPI()
# res = api.get_fixtures_by_team_id(team_id=238093, season_id=18110)
# import json
# print(res)
# with open(f"{238093}.json", "w") as f:
#     f.write(json.dumps(res, indent=2))
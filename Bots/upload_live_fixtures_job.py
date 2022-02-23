
from variables import MONGO_URL
from pymongo import MongoClient

from fixture_formatter import FixtureFormatter
import datetime
import sys
import time
import threading
from sportmonks import SportMonksAPI
import certifi
ca = certifi.where()

formatter = FixtureFormatter(is_live=True)
client = MongoClient(MONGO_URL, tlsCAFile=ca)

database = client.footyamigo
fixtures_col = database.fixtures
nan = None


def upload_fixture(fixture):
    try:
        formatted_fixture = eval(str(formatter.format(fixture)))
        fixture_id = fixture.get("id")
        fixtures_col.update_one(
            {'fixture_id': fixture_id}, formatted_fixture, upsert=True)
        response = {
            "statusCode": 200,
            "body": f"Fixture ID: {fixture_id} upload success"
        }

        sys.stdout.write('\r'+str(fixture["id"]) + " success")
        #print(fixture_id, "success")
        return response
    except Exception as e:
        print("\nError occured:", fixture["id"], e, "\n")


api = SportMonksAPI()
max_wait_seconds = 20
while True:
    page = 1
    print(datetime.datetime.now())
    start = time.time()
    while True:
        try:
            res = api.get_fixtures_live(page)
            if not res or "data" not in res:
                raise Exception(res, "ERROR")
        except Exception as e:
            print("Laora", e)
            time.sleep(10)
            continue
        tasks = []

      
        print(len(res["data"]), "Fixtures Found")
        for fixture in res["data"]:
            t = threading.Thread(target=upload_fixture,
                                 args=(fixture,))
            tasks.append(t)
            t.start()
        for t in tasks:
            t.join()
        if res["total_pages"] == res["current_page"]:
            break
        else:
            page += 1
    end = time.time()
    seconds_elapsed = round(end - start)
    wait_seconds = max(0, max_wait_seconds-seconds_elapsed)
    print(f"\nElapsed {seconds_elapsed} Seconds. Waiting {wait_seconds} Seconds")
    time.sleep(wait_seconds)


const { Fixture } = require("../db");
const moment = require("moment");
const { Op } = require("sequelize");
const { ToadScheduler, SimpleIntervalJob, Task } = require("toad-scheduler");
const HistoryUploader = require("../uploaders/HistoryUploader");

const historyUploader = new HistoryUploader();

async function updateTodaysHistory() {
  const startOfDay = moment()
    .utc()
    .startOf("day")
    .unix();
  const endOfDay = moment()
    .utc()
    .endOf("day")
    .unix();
  const fixtures = await Fixture.findAll({
    where: {
      timestamp: {
        [Op.gte]: startOfDay
      }
    },
    attributes: ["timestamp", "id"]
  });
  console.log(fixtures.length, "today history");
  for (var fixture of fixtures) {
    console.log(fixture.id);
    await historyUploader.uploadHistory(fixture.id);
  }
  return fixtures.length;
}

scheduler = new ToadScheduler({});

updateTodaysHistoryTask = new Task("updateTodaysHistory", () => {
  updateTodaysHistory();
});
updateTodayHistoryJob = new SimpleIntervalJob(
  { minutes: 60, runImmediately: true },
  updateTodaysHistoryTask
);

//scheduler.addSimpleIntervalJob(updateTodayHistoryJob);

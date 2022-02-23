const { findAndSendQuickAlerts } = require("./QuickAlertsJob");

require("./UpdateHistory");

/*

setInterval(()=> {
  console.log("fetching quick alerts")
  findAndSendQuickAlerts()
}, 10*1000)*/

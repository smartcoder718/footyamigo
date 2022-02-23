import Vue from "vue";

import moment from "moment-timezone";
import "transition-style";
// In main.js
import LoadScript from "vue-plugin-load-script";

Vue.use(LoadScript);

const {
  getPreMatchPreview,
  getInPlayPreview,
} = require("../functions/previews");

//import 'flag-icon-css/css/flag-icon.css'

import UUID from "vue-uuid";

Vue.use(UUID);

import "animate.css/animate.min.css";
import "~/assets/scss/bootstrap.scss";
//import '~/assets/scss/slider.scss'
import "~/assets/scss/styles.scss";

function getColor(num, type = "") {
  if (num >= 70) {
    return type + "primary";
  } else if (num >= 50) {
    return type + "warning";
  } else {
    return type + "danger";
  }
}

function arrayToObject(array, keyfield = "value") {
  let obj = {};
  for (var i of array) {
    obj[i[keyfield]] = i;
  }
  return obj;
}

function getFlag(iso) {
  iso = (iso || "").toLowerCase();
  return iso ? "flag-icon-" + iso : "flag-icon-un";
}

function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function flattenObject(ob) {
  var toReturn = {};
  if (!ob) {
    return toReturn;
  }

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object" && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}
function groupFixturesByDate(fixtures) {
  const dates = {};
  fixtures.forEach((fixture) => {
    var date = this.$moment.utc(fixture.createdAt).local().format("LL");
    var group = dates[date];
    if (!group) {
      dates[date] = [];
    }
    dates[date].push(fixture);
  });
  return dates;
}
function groupFixturesByLeague(fixtures) {
  const leagues = {};
  fixtures.forEach((fixture) => {
    var { league_id, league_name, iso, country_name, country, timestamp } =
      fixture;
    // console.log(fixture);
    country_name = country_name || country;
    var group = leagues[timestamp + "-" + league_id];
    if (!group) {
      if (iso) {
        var flagicon = "flag-icon-" + iso;
      } else {
        var flagicon = "flag-icon-un";
      }
      leagues[timestamp + "-" + league_id] = {
        name: country_name + " • " + league_name,
        fixtures: [],
        flagicon,
        id: league_id,
        league_id: league_id,
      };
    }
    // console.log(leagues)
    leagues[timestamp + "-" + league_id].fixtures.push(fixture);
  });
  // var sortable = [];
  // for (var league_id in leagues) {
  //   sortable.push(["HEHE"+league_id, leagues[league_id]]);
  // }

  // sortable.sort(function(a, b) {
  //   return a[0].split("-")[0] - b[0].split("-");
  // });
  // return sortable;
  return leagues;
}

function truncate(input, maxlen = 300) {
  if (input.length > maxlen) {
    return input.substring(0, maxlen) + "...";
  }
  return input;
}

function nth(n) {
  n = parseInt(n);
  if (isNaN(n)) {
    return "Na";
  }
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

Vue.filter("truncate", truncate);
Vue.filter("nth", nth);

Vue.prototype.$defaultLogo =
  "https://cdn.sportmonks.com/images/soccer/team_placeholder.png";

Vue.prototype.$nth = nth;
Vue.prototype.$groupFixturesByDate = groupFixturesByDate;
Vue.prototype.$groupFixturesByLeague = groupFixturesByLeague;
Vue.prototype.$moment = moment;
Vue.prototype.$getColor = getColor;
Vue.prototype.$arrayToObject = arrayToObject;
Vue.prototype.$copyObject = copyObject;
Vue.prototype.$jsonify = copyObject;
Vue.prototype.$getPreMatchPreview = getPreMatchPreview;
Vue.prototype.$getInPlayPreview = getInPlayPreview;
Vue.prototype.$getFlag = getFlag;
Vue.prototype.$truncate = truncate;
Vue.prototype.$flattenObject = flattenObject;

//Common components
import FootyInput from "~/components/common/FootyInput.vue";
import FootyIcon from "~/components/common/FootyIcon.vue";
import FootySelect from "~/components/common/FootySelect.vue";
import FootyRadio from "~/components/common/FootyRadio.vue";
import FootyCheckbox from "~/components/common/FootyCheckbox.vue";
import FootyCheckbox2 from "~/components/common/FootyCheckbox2.vue";

import FootyVerticalCheckbox from "~/components/common/FootyVerticalCheckbox.vue";
import FootyVerticalRadio from "~/components/common/FootyVerticalRadio.vue";
import FootyMultiSelect from "~/components/common/FootyMultiSelect.vue";
import FootyButton from "~/components/common/FootyButton.vue";
import FootyButtonGroup from "~/components/common/FootyButtonGroup.vue";
import FootyDropdownSelect from "~/components/common/FootyDropdownSelect.vue";
import FootyFilterDropdownMultiple from "~/components/common/FootyFilterDropdownMultiple.vue";
import FootyTabSelect from "~/components/common/FootyTabSelect.vue";
import FootyFilterDropdown from "~/components/common/FootyFilterDropdown.vue";
import FootySettingsDropdown from "~/components/common/FootySettingsDropdown.vue";
import ArrowCheckbox from "~/components/common/ArrowCheckbox.vue";
////import FootyLeaugeStatus from "~/components/common/FootyLeaugeStatus.vue";
import FootySwitch from "~/components/common/FootySwitch.vue";
import LoaderGeneral from "~/components/common/LoaderGeneral.vue";
import Modal from "~/components/common/Modal.vue";
import ModalOnMobile from "~/components/common/ModalOnMobile.vue";
import GeneralPage from "~/components/GeneralPage.vue";
import PromptModal from "~/components/common/PromptModal.vue";

import LoadMore from "~/components/animations/LoadMore.vue";

Vue.component("LoadMore", LoadMore);

Vue.component("footy-input", FootyInput);
Vue.component("footy-icon", FootyIcon);
Vue.component("footy-select", FootySelect);
Vue.component("footy-checkbox", FootyCheckbox);
Vue.component("footy-checkbox2", FootyCheckbox2);

Vue.component("footy-radio", FootyRadio);
Vue.component("footy-multi-select", FootyMultiSelect);
Vue.component("footy-button", FootyButton);
Vue.component("footy-button-group", FootyButtonGroup);
Vue.component("footy-dropdown-select", FootyDropdownSelect);
Vue.component("footy-filter-dropdown", FootyFilterDropdown);
Vue.component("footy-tab-select", FootyTabSelect);
Vue.component("footy-vertical-checkbox", FootyVerticalCheckbox);
Vue.component("footy-vertical-radio", FootyVerticalRadio);
Vue.component("footy-switch", FootySwitch);
Vue.component("footy-filter-dropdown-multiple", FootyFilterDropdownMultiple);
Vue.component("footy-settings-dropdown", FootySettingsDropdown);
//Vue.component("footy-league-status", FootyLeaugeStatus);
Vue.component("loader-general", LoaderGeneral);
Vue.component("modal", Modal);
Vue.component("ModalOnMobile", ModalOnMobile);
Vue.component("GeneralPage", GeneralPage);
Vue.component("PromptModal", PromptModal);

Vue.component("ArrowCheckbox", ArrowCheckbox);

import VueFormulate from "@braid/vue-formulate";

Vue.use(VueFormulate);

Vue.filter("TwoDecimal", function (value) {
  if (value != null) {
    return value.toFixed(2);
  } else {
    return "-";
  }
});

import InfiniteScroll from "v-infinite-scroll";

Vue.use(InfiniteScroll);

import InfiniteLoading from "vue-infinite-loading";

Vue.use(InfiniteLoading, {
  /* options */
});

import MugenScroll from "vue-mugen-scroll";
import HowItWorks from "~/components/HowItWorks";
Vue.component("MugenScroll", MugenScroll);
Vue.component("HowItWorks", HowItWorks);
import UpgradeToPro from "~/components/UpgradeToPro";
Vue.component("UpgradeToPro", UpgradeToPro);

import SmallDropdown from "~/components/common/SmallDropdown";
Vue.component("SmallDropdown", SmallDropdown);

function scrollToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

Vue.prototype.$scrollToTop = scrollToTop;

import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);

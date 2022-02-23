const {
  getPreMatchPreview,
  getInPlayPreview
} = require("../functions/previews");

function jsonify(obj) {
  return JSON.parse(JSON.stringify(obj));
}
// function initialPreMatchForm() {
//   return {
//     id: null,
//     title: "",
//     strategy_prematch_rules: [],
//     strategy_inplay_rules: [],
//     outcomes: [],
//     needs_odds: false,
//     is_public: true,
//     timer: {
//       minute: 15
//     },
//     note: "",
//     has_note: false,
//     leagues: []
//   };
// }

function initialPreMatchSetting() {
  return {
    rule_id: null,
    values: [0, 6],
    comparator: "=",
    value: 1,
    team: "home",
    location: "home"
  };
}

function initialInPlaySetting() {
  return {
    first_rule_id: null,
    second_rule_id: null,
    first_team: "home",
    second_team: "away",
    first_category: "stats",
    second_category: "numeric",
    first_subcategory: "live_odds",
    second_subcategory: "live_odds",
    comparator: "=",
    value: 1,
    odds_value: 1.55
  };
}

// function initialInPlayForm() {
//   return {
//     id: null,
//     title: "",
//     strategy_prematch_rules: [],
//     strategy_inplay_rules: [],
//     leagues: [],
//     outcomes: [],
//     needs_odds: false,
//     is_public: true,
//     timer: {
//       time: "atMinuteX",
//       from: 0,
//       to: 70,
//       minute: 70
//     },
//     note: "",
//     has_note: false
//   };
// }

function rulesAsObject(rules) {
  const group = {};
  rules.forEach(rule => {
    const { id } = rule;
    group[id] = rule;
  });
  return group;
}

export const state = () => ({
  counter: 0,
  leagues: [],
  countries: [],
  in_play_rules: null,
  outcomes: null,
  // form: initialPreMatchForm(),
  // form_in_play: initialInPlayForm(),
  // in_play_timer: {
  //   time: "atMinuteX",
  //   from: 0,
  //   to: 70,
  //   minute: 70
  // },
  leagues_raw: [],
  step: 1,
  steps: ["", "basic", "rules", "outcomes", "settings"],
  create_filter_mode: "prematch",
  strategy_type: "inplay",
  category: "general",
  category_in_play: "statistics",
  pre_match_rules: null,
  //   Setting object for rules
  setting: initialPreMatchSetting(),
  setting_in_play: initialInPlaySetting(),
  strategy_prematch_rules: [],
  strategy_inplay_rules: [],
  //   Selected Rule
  rule: null
});

export const mutations = {
  updatePreMatchSetting(state, { index, setting }) {
    if (state.create_filter_mode == "prematch") {
      Object.assign(state.form.strategy_prematch_rules[index], setting);
    } else {
      Object.assign(state.form_in_play.strategy_prematch_rules[index], setting);
    }
  },
  updateInPlaySetting(state, { index, setting }) {
    Object.assign(state.form_in_play.strategy_inplay_rules[index], setting);
  },
  insertPreMatchSetting(state) {
    if (state.create_filter_mode == "prematch") {
      state.form.strategy_prematch_rules.push(jsonify(state.setting));
    } else {
      state.form_in_play.strategy_prematch_rules.push(jsonify(state.setting));
    }
  },
  insertInPlaySetting(state) {
    state.form_in_play.strategy_inplay_rules.push(
      jsonify(state.setting_in_play)
    );
  },
  deletePreMatchSetting(state, index) {
    if (state.create_filter_mode == "prematch") {
      state.form.strategy_prematch_rules.splice(index, 1);
    } else {
      state.form_in_play.strategy_prematch_rules.splice(index, 1);
    }
  },
  deleteInPlaySetting(state, index) {
    state.form_in_play.strategy_inplay_rules.splice(index, 1);
  },
  setStrategyType(state, type) {
    state.strategy_type = type;
  },
  setCreateFilterMode(state, setting) {
    state.create_filter_mode = setting;
  },
  setSetting(state, setting) {
    Object.assign(state.setting, setting);
  },
  setAvatar(state, avatar_id) {
    state.user.avatar_id = avatar_id;
  },
  setInPlaySetting(state, setting) {
    Object.assign(state.setting_in_play, setting);
  },
  setInPlayForm(state, form) {
    Object.assign(state.form_in_play, form);
  },
  setSettingId(state, id) {
    state.setting.id = id;
  },
  setPreMatchForm(state, setting) {
    Object.assign(state.form, setting);
  },
  setLeagues(state, leagues) {
    state.leagues = leagues;
  },
  setLeaguesRaw(state, leagues) {
    state.leagues_raw = leagues;
  },
  setPreMatchRules(state, rules) {
    state.pre_match_rules = rules;
  },
  setInPlayRules(state, rules) {
    state.in_play_rules = rules;
  },
  setCountries(state, countries) {
    state.countries = countries;
  },
  setOutcomes(state, outcomes) {
    state.outcomes = outcomes;
  },
  setCategory(state, value) {
    state.category = value;
  },
  setStep1(state) {
    state.step = 1;
  },

  addStep(state) {
    state.step = state.step + 1;
    //window.scrollTo(0, 0);
  },
  setStep(state, step) {
    state.step = step;
  },
  resetStep(state) {
    if (state.create_filter_mode == "prematch") {
      state.step = 2;
    } else {
      state.step = 1;
    }
  },
  decreaseStep(state) {
    state.step = state.step - 1;
    // window.scrollTo(0, 0);
  },
  setFormTitle(state, value) {
    state.form.title = value;
  },

  resetSettings(state) {
    state.form_in_play.strategy_inplay_rules = [];
    state.form.strategy_prematch_rules = [];
    state.form_in_play.strategy_prematch_rules = [];
  },

  setRule(state, value) {
    state.rule = value;
    //console.log(state.rule);
  },
  setFormOutcomes(state, payload) {
    state.form.outcomes = payload;
  },
  setForm(state, form) {
    Object.assign(state.form, form);
  },
  resetForm(state, payload) {
    state.form.id = payload.id;
    state.form.leagues = payload.leagues;
    state.form.title = payload.title;
    state.form.needs_odds = payload.needs_odds;
    state.form.timer = payload.timer;
    state.form.note = payload.note;
    state.form.outcomes = payload.outcomes;
  },

  // ==== In-Play Mutations
  setInPlayTitle(state, value) {
    state.form_in_play.title = value;
  },
  setPlayRules(state, value) {
    if (value.field == "prematch") {
      state.form_in_play.settings.prematch.push(value.value);
    } else {
      state.form_in_play.settings.in - play.push(value.value);
    }
  },
  setInplayOutcomes(state, payload) {
    state.form_in_play.outcomes = payload;
  },
  setinPlayForm(state, payload) {
    state.form_in_play[payload.field] = payload.value;
  },
  // setinPlayTimer(state, timer) {
  //   Object.assign(state.in_play_timer, timer);
  // },

  deletePlayRule(state, payload) {
    state.form_in_play.settings[payload.field].splice(payload.index, 1);
  },
  // setPlayTime(state, payload) {
  //   state.form_in_play.timer[payload.field] = payload.value;
  // },
  resetPlayStep(state) {
    state.step = 1;
  },
  resetPlayForm(state, payload) {
    state.form_in_play.id = payload.id;
    state.form_in_play.leagues = payload.leagues;
    state.form_in_play.title = payload.title;
    state.form_in_play.settings = payload.settings;
    state.form_in_play.needs_odds = payload.needs_odds;
    // state.form_in_play.timer = payload.timer;
    state.form_in_play.note = payload.note;
    state.form_in_play.outcomes = payload.outcomes;
  },
  setNum(state, value) {
    state.setting.value = value;
  },
  updateSetting(state, setting) {
    state.setting = setting;
  }
};

export const actions = {
  async fetchLeagues({ commit }) {
    try {
      const leagues_raw = await this.$axios.$get("/user/leagues");
      const leagues = leagues_raw.map(league => {
        return {
          value: league.id,
          text: league["country_name"] + " • " + league["name"]
        };
      });
      commit("setLeagues", leagues);
      commit("setLeaguesRaw", leagues_raw);
      return leagues;
    } catch (error) {
      console.log(error);
    }
  },
  async fetchCountries({ commit }) {
    try {
      const countries = await this.$axios.$get("/user/countries");
      commit("setCountries", countries);
    } catch (error) {
      console.log(error);
    }
  },
  async fetchOutcomes({ commit }, is_bet_builder = false) {
    try {
      const url = is_bet_builder
        ? "/user/bet-builders/outcomes"
        : "/user/outcomes";

      const outcomes = await this.$axios.$get(url);
      commit("setOutcomes", outcomes);
    } catch (error) {
      console.log(error);
    }
  },
  async fetchPreMatchRules({ commit }) {
    try {
      const rules = await this.$axios.$get("/user/rules/pre-match/");
      // console.log(rules);
      commit("setPreMatchRules", rules);
    } catch (error) {
      console.log(error);
    }
  },

  async fetchInPlayRules({ commit }) {
    try {
      const rules = await this.$axios.$get("/user/rules/in-play/");
      commit("setInPlayRules", rules);
    } catch (error) {
      console.log(error);
    }
  }
};

export const getters = {
  lookupPreMatchRules(state) {
    if (state.pre_match_rules) {
      return rulesAsObject(state.pre_match_rules);
    }
  },
  lookupInPlayRules(state) {
    if (state.in_play_rules) {
      return rulesAsObject(state.in_play_rules);
    }
  },
  isPro(state) {
    const user = state.auth.user;
    if (user && user.subscription && user.subscription.trial != true) {
      return true;
    }
  },
  getAvatar(state) {
    if (state.auth && state.auth.user) {
      var avatar_id = state.auth.user.avatar_id;
    } else {
      var avatar_id = 0;
    }
    return `/svg/${avatar_id}.svg`;
  },
  // getTimer(state) {
  //   return state.form_in_play.timer;
  // },
  getOutcomeOptions(state) {
    if (state.outcomes) {
      return state.outcomes.map(outcome => {
        return {
          value: outcome.id,
          text: outcome.label
        };
      });
    }
  },
  inPlaySettings(state) {
    return state.form_in_play.strategy_inplay_rules;
  },
  preMatchSettings(state) {
    if (state.create_filter_mode == "prematch") {
      return state.form.strategy_prematch_rules;
    } else {
      return state.form_in_play.strategy_prematch_rules;
    }
  },
  nextButtonDisabled(state, getters) {
    if (state.create_filter_mode == "in-play") {
      return (state.form_in_play.title.length && getters.rulesCount) > 0;
    } else {
      return (state.form.title.length && getters.rulesCount) > 0;
    }
  },
  rulesCount(state, getters) {
    return getters.inPlaySettings.length + getters.preMatchSettings.length;
  },
  rulesCountText(state, getters) {
    const count = getters.rulesCount;
    return count ? " • " + count : "";
  },
  previewPreMatch(state) {
    if (state.pre_match_rules) {
      return getPreMatchPreview(state.setting, state.pre_match_rules);
    }
  },
  previewInPlay(state) {
    if (state.in_play_rules) {
      return getInPlayPreview(
        state.setting_in_play,
        state.in_play_rules
      );
    }
  },
  canSave(state, getters) {
    const { form } = state;
    return (
      (form.title.length &&
        form.outcomes &&
        form.leagues.length &&
        getters.rulesCount) > 0
    );
  },
  canSaveInPlay(state, getters) {
    const { form_in_play: form } = state;
    // console.log(form);
    return (
      (form.title.length &&
        form.outcomes &&
        form.leagues.length &&
        getters.rulesCount) > 0
    );
  },

  subscriptionType(state) {
    if (state.auth.user && state.auth.user && state.auth.user.subscription) {
      if (state.auth.user.subscription.trial) {
        return "trial";
      } else {
        return "pro";
      }
    }
  }
};

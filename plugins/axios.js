export default function ({ $axios, redirect }, inject) {
  /*const admin = $axios.create({
    baseURL: '/api/admin'
  })

  admin.getips = () => admin.$get('/iplog/')

  inject('admin', admin)*/
  const UNAUTHORIZED = 401;
  // $axios.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     const { status } = error.response;
  //     if (status === UNAUTHORIZED) {
  //       // console.log(window.location.pathname);
  //       if (!window.location.pathname.startsWith("/auth/")) {
  //         window.location.replace("/auth/login");
  //       }
  //     }
  //     // return Promise.reject(error);
  //   }
  // );
  $axios.profile = () => $axios.$get("/admin/profile/");

  $axios.loginUser = (data) => $axios.$post("/login-admin/", data);

  $axios.signupUser = (data) => $axios.$post("/signup-admin/", data);

  $axios.getResults = (game) => $axios.$get("/results/" + game);

  $axios.createPreMatchFilter = (payload) =>
    $axios.$post("/user/strategies/pre-match-alerts/create/", payload);

  $axios.saveStrategy = (body, type) => {
    return $axios.$post(`/user/strategies/${type}/create/`, body);
  };
  $axios.createInPlayFilter = (payload) =>
    $axios.$post("/user/strategies/in-play-alerts/create/", payload);

  $axios.getRecentPicks = () => $axios.$get("/user/picks/");

  $axios.getStrikeRates = () => $axios.$get("/user/strategies/strike-rates");

  $axios.getPicksSent = () => $axios.$get("/user/strategies/picks-sent");

  $axios.fetchStrategies = (params) =>
    $axios.$get("/user/strategies/", {
      params,
    });

  $axios.fetchAdminStrategies = ({ type, page }) =>
    $axios.$get("/admin/presets/", { params: { type, page } });

  $axios.togglePresetByAdmin = (id) =>
    $axios.$get("/admin/presets/toggle-preset/" + id);

  $axios.togglePublicByAdmin = (id) =>
    $axios.$get("/admin/presets/toggle-public/" + id);

  $axios.getPreMatchStrategies = () =>
    $axios.$get("/user/strategies/pre-match-alerts");

  $axios.getInPlayStrategies = () =>
    $axios.$get("/user/strategies/in-play-alerts");

  $axios.getInPlayFilter = (id) =>
    $axios.$get("/user/strategies/in-play-alerts/id/" + id);

  $axios.getPreMatchFilter = (id) =>
    $axios.$get("/user/strategies/pre-match-alerts/id/" + id);

  $axios.trustStrategy = (id) => $axios.$post("/user/strategies/trust/" + id);

  $axios.untrustStrategy = (id) =>
    $axios.$post("/user/strategies/untrust/" + id);

  $axios.cloneStrategy = (id) => $axios.$post("/user/strategies/clone/" + id);

  $axios.importStrategy = (id) => $axios.$post("/user/strategies/import/" + id);

  $axios.deleteStrategy = (id) => $axios.$post("/user/strategies/delete/" + id);

  $axios.importBettingSystem = (id) =>
    $axios.$post("/user/betting-systems/import/" + id);

  $axios.toggleActiveStatus = (id) =>
    $axios.$post("/user/strategies/toggle-active/" + id);

  $axios.associateTelegram = () =>
    $axios.$get("/user/telegram/associate-account");

  $axios.deassociateTelegram = () =>
    $axios.$get("/user/telegram/deassociate-account");

  $axios.getFixtureById = (id) => $axios.$get("/user/fixtures/id/" + id);
}

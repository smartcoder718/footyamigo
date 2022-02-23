const axios = require("axios");
const qs = require("qs");

const base_url = process.env.SENDY_INSTALLATION_URL;
const api_key = process.env.SENDY_API_KEY;

const sendySubscribe = ({ email, name, list }) => {
  const url = base_url + "/subscribe";
  return axios.post(url, qs.stringify({ email, name, list, api_key }));
};

const sendyUnsubscribe = ({ email, list }) => {
  const url = base_url + "/unsubscribe";
  return axios.post(url, qs.stringify({ email, list, api_key }));
};

module.exports = {
  sendySubscribe,
  sendyUnsubscribe
};

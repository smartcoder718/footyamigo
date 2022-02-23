module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "FootyAmigo",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, user-scalable=0",
      },
      { hid: "description", name: "description", content: "" },
    ],
    link: [
      { rel: "icon", href: "/favicon.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600&display=swap",
      },
    ],
  },
  ssr: false,
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    //"~/static/flag-icon-css-master/css/flag-icon.min.css",
    "@/assets/css/global.css",
  ],
  telemetry: false,

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins",
    "~/plugins/axios",
    { src: "~/plugins/vue-slider", mode: "client" },
    { src: "~/plugins/vcalendar", mode: "client" },
    { src: "~/plugins/icons" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/svg", "@nuxtjs/gtm"],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false, // Or `bvCSS: false`
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    "bootstrap-vue/nuxt",
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "nuxt-svg-loader",
    "vue2-editor/nuxt",
  ],
  auth: {
    strategies: {
      cookie: {
        // scheme: "refresh",
        endpoints: {
          login: { url: "/auth/login", method: "post" },
          logout: { url: "/auth/logout", method: "get" },
          user: { url: "/user/profile", method: "get" },
          // refresh: { url: "/user/refresh-token", method: "get" },
        },
        // refreshToken: {
        //   property: "token",
        //   data: "token",
        //   // maxAge: 1000 * 60 * 0.5,
        // },
        autoLogout: true,
        user: {
          property: "user",
        },
        token: {
          // maxAge: 1000 * 60 * 60*24*3,
        },
      },
    },
    // 1000 * 60 * 60 * 24
    redirect: {
      login: "/auth/login",
      logout: "/auth/logout",
      callback: "/login",
      home: "/dashboard",
    },
  },
  gtm: {
    id: process.env.GOOGLE_TAG_MANAGER_ID, // Used as fallback if no runtime config is provided
  },

  publicRuntimeConfig: {
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID,
    },
  },
  server: {
    port: process.env.PORT || 80,
    host: process.env.HOST || "0.0.0.0",
  },
  styleResources: {
    scss: ["~/assets/scss/variables.scss"],
  },
  axios: {
    baseURL: "/api",
    browserBaseURL: "/api",
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.API_BASE_URL,
    },
  },
  // serverMiddleware: {
  //   '/api': '~/api'
  // },
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.API_BASE_URL,
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      vue: {
        prettify: false,
      },
    },
  },
};

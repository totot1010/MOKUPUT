// Import the plugin
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

// Update your mix plugins
mix.js("resources/js/app.js", "public/js").webpackConfig({
  plugins: [
    // To strip all locales except “en”
    new MomentLocalesPlugin({
      localesToKeep: ["es-us", "ru"],
    }),
  ],
  // Other config goes here
});
mix.webpackConfig({
  externals: {
    moment: "moment",
  },
});

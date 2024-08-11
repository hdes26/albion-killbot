const { getNumber, getBool } = require("../helpers/utils");

module.exports = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION || "us-east-1",
    bucket: process.env.AWS_BUCKET || "albion-items-v2 ",
  },

  discord: {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    token: process.env.DISCORD_TOKEN,
  },

  features: {
    events: {
      useHistoryPrices: getBool(process.env.FEATURE_USE_HISTORY_PRICES, false),
      displayTraitIcons: getBool(process.env.DISPLAY_TRAIT_ICONS, true),
    }
  },

  mongodb: {
    uri: process.env.MONGODB_URL,
  },

  api: {
    port: getNumber(process.env.PORT, 12000),
    cache: {
      enabled: true,
    },
  },

  bot: {
    shards: {
      total: process.env.SHARDS_TOTAL || "auto",
      spawn: process.env.SHARDS_TO_SPAWN || "auto",
    },
    guildRankings: true,
    servers: {
      cacheInterval: 60000,
    },
  },
};

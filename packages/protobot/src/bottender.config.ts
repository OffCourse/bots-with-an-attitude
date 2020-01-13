module.exports =  {
  channels: {
    slack: {
      enabled: true,
      path: "/webhooks/slack",
      accessToken: process.env.SLACK_ACCESS_TOKEN,
      verificationToken: process.env.SLACK_VERIFICATION_TOKEN
    }
  },
  session: {
    driver: "memory",
    stores: {
      memory: {
        maxSize: 500 // The maximum size of the cache, default will be 500.
      }
    }
  }
};

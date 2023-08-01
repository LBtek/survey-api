module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.4.20',
      skipMD5: true
    },
    instance: {
      dbName: 'jest'
    },
    autoStart: false
  }
}

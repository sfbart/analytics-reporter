const EMAIL_PREFIX = "ANALYTICS_REPORT_EMAIL"
const KEY_PREFIX = "ANALYTICS_KEY"

const _preloadSecretKeys = () => {
  const emailRegex = RegExp(`^${EMAIL_PREFIX}(.*)`)
  const secretKeyRegex = RegExp(`^${KEY_PREFIX}(.*)`)

  Object.keys(process.env).forEach(key => {
    if (key.match(emailRegex)) {
      const suffix = key.match(emailRegex)[1]
      const email = process.env[key]
      _setEmailForSuffix({ suffix, email })
    } else if (key.match(secretKeyRegex)) {
      const suffix = key.match(secretKeyRegex)[1]
      const secretKey = process.env[key]
      _setSecretKeyForSuffix({ suffix, secretKey })
    }
  })

  Object.keys(global.analyticsSecretKeysBySuffix).forEach(suffix => {
    const secretKey = global.analyticsSecretKeysBySuffix[suffix]
    global.analyticsSecretKeys.push(secretKey)
  })
}

const _setEmailForSuffix = ({ suffix, email }) => {
  if (!global.analyticsSecretKeysBySuffix[suffix]) {
    global.analyticsSecretKeysBySuffix[suffix] = {}
  }
  global.analyticsSecretKeysBySuffix[suffix].email = email
}

const _setSecretKeyForSuffix = ({ suffix, secretKey }) => {
  if (!global.analyticsSecretKeysBySuffix[suffix]) {
    global.analyticsSecretKeysBySuffix[suffix] = {}
  }
  global.analyticsSecretKeysBySuffix[suffix].secretKey = secretKey
}

if (!global.analyticsSecretKeys) {
  global.analyticsSecretKeys = []
  global.analyticsSecretKeysBySuffix = {}
  global.analyticsSecretKeysIndex = 0
  _preloadSecretKeys()
}

const loadNextGoogleAnalyticsSecretKey = () => {
  const index = global.analyticsSecretKeysIndex++ % global.analyticsSecretKeys.length
  return global.analyticsSecretKeys[index]
}

module.exports = loadNextGoogleAnalyticsSecretKey

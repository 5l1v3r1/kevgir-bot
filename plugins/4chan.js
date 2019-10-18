const rp = require('request-promise-native')

// https://i.4cdn.org/b/1570732453655.webm
const rule = RegExp('(?:https?:\\/\\/)?(i\\.4cdn\\.org\\/\\w+\\/(\\d+)\\.webm)')

const test = (url) => {
  if (rule.test(url)) { return true } else { return false }
}

const get = async (url) => {
  let convertedUrl = ''
  const options = {
    method: 'GET',
    url: 'https://api.cloudconvert.com/convert',
    headers: { 'content-type': 'application/json' },
    body: {
      apikey: process.env.CLOUD_CONVERT_TOKEN,
      inputformat: 'webm',
      outputformat: 'mp4',
      input: 'download',
      file: url,
      wait: true,
      download: false
    },
    json: true
  }

  await rp(options)
    .then(res => {
      convertedUrl = res.output.url
    })

  return convertedUrl ? ('http:' + convertedUrl) : false
}

module.exports = { test, get }

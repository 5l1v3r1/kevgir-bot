const rp = require('request-promise-native')

const rule = RegExp('(?:https?:\\/\\/)?(?:www.)?gfy(?:cat\\.com(?:\\/.{1,3})?(?!\\/(?:privacy|contact|upload|sign|leader|random|support|partners|gifbrewery|cajax\\/))|gur\\.com\\/view\\/\\d+)\\/+(?:(?:cajax\\/checkUrl|fetch)\\/(?:http.+)|(?!useraccount\\/|ifr\\/|(?:(?:\\w\\w\\/)?gifs\\/)?detail\\/)@?(?:[\\w.-]+)(?:\\/albums)?\\/(?:[\\w-]+).*|(?:ifr\\/|(?:(?:\\w\\w\\/)?gifs\\/)?detail\\/)?([a-zA-Z]{6,})(#?\\?direction=reverse)?.*)')

const test = (url) => {
  if (rule.test(url)) { return true } else { return false }
}

const get = async (url) => {
  let mediaUrl
  const matched = rule.exec(url)[1]
  console.log(matched)

  const options = {
    uri: 'https://api.gfycat.com/v1/gfycats/' + matched,
    json: true
  }
  await rp.get(options)
    .then(content => {
      mediaUrl = content.gfyItem.mobileUrl
    })
    .catch((err) => {
    // console.log(err)
    })

  return mediaUrl || false
}

module.exports = { test, get }

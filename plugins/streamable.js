const rp = require('request-promise-native')

const rule = RegExp('(?:https?:\\/\\/)?(?:www.)?(?:streamable\\.com\\/)(?!about|documentation|privacy|terms|signup|login|tools|videos|albums|dashboard|search|clipper)(?:\\w\\/|album|ajax\\/groups\\/)?([\\da-z]+).*')

const test = (url) => {
  if (rule.test(url)) { return true } else { return false }
}

const get = async (url) => {
  let mediaUrl
  const mediaId = rule.exec(url)[1]

  await rp.get('https://streamable.com/o/' + mediaId)
    .then(content => {
      let videoJSON = JSON.parse(content.match(/var videoObject = (\{[^\n]+\})/)[1])
      let mobileUrl = 'https:' + videoJSON.files['mp4-mobile'].url
      return mobileUrl
    })
    .catch((err) => {
    // console.log(err)
    })

  return mediaUrl || false
}

module.exports = { test, get }

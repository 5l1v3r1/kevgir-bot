const requireDir = require('require-dir')
const plugins = requireDir('./plugins')
const { execSync } = require('child_process')

const getMediaYTDL = async (url) => {
  let ytdl

  // If no https?://
  if (!RegExp('^(?:https?:\\/\\/)').test(url)) {
    url = 'http://' + url
  }
  try {
    ytdl = execSync(`youtube-dl -g ${url}`, { encoding: 'utf8' }).toString()
  } catch (e) {
    // console.log(e)
  }

  return ytdl || false
}

const update = () => {
  let ytdl
  try {
    ytdl = execSync(`youtube-dl -U`, { encoding: 'utf8' }).toString()
  } catch (err) {
    // console.log(err)
  }
  return ytdl || false
}

const matchUrl = (url) => {
  let matchedPlugin
  for (let plugin of Object.keys(plugins)) {
    if (plugins[plugin].test(url)) { matchedPlugin = plugin }
  }
  return matchedPlugin
}

const getMedia = async (url) => {
  let plugin = matchUrl(url)
  if (plugin) {
    var mediaUrl = await plugins[plugin].get(url)
    return mediaUrl
  } else { return false }
}

module.exports = { getMedia, getMediaYTDL, update }

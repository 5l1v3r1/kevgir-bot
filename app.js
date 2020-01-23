const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const kevgir = require('./kevgir')
// const fs = require('fs')

require('dotenv').config()

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

const getMarkup = (text, value) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.urlButton(text, value),
    Markup.callbackButton('Sil', 'delete')
  ])
  return keyboard
}

bot.on('text', async (ctx) => {
  let mediaUrl, command, url

  // Special commands
  if (ctx.message.text.startsWith('!')) {
    handleSpecialCommand(ctx)
    return
  }

  // Ignore if message has no entities
  if (!ctx.message.hasOwnProperty('entities')) { return }

  // Getting command and url entities
  ctx.message.entities.map(entity => {
    if (entity.type === 'bot_command') {
      command = ctx.message.text.slice(entity.offset, entity.offset + entity.length)
    }
    if (entity.type === 'url') {
      url = ctx.message.text.slice(entity.offset, entity.offset + entity.length)
    }
  })

  // Handle ping command
  if (command && command === '/bot') {
    ctx.reply(';)', Extra.markup(getMarkup('Link', 'http://akrepnalan.com')))
    return
  }

  // /update command
  else if (command && command === '/update') {
    const updateResult = await kevgir.update()
    if (updateResult) {
      ctx.reply(updateResult, Extra.markup(getMarkup('Tamam', 'http://akrepnalan.com')))
      return
    }
  }

  // Ignore if message has no urls
  if (!url) { return }

  // /force command
  if (command && command === '/force') {
    mediaUrl = await kevgir.getMediaYTDL(url)
    if (mediaUrl) { sendMedia(ctx, mediaUrl) } else { ctx.reply('Zor.', Extra.markup(getMarkup('Link', url))) }
  }

  // /url or /link command
  else if (command && (command === '/url' || command === '/link')) {
    mediaUrl = await kevgir.getMediaYTDL(url)
    // Checking if url
    if (RegExp('^(https?:\\/\\/\\S+)').test(mediaUrl)) {
      mediaUrl.trim().split('\n').forEach(url => {
        ctx.reply('Selam.', Extra.markup(getMarkup('Link', url)))
      })
    }
    // Not a url
    else {
      ctx.reply('Zor.', Extra.markup(getMarkup('Link', url)))
    }
  }

  // Message has no commands
  else if (!command) {
    mediaUrl = await kevgir.getMedia(url)
    if (mediaUrl) {
      sendMedia(ctx, mediaUrl)
    }
  }
})

const handleSpecialCommand = (ctx) => {
  const command = ctx.message.text.slice(1)
  let message = ''
  let downloadLink = ''
  let crackLink = ''
  switch (command) {
    case 'photoshop':
      message = 'Photoshop'
      downloadLink = 'https://prodesigntools.com/prdl-download/Photoshop/66A1D1E00DE44601B041A631261EC584/1507846032938/AdobePhotoshop19-mul_x64.zip'
      crackLink += 'https://t.me/c/1125644969/75261'
      break
    case 'windows':
      message = 'Windows 10'
      downloadLink = 'https://tb.rg-adguard.net/public.php'
      crackLink += 'https://t.me/c/1125644969/70079'
      break
    default:
      break
  }
  ctx.reply(message, Extra.markup(Markup.inlineKeyboard([
    Markup.urlButton('Download', downloadLink),
    Markup.urlButton('Crack', crackLink),
    Markup.callbackButton('Sil', 'delete')
  ])))
}
// const sendLocalMedia = (ctx, mediaPath) => {
//   try {
//     ctx.replyWithVideo({ source: fs.createReadStream(mediaPath) })
//   } catch (error) {
//     console.log(error)
//     ctx.replyWithVideoNote({ source: fs.createReadStream(mediaPath) })
//   }
// }

const sendMedia = (ctx, mediaUrl) => {
  if (RegExp('^(https?:\\/\\/\\S+)').test(mediaUrl)) {
    try {
      ctx.replyWithVideo(mediaUrl, Extra.markup(getMarkup('Link', mediaUrl)))
    } catch (error) {
      console.log(error)
      ctx.replyWithPhoto(mediaUrl, Extra.markup(getMarkup('Link', mediaUrl)))
    }
  }
  // else {
  //   sendLocalMedia(ctx, mediaUrl)
  // }
}

bot.action('delete', ({ deleteMessage }) => deleteMessage())

bot.startPolling()

const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const kevgir = require('./kevgir')
// const fs = require('fs')

require('dotenv').config()

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

const getMarkup = (text, value) => {
  if (!value.startsWith('http')) { value = `http://\n${value}` }
  const keyboard = Markup.inlineKeyboard([
    Markup.urlButton(text, value),
    Markup.callbackButton('Sil', 'delete')
  ])
  return keyboard
}

bot.on('text', async (ctx) => {
  let mediaUrl, command, url

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
      ctx.reply('Tamam.', Extra.markup(getMarkup('Detay', updateResult)))
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

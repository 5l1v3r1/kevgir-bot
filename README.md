Kevgir Bot
==========================

A [Telegram Bot](https://core.telegram.org/bots) that helps with the media previews in group chats.

## Overview

> In Telegram chats, video links usually get detected and become instantly in-app-watchable but SOME DON'T and clicking on them launches your browser.

To fix that, I've prototyped this bot. It's obviously not production ready and badly written, but hey, it works.

You can also use it as a youtube-dl powered video downloader/link grabber.

## Documentation // TODO

It supports plugins but it's not documented well enough.

If the detected link is supported by one of the plugins, the bot will resend the video as directly watchable.
If not, you can force grab the video (or its URL) using its embedded youtube-dl.

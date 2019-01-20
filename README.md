# Google Home Talker
An NPM module for playing a sound or YouTube, or saying a text on Google Home.

Google Homeにしゃべらせたり、音楽を再生させたりするnpmモジュールです。`noelportugal/google-home-notifier` のメンテが長らくされていないため、自分用に作っています。

## 変更点 / What's changes from google-home-notifer
Below:
 * Change mdns package: `mdns` -> `mdns-js` ( For using on Raspberry Pi)
 * Playing YouTube URL
 * [WIP] Resume when interrupted
 * [WIP] Express middleware
 * [WIP] VoiceText(Japanese TTS Service) API ready

 特に、日本国内ではラズパイで動作させ、VoiceTextを使って声を可愛くすることが良く紹介されていますので、それらに対応させたいです。

 ## How To Use
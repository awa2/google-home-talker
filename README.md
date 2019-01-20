# Google Home Talker
Google Homeにしゃべらせたり、音楽を再生させたりするnpmモジュールです。
`noelportugal/google-home-notifier` のメンテが長らくされていないため、自分用に作っています。

## 変更点 / What's changes from google-home-notifer
Below:
 * Change mdns package: `mdns` -> `mdns-js` ( For using Raspberry Pi)
 * Playing YouTube URL
 * [WIP] Resume when interrupted
 * [WIP] Express middleware
 * [wIP] VoiceText(Japanese TTS Service) API ready

 特に、日本国内ではラズパイで動作させ、VoiceTextを使って声を可愛くすることが良く紹介されていますので、それらに対応させたいです。

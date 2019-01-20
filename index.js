const Client = require('castv2-client').Client;
const Youtube = require('youtube-castv2-client').Youtube;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const MDNS = require('mdns-js');
const Browser = MDNS.createBrowser(MDNS.tcp('googlecast'));
const Googletts = require('google-tts-api');

class GoogleHomeTalk {
    /**
     * Creates an instance of GoogleHomeTalk.
     * @param {string} deviceName Cast Device Name
     * @param {string} [lang='en'] Language
     * @param {string} [accent='us'] Accent
     * @memberof GoogleHomeTalk
     */
    constructor(deviceName, lang = 'en', accent = 'us') {
        if (deviceName) { this.deviceName = deviceName; }
        else { throw 'Device Name is not defined'; }
        this.lang = lang;
        this.accent = accent;
        this.getDeviceIp();
        return this;
    }

    /**
     * Get Cast Device Ip
     *
     * @returns {GoogleHomeTalk}
     * @memberof GoogleHomeTalk
     */
    getDeviceIp() {
        Browser.on('ready', () => {
            Browser.discover();
        });
        Browser.on('update', (service) => {
            if (service.fullname) {
                console.log(`${service.fullname} [ ${service.addresses[0]}:${service.port} ] is found`);
                console.log(JSON.stringify(service));
                if (service.fullname.includes(this.deviceName) || service.fullname.includes(this.deviceName.replace(' ', '-'))) {
                    this.deviceIp = service.addresses[0];
                    Browser.stop();
                }
            }
        });
        return this;
    }

    /**
     * Play an URL
     *
     * @param {string} URL
     * @returns {Promise}
     * @memberof GoogleHomeTalk
     */
    play(url) {
        if (url.match(/https:\/\/((www\.|)youtube\.com\/watch.+|youtu\.be\/.+)/g)) {
            // Playing YouTube
            return this.playYouTube(url);
        }
        if (url.match(/(https|http):\/\/.+/g)) {
            // Playing Endpoint
            return this.playEndpoint(url);
        }
    }

    /**
     * Play an YouTube
     *
     * @param {string} YouTube
     * @returns {Promise}
     * @memberof GoogleHomeTalk
     */
    playYouTube(url) {
        var videoId = '';
        if (url.match(/https:\/\/(www\.|)youtube.com\/watch.+/g)) {
            videoId = url.match(/v=([^&]+)/g)[0];
            videoId = videoId.substring(2);
        }
        if (url.match(/https:\/\/youtu\.be\/.+/g)) {
            videoId = url.substring(17);
        }
        return new Promise((resolve, reject) => {
            try {
                if(!this.deviceIp){ throw `${this.deviceName} is not found`; }
                const client = new Client();
                client.connect(this.deviceIp, () => {
                    console.log(`Connecting ${this.deviceIp} ...`);
                    client.launch(Youtube, (err, Player) => {
                        if (err) { reject(err); }
                        Player.load(videoId);
                    });
                });
    
                client.on('error', (error) => {
                    client.close();
                    reject(error);
                });
                
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Play a multimedia file with URL
     *
     * @param {string} URL
     * @returns {Promise}
     * @memberof GoogleHomeTalk
     */
    playEndpoint(url) {
        return new Promise((resolve, reject) => {
            try {
                if(!this.deviceIp){ throw `${this.deviceName} is not found`; }
                const client = new Client();
                client.connect(this.deviceIp, () => {
                    console.log(`Connecting ${this.deviceIp} ...`);
                    client.launch(DefaultMediaReceiver, (err, Player) => {
                        if (err) { 
                            reject(err);
                            // throw err;
                        }
                        let media = {
                            contentId: url,
                            contentType: 'audio/mp3',
                            streamType: 'LIVE'//'BUFFERED' // or LIVE
                        };
                        Player.load(media, { autoplay: true }, (err, status) => {
                            if (err) { 
                                reject(err);
                                // throw err;
                            }
                            console.log(`[SUCCESS] Now playing ${url}`);
                            client.close();
                            resolve(status);
                        });
                    });
                });
    
                client.on('error', (error) => {
                    client.close();
                    // reject(error);
                    throw error;
                });
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Say a text by Google TTS
     *
     * @param {string} text
     * @returns {Promise}
     * @memberof GoogleHomeTalk
     */
    talk(text) {
        return new Promise(async (resolve, reject) => {
            // Using Google Text to Speach
            try {
                const url = await Googletts(text, this.accent, 1);
                resolve(await this.playEndpoint(url));
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = GoogleHomeTalkApp;
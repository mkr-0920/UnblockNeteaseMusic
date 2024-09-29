const DEFAULT_SOURCE = ['kugou', 'kuwo', 'migu', 'navidrome', 'ytdlp'];
const PROVIDERS = {
	qq: require('./provider/qq'),
	kugou: require('./provider/kugou'),
	kuwo: require('./provider/kuwo'),
	migu: require('./provider/migu'),
	joox: require('./provider/joox'),
	youtube: require('./provider/youtube'),
	ytdownload: require('./provider/yt-download'),
	youtubedl: require('./provider/youtube-dl'),
	ytdlp: require('./provider/yt-dlp'),
	navidrome: require('./provider/navidrome'),
	pyncmd: require('./provider/pyncmd'),
};

module.exports = {
	DEFAULT_SOURCE,
	PROVIDERS,
};

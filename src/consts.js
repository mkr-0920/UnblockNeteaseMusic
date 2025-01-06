const DEFAULT_SOURCE = ['pyncmd', 'qq', 'kugou', 'kuwoflac', 'kuwo', 'migu', 'navidrome'];
const PROVIDERS = {
	qq: require('./provider/qq'),
	kugou: require('./provider/kugou'),
	kuwo: require('./provider/kuwo'),
	kuwoflac: require('./provider/kuwoflac'),
	migu: require('./provider/migu'),
	joox: require('./provider/joox'),
	youtube: require('./provider/youtube'),
	youtubedl: require('./provider/youtube-dl'),
	ytdlp: require('./provider/yt-dlp'),
	navidrome: require('./provider/navidrome'),
	pyncmd: require('./provider/pyncmd'),
};

module.exports = {
	DEFAULT_SOURCE,
	PROVIDERS,
};

const insure = require('./insure');
const select = require('./select');
const request = require('../request');
const { getManagedCacheStorage } = require('../cache');

const track = (info) => {
	const url =
		'https://www.hhlqilongzhu.cn/api/dg_kuwomusic.php?type=json&n=1&msg=' +
		encodeURIComponent(info.keyword);
		return request('GET', url)
		.then((response) => response.json())
		.then((jsonBody) => {
			const playurl = jsonBody.flac_url; // 获取音乐播放链接
			return playurl;
			});
};
const cs = getManagedCacheStorage('provider/kuwoflac');
const check = (info) => cs.cache(info, () => track(info));

module.exports = { check, track };

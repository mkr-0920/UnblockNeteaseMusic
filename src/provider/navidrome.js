const {
	cacheStorage,
	CacheStorageGroup,
	getManagedCacheStorage,
} = require('../cache');
const insure = require('./insure');
const select = require('./select');
const request = require('../request');

const format = (song) => {
	return {
	  id: song.id,
	  name: song.title,
	  duration: song.duration * 1000,
	  album: { id: song.album, name: song.album }, // 使用 song.album
	  artists: { id: song.artistId, name: song.artist }, // 使用 song.artistId
	};
  };
const search = (info) => {
	const keyword = encodeURIComponent(
		info.keyword
			.replace(/ - .*/, '') // 去掉 - 及其后面的内容
			.replace(/\s+\(live\)$/i, '(live)') // 去掉 (live) 前面的空格，处理小写
			.replace(/\s+\(Live\)$/i, '(Live)') // 去掉 (Live) 前面的空格，处理大写
	);	
	const url =
		'https://xxx/rest/search2?' +
		'songCount=5&songOffset=0&u=xxx&t=xxx&s=1c9a40&f=json&v=1.8.0&c=NavidromeUI&query=' +
		keyword;
	return request('GET', url)
		.then((response) => response.json())
		.then((jsonBody) => {
			const list = jsonBody['subsonic-response'].searchResult2.song.map(format);
            // 检查 list 是否为空
			if (list.length === 0) {
				return Promise.reject(new Error("navidrome: No matching song found"));
			} else {
				const matched = select(list, info);
				return matched ? matched.id : Promise.reject(new Error("navidrome: No matching song found"));
			}
		});
};

const track = (id) => {
	const url =
		'https://xxx/rest/stream?' +
		'u=xxx&t=xxx&s=xxx&f=json&v=1.8.0&c=NavidromeUI&id=' +
		id;
	return url;
};

const cs = getManagedCacheStorage('provider/navidrome');
const check = (info) => cs.cache(info, () => search(info)).then(track);

module.exports = { check, track };
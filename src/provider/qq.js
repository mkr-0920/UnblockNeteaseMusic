const insure = require('./insure');
const select = require('./select');
const request = require('../request');
const { getManagedCacheStorage } = require('../cache');

const headers = {
	origin: 'http://y.qq.com/',
	referer: 'http://y.qq.com/',
};

const format = (song) => ({
	id: { song: song.mid, file: song.mid },
	name: song.name,
	duration: song.interval * 1000,
	album: song.album.name,
	artist: song.singer[0].name,
	searchString: `${song.name} - ${song.singer.length > 0 ? song.singer.map(s => s.name).join(' / ') : ''} ${song.album.name}`,
});

const search = (info) => {
	const url =
		'https://u.y.qq.com/cgi-bin/musicu.fcg?data=' +
		encodeURIComponent(
			JSON.stringify({
				search: {
					method: 'DoSearchForQQMusicDesktop',
					module: 'music.search.SearchCgiService',
					param: {
						num_per_page: 5,
						page_num: 1,
						query: info.keyword,
						search_type: 0,
					},
				},
			})
		);

	return request('GET', url, headers)
		.then((response) => response.json())
		.then((jsonBody) => {
			const result = jsonBody.search.data.body.song.list.map(format);
			const matched = select(result, info);
			return matched ? matched : Promise.reject();
		});
};

const track = (matched) => {
    const url =
        'https://www.hhlqilongzhu.cn/api/dg_qqmusic_SQ.php?type=json&n=&msg=' +
        encodeURIComponent(matched.searchString);
    
    return request('GET', url)
        .then((response) => response.json())
        .then(jsonBody => {
            const songsToSearch = jsonBody.data.slice(0, 5); // 截取前 5 条数据
            
            // 遍历前 5 条数据，查找匹配的歌曲标题
            for (let song of songsToSearch) {
                if (song.song_title === matched.name) {
                    const nValue = song.n; // 获取对应的 n 值

                    // 使用找到的 n 值构建新的 URL
                    const newUrl =
                        'https://www.hhlqilongzhu.cn/api/dg_qqmusic_SQ.php?type=json&n=' +
                        encodeURIComponent(nValue) + // 将 n 值添加到 URL
                        '&msg=' + encodeURIComponent(matched.searchString); // 加号拼接

                    return request('GET', newUrl)
                        .then((response) => response.json())
                        .then((jsonBody) => {
                            const playurl = jsonBody.data.music_url; // 获取音乐播放链接
                            return playurl;
                        });
                }
            }
        });
};

const cs = getManagedCacheStorage('provider/qq');
const check = (info) => 
    cs.cache(info, () => search(info))
        .then(track) // 处理成功的情况
        .catch((error) => {
            console.error("Error occurred:", error);
            // 这里可以选择不做任何事情，或者处理错误
        });

module.exports = { check, track };

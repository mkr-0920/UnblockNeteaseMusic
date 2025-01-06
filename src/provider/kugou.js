const insure = require('./insure');
const select = require('./select');
const crypto = require('../crypto');
const request = require('../request');
const { getManagedCacheStorage } = require('../cache');
const { info } = require('console');

const format = (song) => {
	return {
		id: song['hash'],
		id_hq: song['320hash'],
		id_sq: song['sqhash'],
		name: song['songname'],
		artists: song['singername'].replace(/、/g, ''),
		duration: song['duration'] * 1000,
		album: { id: song['album_id'], name: song['album_name'] },
		searchString: `${song['songname']} - ${song['singername'].replace(/、/g, '')} ${song['album_name']}`,
	};
};

const search = (info) => {
	const url =
		'http://mobilecdn.kugou.com/api/v3/search/song?' +
		'keyword=' +
		encodeURIComponent(info.keyword) +
		'&page=1&pagesize=10';

	return request('GET', url)
		.then((response) => response.json())
		.then((jsonBody) => {
			// const list = jsonBody.data.lists.map(format)
			const list = jsonBody.data.info.map(format);
			const matched = select(list, info);
			return matched ? matched : Promise.reject();
		})
};

const track = (matched) => {
    const url =
        'https://www.hhlqilongzhu.cn/api/dg_kugouSQ.php?n=&type=json&quality=&msg=' +
        encodeURIComponent(matched.searchString);
    
    return request('GET', url)
        .then((response) => response.json())
        .then(jsonBody => {
            const songsToSearch = jsonBody.data.slice(0, 5); // 截取前 5 条数据
            
            // 遍历前 5 条数据，查找匹配的歌曲标题
            for (let song of songsToSearch) {
                if (song.title === matched.name) {
                    const nValue = song.n; // 获取对应的 n 值

                    // 使用找到的 n 值构建新的 URL
                    const newUrl =
                        'https://www.hhlqilongzhu.cn/api/dg_kugouSQ.php?type=json&quality=&n=' +
                        encodeURIComponent(nValue) + // 将 n 值添加到 URL
                        '&msg=' + encodeURIComponent(matched.searchString); // 加号拼接

                    return request('GET', newUrl)
                        .then((response) => response.json())
                        .then((jsonBody) => {
                            const playurl = jsonBody.music_url; // 获取音乐播放链接
                            return playurl;
                        });
                }
            }
        });
};
// const track = (info) => {
// 	const url =
// 		'https://www.hhlqilongzhu.cn/api/dg_kugouSQ.php?n=1&type=json&quality=&msg=' +
// 		encodeURIComponent(info.keyword);
// 	return request('GET', url)
// 	.then((response) => response.json())
// 	.then((jsonBody) => {
// 		const playurl = jsonBody.music_url; // 获取音乐播放链接
// 		return playurl; // 如果相同，返回播放链接
// 	});
// };

const cs = getManagedCacheStorage('provider/kugou');
const check = (info) => 
    cs.cache(info, () => search(info))
        .then(track) // 处理成功的情况
        .catch((error) => {
            console.error("Error occurred:", error);
            // 这里可以选择不做任何事情，或者处理错误
        });

module.exports = { check, track };
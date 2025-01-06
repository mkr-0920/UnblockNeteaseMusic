module.exports = (list, info) => {
    const { duration } = info; // 从 info 中解构出 duration 属性

    const song = list
        .slice(0, 5) // 只考虑前 5 个结果
        .find((song) => {
            // 检查歌曲的 duration 是否存在，并与目标 duration 比较
            if (song.duration && Math.abs(song.duration - duration) < 2 * 1e3) {
                console.log("匹配成功"); // 打印匹配成功的消息
                return true; // 返回 true 以表示找到了匹配的歌曲
            }
            return false; // 返回 false 以表示没有找到匹配的歌曲
        });
    return song || null; // 如果找到歌曲，返回该歌曲；否则返回 null
};
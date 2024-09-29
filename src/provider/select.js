module.exports = (list, info) => {
    const { duration } = info; // 从 info 中解构出 duration 属性

    const song = list
        .slice(0, 5) // 只考虑前 5 个结果
        .find(
            (song) =>
                song.duration && Math.abs(song.duration - duration) < 2 * 1e3 // 寻找时长相差小于 2 秒的歌曲
        );

    // 返回找到的歌曲或 null
    return song || null; // 如果找到歌曲，返回该歌曲；否则返回 null
};
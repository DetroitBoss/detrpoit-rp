export const YOUTUBE_LIMIT_ACCESS = {
    /** Количество лайков минимум */
    likesCount: 1,
    /** Количество просмотров минимум */
    viewsCount: 1,
    /** Количество комментариев минимум */
    commentsCount: 1,
    /** Процент дизлайков по отношению к сумме лайков и дизлайков. Если больше указанного числа - то не пропускаем */
    dislikePercent: 20,
    /** Сколько секунд минимум должен длится ролик */
    durationMinSeconds: 20,
    /** Сколько секунд максимум должен длится ролик */
    durationMaxSeconds: 60 * 5,
}
/** Папка с звуковыми файлами, не изменять */
export const SONG_FOLDER_NAME = `songs`
export const SONG_FOLDER = `./${SONG_FOLDER_NAME}/`

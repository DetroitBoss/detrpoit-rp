export const ALERTS_SETTINGS = {
    boxgame: "Оповещения о поиске сумки на карте",
    background: "Начальная музыка",
    startVoice: "Голосовое приветствие",
    hudHotkeys: "Подсказки в худе",
    opacityChat: "Затухание неактивного чата",
    questLines: "Отображение сюжетной линии",
    enableIntro: "Отображение интро при входе",
    enableChat: "Отображать текстовый чат",
    hitMaker: "Отображение наносимого урона",
    personalHitMarker: "Отображение наносимого Вам урона"
}

export type StorageAlertData = Partial<Record<keyof typeof ALERTS_SETTINGS, boolean>>
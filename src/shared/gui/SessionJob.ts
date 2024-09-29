export interface SessionJobMenuConfig {
    NameLarge: string,
    NameThin: string,
    Description: string,
    DescriptionItems: { UpperText: string, LowerText: string, Image: string }[]
    RightImage: string
}

export interface SessionInfo {
    Id: number,
    Name: string,
    IsProtected: boolean
}

export interface SessionPlayer {
    Id: number,
    Name: string,
    IsReady: boolean,
    IsOwner?: boolean
}

export const MenuConfigs = new Map<string, SessionJobMenuConfig>([
    [
        'firefighter',
        {
            NameLarge: 'Пожарная', NameThin: 'организация',
            Description: 'Работа пожарного - дело не легкое, По сигналу тревоги спешите на вызов. ' +
                'Пожары, аварии, возгорания – каждый раз сценарии разные, но цель всегда одна: спасти. ' +
                'Ощутите себя в роли настоящего героя. Собирайте команду из ваших друзей и спешите тушить пожары. ' +
                'За каждое задание вы будите получать вознаграждение.',
            RightImage: 'firefighter-right-new',
            DescriptionItems: [
                { UpperText: 'За час работы', LowerText: 'до $60.000', Image: 'flat-icon-1' },
                { UpperText: 'Вклад в развитие', LowerText: 'штата', Image: 'flat-icon-2' },
                { UpperText: 'Работай', LowerText: 'с друзьями', Image: 'firefighter-small' }
            ]
        }
    ]
]);
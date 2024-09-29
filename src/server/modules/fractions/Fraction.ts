import {FractionsEntity} from "../typeorm/entities/fractions";
import {ALL_FRACTION_RIGHTS, FRACTION_RIGHTS} from "../../../shared/fractions/ranks";
import {fractionCfg} from "./main";

export class Fraction {
    private fractionsData: FractionsEntity[]

    constructor(fractionsData: FractionsEntity[]) {
        this.fractionsData = fractionsData;
    }

    public updateFractionsData(fractionsData: FractionsEntity[]) {
        this.fractionsData = fractionsData;
    }

    getRightsForRank(fractionId: number, rank: number): FRACTION_RIGHTS[] {
        const fraction = this.fractionsData.find(el => el.fractionId === fractionId);

        if (fractionCfg.isLeader(fractionId, rank)) return ALL_FRACTION_RIGHTS;

        if (!fraction) return [];

        const rankData = fraction.ranks[rank - 1];

        if (!rankData) return [];

        return rankData.rights;
    }

    getAwardCount(fractionId: number, rank: number): number {
        const fraction = this.fractionsData.find(el => el.fractionId === fractionId);

        if (!fraction) return 1;

        const rankData = fraction.ranks[rank - 1];

        if (!rankData) return 1;

        return rankData.award;
    }
}
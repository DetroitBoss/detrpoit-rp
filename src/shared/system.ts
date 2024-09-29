import {randomArrayElement, randomArrayElementIndex} from "./arrays";
import {QUEST_SPAWN_ITEM} from "./quests";

export type VectorWithOptionalHeading = [Vector3Shared, number?]
export type Vector3WithHeading = [Vector3Shared, number];
export interface Vector3Shared {
    x: number,
    y: number,
    z: number
}

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' |  'unshift'
type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> =
    Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>>
    & {
    readonly length: L
    [ I : number ] : T
    [Symbol.iterator]: () => IterableIterator<T>
}

function drawPoint(
    /** Первая точка */
    point: { x: number, y: number, z: number },
    /** Вторая точка */
    point2: { x: number, y: number, z: number },
    /** Расстояние на котором цели должны встретится */
    range: number
): [{ x: number, y: number, z: number }, { x: number, y: number, z: number }];
function drawPoint(
    /** Первая точка */
    point: { x: number, y: number },
    /** Вторая точка */
    point2: { x: number, y: number },
    /** Расстояние на котором цели должны встретится */
    range: number
): [{ x: number, y: number }, { x: number, y: number }];
function drawPoint(point: any, point2: any, range: number): any {
    if (!point.z) point.z = 0;
    if (!point2.z) point2.z = 0;
    const middle = systemUtil.middlePoint3d(point, point2);
    const distance = systemUtil.distanceToPos(point, point2);

    const shortX = ((point2.x - point.x) / distance) * (range / 2);
    const shortY = ((point2.y - point.y) / distance) * (range / 2);
    const shortZ = ((point2.z - point.z) / distance) * (range / 2);

    const target = { x: middle.x - shortX, y: middle.y - shortY, z: middle.z - shortZ }
    const target2 = { x: middle.x + shortX, y: middle.y + shortY, z: middle.z + shortZ }

    return [target, target2]
}


function offsetPosition(
    position: Vector3Mp,
    /** Вектор поворота объёкта */
    rotation: Vector3Mp,
    offset: Vector3Mp
): Vector3Mp;
function offsetPosition(
    position: Vector3Mp,
    /** GTA Heading объёкта */
    heading: number,
    offset: Vector3Mp
): Vector3Mp;
function offsetPosition(position: Vector3Mp, rotation: Vector3Mp | number, offset: Vector3Mp): Vector3Mp {
    if (typeof rotation == "number") rotation = new mp.Vector3(0, 0, rotation)
    const _rotation = new mp.Vector3(rotation.x / 180 * Math.PI, rotation.y / 180 * Math.PI, rotation.z / 180 * Math.PI);
    const cos_rx = Math.cos(_rotation.x);
    const cos_ry = Math.cos(_rotation.y);
    const cos_rz = Math.cos(_rotation.z);
    const sin_rx = Math.sin(_rotation.x);
    const sin_ry = Math.sin(_rotation.y);
    const sin_rz = Math.sin(_rotation.z);

    return new mp.Vector3(
        position.x + offset.x * cos_ry * cos_rz - offset.x * sin_rx * sin_ry * sin_rz - offset.y * cos_rx * sin_rz + offset.z * sin_ry * cos_rz + offset.z * sin_rx * cos_ry * sin_rz,
        position.y + offset.x * cos_ry * sin_rz + offset.x * sin_rx * sin_ry * cos_rz + offset.y * cos_rx * cos_rz + offset.z * sin_ry * sin_rz - offset.z * sin_rx * cos_ry * cos_rz,
        position.z - offset.x * cos_rx * sin_ry + offset.y * sin_rx + offset.z * cos_rx * cos_ry
    );
};
type Polygon2D = [number, number];

function degrees_to_radians(degrees: number) {return degrees * ((Math.PI)/180);}

export class systemUtil {
    static round(number: number, round = 2){
        return +number.toFixed(round);
    }
    static radian(degrees: number):number;
    static radian(degrees: {x: number, y: number, z: number}):{x: number, y: number, z: number};
    static radian(degrees: {x: number, y: number, z: number} | number){
        if(typeof degrees === 'number') return degrees_to_radians(degrees)
        else return {
            x: degrees_to_radians(degrees.x),
            y: degrees_to_radians(degrees.y),
            z: degrees_to_radians(degrees.z),
        }
    }
    static insidePolygon(point: number[], vs: [Polygon2D, Polygon2D, Polygon2D, Polygon2D]) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var x = point[0], y = point[1];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
    }
    static lerpVectors(vector1: Vector3Mp, vector2: Vector3Mp, amount: number){
        return new mp.Vector3(this.lerp(vector1.x, vector2.x, amount), this.lerp(vector1.y, vector2.y, amount), this.lerp(vector1.z, vector2.z, amount))
    }
    static lerp2d(vector1: {x: number, y: number}, vector2: {x: number, y: number}, amount: number){
        return {x: this.lerp(vector1.x, vector2.x, amount), y: this.lerp(vector1.y, vector2.y, amount)}
    }
    static lerp(value1: number, value2: number, amount: number) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    }
    static flatten<T>(arr:T[]): T[] {
        return arr.reduce((flat, toFlatten) => {
            return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
        }, []);
    }
    static sortArray<T>(array:T[],type:"DESC"|"ASC" = "DESC"):Array<T>{
        return array.sort((a,b) => {
            let res = 0;
            if(type !== "DESC"){
                if(a < b) res = -1;
                else if(a > b) res = 1;
            } else {
                if(a < b) res = 1;
                else if(a > b) res = -1;
            }
            return res;
        })
    }
    static spliceArrayByArray<T>(arrayToSplice: T[], spliceArray: T[], predictFunc?: (a: T, b: T) => boolean) {
        if (!predictFunc) {
            predictFunc = (a, b) => a === b;
        }

        spliceArray.forEach(item => {
            const idx = arrayToSplice.findIndex((sourceItem) => predictFunc(sourceItem, item));
            if (idx === -1) {
                return;
            }

            arrayToSplice.splice(idx);
        })
    }
    static chunkArray<T, Z extends number>(array: T[], chunkSize: Z): FixedLengthArray<T, Z>[]{
        return [].concat.apply([],
            array.map(function(elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        );
    }
    static sortArrayObjects<T>(array:T[],param:{id: keyof T,type: "DESC"|"ASC"}[]):Array<T>{
        return array.sort((a,b) => {
            let res = 0;
            param.map(q => {
                if(res != 0) return;
                const aval = a[q.id];
                const bval = b[q.id];
                if(q.type !== "DESC"){
                    if(aval < bval) res = -1;
                    else if(aval > bval) res = 1;
                } else {
                    if(aval < bval) res = 1;
                    else if(aval > bval) res = -1;
                }
            })
            return res;
        })
    }
    static filterInput(text: string){
        if(!text) return text;
        if(typeof text !== "string") text = String(text);
        if(!text.length) return text;
        text = text.toString().replace(/[^A-Za-zА-Яа-яЁёЇїІі0-9 \-,.?/!%()$_*+=#№@;:<>{}\[\]]/g, '')
        text = text.toString().replace(/<([^>]*)>?/gm, '$1');
        text = text.toString().replace(/"/g, '')
        // text = text.toString().replace(/[^\x20-\x7E]/g, '')
        // text = text.toString().replace(/	/g, '')
        // text = text.toString().replace(/\\/g, '')
        text = text.toString().replace(/'/g, '')
        // text = text.toString().replace(/`/g, '')
        // text = text.toString().replace(/\n/g, ' ');
        // text = text.toString().replace(/<([^>]*)>?/gm, '$1');
        return text
    }
    static secondsToString(duration: number){
        // Hours, minutes and seconds
        let hrs = ~~(duration / 3600);
        let mins = ~~((duration % 3600) / 60);
        let secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }
    static msecondsToString(duration: number){
        let ms = duration % 1000;
        return `${this.secondsToString(duration - ms)}${ms ? `:${ms < 10 ? '0' : ''}${ms < 100 ? '0' : ''}${ms}` : `000`}`
    }
    static componentToHex(c: number) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    static rgbToHex(r: number, g: number, b: number) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    static hexToRgb(hex: string){
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static encryptCodes(content:string, passcode:string) {
        var result = []; var passLen = passcode.length ;
        for(var i = 0  ; i < content.length ; i++) {
            var passOffset = i%passLen ;
            var calAscii = (content.charCodeAt(i)+passcode.charCodeAt(passOffset));
            result.push(calAscii);
        }
        return JSON.stringify(result) ;
    }
    static decryptCodes(content: string, passcode: string) {
        var result = [];var str = '';
        var codesArr = JSON.parse(content);var passLen = passcode.length ;
        for(var i = 0  ; i < codesArr.length ; i++) {
            var passOffset = i%passLen ;
            var calAscii = (codesArr[i]-passcode.charCodeAt(passOffset));
            result.push(calAscii) ;
        }
        for(var i = 0 ; i < result.length ; i++) {
            var ch = String.fromCharCode(result[i]); str += ch ;
        }
        return str ;
    }
    static offsetPosition = offsetPosition;
    static drawPoint = drawPoint;
    static middlePoint2d(...points: { x: number, y: number }[]) {
        return {
            x: points.map(q => q.x).reduce((sum, current) => { return sum + current }) / points.length,
            y: points.map(q => q.y).reduce((sum, current) => { return sum + current }) / points.length,
        }
    }
    static middlePoint3d(...points: { x: number, y: number, z: number }[]) {
        return {
            x: points.map(q => q.x).reduce((sum, current) => { return sum + current }) / points.length,
            y: points.map(q => q.y).reduce((sum, current) => { return sum + current }) / points.length,
            z: points.map(q => q.z).reduce((sum, current) => { return sum + current }) / points.length,
        }
    }
    static getTime(ms = false) {
        let dateTime = new Date();
        return `${this.digitFormat(dateTime.getHours())}:${this.digitFormat(dateTime.getMinutes())}:${this.digitFormat(dateTime.getSeconds())}` + (ms ? `:${this.digitFormat(dateTime.getMilliseconds())}` : '');
    }
    /** Полная строка с датой и временем сервера, 
     * @example 20.01.2020 12:00 */
    static get fullDateTime() {
        let dateTime = new Date();
        return `${this.digitFormat(dateTime.getDate())}.${this.digitFormat(dateTime.getMonth()+1)}.${this.digitFormat(dateTime.getFullYear())} ${this.digitFormat(dateTime.getHours())}:${this.digitFormat(dateTime.getMinutes())}`;
    }
    /** Полная строка с датой и временем
     * @example 20.01.2020 12:00
     * @example 12:00 (Дата не рисуется если она сегодняшняя)
     * @example 20.01.2020 12:00 (В любом случае будет дата, если параметр full = true)
    */
    static timeStampString(time: number, full = false) {
        let dateTimeNow = new Date();
        let dateTime = new Date(time * 1000);
        let res = `${this.digitFormat(dateTime.getHours())}:${this.digitFormat(dateTime.getMinutes())}`;
        if (full || dateTimeNow.getDate() != dateTime.getDate() || dateTimeNow.getMonth() != dateTime.getMonth() || dateTimeNow.getFullYear() != dateTime.getFullYear()) res = `${this.digitFormat(dateTime.getDate())}.${this.digitFormat(dateTime.getMonth()+1)}${dateTimeNow.getFullYear() != dateTime.getFullYear() || full ? `.${this.digitFormat(dateTime.getFullYear())}` : ""} ` + res
        return res;
    }
    /** Вернёт только дату */
    static timeStampStringDate(time: number) {
        let dateTime = new Date(time * 1000);
        return `${this.digitFormat(dateTime.getDate())}.${this.digitFormat(dateTime.getMonth()+1)}.${this.digitFormat(dateTime.getFullYear())}`
    }
    /** Вернёт только время */
    static timeStampStringTime(time: number) {
        let dateTime = new Date(time * 1000);
        return `${this.digitFormat(dateTime.getHours())}:${this.digitFormat(dateTime.getMinutes())}`
    }
    /** Вернет строку в минутах:секундах */
    static timeStampStringTimeInMinutes(time: number) {
        let dateTime = new Date(time * 1000);
        return `${this.digitFormat(dateTime.getMinutes())}:${this.digitFormat(dateTime.getSeconds())}`
    }
    static sleep(time = 1000) { return new Promise((resolve, reject) => setTimeout(resolve, time)) }
    static randomStr(len: number, arr: string = '1234567890abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXY') {
        var ans = '';
        for (var i = len; i > 0; i--) {
            ans +=
                arr[Math.floor(Math.random() * arr.length)];
        }
        return ans;
    }
    static randomNumber(len: number) {
        if(!len) len = 7;
        let string = this.randomStr(len, '1234567890');
        if (string[0] === "0") string = string.replace(/^.{1}/g, '1')
        return parseInt(string)
    }
    static digitFormat(number: string | number) {
        return ('0' + number).slice(-this.biggestNumber(number.toString().length, 2));
    }
    static onlyNumber(str: string) {
        return (/^\d+$/.test(str))
    }
    static biggestNumber(number1: number, number2: number) {
        if (number1 >= number2) return number1;
        else return number2
    }
    static smallestNumber(number1: number, number2: number) {
        if (number1 < number2) return number1;
        else return number2
    }
    /** Базовый scale не особо важных иконок на карте */
    static readonly blipBaseScale = 0.8
    /** Базовый scale ключевых иконок на карте */
    static readonly blipBaseNeeded = 0.9
    static createBlip(type: number, color: number, position: {x: number, y: number, z?: number}, name: string, dimension: number = 0, shortRange: boolean = true) {
        return mp.blips.new(type, new mp.Vector3(position.x, position.y, position.z || 0.0), {
            shortRange,
            scale: this.blipBaseScale,
            color, name, dimension
        })
    }
    static getRandomSpawn(): [Vector3Mp, number] {
        return randomArrayElement([
            [new mp.Vector3(-1037.72, -2737.72, 20.17), 330],
        ])
    }
    static getDataByQuest(index: number) {
        return QUEST_SPAWN_ITEM.find(q => q.questID === index)
    }
    static getDataByQuestLine(index: number) {
        return QUEST_SPAWN_ITEM[index]
    }
    static parseInt(val: string | number) {
        if (typeof val === "string") return parseInt(val)
        else Math.floor(val)
    }
    static parseFloat(str: number | string) {
        if (typeof str == "string") str = parseFloat(str);
        else str = parseFloat(str.toFixed(2));
        if (isNaN(str)) str = 0;
        return str
    }
    static numberFormat(num: number, replaceIntEnd = true) {
        if (typeof num !== "number") num = Number(num);
        let n = num.toFixed(2);
        if (replaceIntEnd) n = n.replace('.00', '');
        return n.replace(/.+?(?=\D|$)/, function (f) {
            return f.replace(/(\d)(?=(?:\d\d\d)+$)/g, "$1 ");
        });
    }
    /** Форматирует секунды в строковое отображение
     * @example 02:59
     * @example 165:10
    */
    static formatTime(timeS: number): string {
        const minutes = Math.floor(timeS / 60);
        const seconds = timeS % 60;

        return `${this.digitFormat(minutes)}:${this.digitFormat(seconds)}`;
    }
    static getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    static getRandomIntStep(min: number, max: number, step: number) {
        const number = this.getRandomInt(min, max);
        const ost = number % step;
        if(ost / step < 0.5) return number - ost;
        else return number - ost + step
    }
    static getRandomFloat() {
        return this.getRandomInt(0, 10000) / 10000;
    }
    static daysInMonth(month: number, year: number) {
        return new Date(year, month, 0).getDate();
    }
    static distanceToPos(v1: { x: number, y: number, z: number }, v2: { x: number, y: number, z: number }) {
        return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x), 2) +
            Math.pow((v2.y - v1.y), 2) +
            Math.pow((v2.z - v1.z), 2)));
    }
    static distanceToPos2D(v1: Vector2, v2: Vector2) {
        return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x), 2) +
            Math.pow((v2.y - v1.y), 2)));
    }
    /** Проверяем входит ли точка в одну из точек из нашего массива точек с указанным радиусом */
    static isPointInPoints(point: Vector3Mp, points: Vector3Mp[], range?: number): boolean;
    static isPointInPoints(point: Vector2, points: Vector2[], range?: number): boolean;
    static isPointInPoints(
        /** Точка, которую проверяем */
        point: Vector2|Vector3Mp,
        /** Точки, с которыми сверяем */
        points: (Vector2|Vector3Mp)[],
        /** Радиус проверки */
        range = 5
    ) {
        return this.isPointInPointsIndex(point, points, range) > -1
    }
    /** Проверяем входит ли точка в одну из точек из нашего массива точек с указанным радиусом */
    static isPointInPointsIndex(point: Vector3Mp, points: Vector3Mp[], range?: number): number;
    static isPointInPointsIndex(point: Vector2, points: Vector2[], range?: number): number;
    static isPointInPointsIndex(
        /** Точка, которую проверяем */
        point: Vector2|Vector3Mp,
        /** Точки, с которыми сверяем */
        points: (Vector2|Vector3Mp)[],
        /** Радиус проверки */
        range = 5
    ) {
        const is3d = (point as Vector3Mp).z;
        if(is3d) return points.findIndex(p => this.distanceToPos(p as Vector3Mp, point as Vector3Mp) <= range)
        return points.findIndex(p => this.distanceToPos2D(p, point) <= range)
    }

    /** Проверяем входит ли точка в прямоугольник по его двум противоположным сторонам */
    static isPointInRectangle2D(pointPos: Vector2, firstPos: Vector2, secondPos: Vector2) {
        const minX = firstPos.x > secondPos.x ? secondPos.x : firstPos.x
        const minY = firstPos.y > secondPos.y ? secondPos.y : firstPos.y
        const maxX = firstPos.x > secondPos.x ? firstPos.x : secondPos.x
        const maxY = firstPos.y > secondPos.y ? firstPos.y : secondPos.y
        return (pointPos.x >= minX && pointPos.y >= minY && pointPos.x <= maxX && pointPos.y <= maxY)
    }
    
    static removeQuotes(str: string) {
        if (typeof str != "string") return str;
        return str.replace('\'', '');
    }
    static getDate() {
        return new Date()
    }
    static getTimeStamp() {
        return Date.now() / 1000 | 0;
    }
    static getTimeStampMS() {
        return Number(new Date())
    }
    /** Время в секундах */
    static get timestamp() {
        return this.getTimeStamp()
    }

    /**
     * Возвращает время в секундах от текущего момента
     */
    static getTimeAfter(addOptions: { hours?: number, minutes?: number, seconds?: number }) : number {
        let time = this.timestamp;

        time += (addOptions.seconds) ? addOptions.seconds : 0;
        time += (addOptions.minutes) ? addOptions.minutes * 60 : 0;
        time += (addOptions.hours) ? addOptions.hours * 60 * 60 : 0;

        return time;
    }

    /** Время в миллисекундах */
    static get timestampMS() {
        return this.getTimeStampMS()
    }
    static generateTransaction(
        /** Количество блоков */
        blocksSize = 4,
        /** Длинна каждого блока */
        len = 4,
        arr = '123456789QWERTYUIOPASDFGHJKLZXCVBNM'
        ){
            let block:string[] = []
        for (let id = 0; id < len; id++) block.push(this.randomStr(blocksSize, arr))
        return block.join('_')
    }
    /** Время между командой на телепортацию и самой телепортацией */
    static TELEPORT_TIME = 1000
    static randomArrayElement = randomArrayElement
    static randomArrayElementIndex = randomArrayElementIndex
    static getWeatherName(type: "EXTRASUNNY" | "CLEAR" | "CLOUDS" | "SMOG" | "FOGGY" | "OVERCAST" | "RAIN" | "THUNDER" | "CLEARING" | "SNOW" | "XMAS" | "HALLOWEEN" | "NEUTRAL"){
        switch (type) {
            case 'EXTRASUNNY':
            case 'CLEAR':
                return 'Ясно';
            case 'CLOUDS':
                return 'Облачно';
            case 'SMOG':
                return 'Смог';
            case 'FOGGY':
                return 'Туман';
            case 'OVERCAST':
                return 'Пасмурно';
            case 'RAIN':
                return 'Дождь';
            case 'THUNDER':
                return 'Гроза';
            case 'CLEARING':
                return 'Лёгкий дождь';
            case 'SNOW':
                return 'Снег';
            case 'XMAS':
                return 'Снег';
        }
        return 'Ясно';
    }
    static addVectors(v1: Vector3Mp, v2: Vector3Mp): Vector3Mp {
        return new mp.Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static getVector3Mp(sharedVector: Vector3Shared): Vector3Mp {
        return new mp.Vector3(sharedVector.x, sharedVector.y, sharedVector.z);
    }
}
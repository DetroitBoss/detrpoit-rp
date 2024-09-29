function randEl<T>(arr: T[], length?: undefined | 1 | null): T;
function randEl<T>(arr: T[], length?: number): T[];
function randEl<T>(arr: T[], length: number = 1): T[] | T {
    if (arr.length == 0) return null;
    const newArr = [...arr];
    if (length > 1) {
        let resArr: T[] = [];
        for (let id = 0; id < length; id++) {
            let id = getRandomInt(0, newArr.length - 1)
            resArr.push(newArr[id])
            newArr.splice(id, 1);
        }

        return resArr;
    } else {
        return newArr[getRandomInt(0, newArr.length - 1)]
    }
}

export const randomArrayElement = randEl

export function distinctArray<T>(array: T[], getKeyFunc: (element: T) => any) {
    return [...new Map(
        array.map(element => [getKeyFunc(element), element]))
        .values()
    ];
}

export const randomArrayElementIndex = (data: any[]) => {
    if(data.length === 0) return -1
    return getRandomInt(0, data.length - 1);
}

function takeArrayElements<T>(array: T[], amount: number) {
    const elements: T[] = [];
    for (let i = 0; i < amount; i++) {
        if (i >= array.length) {
            break;
        }

        elements.push(array[i])
    }

    return elements;
}

export const takeElements = takeArrayElements;

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function paginate<T>(array: T[], page_size: number, page_number: number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
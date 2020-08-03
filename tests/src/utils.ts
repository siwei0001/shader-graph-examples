
export function getJsonObject (str: string) {
    let content;
    try {
        content = JSON.parse(str);
    }
    catch (err) {
        console.error(err);
    }
    return content;
}

export function getFloatString (value: number) {
    if (typeof value !== 'number') {
        return value;
    }

    let str = value + '';
    if (!str.includes('.')) {
        str += '.';
    }
    return str;
}

let ValueElements = {
    vector: ['x', 'y', 'z', 'w'],
    color: ['r', 'g', 'b', 'a'],
    mat4: ['e00', 'e01', 'e02', 'e03']
}

export function getValueElement (value: object | number, index: number): number {
    if (typeof value === 'number') {
        return value;
    }

    let elements;

    if (value.x !== undefined) {
        elements = ValueElements.vector;
    }
    else if (value.r !== undefined) {
        elements = ValueElements.color;
    }
    else if (value.e00 !== undefined) {
        elements = ValueElements.mat4;
    }

    return value[elements[index]] || 0;
}

export function getValueElementStr(value: object | number, index: number): string {
    return getFloatString(getValueElement(value, index));
}

export function getValueConcretePrecision (value) {
    let valueConretePresition = 1;
    if (typeof value === 'object') {
        if (value.w !== undefined || value.a !== undefined) {
            valueConretePresition = 4;
        }
        else if (value.z !== undefined || value.b !== undefined) {
            valueConretePresition = 3;
        }
        else if (value.y !== undefined || value.g !== undefined) {
            valueConretePresition = 2;
        }
    }
    return valueConretePresition;
}

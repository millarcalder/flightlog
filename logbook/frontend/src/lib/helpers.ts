export const deepClone = <Type extends object>(obj: Type): Type => {
    let clone: any = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof(value) === "object") {
            if (Array.isArray(value)) clone[key] = [...value]
            else clone[key] = deepClone(value);
        } else {
            clone[key] = value;
        }
    }
    return clone
}

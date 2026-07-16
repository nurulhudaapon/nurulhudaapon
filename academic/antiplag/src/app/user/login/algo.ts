export function hashPassword(str: string) {
    let hash = 5381; // Initial hash value

    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }

    return hash >>> 0;
}

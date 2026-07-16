
/**
 * Hashes the password using the SHA-256 algorithm
 * @param str The password to hash
 * @returns The hashed password as a positive integer
 */
export function hashPassword(str: string) {
    let hash = 5381; // Initial hash value

    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i); // Update the hash value using the current character code
    }

    return hash >>> 0; // Ensure the result is a positive integer
}

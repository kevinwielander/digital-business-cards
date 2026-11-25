/**
 * Base64-encode a string as UTF-8.
 *
 * `btoa` only accepts Latin1 characters and throws InvalidCharacterError for
 * anything else (e.g. Greek, Cyrillic, CJK, emoji). Encoding to UTF-8 bytes
 * first makes it safe for arbitrary user input.
 */
export function utf8ToBase64(input: string): string {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

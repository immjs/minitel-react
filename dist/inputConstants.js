export const expectNextChars = {
    '\x13': 1,
    '\x1b': 1,
    '\x1b\x39': 1,
    '\x1b\x5b': 1,
    '\x1b\x3a': 2,
    '\x1b\x3b': 3,
};

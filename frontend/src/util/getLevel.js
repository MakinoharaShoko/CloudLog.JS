const levelToNum = {
    all: 7,
    ALL: 7,
    TRACE: 6,
    DEBUG: 5,
    INFO: 4,
    WARN: 3,
    ERROR: 2,
    FATAL: 1,
    NONE: 0,
    none: 0
}

const isLevelShow = (currentLevel, universalLevel) => {
    const cl = levelToNum[currentLevel];
    const ul = levelToNum[universalLevel];
    return cl <= ul;
}

export default isLevelShow;
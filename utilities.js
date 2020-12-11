
/**
 * @desc Returns random element from array
 * @param {Array} arr An array of items.
 * */
function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

/**
 * @desc Shuffles array in place. (https://stackoverflow.com/a/6274381/1097977)
 * @param {Array} arr items An array containing the items.
 */
function array_shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}

/**
 * sprintf() method for String primitive type
 */
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

/**
 * @desc Returns random int selected from interval [min, max), both ends inclusive
 * @param min lower bound, inclusive
 * @param max upper bound, inclusive
 */
function ranged_random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @desc Given length of some array, returns dimensions of grid of best fit.
 * @param n length of array to be arranged in grid
 */
function best_grid(n) {
    x = Math.floor(Math.sqrt(n));
    y = Math.ceil(n/x);
    return [x, y];
}
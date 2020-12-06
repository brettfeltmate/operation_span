function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

/**
 * @desc Shuffles array in place. (https://stackoverflow.com/a/6274381/1097977)
 * @param {Array} a items An array containing the items.
 */
function array_shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

/**
 * sprintf() method for String primitive that I jacked from stack overflow and then lost the URL to
 */
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function ranged_random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sum = (a, b) =>
    a + b;
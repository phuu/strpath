var isUndefined = function (data) {
  return typeof data === "undefined";
};

var isNumeric = function (str) {
  str = ''+str;
  return (''+parseFloat(str)) === str;
};

var strpath = function (obj, path, val) {
  if (!obj || typeof obj !== "object") return obj;
  if (!path || typeof path !== 'string') throw new Error('Path is not a string.');

  var keys = path.split(/[.\[\]]/).filter(function (key) { return !!key.length; }),
      level = obj,
      setMode = !isUndefined(val),
      returnVal,
      done = false;

  keys.forEach(function (key, i) {
    if (done) return;
    var last = (i === keys.length - 1);
    // If this is the last and we're setting, set it
    if (last && setMode) level[key] = val;
    // If this is the last, return the found value
    if (last) return (done = true) && (returnVal = level[key]);
    // When getting, don't create new paths
    if (!setMode &&
        isUndefined(level[key])) return (done = true);
    // Don't overwrite existing non-object data
    if (setMode &&
        !last &&
        !isUndefined(level[key]) &&
        typeof level[key] !== "object") return (done = true);
    // If we're setting and the path doesn't exists, make it
    if (setMode &&
        !level[key]) {
      level[key] = (isNumeric(keys[i+1]) ? [] : {});
    }
    // Drop to the next level
    level = level[key];
  });
  return returnVal;
};

module.exports = strpath;
module.exports.isNumeric = isNumeric;
'use strict';

var gSrcTable = {};
var gPathList = {};

function testComment(match) {
    return /\/\//.test(match[1]);
}

function getJsioSrc() {
    var src = require.__init.toString();

    return require.__util.concat('var jsio=(', src, '());');
}

function getSrcCache() {
    var str = "{";
    for (var prop in gSrcTable) {
        str = require.__util.concat(str, JSON.stringify(prop), ":", gSrcTable[prop], ",");
    }

    str = require.__util.concat(str.substring(0, str.length - 1), "}");

    return require.__util.concat("jsio.setCache(", str, ");");
}

function getPathJS() {
  for(var prop in require.__pathCache){
      if(!require.__util.getExtension(require.__pathCache[prop])) { 
        gPathList[prop] = require.__pathCache[prop];
      }
  }


  for(var prop in require.__pathCache){
      if(require.__util.getExtension(require.__pathCache[prop])) { 
        gPathList[prop] = require.__pathCache[prop];
      }
  }

    var str = JSON.stringify(gPathList);

    return require.__util.concat("jsio.setCachePath(", str, ");");
}

function replace(raw, p1, p2, p3, p4) {
    return require.__util.concat(p1, '', p4);
}

module.exports = function(moduleDef, preprocessors, jsio) {
    var removeFuncBody = /^(\(\s*function\s*\([^=+*"'\r\n.;]+\)\s*\{)((\s*.*)*)(\s*\}\s*\))/gm,
        requireRegex = /^(.*)require\s*\(\s*['"](.+?)['"]\s*(,\s*\{[^}]+\})?\)/gm,
        match, cmd, ignore;

    do {
        ignore = false;
        match = requireRegex.exec(moduleDef.src);

        if (match && !testComment(match)) {
            cmd = match[2];

            if (process.binding('natives')[cmd] ||
                cmd == "uws" ||
                cmd == "bufferutil" ||
                cmd == "utf-8-validate" ||
                cmd.split('/').pop == 'pty.node') {
                ignore = true;
            }

            if (!ignore) {
                jsio(cmd, preprocessors);
            }
        }
    } while (match)
    gSrcTable[moduleDef.path] = moduleDef.src;
    // stops eval module src by removing body
    moduleDef.src = moduleDef.src.replace(removeFuncBody, replace);
};

module.exports.generateSrc = function(callback) {
    var str = require.__util.concat(getJsioSrc(), getPathJS(), getSrcCache());

    callback(str);
};

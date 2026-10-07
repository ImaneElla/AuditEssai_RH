"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault").default;
exports.__esModule = true;
exports.default = idFromPathMethod;
var _replaceSpecialCharsWithUnderscore = _interopRequireDefault(require("../replace-special-chars-with-underscore.js"));
const STANDARD_HTTP_METHODS = new Set(['connect', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'query', 'trace']);
function idFromPathMethod(pathName, method, {
  v2OperationIdCompatibilityMode
} = {}) {
  if (v2OperationIdCompatibilityMode) {
    let res = `${method.toLowerCase()}_${pathName}`.replace(/[\s!@#$%^&*()_+=[{\]};:<>|./?,\\'""-]/g, '_');
    res = res || `${pathName.substring(1)}_${method}`;
    return res.replace(/((_){2,})/g, '_').replace(/^(_)*/g, '').replace(/([_])*$/g, '');
  }
  const normalizedMethod = STANDARD_HTTP_METHODS.has(method.toLowerCase()) ? method.toLowerCase() : method;
  return `${normalizedMethod}${(0, _replaceSpecialCharsWithUnderscore.default)(pathName)}`;
}
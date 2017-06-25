const M = require("ramda-fantasy").Maybe;
const Just = M.Just;
const Nothing = M.Nothing;

const WANTED_L = "de";
const FB_A = "it";
const FB_B = "xx";

const _data_full = [
  { var: "AVP 1", lng: ["de", "xx"] },
  { var: "AVP 2", lng: ["xx"] },
  { var: "AVP 3", lng: ["it", "de", "xx"] },
];
const _data_no_de = [
  { var: "AVP 1", lng: ["xx"] },
  { var: "AVP 2", lng: ["xx", "en"] },
  { var: "AVP 3", lng: ["it", "en", "xx"] },
];

function findLanguage(lng) {
  const d = _data_no_de.find(avp => avp.lng.includes(lng));
  return d !== undefined ? Just(d) : Nothing();
}

console.time('NEW');
let _row_new = []
_row_new.push(findLanguage(WANTED_L).getOrElse(findLanguage(FB_A)).getOrElse(findLanguage(FB_B)).var)
console.log(_row_new);
console.timeEnd('NEW');

console.time('OLD');
let _row_old = []
const _avp_wanted_lng = _data_no_de.find(avp => avp.lng.includes(WANTED_L));
if (_avp_wanted_lng) {
  _row_old.push(_avp_wanted_lng.var);
} else {
  const _avp_wanted_default = _data_no_de.find(avp => avp.lng.includes(FB_A));
  if (_avp_wanted_default) {
    _row_old.push(_avp_wanted_default.var);
  } else {
    const _avp_wanted_fallback = _data_no_de.find(avp => avp.lng.includes(FB_B));
    if (_avp_wanted_fallback) {
      _row_old.push(_avp_wanted_fallback.var);
    } else {
      _row_old.push("");
    }
  }
}
console.log(_row_old);
console.timeEnd('OLD');

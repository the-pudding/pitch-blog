'use strict';

function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  copy: function(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}

function rgb_formatRgb() {
  var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(")
      + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.b) || 0))
      + (a === 1 ? ")" : ", " + a + ")");
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl: function() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(")
        + (this.h || 0) + ", "
        + (this.s || 0) * 100 + "%, "
        + (this.l || 0) * 100 + "%"
        + (a === 1 ? ")" : ", " + a + ")");
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

function constant(x) {
  return function() {
    return x;
  };
}

function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}

var interpolateRgb = (function rgbGamma(y) {
  var color = gamma(y);

  function rgb$1(start, end) {
    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$1.gamma = rgbGamma;

  return rgb$1;
})(1);

function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function interpolateString(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

var degrees = 180 / Math.PI;

var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

var cssNode,
    cssRoot,
    cssView,
    svgNode;

function parseCss(value) {
  if (value === "none") return identity;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

var hed = "Behind the Scenes";
var dek = "The Courage (and Disappointment) of Pitching a Visual Essay";
var intro = [
	{
		type: "text",
		value: "I’m published! In the Pudding! Check it out <a href=https://pudding.cool/2020/07/gendered-descriptions/ >here</a>!"
	},
	{
		type: "text",
		value: "Getting to this point was downright terrifying. I’d been posting on my lil’ blog and on Reddit for a while, but it was a huge step to go out into the world and find someone that would pay me for a project."
	},
	{
		type: "text",
		value: "For a hyper-anxious person with a need to do everything The Right Way, the lack of information around how to sell my work was disheartening. There’s a ton out there on how to pitch novels and newspaper articles, but not much at all about data visualization. To hopefully shed some light on how I went from an idea to a published article, I thought I’d share two of my own pitches to the Pudding—one successful and one not—and how I created them."
	},
	{
		type: "text",
		value: "A quick note on the actual experience of pitching. I was terrified. I’m self-taught. I do not do data visualization professionally. I do this as an evenings-and-weekends hobby. I did not (do not) know if my work was (is) strong enough to stand on its own, especially on a site like the Pudding. Their other freelancers are people like Shirley Wu, for chrissakes. I assumed I’d hear a “no,” but of course I really, really didn’t want that outcome."
	},
	{
		type: "text",
		value: "Both times I sent a pitch email to the Pudding, I obsessively checked my phone until they responded. Every email notification made my stomach flip, and I wasn’t sure if it’d be better to hear a hard no or to never get a response at all. Eventually I started leaving my phone in my car when I went to work because it was such a horrible distraction."
	},
	{
		type: "text",
		value: "Thank you to my friends for putting up with all my, “Do you think they’ve seen it?” “What if they hate it?” “What if they hate me?” “Oh god what I have done?”"
	},
	{
		type: "text",
		value: "I want to discuss my unsuccessful pitch first. You can read the whole thing <here>. This started out like any other project that I’d post to my blog, but the more work I did, the more it felt like a “big enough” idea to try to pitch."
	},
	{
		type: "text",
		value: "I wanted to see if Trader Joe’s parking lots are as terrible as they’re made out to be. If you’re not lucky enough to have a Trader Joe’s in your area, let me explain: it’s a tropical island-themed grocery store with amazing deals on great food. They intentionally under-invest in their parking lots so that they can spend more on other aspects of the store. Getting a spot in a Trader Joe’s lot can feel akin to a middle-class demolition derby."
	},
	{
		type: "text",
		value: "As I was leaving Trader Joe’s one day, I realized I felt similar parking-lot frustration at my local Target and Fred Meyer, too. Are Trader Joe’s parking lots really that bad compared to other grocery stores?"
	},
	{
		type: "text",
		value: "Not knowing how to determine what a “bad” parking lot was, I decided to start gathering what data I could and figure out the story later. This is almost always the approach I take, and it often works. It’s hard to know what direction a story will take until you can get a little data to look at."
	},
	{
		type: "text",
		value: "I scraped a list of all Trader Joe’s locations from their website, and started looking them up one by one in OpenStreetMap to see if someone had already mapped the store and its parking lot. I added the missing ones to OSM myself. I used a Microsoft Access database to keep track of which parking lots and which buildings were relevant to my project, and which weren’t."
	},
	{
		type: "text",
		value: "<img src=assets/osm.png>"
	},
	{
		type: "text",
		value: "This amount of targeted activity aroused the suspicion of someone on the site, who messaged to ask if I worked for Trader Joes!"
	},
	{
		type: "text",
		value: "I did this for all 200-ish Trader Joe’s in California, and then I did it for 100 randomly chosen Safeway and Whole Foods locations as well."
	},
	{
		type: "text",
		value: "If this sounds like an enormous amount of work, well, it was. I’d fallen into a trap of my own making."
	},
	{
		type: "text",
		value: "Even after a solid 40 hours of mapping parking lots, I still had no idea what made one good or bad to park in. I kept collecting more data points--Google’s average wait time was one—in the hopes that something would jump out at me, but nothing did."
	},
	{
		type: "text",
		value: "The data I collected didn’t show much of a difference between Trader Joe’s and the other stores. The best thing I could pitch was that the idea that Trader Joe’s lots are terrible has become some sort of in-joke or meme. Even though my results weren’t that interesting, I’d sunk so much emotional energy into the project that I felt I had to pitch it. To do that much work just to let it rot on my hard drive felt too demoralizing to consider."
	},
	{
		type: "text",
		value: "Of course, they rejected this pitch on the grounds that there really wasn’t much of a story to it. They were really kind about it, and later told me they prefer to reject people in a sympathetic way, with considered feedback."
	},
	{
		type: "text",
		value: "<span class=quote>Thanks for pitching us! We just discussed this idea in our editorial meeting, and everyone agreed that it's a great topic! We were a little more hesitant about it after seeing the data though. Since it seems like Whole Foods has a pretty similar predicament in terms of size and wait time, perhaps there is a better way to focus in on Trader Joe's by itself?</span>"
	},
	{
		type: "text",
		value: "<span class=quote>For instance, assuming Trader Joe's lots are actually bad, is there some way to look at why that might be? Perhaps they are buying cheaper lots where flow of traffic will be more awkward? Or maybe they are misusing their parking lot space somehow?</span>"
	},
	{
		type: "text",
		value: "<span class=quote>Basically, we love the hook and think you're on the right track, but we'd like to see a stronger narrative coming out of the data. If you're interested in reframing and re-pitching the piece, though, you should be aware that we don't have the bandwidth to take on any new freelance pieces until October-ish. So we encourage you to bring this back to us then if you move forward with it! Or send something else! </span>"
	},
	{
		type: "text",
		value: "It stung, but on reflection it made sense. If even I wasn’t convinced of the value of what I was pitching, why would they be? What point was I even trying to make?"
	},
	{
		type: "text",
		value: "In retrospect, I think I jumped right into pitching this article because it felt like the first idea “big” enough for the Pudding. It involved an enormous amount of data collection, and I amassed a dataset I’m almost certain nobody else (save probably Trader Joe’s themselves) has. I mistook hard work and unusual data for an interesting article."
	},
	{
		type: "text",
		value: "I don’t want to abandon all the work I did and I’m still interested in this project. I do want to get back to it (…eventually…) and finish up data collection for all 380-ish Trader Joe’s locations. Although there probably isn’t a compelling story to tell with the data I have, I do think it would make a pretty neat poster!"
	},
	{
		type: "text",
		value: "On to the successful pitch. You can read the whole thing <here>"
	},
	{
		type: "text",
		value: "Unusually, I have a written record of where the idea for this one came from. Our book club was very annoyed with overwrought descriptions of a fairy in Patrick Rothfuss’s The Name of the Wind. My friend <a href=https://twitter.com/lianabnana/>Liana</a> had the idea to analyze how exactly he describes her body:"
	},
	{
		type: "text",
		value: "<img src=assets/textchain.png>"
	},
	{
		type: "text",
		value: "(This screenshot is from Liana’s phone)"
	},
	{
		type: "text",
		value: "The idea was too good to pass by, and we all loved it. I decided to expand on it to see how authors in general describe bodies, and we were off to the races."
	},
	{
		type: "text",
		value: "Immediately, this idea felt very different from the Trader Joe’s parking lots one. No matter the results, there’d be something interesting to write about. Either rote stereotypes are indeed played out in literature, or Patrick Rothfuss’s writing is exceptional in its poor treatment of female bodies. (Spoiler alert: it’s the former.)"
	},
	{
		type: "text",
		value: "All the same, I wanted to get a solid dataset to analyze before pitching anything. If I’ve learned anything from life, it’s to have all your ducks in a row before presenting them to someone you want to impress. I wanted to tell the Pudding a story, not tell them that I would tell them a story &#x1f60a;."
	},
	{
		type: "text",
		value: "To get started, I grabbed a few pages of <em>The Name of the Wind</em>. A bit of Googling brought me to the CoreNLP <a href=https://corenlp.run>demonstration page</a> (as of this writing unfortunately offline), where I could play around with natural language processing (NLP). Just a few demo runs were enough to convince me that extracting body parts, owners, and adjectives was completely possible."
	},
	{
		type: "text",
		value: "I then moved on to using the spaCy NLP parser in R to extract body parts more efficiently. Before this project I was completely unfamiliar with NLP. I definitely didn’t sit down with a plan and just type out some code and boom, results. Getting my code together was a process of trial and error – feeding the parser a few simple sentences, seeing what came back, tweaking it, feeding it more sentences, and so on."
	},
	{
		type: "text",
		value: "Once I got my code working smoothly and all my books parsed, the members of our book club (all 3 of us) threw tons of ideas out, most of them bad, and developed them all. Here’s a few random sketches from that phase, none of which made it into the pitch."
	},
	{
		type: "text",
		value: "<img src=assets/weird.png>"
	},
	{
		type: "text",
		value: "<img src=assets/avg.png>"
	},
	{
		type: "text",
		value: "<img src=assets/gender.png>"
	},
	{
		type: "text",
		value: "<img src=assets/notes.png>"
	},
	{
		type: "text",
		value: "Once we saw <em>everything</em>, we could strip away what wasn’t compelling until we reached what felt like a concise, tight draft that covered everything we thought was important."
	},
	{
		type: "text",
		value: "This took some time. I have at least four full drafts saved in Word, but that doesn’t count the Google docs, the email chains, and the text threads. This was probably overkill, but the idea felt really solid, and I didn’t want to do it a disservice by sending over a flabby pitch."
	},
	{
		type: "text",
		value: "Of course, this pitch did end up being successful. I still panicked for the couple weeks it took the Pudding to get back to me, but I felt much better about what I had sent this time than the first time. The difference, ultimately, was that I thought our findings were genuinely interesting. I could get behind the article without reservation, so it seemed more likely that the Pudding could, too."
	},
	{
		type: "text",
		value: "How do I wrap this up? I don’t really know! Maybe with some lessons learned:"
	}
];
var outro = [
	{
		type: "text",
		value: "If your idea isn’t really compelling to you, it probably isn’t compelling to anyone else either"
	},
	{
		type: "text",
		value: "Work on a project you genuinely love, because it is going to take a <em>lot </em>of time and effort. My article took a year from initial idea to publication."
	},
	{
		type: "text",
		value: "Be clear on what your essay/pitch is trying to achieve, especially to yourself."
	},
	{
		type: "text",
		value: "Hard work != good work"
	},
	{
		type: "text",
		value: "All your previous work is building up to something. Taken individually, each little visualization I’ve done didn’t feel super important. Taken collectively, I actually learned a ton of skills—technical and not—that really helped in executing bigger, important-feeling projects."
	},
	{
		type: "text",
		value: "Starting a blog was a really good idea. It’s kept me motivated to actually finish projects instead of abandoning them when a more exciting idea comes along. The Pudding also said seeing a record of my work made them more confident in saying yes to my pitch."
	},
	{
		type: "text",
		value: "Everything is easier with friends :)"
	},
	{
		type: "Corollary",
		value: "Working with a professional illustrator is pretty neat! I’ve been friends with Liana for 18 years but never worked with her professionally, and it was really fun to see how she took my ramblings about data and made a visual essay!"
	}
];
var doc = {
	hed: hed,
	dek: dek,
	intro: intro,
	outro: outro
};

/* src/components/Intro.svelte generated by Svelte v3.23.2 */

const css = {
	code: "@font-face{font-family:'Lyon Display Web';src:url('./../assets/fonts/lyon/LyonDisplay-Regular-Web.woff2') format('woff2'),\n   url('./../assets/fonts/lyon/LyonDisplay-Regular-Web.woff') format('woff');font-weight:300;font-style:normal;font-stretch:normal;font-display:swap}@font-face{font-family:'Lyon Text Web';src:url('./../assets/fonts/lyon/LyonText-Regular-Web.woff2') format('woff2'),\n\turl('./../assets/fonts/lyon/LyonText-Regular-Web.woff') format('woff');font-weight:300;font-style:normal;font-stretch:normal;font-display:swap}h3.svelte-19i3bwt.svelte-19i3bwt,h1.svelte-19i3bwt.svelte-19i3bwt{font-family:'Lyon Text Web';text-align:center}h3.svelte-19i3bwt.svelte-19i3bwt{width:95%;margin-bottom:1rem;text-transform:uppercase;letter-spacing:2px;color:#bd3b32;font-size:1.3rem;margin-top:4rem}h1.svelte-19i3bwt.svelte-19i3bwt{font-family:'Walter Turncoat';margin:0 auto;width:95%;max-width:50rem;font-size:4rem;line-height:1.2;margin-bottom:2rem;color:rgba(0,0,0,.8)}@media(max-width: 600px){h1.svelte-19i3bwt.svelte-19i3bwt{font-size:3rem}}@media(max-width: 400px){h1.svelte-19i3bwt.svelte-19i3bwt{font-size:2.5rem}}@media(max-width: 330px){h1.svelte-19i3bwt.svelte-19i3bwt{font-size:2rem}}.intro.svelte-19i3bwt.svelte-19i3bwt{max-width:500px;margin:0 auto}p.svelte-19i3bwt.svelte-19i3bwt{color:rgba(0,0,0,.8);font-family:'Lyon Text Web';font-size:1.3rem;width:95%;margin:0 auto;margin-bottom:1.5rem}.byline.svelte-19i3bwt p.svelte-19i3bwt{text-align:center;font-size:1.1rem;margin-bottom:3rem;margin-top:2rem}a.svelte-19i3bwt.svelte-19i3bwt:hover{border-bottom:1px solid black}ul.svelte-19i3bwt li.svelte-19i3bwt{font-family:'Lyon Text Web';font-size:1.3rem;color:rgba(0,0,0,.8);margin-bottom:1.3rem;line-height:1.65;margin-left:2rem;list-style-type:disc;padding-left:1rem}",
	map: "{\"version\":3,\"file\":\"Intro.svelte\",\"sources\":[\"Intro.svelte\"],\"sourcesContent\":[\"<style>\\n\\n @font-face {\\n   font-family: 'Lyon Display Web';\\n   src: url('./../assets/fonts/lyon/LyonDisplay-Regular-Web.woff2') format('woff2'),\\n   url('./../assets/fonts/lyon/LyonDisplay-Regular-Web.woff') format('woff');\\n   font-weight: 300;\\n   font-style: normal;\\n   font-stretch: normal;\\n   font-display: swap;\\n }\\n\\n @font-face {\\n\\tfont-family: 'Lyon Text Web';\\n\\tsrc: url('./../assets/fonts/lyon/LyonText-Regular-Web.woff2') format('woff2'),\\n\\turl('./../assets/fonts/lyon/LyonText-Regular-Web.woff') format('woff');\\n\\tfont-weight: 300;\\n\\tfont-style: normal;\\n\\tfont-stretch: normal;\\n\\tfont-display: swap;\\n}\\n\\n h3, h1 {\\n   font-family: 'Lyon Text Web';\\n   text-align: center;\\n\\n }\\n\\n h3 {\\n   width: 95%;\\n   margin-bottom: 1rem;\\n   text-transform: uppercase;\\n   letter-spacing: 2px;\\n   color: #bd3b32;\\n\\n   font-size: 1.3rem;\\n   margin-top:4rem;\\n }\\n\\n h1 {\\n   font-family: 'Walter Turncoat';\\n   margin: 0 auto;\\n   width: 95%;\\n   max-width: 50rem;\\n   font-size: 4rem;\\n   line-height: 1.2;\\n   margin-bottom:2rem;\\n   color:rgba(0,0,0,.8);\\n }\\n\\n @media (max-width: 600px){\\n   h1 {\\n     font-size: 3rem;\\n   }\\n }\\n\\n @media (max-width: 400px){\\n   h1 {\\n     font-size: 2.5rem;\\n   }\\n }\\n\\n @media (max-width: 330px){\\n   h1 {\\n     font-size: 2rem;\\n   }\\n }\\n\\n .intro {\\n   max-width: 500px;\\n   margin: 0 auto;\\n }\\n\\n p {\\n   color:rgba(0,0,0,.8);\\n   font-family: 'Lyon Text Web';\\n   font-size:1.3rem;\\n   width: 95%;\\n   margin: 0 auto;\\n   margin-bottom: 1.5rem;\\n }\\n\\n .byline p{\\n   text-align:center;\\n   font-size:1.1rem;\\n   margin-bottom:3rem;\\n   margin-top:2rem;\\n }\\n a:hover{\\n   border-bottom:1px solid black;\\n }\\n\\n ul li {\\n   font-family: 'Lyon Text Web';\\n   font-size: 1.3rem;\\n   color:rgba(0,0,0,.8);\\n   margin-bottom: 1.3rem;\\n   line-height:1.65;\\n   margin-left: 2rem;\\n   list-style-type: disc;\\n   padding-left: 1rem;\\n }</style>\\n\\n<script>\\n  import doc from \\\"../data/copy.json\\\"\\n</script>\\n\\n<p class=\\\"logo-wrapper\\\">A project from the <a target=\\\"_blank\\\" class=\\\"text-underline\\\" href=\\\"/\\\">The Pudding</a></p>\\n\\n<h3>{doc.hed}</h3>\\n<h1>{doc.dek}</h1>\\n<div class=\\\"byline\\\">\\n\\t<p>by <a target=\\\"_blank\\\" href=\\\"https://pudding.cool/author/erin-davis/\\\">Erin Davis</a></p>\\n</div>\\n\\n<div class=\\\"intro\\\">\\n  {#each doc.intro as intro}\\n    <p class='prose'>{@html intro.value}</p>\\n  {/each}\\n  <ul>\\n    {#each doc.outro as outro}\\n      <li class='prose bullet'>{@html outro.value}</li>\\n    {/each}\\n  </ul>\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAEC,UAAU,AAAC,CAAC,AACV,WAAW,CAAE,kBAAkB,CAC/B,GAAG,CAAE,IAAI,sDAAsD,CAAC,CAAC,OAAO,OAAO,CAAC,CAAC;GACjF,IAAI,qDAAqD,CAAC,CAAC,OAAO,MAAM,CAAC,CACzE,WAAW,CAAE,GAAG,CAChB,UAAU,CAAE,MAAM,CAClB,YAAY,CAAE,MAAM,CACpB,YAAY,CAAE,IAAI,AACpB,CAAC,AAED,UAAU,AAAC,CAAC,AACZ,WAAW,CAAE,eAAe,CAC5B,GAAG,CAAE,IAAI,mDAAmD,CAAC,CAAC,OAAO,OAAO,CAAC,CAAC;CAC9E,IAAI,kDAAkD,CAAC,CAAC,OAAO,MAAM,CAAC,CACtE,WAAW,CAAE,GAAG,CAChB,UAAU,CAAE,MAAM,CAClB,YAAY,CAAE,MAAM,CACpB,YAAY,CAAE,IAAI,AACnB,CAAC,AAEA,gCAAE,CAAE,EAAE,8BAAC,CAAC,AACN,WAAW,CAAE,eAAe,CAC5B,UAAU,CAAE,MAAM,AAEpB,CAAC,AAED,EAAE,8BAAC,CAAC,AACF,KAAK,CAAE,GAAG,CACV,aAAa,CAAE,IAAI,CACnB,cAAc,CAAE,SAAS,CACzB,cAAc,CAAE,GAAG,CACnB,KAAK,CAAE,OAAO,CAEd,SAAS,CAAE,MAAM,CACjB,WAAW,IAAI,AACjB,CAAC,AAED,EAAE,8BAAC,CAAC,AACF,WAAW,CAAE,iBAAiB,CAC9B,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,KAAK,CAAE,GAAG,CACV,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,GAAG,CAChB,cAAc,IAAI,CAClB,MAAM,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,AACtB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,CAAC,AACxB,EAAE,8BAAC,CAAC,AACF,SAAS,CAAE,IAAI,AACjB,CAAC,AACH,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,CAAC,AACxB,EAAE,8BAAC,CAAC,AACF,SAAS,CAAE,MAAM,AACnB,CAAC,AACH,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,CAAC,AACxB,EAAE,8BAAC,CAAC,AACF,SAAS,CAAE,IAAI,AACjB,CAAC,AACH,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,CAAC,CAAC,IAAI,AAChB,CAAC,AAED,CAAC,8BAAC,CAAC,AACD,MAAM,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CACpB,WAAW,CAAE,eAAe,CAC5B,UAAU,MAAM,CAChB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,aAAa,CAAE,MAAM,AACvB,CAAC,AAED,sBAAO,CAAC,gBAAC,CAAC,AACR,WAAW,MAAM,CACjB,UAAU,MAAM,CAChB,cAAc,IAAI,CAClB,WAAW,IAAI,AACjB,CAAC,AACD,+BAAC,MAAM,CAAC,AACN,cAAc,GAAG,CAAC,KAAK,CAAC,KAAK,AAC/B,CAAC,AAED,iBAAE,CAAC,EAAE,eAAC,CAAC,AACL,WAAW,CAAE,eAAe,CAC5B,SAAS,CAAE,MAAM,CACjB,MAAM,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CACpB,aAAa,CAAE,MAAM,CACrB,YAAY,IAAI,CAChB,WAAW,CAAE,IAAI,CACjB,eAAe,CAAE,IAAI,CACrB,YAAY,CAAE,IAAI,AACpB,CAAC\"}"
};

const Intro = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	$$result.css.add(css);

	return `<p class="${"logo-wrapper svelte-19i3bwt"}">A project from the <a target="${"_blank"}" class="${"text-underline svelte-19i3bwt"}" href="${"/"}">The Pudding</a></p>

<h3 class="${"svelte-19i3bwt"}">${escape(doc.hed)}</h3>
<h1 class="${"svelte-19i3bwt"}">${escape(doc.dek)}</h1>
<div class="${"byline svelte-19i3bwt"}"><p class="${"svelte-19i3bwt"}">by <a target="${"_blank"}" href="${"https://pudding.cool/author/erin-davis/"}" class="${"svelte-19i3bwt"}">Erin Davis</a></p></div>

<div class="${"intro svelte-19i3bwt"}">${each(doc.intro, intro => `<p class="${"prose svelte-19i3bwt"}">${intro.value}</p>`)}
  <ul class="${"svelte-19i3bwt"}">${each(doc.outro, outro => `<li class="${"prose bullet svelte-19i3bwt"}">${outro.value}</li>`)}</ul></div>`;
});

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);

var noop = {value: function() {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function selection_selectAll(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant$1(x) {
  return function() {
    return x;
  };
}

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

function selection_data(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant$1(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending$1;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function ascending$1(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

var filterEvents = {};

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
    }
  };
}

function parseTypenames$1(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, capture) {
  var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

var frame = 0, // is an animation frame pending?
    timeout = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout$1(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(function(elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get$1(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set$1(node, id) {
  var schedule = get$1(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get$1(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout$1(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout$1(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

function interrupt(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = set$1(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = set$1(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function transition_tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get$1(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = set$1(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get$1(node, id).value[name];
  };
}

function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber
      : b instanceof color ? interpolateRgb
      : (c = color(b)) ? (b = c, interpolateRgb)
      : interpolateString)(a, b);
}

function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS$1(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction$1(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS$1(fullname, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
      : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
}

function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

function transition_delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get$1(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function() {
    set$1(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    set$1(this, id).duration = value;
  };
}

function transition_duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get$1(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set$1(this, id).ease = value;
  };
}

function transition_ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get$1(this.node(), id).ease;
}

function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set$1;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get$1(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection$1 = selection.prototype.constructor;

function transition_selection() {
  return new Selection$1(this._groups, this._parents);
}

function styleNull(name, interpolate) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction$1(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
  return function() {
    var schedule = set$1(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove$1(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

    schedule.on = on1;
  };
}

function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, styleRemove$1(name))
    : typeof value === "function" ? this
      .styleTween(name, styleFunction$1(name, i, tweenValue(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, styleConstant$1(name, i, value), priority)
      .on("end.style." + name, null);
}

function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction$1(tweenValue(this, "text", value))
      : textConstant$1(value == null ? "" : value + ""));
}

function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, textTween(value));
}

function transition_transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get$1(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

function transition_end() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule = set$1(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule.on = on1;
    });
  });
}

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return selection().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = selection.prototype;

Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  end: transition_end
};

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = now(), defaultTiming;
    }
  }
  return timing;
}

function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

function ascending$2(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector$1(compare) {
  if (compare.length === 1) compare = ascendingComparator$1(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator$1(f) {
  return function(d, x) {
    return ascending$2(f(d), x);
  };
}

var ascendingBisect$1 = bisector$1(ascending$2);

var prefix = "$";

function Map$1() {}

Map$1.prototype = map.prototype = {
  constructor: Map$1,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function(f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map(object, f) {
  var map = new Map$1;

  // Copy constructor.
  if (object instanceof Map$1) object.each(function(value, key) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f(o = object[i], i, object), o);
  }

  // Convert object to map.
  else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

function Set$1() {}

var proto = map.prototype;

Set$1.prototype = set$2.prototype = {
  constructor: Set$1,
  has: proto.has,
  add: function(value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set$2(object, f) {
  var set = new Set$1;

  // Copy constructor.
  if (object instanceof Set$1) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

function ascending$3(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector$2(compare) {
  if (compare.length === 1) compare = ascendingComparator$2(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator$2(f) {
  return function(d, x) {
    return ascending$3(f(d), x);
  };
}

var ascendingBisect$2 = bisector$2(ascending$3);

/* src/components/Footer.svelte generated by Svelte v3.23.2 */

const css$1 = {
	code: "*{box-sizing:border-box;-moz-box-sizing:border-box}html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;vertical-align:baseline;font:inherit;font-size:100%}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section{display:block}a img{border:none}blockquote{quotes:none}blockquote:before,blockquote:after{content:'';content:none}table{border-spacing:0;border-collapse:collapse}caption,th,td{vertical-align:middle;text-align:left;font-weight:normal}body{padding-top:3rem;background-attachment:fixed;color:#000;font-weight:500;font-family:'National 2 Web', Helvetica, Arial, sans-serif;font-feature-settings:'kern' 1, 'onum' 0, 'liga' 0, 'tnum' 1;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:rgba(0,0,0,0);background-color:#fffaf3}p{line-height:1.625;color:#282828}h1{font-size:2em;color:#282828}@media only screen and (min-width: 640px){h1{font-size:3em}}h2{font-size:1.5em;color:#282828}@media only screen and (min-width: 640px){h2{font-size:2.5em}}h3{font-size:1em}@media only screen and (min-width: 640px){h3{font-size:2em}}h4{font-size:1em}@media only screen and (min-width: 640px){h4{font-size:1.5em}}h5{font-size:1em}@media only screen and (min-width: 640px){h5{font-size:1.25em}}h6{font-size:1em}@media only screen and (min-width: 640px){h6{font-size:1.125em}}p{margin:1em 0;font-size:1em}@media only screen and (min-width: 480px){p{font-size:1.125em}}a{border-bottom:1px solid #000;color:#000;text-decoration:none}a:hover{border-bottom:1px solid #000}a:visited,a:hover{color:#000}strong,b{font-weight:700}em,i{font-style:italic}ul{list-style-type:none}img,video{display:block;width:100%}button{margin:0;padding:0;outline:none;border:none;font-size:1em;font-family:'National 2 Web', Helvetica, Arial, sans-serif;cursor:pointer}sub,sup{position:relative;vertical-align:baseline;font-size:0.75rem;line-height:0}sup{top:-0.5em}sub{bottom:-0.25em}.skip-to-main{position:absolute;overflow:hidden;width:1px;height:1px;border:none}.skip-to-main:focus{z-index:1000;padding:0.5rem;width:auto;height:auto;background-color:#f4f4f4}@font-face{font-weight:500;font-style:normal;font-stretch:normal;font-family:'National 2 Web';src:url(\"https://pudding.cool/assets/fonts/national/National2Web-Regular.woff2\") format('woff2'), url(\"https://pudding.cool/assets/fonts/national/National2Web-Regular.woff\") format('woff');font-display:swap}@font-face{font-weight:700;font-style:normal;font-stretch:normal;font-family:'National 2 Web';src:url(\"https://pudding.cool/assets/fonts/national/National2Web-Bold.woff2\") format('woff2'), url(\"https://pudding.cool/assets/fonts/national/National2Web-Bold.woff\") format('woff');font-display:swap}#alt-footer{border-top:none}#alt-footer #wordmark{display:none}#alt-footer .footer-company__description{font-size:24px}#alt-footer .footer-company__trademark{margin-top:1.5rem}.pre-footer{display:block;font-family:'Lyon Text Web';padding-top:2rem;padding-bottom:3rem}.pre-footer p{font-family:'Lyon Text Web';margin:0 auto;color:#000;font-size:18px;width:95%;text-align:center}.pre-footer .socials{margin-top:5rem}.pre-footer .newsletter-cta form{display:flex;margin:0 auto;justify-content:center;margin-top:2rem;margin-bottom:2rem;width:95%}.pre-footer .newsletter-cta form .newsletter__input{background:rgba(255,255,255,0.53);border:1px solid rgba(0,0,0,0.25);border-radius:3px;margin-right:5px;padding-left:0.5rem;font-family:'Atlas Grotesk Web';-webkit-appearance:none;-moz-appearance:none;font-size:14px}.pre-footer .newsletter-cta form .newsletter__input::-moz-placeholder{font-family:'Atlas Grotesk Web';font-size:14px}.pre-footer .newsletter-cta form .newsletter__input:-ms-input-placeholder{font-family:'Atlas Grotesk Web';font-size:14px}.pre-footer .newsletter-cta form .newsletter__input::-ms-input-placeholder{font-family:'Atlas Grotesk Web';font-size:14px}.pre-footer .newsletter-cta form .newsletter__input::placeholder{font-family:'Atlas Grotesk Web';font-size:14px}.pre-footer .newsletter-cta form .btn{border:1px solid #4365be;background-color:#5977e1;color:#fff;border-radius:3px;font-size:16px;font-weight:600;padding:0.5rem 1rem;cursor:pointer;font-family:'Atlas Grotesk Web';box-shadow:0 1px 2px rgba(15,15,15,0.15);-webkit-appearance:none;-moz-appearance:none}.pre-footer .patreon-cta{padding-top:4rem;display:flex;flex-direction:column;margin-bottom:3rem;position:relative}.pre-footer .patreon-cta:before{border-top:1px solid #000;content:'';position:absolute;top:0px;width:100px;left:0;right:0;margin:0 auto}.pre-footer .patreon-cta a{color:#fff;border:none;font-family:'Atlas Grotesk Web';font-size:16px;font-weight:600;margin:0 auto;display:block}.pre-footer .patreon-cta button{margin:0 auto;box-shadow:0 2px 2px rgba(225,98,89,0.36);background-color:#e16259;border:1px solid #be5643;border-radius:3px;padding:0.5rem 1rem;display:inline-block;font-family:'Atlas Grotesk Web';align-self:center;margin-top:2rem;margin-bottom:2rem;font-weight:600;color:#fff}footer.pudding-footer{padding:0 1rem;border-top:4px solid #000;font-family:'Lyon Text Web';margin-top:3rem;padding-bottom:3rem}footer.pudding-footer .footer-recirc{max-width:65rem;margin:0 auto}footer.pudding-footer .footer-recirc p{text-align:center}footer.pudding-footer .footer-recirc p font-size 18px{color:#000}footer.pudding-footer .footer-recirc .footer-recirc__articles{display:flex;flex-wrap:wrap;justify-content:space-between;margin-top:3rem}footer.pudding-footer .footer-recirc .footer-recirc__article{width:100%;border:none}footer.pudding-footer .footer-recirc .footer-recirc__article display block{max-width:350px}footer.pudding-footer .footer-recirc .footer-recirc__article margin-bottom 2rem{color:#000}@media only screen and (min-width: 800px){footer.pudding-footer .footer-recirc .footer-recirc__article{width:calc(25% - 1.5rem);margin-right:1.5rem}footer.pudding-footer .footer-recirc .footer-recirc__article:last-of-type{margin-right:0}}",
	map: "{\"version\":3,\"file\":\"Footer.svelte\",\"sources\":[\"Footer.svelte\"],\"sourcesContent\":[\"<style global src=\\\"./../styles/footer.styl\\\">:global(*) {\\n  box-sizing: border-box;\\n  -moz-box-sizing: border-box;\\n}\\n:global(html),\\n:global(body),\\n:global(div),\\n:global(span),\\n:global(applet),\\n:global(object),\\n:global(iframe),\\n:global(h1),\\n:global(h2),\\n:global(h3),\\n:global(h4),\\n:global(h5),\\n:global(h6),\\n:global(p),\\n:global(blockquote),\\n:global(pre),\\n:global(a),\\n:global(abbr),\\n:global(acronym),\\n:global(address),\\n:global(big),\\n:global(cite),\\n:global(code),\\n:global(del),\\n:global(dfn),\\n:global(em),\\n:global(img),\\n:global(ins),\\n:global(kbd),\\n:global(q),\\n:global(s),\\n:global(samp),\\n:global(small),\\n:global(strike),\\n:global(strong),\\n:global(sub),\\n:global(sup),\\n:global(tt),\\n:global(var),\\n:global(b),\\n:global(u),\\n:global(i),\\n:global(center),\\n:global(dl),\\n:global(dt),\\n:global(dd),\\n:global(ol),\\n:global(ul),\\n:global(li),\\n:global(fieldset),\\n:global(form),\\n:global(label),\\n:global(legend),\\n:global(table),\\n:global(caption),\\n:global(tbody),\\n:global(tfoot),\\n:global(thead),\\n:global(tr),\\n:global(th),\\n:global(td),\\n:global(article),\\n:global(aside),\\n:global(canvas),\\n:global(details),\\n:global(embed),\\n:global(figure),\\n:global(figcaption),\\n:global(footer),\\n:global(header),\\n:global(hgroup),\\n:global(menu),\\n:global(nav),\\n:global(output),\\n:global(ruby),\\n:global(section),\\n:global(summary),\\n:global(time),\\n:global(mark),\\n:global(audio),\\n:global(video) {\\n  margin: 0;\\n  padding: 0;\\n  border: 0;\\n  vertical-align: baseline;\\n  font: inherit;\\n  font-size: 100%;\\n}\\n:global(article),\\n:global(aside),\\n:global(details),\\n:global(figcaption),\\n:global(figure),\\n:global(footer),\\n:global(header),\\n:global(hgroup),\\n:global(main),\\n:global(menu),\\n:global(nav),\\n:global(section) {\\n  display: block;\\n}\\n:global(a) :global(img) {\\n  border: none;\\n}\\n:global(blockquote) {\\n  quotes: none;\\n}\\n:global(blockquote:before),\\n:global(blockquote:after) {\\n  content: '';\\n  content: none;\\n}\\n:global(table) {\\n  border-spacing: 0;\\n  border-collapse: collapse;\\n}\\n:global(caption),\\n:global(th),\\n:global(td) {\\n  vertical-align: middle;\\n  text-align: left;\\n  font-weight: normal;\\n}\\n:global(body) {\\n  padding-top: 3rem;\\n  background-attachment: fixed;\\n  color: #000;\\n  font-weight: 500;\\n  font-family: 'National 2 Web', Helvetica, Arial, sans-serif;\\n  font-feature-settings: 'kern' 1, 'onum' 0, 'liga' 0, 'tnum' 1;\\n  -webkit-font-smoothing: antialiased;\\n  -webkit-tap-highlight-color: rgba(0,0,0,0);\\n  background-color: #fffaf3;\\n}\\n:global(p) {\\n  line-height: 1.625;\\n  color: #282828;\\n}\\n:global(h1) {\\n  font-size: 2em;\\n  color: #282828;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h1) {\\n    font-size: 3em;\\n  }\\n}\\n:global(h2) {\\n  font-size: 1.5em;\\n  color: #282828;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h2) {\\n    font-size: 2.5em;\\n  }\\n}\\n:global(h3) {\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h3) {\\n    font-size: 2em;\\n  }\\n}\\n:global(h4) {\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h4) {\\n    font-size: 1.5em;\\n  }\\n}\\n:global(h5) {\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h5) {\\n    font-size: 1.25em;\\n  }\\n}\\n:global(h6) {\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h6) {\\n    font-size: 1.125em;\\n  }\\n}\\n:global(p) {\\n  margin: 1em 0;\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 480px) {\\n  :global(p) {\\n    font-size: 1.125em;\\n  }\\n}\\n:global(a) {\\n  border-bottom: 1px solid #000;\\n  color: #000;\\n  text-decoration: none;\\n}\\n:global(a:hover) {\\n  border-bottom: 1px solid #000;\\n}\\n:global(a:visited),\\n:global(a:hover) {\\n  color: #000;\\n}\\n:global(strong),\\n:global(b) {\\n  font-weight: 700;\\n}\\n:global(em),\\n:global(i) {\\n  font-style: italic;\\n}\\n:global(ul) {\\n  list-style-type: none;\\n}\\n:global(img),\\n:global(video) {\\n  display: block;\\n  width: 100%;\\n}\\n:global(button) {\\n  margin: 0;\\n  padding: 0;\\n  outline: none;\\n  border: none;\\n  font-size: 1em;\\n  font-family: 'National 2 Web', Helvetica, Arial, sans-serif;\\n  cursor: pointer;\\n}\\n:global(sub),\\n:global(sup) {\\n  position: relative;\\n  vertical-align: baseline;\\n  font-size: 0.75rem;\\n  line-height: 0;\\n}\\n:global(sup) {\\n  top: -0.5em;\\n}\\n:global(sub) {\\n  bottom: -0.25em;\\n}\\n:global(.skip-to-main) {\\n  position: absolute;\\n  overflow: hidden;\\n  width: 1px;\\n  height: 1px;\\n  border: none;\\n}\\n:global(.skip-to-main:focus) {\\n  z-index: 1000;\\n  padding: 0.5rem;\\n  width: auto;\\n  height: auto;\\n  background-color: #f4f4f4;\\n}\\n@font-face {\\n  font-weight: 500;\\n  font-style: normal;\\n  font-stretch: normal;\\n  font-family: 'National 2 Web';\\n  src: url(\\\"https://pudding.cool/assets/fonts/national/National2Web-Regular.woff2\\\") format('woff2'), url(\\\"https://pudding.cool/assets/fonts/national/National2Web-Regular.woff\\\") format('woff');\\n  font-display: swap;\\n}\\n@font-face {\\n  font-weight: 700;\\n  font-style: normal;\\n  font-stretch: normal;\\n  font-family: 'National 2 Web';\\n  src: url(\\\"https://pudding.cool/assets/fonts/national/National2Web-Bold.woff2\\\") format('woff2'), url(\\\"https://pudding.cool/assets/fonts/national/National2Web-Bold.woff\\\") format('woff');\\n  font-display: swap;\\n}\\n:global(#alt-footer) {\\n  border-top: none;\\n}\\n:global(#alt-footer) :global(#wordmark) {\\n  display: none;\\n}\\n:global(#alt-footer) :global(.footer-company__description) {\\n  font-size: 24px;\\n}\\n:global(#alt-footer) :global(.footer-company__trademark) {\\n  margin-top: 1.5rem;\\n}\\n:global(.pre-footer) {\\n  display: block;\\n  font-family: 'Lyon Text Web';\\n  padding-top: 2rem;\\n  padding-bottom: 3rem;\\n}\\n:global(.pre-footer) :global(p) {\\n  font-family: 'Lyon Text Web';\\n  margin: 0 auto;\\n  color: #000;\\n  font-size: 18px;\\n  width: 95%;\\n  text-align: center;\\n}\\n:global(.pre-footer) :global(.socials) {\\n  margin-top: 5rem;\\n}\\n:global(.pre-footer) :global(.newsletter-cta) :global(form) {\\n  display: flex;\\n  margin: 0 auto;\\n  justify-content: center;\\n  margin-top: 2rem;\\n  margin-bottom: 2rem;\\n  width: 95%;\\n}\\n:global(.pre-footer) :global(.newsletter-cta) :global(form) :global(.newsletter__input) {\\n  background: rgba(255,255,255,0.53);\\n  border: 1px solid rgba(0,0,0,0.25);\\n  border-radius: 3px;\\n  margin-right: 5px;\\n  padding-left: 0.5rem;\\n  font-family: 'Atlas Grotesk Web';\\n  -webkit-appearance: none;\\n  -moz-appearance: none;\\n  font-size: 14px;\\n}\\n:global(.pre-footer) :global(.newsletter-cta) :global(form) :global(.newsletter__input::-moz-placeholder) {\\n  font-family: 'Atlas Grotesk Web';\\n  font-size: 14px;\\n}\\n:global(.pre-footer) :global(.newsletter-cta) :global(form) :global(.newsletter__input:-ms-input-placeholder) {\\n  font-family: 'Atlas Grotesk Web';\\n  font-size: 14px;\\n}\\n:global(.pre-footer) :global(.newsletter-cta) :global(form) :global(.newsletter__input::-ms-input-placeholder) {\\n  font-family: 'Atlas Grotesk Web';\\n  font-size: 14px;\\n}\\n:global(.pre-footer) :global(.newsletter-cta) :global(form) :global(.newsletter__input::placeholder) {\\n  font-family: 'Atlas Grotesk Web';\\n  font-size: 14px;\\n}\\n:global(.pre-footer) :global(.newsletter-cta) :global(form) :global(.btn) {\\n  border: 1px solid #4365be;\\n  background-color: #5977e1;\\n  color: #fff;\\n  border-radius: 3px;\\n  font-size: 16px;\\n  font-weight: 600;\\n  padding: 0.5rem 1rem;\\n  cursor: pointer;\\n  font-family: 'Atlas Grotesk Web';\\n  box-shadow: 0 1px 2px rgba(15,15,15,0.15);\\n  -webkit-appearance: none;\\n  -moz-appearance: none;\\n}\\n:global(.pre-footer) :global(.patreon-cta) {\\n  padding-top: 4rem;\\n  display: flex;\\n  flex-direction: column;\\n  margin-bottom: 3rem;\\n  position: relative;\\n}\\n:global(.pre-footer) :global(.patreon-cta:before) {\\n  border-top: 1px solid #000;\\n  content: '';\\n  position: absolute;\\n  top: 0px;\\n  width: 100px;\\n  left: 0;\\n  right: 0;\\n  margin: 0 auto;\\n}\\n:global(.pre-footer) :global(.patreon-cta) :global(a) {\\n  color: #fff;\\n  border: none;\\n  font-family: 'Atlas Grotesk Web';\\n  font-size: 16px;\\n  font-weight: 600;\\n  margin: 0 auto;\\n  display: block;\\n}\\n:global(.pre-footer) :global(.patreon-cta) :global(button) {\\n  margin: 0 auto;\\n  box-shadow: 0 2px 2px rgba(225,98,89,0.36);\\n  background-color: #e16259;\\n  border: 1px solid #be5643;\\n  border-radius: 3px;\\n  padding: 0.5rem 1rem;\\n  display: inline-block;\\n  font-family: 'Atlas Grotesk Web';\\n  align-self: center;\\n  margin-top: 2rem;\\n  margin-bottom: 2rem;\\n  font-weight: 600;\\n  color: #fff;\\n}\\n:global(footer.pudding-footer) {\\n  padding: 0 1rem;\\n  border-top: 4px solid #000;\\n  font-family: 'Lyon Text Web';\\n  margin-top: 3rem;\\n  padding-bottom: 3rem;\\n}\\n:global(footer.pudding-footer) :global(.footer-recirc) {\\n  max-width: 65rem;\\n  margin: 0 auto;\\n}\\n:global(footer.pudding-footer) :global(.footer-recirc) :global(p) {\\n  text-align: center;\\n}\\n:global(footer.pudding-footer) :global(.footer-recirc) :global(p) :global(font-size) :global(18px) {\\n  color: #000;\\n}\\n:global(footer.pudding-footer) :global(.footer-recirc) :global(.footer-recirc__articles) {\\n  display: flex;\\n  flex-wrap: wrap;\\n  justify-content: space-between;\\n  margin-top: 3rem;\\n}\\n:global(footer.pudding-footer) :global(.footer-recirc) :global(.footer-recirc__article) {\\n  width: 100%;\\n  border: none;\\n}\\n:global(footer.pudding-footer) :global(.footer-recirc) :global(.footer-recirc__article) :global(display) :global(block) {\\n  max-width: 350px;\\n}\\n:global(footer.pudding-footer) :global(.footer-recirc) :global(.footer-recirc__article) :global(margin-bottom) :global(2rem) {\\n  color: #000;\\n}\\n@media only screen and (min-width: 800px) {\\n  :global(footer.pudding-footer) :global(.footer-recirc) :global(.footer-recirc__article) {\\n    width: calc(25% - 1.5rem);\\n    margin-right: 1.5rem;\\n  }\\n  :global(footer.pudding-footer) :global(.footer-recirc) :global(.footer-recirc__article:last-of-type) {\\n    margin-right: 0;\\n  }\\n}</style>\\n\\n<script>\\n  import * as d3 from \\\"d3\\\";\\n  import { onMount } from 'svelte';\\n\\n  const fallbackData = [\\n  {\\n    image: \\\"2018_02_stand-up\\\",\\n    url: \\\"2018/02/stand-up\\\",\\n    hed: \\\"The Structure of Stand-Up Comedy\\\"\\n  },\\n  {\\n    image: \\\"2018_04_birthday-paradox\\\",\\n    url: \\\"2018/04/birthday-paradox\\\",\\n    hed: \\\"The Birthday Paradox Experiment\\\"\\n  },\\n  {\\n    image: \\\"2018_11_boy-bands\\\",\\n    url: \\\"2018/11/boy-bands\\\",\\n    hed: \\\"Internet Boy Band Database\\\"\\n  },\\n  {\\n    image: \\\"2018_08_pockets\\\",\\n    url: \\\"2018/08/pockets\\\",\\n    hed: \\\"Women’s Pockets are Inferior\\\"\\n  }\\n  ];\\n  //\\n  let storyData = null;\\n\\n  function loadJS(src, cb) {\\n  const ref = document.getElementsByTagName(\\\"script\\\")[0];\\n  const script = document.createElement(\\\"script\\\");\\n  script.src = src;\\n  script.async = true;\\n  ref.parentNode.insertBefore(script, ref);\\n\\n  if (cb && typeof cb === \\\"function\\\") {\\n    script.onload = cb;\\n  }\\n\\n  return script;\\n  }\\n\\n  function loadStories(cb) {\\n  const request = new XMLHttpRequest();\\n  const v = Date.now();\\n  const url = `https://pudding.cool/assets/data/stories.json?v=${v}`;\\n  request.open(\\\"GET\\\", url, true);\\n\\n  request.onload = () => {\\n    if (request.status >= 200 && request.status < 400) {\\n      const data = JSON.parse(request.responseText);\\n      cb(data);\\n    } else cb(fallbackData);\\n  };\\n\\n  request.onerror = () => cb(fallbackData);\\n\\n  request.send();\\n  }\\n\\n  function createLink(d) {\\n  return `\\n  <a class='footer-recirc__article' href='https://pudding.cool/${d.url}' target='_blank' rel='noopener'>\\n    <img class='article__img' src='https://pudding.cool/common/assets/thumbnails/640/${d.image}.jpg' alt='${d.hed}'>\\n    <p class='article__headline'>${d.hed}</p>\\n  </a>\\n  `;\\n  }\\n\\n  function recircHTML() {\\n  const url = window.location.href;\\n  const html = storyData\\n    .filter(d => !url.includes(d.url))\\n    .slice(0, 4)\\n    .map(createLink)\\n    .join(\\\"\\\");\\n\\n  d3.select(\\\".pudding-footer .footer-recirc__articles\\\").html(html);\\n\\n  }\\n  //\\n  function init() {\\n  loadStories(data => {\\n    storyData = data;\\n\\n    recircHTML();\\n  });\\n  }\\n  //\\n  init();\\n\\n</script>\\n\\n<div class=\\\"pre-footer\\\">\\n  <div class=\\\"patreon-cta\\\">\\n    <p>Enjoy this project? Consider helping fund us on Patreon.</p>\\n    <a target=\\\"_blank\\\" href=\\\"https://patreon.com/thepudding\\\">\\n    <button type=\\\"button\\\" name=\\\"button\\\">Become a Patron\\n    </button>\\n    </a>\\n  </div>\\n\\n  <div class=\\\"newsletter-cta\\\">\\n    <p>You should subscribe to our newsletter too.</p>\\n    <form action=\\\"https://poly-graph.us11.list-manage.com/subscribe/post\\\" method=\\\"POST\\\">\\n        <input type=\\\"hidden\\\" name=\\\"u\\\" value=\\\"c70d3c0e372cde433143ffeab\\\">\\n        <input type=\\\"hidden\\\" name=\\\"id\\\" value=\\\"9af100ac0f\\\">\\n        <input label=\\\"email\\\" class=\\\"newsletter__input\\\" type=\\\"email\\\" autocapitalize=\\\"off\\\" autocorrect=\\\"off\\\" name=\\\"MERGE0\\\" id=\\\"MERGE0\\\" size=\\\"25\\\" value=\\\"\\\" placeholder=\\\"you@example.com\\\">\\n        <div class=\\\"hidden-from-view\\\" style=\\\"left:-10000px;position:absolute\\\">\\n          <input label=\\\"text\\\" type=\\\"text\\\" name=\\\"b_c70d3c0e372cde433143ffeab_9af100ac0f\\\" tabindex=\\\"-1\\\" value=\\\"\\\">\\n        </div>\\n        <input class=\\\"btn\\\" style=\\\"\\\" type=\\\"submit\\\" name=\\\"submit\\\" value=\\\"Subscribe\\\">\\n      </form>\\n  </div>\\n\\t<div class=\\\"socials\\\">\\n\\t\\t<p>Or follow us on <a target=\\\"_blank\\\" href=\\\"https://www.instagram.com/the.pudding\\\">Instagram</a>, <a target=\\\"_blank\\\" href=\\\"https://twitter.com/puddingviz\\\">Twitter</a>, <a target=\\\"_blank\\\" href=\\\"https://www.facebook.com/pudding.viz\\\">Facebook</a>, and <a href=\\\"/feed/index.xml\\\">RSS</a>.</p>\\n\\t</div>\\n</div>\\n\\n\\n\\n\\n<footer class='pudding-footer' id=\\\"alt-footer\\\">\\n\\n\\t<div class='footer-recirc'>\\n\\t\\t<p>Check out some of our other projects</p>\\n\\t\\t<div class='footer-recirc__articles'></div>\\n\\t</div>\\n\\n\\t<div class='footer-company'>\\n\\t\\t<div class='footer-company__about'>\\n\\t\\t\\t<p class='footer-company__description'><a target=\\\"_blank\\\" href='https://pudding.cool'>The Pudding</a> is a digital publication that explains ideas debated in culture with visual essays. Learn more about us <a href=\\\"/about\\\">here</a>.</p>\\n\\t\\t\\t<p class='footer-company__trademark'>The Pudding<span>®</span> is made in Brooklyn, NY; Seattle, WA; San Antonio, TX; and Great Barrington, MA. <a target=\\\"_blank\\\" href='https://pudding.cool/privacy/'>Our privacy policy.</a></p>\\n\\t\\t</div>\\n\\n\\t</div>\\n</footer>\\n\"],\"names\":[],\"mappings\":\"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\"}"
};

function createLink(d) {
	return `
  <a class='footer-recirc__article' href='https://pudding.cool/${d.url}' target='_blank' rel='noopener'>
    <img class='article__img' src='https://pudding.cool/common/assets/thumbnails/640/${d.image}.jpg' alt='${d.hed}'>
    <p class='article__headline'>${d.hed}</p>
  </a>
  `;
}

const Footer = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const fallbackData = [
		{
			image: "2018_02_stand-up",
			url: "2018/02/stand-up",
			hed: "The Structure of Stand-Up Comedy"
		},
		{
			image: "2018_04_birthday-paradox",
			url: "2018/04/birthday-paradox",
			hed: "The Birthday Paradox Experiment"
		},
		{
			image: "2018_11_boy-bands",
			url: "2018/11/boy-bands",
			hed: "Internet Boy Band Database"
		},
		{
			image: "2018_08_pockets",
			url: "2018/08/pockets",
			hed: "Women’s Pockets are Inferior"
		}
	];

	//
	let storyData = null;

	function loadStories(cb) {
		const request = new XMLHttpRequest();
		const v = Date.now();
		const url = `https://pudding.cool/assets/data/stories.json?v=${v}`;
		request.open("GET", url, true);

		request.onload = () => {
			if (request.status >= 200 && request.status < 400) {
				const data = JSON.parse(request.responseText);
				cb(data);
			} else cb(fallbackData);
		};

		request.onerror = () => cb(fallbackData);
		request.send();
	}

	function recircHTML() {
		const url = window.location.href;
		const html = storyData.filter(d => !url.includes(d.url)).slice(0, 4).map(createLink).join("");
		select(".pudding-footer .footer-recirc__articles").html(html);
	}

	//
	function init() {
		loadStories(data => {
			storyData = data;
			recircHTML();
		});
	}

	//
	init();

	$$result.css.add(css$1);

	return `<div class="${"pre-footer"}"><div class="${"patreon-cta"}"><p>Enjoy this project? Consider helping fund us on Patreon.</p>
    <a target="${"_blank"}" href="${"https://patreon.com/thepudding"}"><button type="${"button"}" name="${"button"}">Become a Patron
    </button></a></div>

  <div class="${"newsletter-cta"}"><p>You should subscribe to our newsletter too.</p>
    <form action="${"https://poly-graph.us11.list-manage.com/subscribe/post"}" method="${"POST"}"><input type="${"hidden"}" name="${"u"}" value="${"c70d3c0e372cde433143ffeab"}">
        <input type="${"hidden"}" name="${"id"}" value="${"9af100ac0f"}">
        <input label="${"email"}" class="${"newsletter__input"}" type="${"email"}" autocapitalize="${"off"}" autocorrect="${"off"}" name="${"MERGE0"}" id="${"MERGE0"}" size="${"25"}" value="${""}" placeholder="${"you@example.com"}">
        <div class="${"hidden-from-view"}" style="${"left:-10000px;position:absolute"}"><input label="${"text"}" type="${"text"}" name="${"b_c70d3c0e372cde433143ffeab_9af100ac0f"}" tabindex="${"-1"}" value="${""}"></div>
        <input class="${"btn"}" style="${""}" type="${"submit"}" name="${"submit"}" value="${"Subscribe"}"></form></div>
	<div class="${"socials"}"><p>Or follow us on <a target="${"_blank"}" href="${"https://www.instagram.com/the.pudding"}">Instagram</a>, <a target="${"_blank"}" href="${"https://twitter.com/puddingviz"}">Twitter</a>, <a target="${"_blank"}" href="${"https://www.facebook.com/pudding.viz"}">Facebook</a>, and <a href="${"/feed/index.xml"}">RSS</a>.</p></div></div>




<footer class="${"pudding-footer"}" id="${"alt-footer"}"><div class="${"footer-recirc"}"><p>Check out some of our other projects</p>
		<div class="${"footer-recirc__articles"}"></div></div>

	<div class="${"footer-company"}"><div class="${"footer-company__about"}"><p class="${"footer-company__description"}"><a target="${"_blank"}" href="${"https://pudding.cool"}">The Pudding</a> is a digital publication that explains ideas debated in culture with visual essays. Learn more about us <a href="${"/about"}">here</a>.</p>
			<p class="${"footer-company__trademark"}">The Pudding<span>®</span> is made in Brooklyn, NY; Seattle, WA; San Antonio, TX; and Great Barrington, MA. <a target="${"_blank"}" href="${"https://pudding.cool/privacy/"}">Our privacy policy.</a></p></div></div></footer>`;
});

/* src/components/Meta.svelte generated by Svelte v3.23.2 */

const Meta = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `

<link rel="${"preload"}" type="${"font/woff2"}" as="${"font"}" crossorigin href="${"./../assets/fonts/lyon/LyonText-Regular-Web.woff2"}">
<link rel="${"preload"}" type="${"font/woff2"}" as="${"font"}" crossorigin href="${"./../assets/fonts/lyon/LyonDisplay-Regular-Web.woff2"}">

<link rel="${"apple-touch-icon"}" sizes="${"180x180"}" href="${"https://pudding.cool/apple-touch-icon.png"}">

<link rel="${"icon"}" type="${"image/png"}" sizes="${"32x32"}" href="${"https://pudding.cool/favicon-32x32.png"}">

<link rel="${"icon"}" type="${"image/png"}" sizes="${"16x16"}" href="${"https://pudding.cool/favicon-16x16.png"}">

<link rel="${"manifest"}" href="${"https://pudding.cool/site.webmanifest"}">

<link rel="${"mask-icon"}" href="${"https://pudding.cool/safari-pinned-tab.svg"}" color="${"#5bbad5"}">

<meta name="${"msapplication-TileColor"}" content="${"#ffc40d"}">
<meta name="${"theme-color"}" content="${"#ffffff"}">`;
});

/* src/components/App.svelte generated by Svelte v3.23.2 */

const css$2 = {
	code: "*{box-sizing:border-box;-moz-box-sizing:border-box}html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;vertical-align:baseline;font:inherit;font-size:100%}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section{display:block}a img{border:none}blockquote{quotes:none}blockquote:before,blockquote:after{content:'';content:none}table{border-spacing:0;border-collapse:collapse}caption,th,td{vertical-align:middle;text-align:left;font-weight:normal}body{padding-top:3rem;background-attachment:fixed;color:#000;font-weight:500;font-family:'National 2 Web', Helvetica, Arial, sans-serif;font-feature-settings:'kern' 1, 'onum' 0, 'liga' 0, 'tnum' 1;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:rgba(0,0,0,0);background-color:#fffaf3}p{line-height:1.625;color:#282828}h1{font-size:2em;color:#282828}@media only screen and (min-width: 640px){h1{font-size:3em}}h2{font-size:1.5em;color:#282828}@media only screen and (min-width: 640px){h2{font-size:2.5em}}h3{font-size:1em}@media only screen and (min-width: 640px){h3{font-size:2em}}h4{font-size:1em}@media only screen and (min-width: 640px){h4{font-size:1.5em}}h5{font-size:1em}@media only screen and (min-width: 640px){h5{font-size:1.25em}}h6{font-size:1em}@media only screen and (min-width: 640px){h6{font-size:1.125em}}p{margin:1em 0;font-size:1em}@media only screen and (min-width: 480px){p{font-size:1.125em}}a{border-bottom:1px solid #000;color:#000;text-decoration:none}a:hover{border-bottom:1px solid #000}a:visited,a:hover{color:#000}strong,b{font-weight:700}em,i{font-style:italic}ul{list-style-type:none}img,video{display:block;width:100%}button{margin:0;padding:0;outline:none;border:none;font-size:1em;font-family:'National 2 Web', Helvetica, Arial, sans-serif;cursor:pointer}sub,sup{position:relative;vertical-align:baseline;font-size:0.75rem;line-height:0}sup{top:-0.5em}sub{bottom:-0.25em}.skip-to-main{position:absolute;overflow:hidden;width:1px;height:1px;border:none}.skip-to-main:focus{z-index:1000;padding:0.5rem;width:auto;height:auto;background-color:#f4f4f4}@font-face{font-weight:500;font-style:normal;font-stretch:normal;font-family:'National 2 Web';src:url(\"https://pudding.cool/assets/fonts/national/National2Web-Regular.woff2\") format('woff2'), url(\"https://pudding.cool/assets/fonts/national/National2Web-Regular.woff\") format('woff');font-display:swap}@font-face{font-weight:700;font-style:normal;font-stretch:normal;font-family:'National 2 Web';src:url(\"https://pudding.cool/assets/fonts/national/National2Web-Bold.woff2\") format('woff2'), url(\"https://pudding.cool/assets/fonts/national/National2Web-Bold.woff\") format('woff');font-display:swap}.logo-wrapper{text-align:center;padding-top:2rem;margin-top:0}.logo-wrapper a{font-family:'Walter Turncoat';font-weight:600;border:none;margin-top:0;text-transform:uppercase}button{display:inline-block;padding:0.5em 0.5em;background-color:#000;box-shadow:2px 2px 0 1px #000;color:#000;font-weight:700;line-height:1}button.alt{padding:0;background:transparent;box-shadow:none;color:#000;font-weight:500}@media only screen and (hover: hover){button.alt:hover{background-color:transparent}button.alt:hover svg polyline,button.alt:hover svg circle,button.alt:hover svg line,button.alt:hover svg path{stroke:#fffd02}button.alt:hover span{color:#fffd02}}button.dark{background-color:#fffe9b;box-shadow:none;color:#17037c}@media only screen and (hover: hover){button.dark:hover{background-color:#fffd02}}button.dark:first-of-type svg{transform:translate(-1px, 2px)}button.dark:last-of-type svg{transform:translate(1px, 2px)}button.dark svg{width:75%;height:75%}button.dark svg polyline{stroke:#282828}@media only screen and (hover: hover){button:hover{background-color:#fffd02}}form{width:100%}select{margin-top:1rem;padding-right:1.5rem;padding-left:0.5rem;height:1.65rem;border:none;border-radius:0;background-color:#000;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDZFNDEwNjlGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDZFNDEwNkFGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NkU0MTA2N0Y3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NkU0MTA2OEY3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuGsgwQAAAA5SURBVHjaYvz//z8DOYCJgUxAf42MQIzTk0D/M+KzkRGPoQSdykiKJrBGpOhgJFYTWNEIiEeAAAMAzNENEOH+do8AAAAASUVORK5CYII=\");background-position:right 50%;background-repeat:no-repeat;box-shadow:2px 2px 0 1px #000;font-size:0.9em;font-family:'National 2 Web', Helvetica, Arial, sans-serif;line-height:1;-webkit-appearance:none;-moz-appearance:none;appearance:none}@media only screen and (min-width: 960px){select{margin-top:0;margin-left:0.25rem}}canvas{display:block}span.lang{display:none}span.lang.visible{display:inline-block}p.lang{display:none}p.lang.visible{display:block}select.lang{display:none}select.lang.visible{display:inline-block}.icon{display:inline-block;margin-left:0.5em;width:1em;height:1em}.icon svg{width:100%;height:100%}.column{margin:0 auto;padding:0 1rem;max-width:40rem}#long h3{margin-top:1rem;font-weight:bold}#long h4{margin-top:1rem;font-weight:bold}header .wordmark,#about .wordmark{display:block}header .wordmark path,#about .wordmark path{fill:#000}header .back{display:flex;align-items:center}header .back svg{margin-left:0.5em}header .about,header .toggle{display:flex;align-items:center}header .language button{display:flex;align-items:center}header .language button svg{margin-left:0.5em}header .logo svg .st0{fill:#000}header .logo svg .st1{fill:#000}#modal .name button{position:relative;width:1.5rem;height:1.5rem}#modal .name button .lang.visible{display:none}#modal .name button.unclicked .lang.visible{position:absolute;top:0;top:50%;right:0;display:block;width:4rem;color:#282828;text-align:left;font-size:12px;transform:translate(110%, -50%)}#modal .name button svg{display:block;width:26px;height:26px}#modal .name button svg circle{fill:#fffe9b;stroke:#cecc00}#modal .name button svg line{stroke:#282828}@media only screen and (hover: hover){#modal .name button:hover svg circle{fill:#fffd02}}#modal p.description span{display:inline-block;padding:0 0.25em;background-color:#fffe9b;box-shadow:2px 2px 0 0 #cecc00;cursor:pointer}#modal p.description span:hover{background-color:#fffd02}#modal .explore-nav button{width:100%}#long .yt{position:relative;overflow:hidden;margin:2rem 0;padding-bottom:56.25%;max-width:100%;height:0}#long .yt iframe,#long .yt object,#long .yt embed{position:absolute;top:0;left:0;width:100%;height:100%}object{display:none !important}",
	map: "{\"version\":3,\"file\":\"App.svelte\",\"sources\":[\"App.svelte\"],\"sourcesContent\":[\"<style global src=\\\"./../styles/global.styl\\\">:global(*) {\\n  box-sizing: border-box;\\n  -moz-box-sizing: border-box;\\n}\\n:global(html),\\n:global(body),\\n:global(div),\\n:global(span),\\n:global(applet),\\n:global(object),\\n:global(iframe),\\n:global(h1),\\n:global(h2),\\n:global(h3),\\n:global(h4),\\n:global(h5),\\n:global(h6),\\n:global(p),\\n:global(blockquote),\\n:global(pre),\\n:global(a),\\n:global(abbr),\\n:global(acronym),\\n:global(address),\\n:global(big),\\n:global(cite),\\n:global(code),\\n:global(del),\\n:global(dfn),\\n:global(em),\\n:global(img),\\n:global(ins),\\n:global(kbd),\\n:global(q),\\n:global(s),\\n:global(samp),\\n:global(small),\\n:global(strike),\\n:global(strong),\\n:global(sub),\\n:global(sup),\\n:global(tt),\\n:global(var),\\n:global(b),\\n:global(u),\\n:global(i),\\n:global(center),\\n:global(dl),\\n:global(dt),\\n:global(dd),\\n:global(ol),\\n:global(ul),\\n:global(li),\\n:global(fieldset),\\n:global(form),\\n:global(label),\\n:global(legend),\\n:global(table),\\n:global(caption),\\n:global(tbody),\\n:global(tfoot),\\n:global(thead),\\n:global(tr),\\n:global(th),\\n:global(td),\\n:global(article),\\n:global(aside),\\n:global(canvas),\\n:global(details),\\n:global(embed),\\n:global(figure),\\n:global(figcaption),\\n:global(footer),\\n:global(header),\\n:global(hgroup),\\n:global(menu),\\n:global(nav),\\n:global(output),\\n:global(ruby),\\n:global(section),\\n:global(summary),\\n:global(time),\\n:global(mark),\\n:global(audio),\\n:global(video) {\\n  margin: 0;\\n  padding: 0;\\n  border: 0;\\n  vertical-align: baseline;\\n  font: inherit;\\n  font-size: 100%;\\n}\\n:global(article),\\n:global(aside),\\n:global(details),\\n:global(figcaption),\\n:global(figure),\\n:global(footer),\\n:global(header),\\n:global(hgroup),\\n:global(main),\\n:global(menu),\\n:global(nav),\\n:global(section) {\\n  display: block;\\n}\\n:global(a) :global(img) {\\n  border: none;\\n}\\n:global(blockquote) {\\n  quotes: none;\\n}\\n:global(blockquote:before),\\n:global(blockquote:after) {\\n  content: '';\\n  content: none;\\n}\\n:global(table) {\\n  border-spacing: 0;\\n  border-collapse: collapse;\\n}\\n:global(caption),\\n:global(th),\\n:global(td) {\\n  vertical-align: middle;\\n  text-align: left;\\n  font-weight: normal;\\n}\\n:global(body) {\\n  padding-top: 3rem;\\n  background-attachment: fixed;\\n  color: #000;\\n  font-weight: 500;\\n  font-family: 'National 2 Web', Helvetica, Arial, sans-serif;\\n  font-feature-settings: 'kern' 1, 'onum' 0, 'liga' 0, 'tnum' 1;\\n  -webkit-font-smoothing: antialiased;\\n  -webkit-tap-highlight-color: rgba(0,0,0,0);\\n  background-color: #fffaf3;\\n}\\n:global(p) {\\n  line-height: 1.625;\\n  color: #282828;\\n}\\n:global(h1) {\\n  font-size: 2em;\\n  color: #282828;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h1) {\\n    font-size: 3em;\\n  }\\n}\\n:global(h2) {\\n  font-size: 1.5em;\\n  color: #282828;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h2) {\\n    font-size: 2.5em;\\n  }\\n}\\n:global(h3) {\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h3) {\\n    font-size: 2em;\\n  }\\n}\\n:global(h4) {\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h4) {\\n    font-size: 1.5em;\\n  }\\n}\\n:global(h5) {\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h5) {\\n    font-size: 1.25em;\\n  }\\n}\\n:global(h6) {\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 640px) {\\n  :global(h6) {\\n    font-size: 1.125em;\\n  }\\n}\\n:global(p) {\\n  margin: 1em 0;\\n  font-size: 1em;\\n}\\n@media only screen and (min-width: 480px) {\\n  :global(p) {\\n    font-size: 1.125em;\\n  }\\n}\\n:global(a) {\\n  border-bottom: 1px solid #000;\\n  color: #000;\\n  text-decoration: none;\\n}\\n:global(a:hover) {\\n  border-bottom: 1px solid #000;\\n}\\n:global(a:visited),\\n:global(a:hover) {\\n  color: #000;\\n}\\n:global(strong),\\n:global(b) {\\n  font-weight: 700;\\n}\\n:global(em),\\n:global(i) {\\n  font-style: italic;\\n}\\n:global(ul) {\\n  list-style-type: none;\\n}\\n:global(img),\\n:global(video) {\\n  display: block;\\n  width: 100%;\\n}\\n:global(button) {\\n  margin: 0;\\n  padding: 0;\\n  outline: none;\\n  border: none;\\n  font-size: 1em;\\n  font-family: 'National 2 Web', Helvetica, Arial, sans-serif;\\n  cursor: pointer;\\n}\\n:global(sub),\\n:global(sup) {\\n  position: relative;\\n  vertical-align: baseline;\\n  font-size: 0.75rem;\\n  line-height: 0;\\n}\\n:global(sup) {\\n  top: -0.5em;\\n}\\n:global(sub) {\\n  bottom: -0.25em;\\n}\\n:global(.skip-to-main) {\\n  position: absolute;\\n  overflow: hidden;\\n  width: 1px;\\n  height: 1px;\\n  border: none;\\n}\\n:global(.skip-to-main:focus) {\\n  z-index: 1000;\\n  padding: 0.5rem;\\n  width: auto;\\n  height: auto;\\n  background-color: #f4f4f4;\\n}\\n@font-face {\\n  font-weight: 500;\\n  font-style: normal;\\n  font-stretch: normal;\\n  font-family: 'National 2 Web';\\n  src: url(\\\"https://pudding.cool/assets/fonts/national/National2Web-Regular.woff2\\\") format('woff2'), url(\\\"https://pudding.cool/assets/fonts/national/National2Web-Regular.woff\\\") format('woff');\\n  font-display: swap;\\n}\\n@font-face {\\n  font-weight: 700;\\n  font-style: normal;\\n  font-stretch: normal;\\n  font-family: 'National 2 Web';\\n  src: url(\\\"https://pudding.cool/assets/fonts/national/National2Web-Bold.woff2\\\") format('woff2'), url(\\\"https://pudding.cool/assets/fonts/national/National2Web-Bold.woff\\\") format('woff');\\n  font-display: swap;\\n}\\n:global(.logo-wrapper) {\\n  text-align: center;\\n  padding-top: 2rem;\\n  margin-top: 0;\\n}\\n:global(.logo-wrapper) :global(a) {\\n  font-family: 'Walter Turncoat';\\n  font-weight: 600;\\n  border: none;\\n  margin-top: 0;\\n  text-transform: uppercase;\\n}\\n:global(button) {\\n  display: inline-block;\\n  padding: 0.5em 0.5em;\\n  background-color: #000;\\n  box-shadow: 2px 2px 0 1px #000;\\n  color: #000;\\n  font-weight: 700;\\n  line-height: 1;\\n}\\n:global(button.alt) {\\n  padding: 0;\\n  background: transparent;\\n  box-shadow: none;\\n  color: #000;\\n  font-weight: 500;\\n}\\n@media only screen and (hover: hover) {\\n  :global(button.alt:hover) {\\n    background-color: transparent;\\n  }\\n  :global(button.alt:hover) :global(svg) :global(polyline),\\n  :global(button.alt:hover) :global(svg) :global(circle),\\n  :global(button.alt:hover) :global(svg) :global(line),\\n  :global(button.alt:hover) :global(svg) :global(path) {\\n    stroke: #fffd02;\\n  }\\n  :global(button.alt:hover) :global(span) {\\n    color: #fffd02;\\n  }\\n}\\n:global(button.dark) {\\n  background-color: #fffe9b;\\n  box-shadow: none;\\n  color: #17037c;\\n}\\n@media only screen and (hover: hover) {\\n  :global(button.dark:hover) {\\n    background-color: #fffd02;\\n  }\\n}\\n:global(button.dark:first-of-type) :global(svg) {\\n  transform: translate(-1px, 2px);\\n}\\n:global(button.dark:last-of-type) :global(svg) {\\n  transform: translate(1px, 2px);\\n}\\n:global(button.dark) :global(svg) {\\n  width: 75%;\\n  height: 75%;\\n}\\n:global(button.dark) :global(svg) :global(polyline) {\\n  stroke: #282828;\\n}\\n@media only screen and (hover: hover) {\\n  :global(button:hover) {\\n    background-color: #fffd02;\\n  }\\n}\\n:global(form) {\\n  width: 100%;\\n}\\n:global(select) {\\n  margin-top: 1rem;\\n  padding-right: 1.5rem;\\n  padding-left: 0.5rem;\\n  height: 1.65rem;\\n  border: none;\\n  border-radius: 0;\\n  background-color: #000;\\n  background-image: url(\\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDZFNDEwNjlGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDZFNDEwNkFGNzFEMTFFMkJEQ0VDRTM1N0RCMzMyMkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NkU0MTA2N0Y3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NkU0MTA2OEY3MUQxMUUyQkRDRUNFMzU3REIzMzIyQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuGsgwQAAAA5SURBVHjaYvz//z8DOYCJgUxAf42MQIzTk0D/M+KzkRGPoQSdykiKJrBGpOhgJFYTWNEIiEeAAAMAzNENEOH+do8AAAAASUVORK5CYII=\\\");\\n  background-position: right 50%;\\n  background-repeat: no-repeat;\\n  box-shadow: 2px 2px 0 1px #000;\\n  font-size: 0.9em;\\n  font-family: 'National 2 Web', Helvetica, Arial, sans-serif;\\n  line-height: 1;\\n  -webkit-appearance: none;\\n     -moz-appearance: none;\\n          appearance: none;\\n}\\n@media only screen and (min-width: 960px) {\\n  :global(select) {\\n    margin-top: 0;\\n    margin-left: 0.25rem;\\n  }\\n}\\n:global(canvas) {\\n  display: block;\\n}\\n:global(span.lang) {\\n  display: none;\\n}\\n:global(span.lang.visible) {\\n  display: inline-block;\\n}\\n:global(p.lang) {\\n  display: none;\\n}\\n:global(p.lang.visible) {\\n  display: block;\\n}\\n:global(select.lang) {\\n  display: none;\\n}\\n:global(select.lang.visible) {\\n  display: inline-block;\\n}\\n:global(.icon) {\\n  display: inline-block;\\n  margin-left: 0.5em;\\n  width: 1em;\\n  height: 1em;\\n}\\n:global(.icon) :global(svg) {\\n  width: 100%;\\n  height: 100%;\\n}\\n:global(.column) {\\n  margin: 0 auto;\\n  padding: 0 1rem;\\n  max-width: 40rem;\\n}\\n:global(#long) :global(h3) {\\n  margin-top: 1rem;\\n  font-weight: bold;\\n}\\n:global(#long) :global(h4) {\\n  margin-top: 1rem;\\n  font-weight: bold;\\n}\\n:global(header) :global(.wordmark),\\n:global(#about) :global(.wordmark) {\\n  display: block;\\n}\\n:global(header) :global(.wordmark) :global(path),\\n:global(#about) :global(.wordmark) :global(path) {\\n  fill: #000;\\n}\\n:global(header) :global(.back) {\\n  display: flex;\\n  align-items: center;\\n}\\n:global(header) :global(.back) :global(svg) {\\n  margin-left: 0.5em;\\n}\\n:global(header) :global(.about),\\n:global(header) :global(.toggle) {\\n  display: flex;\\n  align-items: center;\\n}\\n:global(header) :global(.language) :global(button) {\\n  display: flex;\\n  align-items: center;\\n}\\n:global(header) :global(.language) :global(button) :global(svg) {\\n  margin-left: 0.5em;\\n}\\n:global(header) :global(.logo) :global(svg) :global(.st0) {\\n  fill: #000;\\n}\\n:global(header) :global(.logo) :global(svg) :global(.st1) {\\n  fill: #000;\\n}\\n:global(#modal) :global(.name) :global(button) {\\n  position: relative;\\n  width: 1.5rem;\\n  height: 1.5rem;\\n}\\n:global(#modal) :global(.name) :global(button) :global(.lang.visible) {\\n  display: none;\\n}\\n:global(#modal) :global(.name) :global(button.unclicked) :global(.lang.visible) {\\n  position: absolute;\\n  top: 0;\\n  top: 50%;\\n  right: 0;\\n  display: block;\\n  width: 4rem;\\n  color: #282828;\\n  text-align: left;\\n  font-size: 12px;\\n  transform: translate(110%, -50%);\\n}\\n:global(#modal) :global(.name) :global(button) :global(svg) {\\n  display: block;\\n  width: 26px;\\n  height: 26px;\\n}\\n:global(#modal) :global(.name) :global(button) :global(svg) :global(circle) {\\n  fill: #fffe9b;\\n  stroke: #cecc00;\\n}\\n:global(#modal) :global(.name) :global(button) :global(svg) :global(line) {\\n  stroke: #282828;\\n}\\n@media only screen and (hover: hover) {\\n  :global(#modal) :global(.name) :global(button:hover) :global(svg) :global(circle) {\\n    fill: #fffd02;\\n  }\\n}\\n:global(#modal) :global(p.description) :global(span) {\\n  display: inline-block;\\n  padding: 0 0.25em;\\n  background-color: #fffe9b;\\n  box-shadow: 2px 2px 0 0 #cecc00;\\n  cursor: pointer;\\n}\\n:global(#modal) :global(p.description) :global(span:hover) {\\n  background-color: #fffd02;\\n}\\n:global(#modal) :global(.explore-nav) :global(button) {\\n  width: 100%;\\n}\\n:global(#long) :global(.yt) {\\n  position: relative;\\n  overflow: hidden;\\n  margin: 2rem 0;\\n  padding-bottom: 56.25%;\\n  max-width: 100%;\\n  height: 0;\\n}\\n:global(#long) :global(.yt) :global(iframe),\\n:global(#long) :global(.yt) :global(object),\\n:global(#long) :global(.yt) :global(embed) {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  width: 100%;\\n  height: 100%;\\n}\\n:global(object) {\\n  display: none !important;\\n}</style>\\n\\n<script>\\n  import { onMount } from \\\"svelte\\\";\\n  import { LayerCake, Svg } from \\\"layercake\\\";\\n  import Intro from \\\"./Intro.svelte\\\";\\n  import Footer from \\\"./Footer.svelte\\\";\\n  import Meta from \\\"./Meta.svelte\\\";\\n  import doc from \\\"../data/copy.json\\\"\\n</script>\\n\\n<svelte:head>\\n  <Meta />\\n</svelte:head>\\n\\n<Intro />\\n<Footer />\\n\"],\"names\":[],\"mappings\":\"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\"}"
};

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	$$result.css.add(css$2);

	return `${($$result.head += `${validate_component(Meta, "Meta").$$render($$result, {}, {}, {})}`, "")}

${validate_component(Intro, "Intro").$$render($$result, {}, {}, {})}
${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});

module.exports = App;

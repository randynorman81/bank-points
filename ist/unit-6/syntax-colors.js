/* Syntax colors for the cheat sheet: the SAME highlighter and colors the HTML editor uses (copied from editor.html).
   If the editor's colors change, regenerate this file from it. Needs html-check.js loaded first (for the named-color list). */
(function (root) {
  var H = root.HTMLCheck || {};
  var HL = (function () {
    function set(s) { var o = {}; s.split(" ").forEach(function (k) { o[k] = 1; }); return o; }
    var TAGS = set("html head body title meta link style script h1 h2 h3 h4 h5 h6 p br hr div span a img ul ol li table thead tbody tfoot tr th td caption b i u em strong small mark sub sup code pre blockquote q abbr cite header footer nav main section article aside figure figcaption form input button label select option textarea iframe video audio source canvas svg center font");
    var ATTRS = set("id class style href src alt title width height type name value lang charset content rel colspan rowspan target border align bgcolor color size face placeholder for action method disabled checked controls autoplay loop");
    var PROPS = set("color background background-color background-image background-size background-position background-repeat border border-color border-style border-width border-radius border-top border-bottom border-left border-right margin margin-top margin-bottom margin-left margin-right padding padding-top padding-bottom padding-left padding-right width height min-width max-width min-height max-height display font font-family font-size font-weight font-style text-align text-decoration text-transform text-indent line-height letter-spacing word-spacing list-style list-style-type list-style-position float clear position top bottom left right overflow opacity visibility box-shadow text-shadow cursor z-index vertical-align white-space border-collapse border-spacing flex flex-direction justify-content align-items gap grid");
    var NAMED = H.NAMED || {};
    var VALUE_WORDS = set("solid dashed dotted double groove ridge inset outset none hidden center left right justify bold bolder lighter normal italic oblique underline overline line-through uppercase lowercase capitalize block inline inline-block flex inline-flex grid serif sans-serif monospace cursive fantasy system-ui auto inherit initial unset transparent currentcolor disc circle square decimal lower-alpha upper-alpha lower-roman upper-roman top middle bottom baseline text-top text-bottom pointer default relative absolute fixed static sticky wrap nowrap row column row-reverse column-reverse space-between space-around space-evenly flex-start flex-end start end stretch cover contain repeat repeat-x repeat-y no-repeat both scroll visible ease ease-in ease-out ease-in-out linear all collapse separate outside inside important rgb rgba hsl hsla repeat minmax arial helvetica verdana georgia tahoma impact times courier garamond palatino trebuchet");
    function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function sp(c, s) { return s === "" ? "" : '<span class="' + c + '">' + esc(s) + "</span>"; }
  
    /* the inside of a { } block or style="" attribute: property: value; */
    function decls(t) {
      return t.replace(/(\/\*[\s\S]*?(?:\*\/|$))|([^:;{}\/]+)(:)|(#[0-9a-fA-F]{3,8}\b)|(-?\d*\.?\d+(?:px|em|rem|%|pt|vh|vw|s|ms|deg|fr)?)|([a-zA-Z][a-zA-Z-]*)|([;{}:])|(\s+)|([\s\S])/g,
        function (m, cm, prop, colon, hex, num, word, punc, ws, other) {
          if (cm) return sp("c-cm", cm);
          if (prop) { var p = prop.trim(); var lead = prop.match(/^\s*/)[0], trail = prop.match(/\s*$/)[0]; return esc(lead) + (PROPS[p.toLowerCase()] ? sp("c-prop", p) : esc(p)) + esc(trail) + sp("c-pun", colon); }
          if (hex) return sp("c-hex", hex);
          if (num) return sp("c-num", num);
          // value words: named colors (green, tomato) and keywords (solid, center, bold). Misspelled ones stay white.
          if (word) return (NAMED[word.toLowerCase()] || VALUE_WORDS[word.toLowerCase()]) ? sp("c-kw", word) : esc(word);
          if (punc) return sp("c-pun", punc);
          return esc(m);
        });
    }
    function css(t) {
      var out = "", re = /\/\*[\s\S]*?(?:\*\/|$)|[^{}]*\{|\}|[^{}]+$/g, m, depth = 0, pos = 0;
      var parts = [];
      /* walk: selector text up to "{", then declarations up to "}" */
      var i = 0, n = t.length;
      while (i < n) {
        var open = t.indexOf("{", i);
        if (open < 0) { out += selectors(t.slice(i)); break; }
        out += selectors(t.slice(i, open)) + sp("c-pun", "{");
        var close = t.indexOf("}", open);
        if (close < 0) { out += decls(t.slice(open + 1)); break; }
        out += decls(t.slice(open + 1, close)) + sp("c-pun", "}");
        i = close + 1;
      }
      return out;
    }
    function selectors(t) {
      return t.replace(/(\/\*[\s\S]*?(?:\*\/|$))|(@[\w-]+)|(#[\w-]+)|(\.[\w-]+)|([a-zA-Z][\w-]*)|([,>+~*:]+)|([\s\S])/g,
        function (m, cm, at, id, cls, el, pun) {
          if (cm) return sp("c-cm", cm);
          if (at) return sp("t-style", at);
          if (id) return sp("t-id", id);
          if (cls) return sp("t-class", cls);
          if (el) return TAGS[el.toLowerCase()] ? sp("t-tag", el) : esc(el);
          if (pun) return sp("c-pun", pun);
          return esc(m);
        });
    }
  
    function tag(m) {
      var mm = /^(<\/?)([^\s>\/]*)([\s\S]*)$/.exec(m), open = mm[1], name = mm[2], rest = mm[3], lname = name.toLowerCase();
      var out = sp("t-br", open);
      out += !TAGS[lname] ? esc(name) : (lname === "style" ? sp("t-style", name) : sp("t-tag", name));
      out += rest.replace(/([^\s=\/>"']+)(\s*=\s*)?("[^"]*"?|'[^']*'?|[^\s>"']+)?|(\/?>)|(\s+)|([\s\S])/g,
        function (x, an, eq, av, close) {
          if (close) return sp("t-br", close);
          if (an === undefined) return esc(x);
          var l = an.toLowerCase(), known = ATTRS[l], cls = !known ? "" : (l === "id" ? "t-id" : l === "class" ? "t-class" : l === "style" ? "t-style" : "t-attr");
          var s = cls ? sp(cls, an) : esc(an);
          if (eq) s += sp("t-eq", eq);
          if (av !== undefined) {
            if (l === "style" && /^["']/.test(av)) { var q = av.charAt(0), end = av.length > 1 && av.slice(-1) === q ? q : ""; s += sp("t-val", q) + decls(av.slice(1, av.length - end.length)) + sp("t-val", end); }
            else s += sp(cls === "t-id" ? "t-id-v" : cls === "t-class" ? "t-class-v" : "t-val", av);
          }
          return s;
        });
      return out;
    }
  
    function html(t) {
      var out = "", re = /<!--[\s\S]*?(?:-->|$)|<![^>]*>?|<\/?[a-zA-Z][^>]*>?/g, last = 0, m;
      while ((m = re.exec(t))) {
        out += esc(t.slice(last, m.index)); last = re.lastIndex;
        if (m[0].slice(0, 4) === "<!--") out += sp("c-cm", m[0]);
        else if (m[0].charAt(1) === "!") out += sp("c-cm", m[0]);
        else {
          out += tag(m[0]);
          if (/^<style[\s>]/i.test(m[0]) && m[0].slice(-1) === ">") {
            var close = t.toLowerCase().indexOf("</style", last); if (close < 0) close = t.length;
            out += css(t.slice(last, close)); last = close; re.lastIndex = close;
          }
        }
      }
      return out + esc(t.slice(last));
    }
    return { html: html, css: css, decls: decls, tag: tag };
  })();
  root.SYNTAX = HL;
})(window);

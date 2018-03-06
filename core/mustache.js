! function(e, t) {
    "object" == typeof exports && exports ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.Mustache = {})
}(this, function(e) {
    var t = Object.prototype.toString,
        n = Array.isArray || function(e) {
            return "[object Array]" === t.call(e)
        };

    function r(e) {
        return "function" == typeof e
    }

    function s(e) {
        return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
    }
    var i = RegExp.prototype.test;
    var o = /\S/;

    function a(e) {
        return t = o, n = e, !i.call(t, n);
        var t, n
    }
    var c = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    var u = /\s*/,
        h = /\s+/,
        l = /\s*=/,
        p = /\s*\}/,
        f = /#|\^|\/|>|\{|&|=|!/;

    function g(e) {
        this.string = e, this.tail = e, this.pos = 0
    }

    function v(e, t) {
        this.view = null == e ? {} : e, this.cache = {
            ".": this.view
        }, this.parent = t
    }

    function w() {
        this.cache = {}
    }
    g.prototype.eos = function() {
        return "" === this.tail
    }, g.prototype.scan = function(e) {
        var t = this.tail.match(e);
        if (!t || 0 !== t.index) return "";
        var n = t[0];
        return this.tail = this.tail.substring(n.length), this.pos += n.length, n
    }, g.prototype.scanUntil = function(e) {
        var t, n = this.tail.search(e);
        switch (n) {
            case -1:
                t = this.tail, this.tail = "";
                break;
            case 0:
                t = "";
                break;
            default:
                t = this.tail.substring(0, n), this.tail = this.tail.substring(n)
        }
        return this.pos += t.length, t
    }, v.prototype.push = function(e) {
        return new v(e, this)
    }, v.prototype.lookup = function(e) {
        var t, n = this.cache;
        if (e in n) t = n[e];
        else {
            for (var s, i, o = this; o;) {
                if (e.indexOf(".") > 0)
                    for (t = o.view, s = e.split("."), i = 0; null != t && i < s.length;) t = t[s[i++]];
                else t = o.view[e];
                if (null != t) break;
                o = o.parent
            }
            n[e] = t
        }
        return r(t) && (t = t.call(this.view)), t
    }, w.prototype.clearCache = function() {
        this.cache = {}
    }, w.prototype.parse = function(t, r) {
        var i = this.cache,
            o = i[t];
        return null == o && (o = i[t] = function(t, r) {
            if (!t) return [];
            var i, o, c, v = [],
                w = [],
                d = [],
                k = !1,
                y = !1;

            function b() {
                if (k && !y)
                    for (; d.length;) delete w[d.pop()];
                else d = [];
                k = !1, y = !1
            }

            function x(e) {
                if ("string" == typeof e && (e = e.split(h, 2)), !n(e) || 2 !== e.length) throw new Error("Invalid tags: " + e);
                i = new RegExp(s(e[0]) + "\\s*"), o = new RegExp("\\s*" + s(e[1])), c = new RegExp("\\s*" + s("}" + e[1]))
            }
            x(r || e.tags);
            for (var U, m, E, T, j, C, A = new g(t); !A.eos();) {
                if (U = A.pos, E = A.scanUntil(i))
                    for (var R = 0, S = E.length; R < S; ++R) a(T = E.charAt(R)) ? d.push(w.length) : y = !0, w.push(["text", T, U, U + 1]), U += 1, "\n" === T && b();
                if (!A.scan(i)) break;
                if (k = !0, m = A.scan(f) || "name", A.scan(u), "=" === m ? (E = A.scanUntil(l), A.scan(l), A.scanUntil(o)) : "{" === m ? (E = A.scanUntil(c), A.scan(p), A.scanUntil(o), m = "&") : E = A.scanUntil(o), !A.scan(o)) throw new Error("Unclosed tag at " + A.pos);
                if (j = [m, E, U, A.pos], w.push(j), "#" === m || "^" === m) v.push(j);
                else if ("/" === m) {
                    if (!(C = v.pop())) throw new Error('Unopened section "' + E + '" at ' + U);
                    if (C[1] !== E) throw new Error('Unclosed section "' + C[1] + '" at ' + U)
                } else "name" === m || "{" === m || "&" === m ? y = !0 : "=" === m && x(E)
            }
            if (C = v.pop()) throw new Error('Unclosed section "' + C[1] + '" at ' + A.pos);
            return function(e) {
                for (var t, n = [], r = n, s = [], i = 0, o = e.length; i < o; ++i) switch ((t = e[i])[0]) {
                    case "#":
                    case "^":
                        r.push(t), s.push(t), r = t[4] = [];
                        break;
                    case "/":
                        s.pop()[5] = t[2], r = s.length > 0 ? s[s.length - 1][4] : n;
                        break;
                    default:
                        r.push(t)
                }
                return n
            }(function(e) {
                for (var t, n, r = [], s = 0, i = e.length; s < i; ++s)(t = e[s]) && ("text" === t[0] && n && "text" === n[0] ? (n[1] += t[1], n[3] = t[3]) : (r.push(t), n = t));
                return r
            }(w))
        }(t, r)), o
    }, w.prototype.render = function(e, t, n) {
        var r = this.parse(e),
            s = t instanceof v ? t : new v(t);
        return this.renderTokens(r, s, n, e)
    }, w.prototype.renderTokens = function(t, s, i, o) {
        var a, c, u = "",
            h = this;

        function l(e) {
            return h.render(e, s, i)
        }
        for (var p = 0, f = t.length; p < f; ++p) switch ((a = t[p])[0]) {
            case "#":
                if (!(c = s.lookup(a[1]))) continue;
                if (n(c))
                    for (var g = 0, v = c.length; g < v; ++g) u += this.renderTokens(a[4], s.push(c[g]), i, o);
                else if ("object" == typeof c || "string" == typeof c) u += this.renderTokens(a[4], s.push(c), i, o);
                else if (r(c)) {
                    if ("string" != typeof o) throw new Error("Cannot use higher-order sections without the original template");
                    null != (c = c.call(s.view, o.slice(a[3], a[5]), l)) && (u += c)
                } else u += this.renderTokens(a[4], s, i, o);
                break;
            case "^":
                (!(c = s.lookup(a[1])) || n(c) && 0 === c.length) && (u += this.renderTokens(a[4], s, i, o));
                break;
            case ">":
                if (!i) continue;
                null != (c = r(i) ? i(a[1]) : i[a[1]]) && (u += this.renderTokens(this.parse(c), s, i, c));
                break;
            case "&":
                null != (c = s.lookup(a[1])) && (u += c);
                break;
            case "name":
                null != (c = s.lookup(a[1])) && (u += e.escape(c));
                break;
            case "text":
                u += a[1]
        }
        return u
    }, e.name = "mustache.js", e.version = "0.8.1", e.tags = ["{{", "}}"];
    var d = new w;
    e.clearCache = function() {
        return d.clearCache()
    }, e.parse = function(e, t) {
        return d.parse(e, t)
    }, e.render = function(e, t, n) {
        return d.render(e, t, n)
    }, e.to_html = function(t, n, s, i) {
        var o = e.render(t, n, s);
        if (!r(i)) return o;
        i(o)
    }, e.escape = function(e) {
        return String(e).replace(/[&<>"'\/]/g, function(e) {
            return c[e]
        })
    }, e.Scanner = g, e.Context = v, e.Writer = w
});
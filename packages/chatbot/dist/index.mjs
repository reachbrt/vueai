import { reactive as P0, onMounted as i0, watch as o0, toRefs as O0, defineComponent as N0, ref as ku, computed as $0, nextTick as j0, createElementBlock as S, openBlock as T, normalizeClass as U0, createElementVNode as y, renderSlot as $, toDisplayString as j, createCommentVNode as U, Fragment as Nu, renderList as H0, withDirectives as Z0, withKeys as V0, withModifiers as G0, vModelText as W0 } from "vue";
let su;
const J0 = new Uint8Array(16);
function Q0() {
  if (!su && (su = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !su))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return su(J0);
}
const v = [];
for (let u = 0; u < 256; ++u)
  v.push((u + 256).toString(16).slice(1));
function K0(u, e = 0) {
  return v[u[e + 0]] + v[u[e + 1]] + v[u[e + 2]] + v[u[e + 3]] + "-" + v[u[e + 4]] + v[u[e + 5]] + "-" + v[u[e + 6]] + v[u[e + 7]] + "-" + v[u[e + 8]] + v[u[e + 9]] + "-" + v[u[e + 10]] + v[u[e + 11]] + v[u[e + 12]] + v[u[e + 13]] + v[u[e + 14]] + v[u[e + 15]];
}
const X0 = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), $u = {
  randomUUID: X0
};
function eu(u, e, t) {
  if ($u.randomUUID && !u)
    return $u.randomUUID();
  u = u || {};
  const n = u.random || (u.rng || Q0)();
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, K0(n);
}
function a0(u) {
  const {
    client: e,
    initialMessages: t = [],
    systemPrompt: n = "You are a helpful assistant.",
    streaming: r = !0,
    persistenceKey: c = null,
    maxMessages: i = 100,
    onError: o = null
  } = u, a = P0({
    messages: [],
    isLoading: !1,
    error: null
  }), s = (l) => l.map((g) => ({
    ...g,
    id: g.id || eu(),
    timestamp: g.timestamp || /* @__PURE__ */ new Date()
  }));
  i0(() => {
    if (c)
      try {
        const l = localStorage.getItem(c);
        if (l) {
          a.messages = s(JSON.parse(l));
          return;
        }
      } catch (l) {
        console.error("Error loading chat history:", l);
      }
    a.messages = s(t);
  }), o0(() => a.messages, (l) => {
    if (c)
      try {
        localStorage.setItem(c, JSON.stringify(l));
      } catch (g) {
        console.error("Error saving chat history:", g);
      }
  }, { deep: !0 });
  const f = async (l) => {
    if (!l.trim()) return;
    a.error = null;
    const g = {
      role: "user",
      content: l,
      id: eu(),
      timestamp: /* @__PURE__ */ new Date()
    };
    a.messages.push(g), a.isLoading = !0;
    try {
      const p = [
        { role: "system", content: n },
        ...a.messages.filter((k) => k.role === "user" || k.role === "assistant").map(({ role: k, content: x }) => ({ role: k, content: x }))
      ];
      if (r) {
        let k = "";
        const x = {
          role: "assistant",
          content: "",
          id: eu(),
          timestamp: /* @__PURE__ */ new Date()
        };
        a.messages.push(x);
        const m = {
          onStart: () => {
          },
          onToken: (_) => {
            k += _;
            const D = a.messages[a.messages.length - 1];
            D && D.role === "assistant" && (D.content = k);
          },
          onComplete: () => {
            a.isLoading = !1;
          },
          onError: (_) => {
            a.error = _, a.isLoading = !1, o && o(_);
          }
        };
        await e.chatStream(p, m);
      } else {
        const k = await e.chat(p);
        a.messages.push({
          role: "assistant",
          content: k,
          // response is a string
          id: eu(),
          timestamp: /* @__PURE__ */ new Date()
        }), a.isLoading = !1;
      }
      if (a.messages.length > i) {
        const k = a.messages.filter((m) => m.role === "system"), x = a.messages.slice(-i);
        a.messages = [...k, ...x];
      }
    } catch (p) {
      a.error = p, a.isLoading = !1, o && o(p);
    }
  }, d = () => {
    a.messages = [], a.error = null;
  }, b = (l) => {
    a.messages = s(l);
  }, h = (l) => {
    a.messages.push({
      ...l,
      id: l.id || eu(),
      timestamp: l.timestamp || /* @__PURE__ */ new Date()
    });
  };
  return {
    ...O0(a),
    sendMessage: f,
    clearMessages: d,
    setMessages: b,
    addMessage: h
  };
}
const ju = {};
function Y0(u) {
  let e = ju[u];
  if (e)
    return e;
  e = ju[u] = [];
  for (let t = 0; t < 128; t++) {
    const n = String.fromCharCode(t);
    e.push(n);
  }
  for (let t = 0; t < u.length; t++) {
    const n = u.charCodeAt(t);
    e[n] = "%" + ("0" + n.toString(16).toUpperCase()).slice(-2);
  }
  return e;
}
function K(u, e) {
  typeof e != "string" && (e = K.defaultChars);
  const t = Y0(e);
  return u.replace(/(%[a-f0-9]{2})+/gi, function(n) {
    let r = "";
    for (let c = 0, i = n.length; c < i; c += 3) {
      const o = parseInt(n.slice(c + 1, c + 3), 16);
      if (o < 128) {
        r += t[o];
        continue;
      }
      if ((o & 224) === 192 && c + 3 < i) {
        const a = parseInt(n.slice(c + 4, c + 6), 16);
        if ((a & 192) === 128) {
          const s = o << 6 & 1984 | a & 63;
          s < 128 ? r += "��" : r += String.fromCharCode(s), c += 3;
          continue;
        }
      }
      if ((o & 240) === 224 && c + 6 < i) {
        const a = parseInt(n.slice(c + 4, c + 6), 16), s = parseInt(n.slice(c + 7, c + 9), 16);
        if ((a & 192) === 128 && (s & 192) === 128) {
          const f = o << 12 & 61440 | a << 6 & 4032 | s & 63;
          f < 2048 || f >= 55296 && f <= 57343 ? r += "���" : r += String.fromCharCode(f), c += 6;
          continue;
        }
      }
      if ((o & 248) === 240 && c + 9 < i) {
        const a = parseInt(n.slice(c + 4, c + 6), 16), s = parseInt(n.slice(c + 7, c + 9), 16), f = parseInt(n.slice(c + 10, c + 12), 16);
        if ((a & 192) === 128 && (s & 192) === 128 && (f & 192) === 128) {
          let d = o << 18 & 1835008 | a << 12 & 258048 | s << 6 & 4032 | f & 63;
          d < 65536 || d > 1114111 ? r += "����" : (d -= 65536, r += String.fromCharCode(55296 + (d >> 10), 56320 + (d & 1023))), c += 9;
          continue;
        }
      }
      r += "�";
    }
    return r;
  });
}
K.defaultChars = ";/?:@&=+$,#";
K.componentChars = "";
const Uu = {};
function ue(u) {
  let e = Uu[u];
  if (e)
    return e;
  e = Uu[u] = [];
  for (let t = 0; t < 128; t++) {
    const n = String.fromCharCode(t);
    /^[0-9a-z]$/i.test(n) ? e.push(n) : e.push("%" + ("0" + t.toString(16).toUpperCase()).slice(-2));
  }
  for (let t = 0; t < u.length; t++)
    e[u.charCodeAt(t)] = u[t];
  return e;
}
function iu(u, e, t) {
  typeof e != "string" && (t = e, e = iu.defaultChars), typeof t > "u" && (t = !0);
  const n = ue(e);
  let r = "";
  for (let c = 0, i = u.length; c < i; c++) {
    const o = u.charCodeAt(c);
    if (t && o === 37 && c + 2 < i && /^[0-9a-f]{2}$/i.test(u.slice(c + 1, c + 3))) {
      r += u.slice(c, c + 3), c += 2;
      continue;
    }
    if (o < 128) {
      r += n[o];
      continue;
    }
    if (o >= 55296 && o <= 57343) {
      if (o >= 55296 && o <= 56319 && c + 1 < i) {
        const a = u.charCodeAt(c + 1);
        if (a >= 56320 && a <= 57343) {
          r += encodeURIComponent(u[c] + u[c + 1]), c++;
          continue;
        }
      }
      r += "%EF%BF%BD";
      continue;
    }
    r += encodeURIComponent(u[c]);
  }
  return r;
}
iu.defaultChars = ";/?:@&=+$,-_.!~*'()#";
iu.componentChars = "-_.!~*'()";
function Bu(u) {
  let e = "";
  return e += u.protocol || "", e += u.slashes ? "//" : "", e += u.auth ? u.auth + "@" : "", u.hostname && u.hostname.indexOf(":") !== -1 ? e += "[" + u.hostname + "]" : e += u.hostname || "", e += u.port ? ":" + u.port : "", e += u.pathname || "", e += u.search || "", e += u.hash || "", e;
}
function du() {
  this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
const ee = /^([a-z0-9.+-]+:)/i, te = /:[0-9]*$/, ne = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, re = ["<", ">", '"', "`", " ", "\r", `
`, "	"], ce = ["{", "}", "|", "\\", "^", "`"].concat(re), ie = ["'"].concat(ce), Hu = ["%", "/", "?", ";", "#"].concat(ie), Zu = ["/", "?", "#"], oe = 255, Vu = /^[+a-z0-9A-Z_-]{0,63}$/, ae = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Gu = {
  javascript: !0,
  "javascript:": !0
}, Wu = {
  http: !0,
  https: !0,
  ftp: !0,
  gopher: !0,
  file: !0,
  "http:": !0,
  "https:": !0,
  "ftp:": !0,
  "gopher:": !0,
  "file:": !0
};
function Mu(u, e) {
  if (u && u instanceof du) return u;
  const t = new du();
  return t.parse(u, e), t;
}
du.prototype.parse = function(u, e) {
  let t, n, r, c = u;
  if (c = c.trim(), !e && u.split("#").length === 1) {
    const s = ne.exec(c);
    if (s)
      return this.pathname = s[1], s[2] && (this.search = s[2]), this;
  }
  let i = ee.exec(c);
  if (i && (i = i[0], t = i.toLowerCase(), this.protocol = i, c = c.substr(i.length)), (e || i || c.match(/^\/\/[^@\/]+@[^@\/]+/)) && (r = c.substr(0, 2) === "//", r && !(i && Gu[i]) && (c = c.substr(2), this.slashes = !0)), !Gu[i] && (r || i && !Wu[i])) {
    let s = -1;
    for (let l = 0; l < Zu.length; l++)
      n = c.indexOf(Zu[l]), n !== -1 && (s === -1 || n < s) && (s = n);
    let f, d;
    s === -1 ? d = c.lastIndexOf("@") : d = c.lastIndexOf("@", s), d !== -1 && (f = c.slice(0, d), c = c.slice(d + 1), this.auth = f), s = -1;
    for (let l = 0; l < Hu.length; l++)
      n = c.indexOf(Hu[l]), n !== -1 && (s === -1 || n < s) && (s = n);
    s === -1 && (s = c.length), c[s - 1] === ":" && s--;
    const b = c.slice(0, s);
    c = c.slice(s), this.parseHost(b), this.hostname = this.hostname || "";
    const h = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!h) {
      const l = this.hostname.split(/\./);
      for (let g = 0, p = l.length; g < p; g++) {
        const k = l[g];
        if (k && !k.match(Vu)) {
          let x = "";
          for (let m = 0, _ = k.length; m < _; m++)
            k.charCodeAt(m) > 127 ? x += "x" : x += k[m];
          if (!x.match(Vu)) {
            const m = l.slice(0, g), _ = l.slice(g + 1), D = k.match(ae);
            D && (m.push(D[1]), _.unshift(D[2])), _.length && (c = _.join(".") + c), this.hostname = m.join(".");
            break;
          }
        }
      }
    }
    this.hostname.length > oe && (this.hostname = ""), h && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
  }
  const o = c.indexOf("#");
  o !== -1 && (this.hash = c.substr(o), c = c.slice(0, o));
  const a = c.indexOf("?");
  return a !== -1 && (this.search = c.substr(a), c = c.slice(0, a)), c && (this.pathname = c), Wu[t] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
du.prototype.parseHost = function(u) {
  let e = te.exec(u);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), u = u.substr(0, u.length - e.length)), u && (this.hostname = u);
};
const se = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: K,
  encode: iu,
  format: Bu,
  parse: Mu
}, Symbol.toStringTag, { value: "Module" })), s0 = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, l0 = /[\0-\x1F\x7F-\x9F]/, le = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, zu = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, f0 = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, d0 = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, fe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: s0,
  Cc: l0,
  Cf: le,
  P: zu,
  S: f0,
  Z: d0
}, Symbol.toStringTag, { value: "Module" })), de = new Uint16Array(
  // prettier-ignore
  'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((u) => u.charCodeAt(0))
), he = new Uint16Array(
  // prettier-ignore
  "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((u) => u.charCodeAt(0))
);
var Du;
const be = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]), pe = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (Du = String.fromCodePoint) !== null && Du !== void 0 ? Du : function(u) {
    let e = "";
    return u > 65535 && (u -= 65536, e += String.fromCharCode(u >>> 10 & 1023 | 55296), u = 56320 | u & 1023), e += String.fromCharCode(u), e;
  }
);
function xe(u) {
  var e;
  return u >= 55296 && u <= 57343 || u > 1114111 ? 65533 : (e = be.get(u)) !== null && e !== void 0 ? e : u;
}
var F;
(function(u) {
  u[u.NUM = 35] = "NUM", u[u.SEMI = 59] = "SEMI", u[u.EQUALS = 61] = "EQUALS", u[u.ZERO = 48] = "ZERO", u[u.NINE = 57] = "NINE", u[u.LOWER_A = 97] = "LOWER_A", u[u.LOWER_F = 102] = "LOWER_F", u[u.LOWER_X = 120] = "LOWER_X", u[u.LOWER_Z = 122] = "LOWER_Z", u[u.UPPER_A = 65] = "UPPER_A", u[u.UPPER_F = 70] = "UPPER_F", u[u.UPPER_Z = 90] = "UPPER_Z";
})(F || (F = {}));
const _e = 32;
var V;
(function(u) {
  u[u.VALUE_LENGTH = 49152] = "VALUE_LENGTH", u[u.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", u[u.JUMP_TABLE = 127] = "JUMP_TABLE";
})(V || (V = {}));
function vu(u) {
  return u >= F.ZERO && u <= F.NINE;
}
function me(u) {
  return u >= F.UPPER_A && u <= F.UPPER_F || u >= F.LOWER_A && u <= F.LOWER_F;
}
function ge(u) {
  return u >= F.UPPER_A && u <= F.UPPER_Z || u >= F.LOWER_A && u <= F.LOWER_Z || vu(u);
}
function ke(u) {
  return u === F.EQUALS || ge(u);
}
var A;
(function(u) {
  u[u.EntityStart = 0] = "EntityStart", u[u.NumericStart = 1] = "NumericStart", u[u.NumericDecimal = 2] = "NumericDecimal", u[u.NumericHex = 3] = "NumericHex", u[u.NamedEntity = 4] = "NamedEntity";
})(A || (A = {}));
var Z;
(function(u) {
  u[u.Legacy = 0] = "Legacy", u[u.Strict = 1] = "Strict", u[u.Attribute = 2] = "Attribute";
})(Z || (Z = {}));
class De {
  constructor(e, t, n) {
    this.decodeTree = e, this.emitCodePoint = t, this.errors = n, this.state = A.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = Z.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(e) {
    this.decodeMode = e, this.state = A.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(e, t) {
    switch (this.state) {
      case A.EntityStart:
        return e.charCodeAt(t) === F.NUM ? (this.state = A.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = A.NamedEntity, this.stateNamedEntity(e, t));
      case A.NumericStart:
        return this.stateNumericStart(e, t);
      case A.NumericDecimal:
        return this.stateNumericDecimal(e, t);
      case A.NumericHex:
        return this.stateNumericHex(e, t);
      case A.NamedEntity:
        return this.stateNamedEntity(e, t);
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(e, t) {
    return t >= e.length ? -1 : (e.charCodeAt(t) | _e) === F.LOWER_X ? (this.state = A.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = A.NumericDecimal, this.stateNumericDecimal(e, t));
  }
  addToNumericResult(e, t, n, r) {
    if (t !== n) {
      const c = n - t;
      this.result = this.result * Math.pow(r, c) + parseInt(e.substr(t, c), r), this.consumed += c;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(e, t) {
    const n = t;
    for (; t < e.length; ) {
      const r = e.charCodeAt(t);
      if (vu(r) || me(r))
        t += 1;
      else
        return this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3);
    }
    return this.addToNumericResult(e, n, t, 16), -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(e, t) {
    const n = t;
    for (; t < e.length; ) {
      const r = e.charCodeAt(t);
      if (vu(r))
        t += 1;
      else
        return this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2);
    }
    return this.addToNumericResult(e, n, t, 10), -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(e, t) {
    var n;
    if (this.consumed <= t)
      return (n = this.errors) === null || n === void 0 || n.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
    if (e === F.SEMI)
      this.consumed += 1;
    else if (this.decodeMode === Z.Strict)
      return 0;
    return this.emitCodePoint(xe(this.result), this.consumed), this.errors && (e !== F.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(e, t) {
    const { decodeTree: n } = this;
    let r = n[this.treeIndex], c = (r & V.VALUE_LENGTH) >> 14;
    for (; t < e.length; t++, this.excess++) {
      const i = e.charCodeAt(t);
      if (this.treeIndex = Ce(n, r, this.treeIndex + Math.max(1, c), i), this.treeIndex < 0)
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === Z.Attribute && // We shouldn't have consumed any characters after the entity,
        (c === 0 || // And there should be no invalid characters.
        ke(i)) ? 0 : this.emitNotTerminatedNamedEntity();
      if (r = n[this.treeIndex], c = (r & V.VALUE_LENGTH) >> 14, c !== 0) {
        if (i === F.SEMI)
          return this.emitNamedEntityData(this.treeIndex, c, this.consumed + this.excess);
        this.decodeMode !== Z.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var e;
    const { result: t, decodeTree: n } = this, r = (n[t] & V.VALUE_LENGTH) >> 14;
    return this.emitNamedEntityData(t, r, this.consumed), (e = this.errors) === null || e === void 0 || e.missingSemicolonAfterCharacterReference(), this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(e, t, n) {
    const { decodeTree: r } = this;
    return this.emitCodePoint(t === 1 ? r[e] & ~V.VALUE_LENGTH : r[e + 1], n), t === 3 && this.emitCodePoint(r[e + 2], n), n;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var e;
    switch (this.state) {
      case A.NamedEntity:
        return this.result !== 0 && (this.decodeMode !== Z.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      // Otherwise, emit a numeric entity if we have one.
      case A.NumericDecimal:
        return this.emitNumericEntity(0, 2);
      case A.NumericHex:
        return this.emitNumericEntity(0, 3);
      case A.NumericStart:
        return (e = this.errors) === null || e === void 0 || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
      case A.EntityStart:
        return 0;
    }
  }
}
function h0(u) {
  let e = "";
  const t = new De(u, (n) => e += pe(n));
  return function(r, c) {
    let i = 0, o = 0;
    for (; (o = r.indexOf("&", o)) >= 0; ) {
      e += r.slice(i, o), t.startEntity(c);
      const s = t.write(
        r,
        // Skip the "&"
        o + 1
      );
      if (s < 0) {
        i = o + t.end();
        break;
      }
      i = o + s, o = s === 0 ? i + 1 : i;
    }
    const a = e + r.slice(i);
    return e = "", a;
  };
}
function Ce(u, e, t, n) {
  const r = (e & V.BRANCH_LENGTH) >> 7, c = e & V.JUMP_TABLE;
  if (r === 0)
    return c !== 0 && n === c ? t : -1;
  if (c) {
    const a = n - c;
    return a < 0 || a >= r ? -1 : u[t + a] - 1;
  }
  let i = t, o = i + r - 1;
  for (; i <= o; ) {
    const a = i + o >>> 1, s = u[a];
    if (s < n)
      i = a + 1;
    else if (s > n)
      o = a - 1;
    else
      return u[a + r];
  }
  return -1;
}
const Ee = h0(de);
h0(he);
function b0(u, e = Z.Legacy) {
  return Ee(u, e);
}
function ye(u) {
  return Object.prototype.toString.call(u);
}
function Iu(u) {
  return ye(u) === "[object String]";
}
const Ae = Object.prototype.hasOwnProperty;
function Fe(u, e) {
  return Ae.call(u, e);
}
function pu(u) {
  return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
    if (t) {
      if (typeof t != "object")
        throw new TypeError(t + "must be object");
      Object.keys(t).forEach(function(n) {
        u[n] = t[n];
      });
    }
  }), u;
}
function p0(u, e, t) {
  return [].concat(u.slice(0, e), t, u.slice(e + 1));
}
function Ru(u) {
  return !(u >= 55296 && u <= 57343 || u >= 64976 && u <= 65007 || (u & 65535) === 65535 || (u & 65535) === 65534 || u >= 0 && u <= 8 || u === 11 || u >= 14 && u <= 31 || u >= 127 && u <= 159 || u > 1114111);
}
function hu(u) {
  if (u > 65535) {
    u -= 65536;
    const e = 55296 + (u >> 10), t = 56320 + (u & 1023);
    return String.fromCharCode(e, t);
  }
  return String.fromCharCode(u);
}
const x0 = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, we = /&([a-z#][a-z0-9]{1,31});/gi, ve = new RegExp(x0.source + "|" + we.source, "gi"), Se = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function Te(u, e) {
  if (e.charCodeAt(0) === 35 && Se.test(e)) {
    const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Ru(n) ? hu(n) : u;
  }
  const t = b0(u);
  return t !== u ? t : u;
}
function Be(u) {
  return u.indexOf("\\") < 0 ? u : u.replace(x0, "$1");
}
function X(u) {
  return u.indexOf("\\") < 0 && u.indexOf("&") < 0 ? u : u.replace(ve, function(e, t, n) {
    return t || Te(e, n);
  });
}
const Me = /[&<>"]/, ze = /[&<>"]/g, Ie = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function Re(u) {
  return Ie[u];
}
function G(u) {
  return Me.test(u) ? u.replace(ze, Re) : u;
}
const qe = /[.?*+^$[\]\\(){}|-]/g;
function Le(u) {
  return u.replace(qe, "\\$&");
}
function E(u) {
  switch (u) {
    case 9:
    case 32:
      return !0;
  }
  return !1;
}
function tu(u) {
  if (u >= 8192 && u <= 8202)
    return !0;
  switch (u) {
    case 9:
    // \t
    case 10:
    // \n
    case 11:
    // \v
    case 12:
    // \f
    case 13:
    // \r
    case 32:
    case 160:
    case 5760:
    case 8239:
    case 8287:
    case 12288:
      return !0;
  }
  return !1;
}
function nu(u) {
  return zu.test(u) || f0.test(u);
}
function ru(u) {
  switch (u) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 124:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function xu(u) {
  return u = u.trim().replace(/\s+/g, " "), "ẞ".toLowerCase() === "Ṿ" && (u = u.replace(/ẞ/g, "ß")), u.toLowerCase().toUpperCase();
}
const Pe = { mdurl: se, ucmicro: fe }, Oe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayReplaceAt: p0,
  assign: pu,
  escapeHtml: G,
  escapeRE: Le,
  fromCodePoint: hu,
  has: Fe,
  isMdAsciiPunct: ru,
  isPunctChar: nu,
  isSpace: E,
  isString: Iu,
  isValidEntityCode: Ru,
  isWhiteSpace: tu,
  lib: Pe,
  normalizeReference: xu,
  unescapeAll: X,
  unescapeMd: Be
}, Symbol.toStringTag, { value: "Module" }));
function Ne(u, e, t) {
  let n, r, c, i;
  const o = u.posMax, a = u.pos;
  for (u.pos = e + 1, n = 1; u.pos < o; ) {
    if (c = u.src.charCodeAt(u.pos), c === 93 && (n--, n === 0)) {
      r = !0;
      break;
    }
    if (i = u.pos, u.md.inline.skipToken(u), c === 91) {
      if (i === u.pos - 1)
        n++;
      else if (t)
        return u.pos = a, -1;
    }
  }
  let s = -1;
  return r && (s = u.pos), u.pos = a, s;
}
function $e(u, e, t) {
  let n, r = e;
  const c = {
    ok: !1,
    pos: 0,
    str: ""
  };
  if (u.charCodeAt(r) === 60) {
    for (r++; r < t; ) {
      if (n = u.charCodeAt(r), n === 10 || n === 60)
        return c;
      if (n === 62)
        return c.pos = r + 1, c.str = X(u.slice(e + 1, r)), c.ok = !0, c;
      if (n === 92 && r + 1 < t) {
        r += 2;
        continue;
      }
      r++;
    }
    return c;
  }
  let i = 0;
  for (; r < t && (n = u.charCodeAt(r), !(n === 32 || n < 32 || n === 127)); ) {
    if (n === 92 && r + 1 < t) {
      if (u.charCodeAt(r + 1) === 32)
        break;
      r += 2;
      continue;
    }
    if (n === 40 && (i++, i > 32))
      return c;
    if (n === 41) {
      if (i === 0)
        break;
      i--;
    }
    r++;
  }
  return e === r || i !== 0 || (c.str = X(u.slice(e, r)), c.pos = r, c.ok = !0), c;
}
function je(u, e, t, n) {
  let r, c = e;
  const i = {
    // if `true`, this is a valid link title
    ok: !1,
    // if `true`, this link can be continued on the next line
    can_continue: !1,
    // if `ok`, it's the position of the first character after the closing marker
    pos: 0,
    // if `ok`, it's the unescaped title
    str: "",
    // expected closing marker character code
    marker: 0
  };
  if (n)
    i.str = n.str, i.marker = n.marker;
  else {
    if (c >= t)
      return i;
    let o = u.charCodeAt(c);
    if (o !== 34 && o !== 39 && o !== 40)
      return i;
    e++, c++, o === 40 && (o = 41), i.marker = o;
  }
  for (; c < t; ) {
    if (r = u.charCodeAt(c), r === i.marker)
      return i.pos = c + 1, i.str += X(u.slice(e, c)), i.ok = !0, i;
    if (r === 40 && i.marker === 41)
      return i;
    r === 92 && c + 1 < t && c++, c++;
  }
  return i.can_continue = !0, i.str += X(u.slice(e, c)), i;
}
const Ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseLinkDestination: $e,
  parseLinkLabel: Ne,
  parseLinkTitle: je
}, Symbol.toStringTag, { value: "Module" })), P = {};
P.code_inline = function(u, e, t, n, r) {
  const c = u[e];
  return "<code" + r.renderAttrs(c) + ">" + G(c.content) + "</code>";
};
P.code_block = function(u, e, t, n, r) {
  const c = u[e];
  return "<pre" + r.renderAttrs(c) + "><code>" + G(u[e].content) + `</code></pre>
`;
};
P.fence = function(u, e, t, n, r) {
  const c = u[e], i = c.info ? X(c.info).trim() : "";
  let o = "", a = "";
  if (i) {
    const f = i.split(/(\s+)/g);
    o = f[0], a = f.slice(2).join("");
  }
  let s;
  if (t.highlight ? s = t.highlight(c.content, o, a) || G(c.content) : s = G(c.content), s.indexOf("<pre") === 0)
    return s + `
`;
  if (i) {
    const f = c.attrIndex("class"), d = c.attrs ? c.attrs.slice() : [];
    f < 0 ? d.push(["class", t.langPrefix + o]) : (d[f] = d[f].slice(), d[f][1] += " " + t.langPrefix + o);
    const b = {
      attrs: d
    };
    return `<pre><code${r.renderAttrs(b)}>${s}</code></pre>
`;
  }
  return `<pre><code${r.renderAttrs(c)}>${s}</code></pre>
`;
};
P.image = function(u, e, t, n, r) {
  const c = u[e];
  return c.attrs[c.attrIndex("alt")][1] = r.renderInlineAsText(c.children, t, n), r.renderToken(u, e, t);
};
P.hardbreak = function(u, e, t) {
  return t.xhtmlOut ? `<br />
` : `<br>
`;
};
P.softbreak = function(u, e, t) {
  return t.breaks ? t.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
P.text = function(u, e) {
  return G(u[e].content);
};
P.html_block = function(u, e) {
  return u[e].content;
};
P.html_inline = function(u, e) {
  return u[e].content;
};
function Y() {
  this.rules = pu({}, P);
}
Y.prototype.renderAttrs = function(e) {
  let t, n, r;
  if (!e.attrs)
    return "";
  for (r = "", t = 0, n = e.attrs.length; t < n; t++)
    r += " " + G(e.attrs[t][0]) + '="' + G(e.attrs[t][1]) + '"';
  return r;
};
Y.prototype.renderToken = function(e, t, n) {
  const r = e[t];
  let c = "";
  if (r.hidden)
    return "";
  r.block && r.nesting !== -1 && t && e[t - 1].hidden && (c += `
`), c += (r.nesting === -1 ? "</" : "<") + r.tag, c += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (c += " /");
  let i = !1;
  if (r.block && (i = !0, r.nesting === 1 && t + 1 < e.length)) {
    const o = e[t + 1];
    (o.type === "inline" || o.hidden || o.nesting === -1 && o.tag === r.tag) && (i = !1);
  }
  return c += i ? `>
` : ">", c;
};
Y.prototype.renderInline = function(u, e, t) {
  let n = "";
  const r = this.rules;
  for (let c = 0, i = u.length; c < i; c++) {
    const o = u[c].type;
    typeof r[o] < "u" ? n += r[o](u, c, e, t, this) : n += this.renderToken(u, c, e);
  }
  return n;
};
Y.prototype.renderInlineAsText = function(u, e, t) {
  let n = "";
  for (let r = 0, c = u.length; r < c; r++)
    switch (u[r].type) {
      case "text":
        n += u[r].content;
        break;
      case "image":
        n += this.renderInlineAsText(u[r].children, e, t);
        break;
      case "html_inline":
      case "html_block":
        n += u[r].content;
        break;
      case "softbreak":
      case "hardbreak":
        n += `
`;
        break;
    }
  return n;
};
Y.prototype.render = function(u, e, t) {
  let n = "";
  const r = this.rules;
  for (let c = 0, i = u.length; c < i; c++) {
    const o = u[c].type;
    o === "inline" ? n += this.renderInline(u[c].children, e, t) : typeof r[o] < "u" ? n += r[o](u, c, e, t, this) : n += this.renderToken(u, c, e, t);
  }
  return n;
};
function B() {
  this.__rules__ = [], this.__cache__ = null;
}
B.prototype.__find__ = function(u) {
  for (let e = 0; e < this.__rules__.length; e++)
    if (this.__rules__[e].name === u)
      return e;
  return -1;
};
B.prototype.__compile__ = function() {
  const u = this, e = [""];
  u.__rules__.forEach(function(t) {
    t.enabled && t.alt.forEach(function(n) {
      e.indexOf(n) < 0 && e.push(n);
    });
  }), u.__cache__ = {}, e.forEach(function(t) {
    u.__cache__[t] = [], u.__rules__.forEach(function(n) {
      n.enabled && (t && n.alt.indexOf(t) < 0 || u.__cache__[t].push(n.fn));
    });
  });
};
B.prototype.at = function(u, e, t) {
  const n = this.__find__(u), r = t || {};
  if (n === -1)
    throw new Error("Parser rule not found: " + u);
  this.__rules__[n].fn = e, this.__rules__[n].alt = r.alt || [], this.__cache__ = null;
};
B.prototype.before = function(u, e, t, n) {
  const r = this.__find__(u), c = n || {};
  if (r === -1)
    throw new Error("Parser rule not found: " + u);
  this.__rules__.splice(r, 0, {
    name: e,
    enabled: !0,
    fn: t,
    alt: c.alt || []
  }), this.__cache__ = null;
};
B.prototype.after = function(u, e, t, n) {
  const r = this.__find__(u), c = n || {};
  if (r === -1)
    throw new Error("Parser rule not found: " + u);
  this.__rules__.splice(r + 1, 0, {
    name: e,
    enabled: !0,
    fn: t,
    alt: c.alt || []
  }), this.__cache__ = null;
};
B.prototype.push = function(u, e, t) {
  const n = t || {};
  this.__rules__.push({
    name: u,
    enabled: !0,
    fn: e,
    alt: n.alt || []
  }), this.__cache__ = null;
};
B.prototype.enable = function(u, e) {
  Array.isArray(u) || (u = [u]);
  const t = [];
  return u.forEach(function(n) {
    const r = this.__find__(n);
    if (r < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + n);
    }
    this.__rules__[r].enabled = !0, t.push(n);
  }, this), this.__cache__ = null, t;
};
B.prototype.enableOnly = function(u, e) {
  Array.isArray(u) || (u = [u]), this.__rules__.forEach(function(t) {
    t.enabled = !1;
  }), this.enable(u, e);
};
B.prototype.disable = function(u, e) {
  Array.isArray(u) || (u = [u]);
  const t = [];
  return u.forEach(function(n) {
    const r = this.__find__(n);
    if (r < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + n);
    }
    this.__rules__[r].enabled = !1, t.push(n);
  }, this), this.__cache__ = null, t;
};
B.prototype.getRules = function(u) {
  return this.__cache__ === null && this.__compile__(), this.__cache__[u] || [];
};
function R(u, e, t) {
  this.type = u, this.tag = e, this.attrs = null, this.map = null, this.nesting = t, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
R.prototype.attrIndex = function(e) {
  if (!this.attrs)
    return -1;
  const t = this.attrs;
  for (let n = 0, r = t.length; n < r; n++)
    if (t[n][0] === e)
      return n;
  return -1;
};
R.prototype.attrPush = function(e) {
  this.attrs ? this.attrs.push(e) : this.attrs = [e];
};
R.prototype.attrSet = function(e, t) {
  const n = this.attrIndex(e), r = [e, t];
  n < 0 ? this.attrPush(r) : this.attrs[n] = r;
};
R.prototype.attrGet = function(e) {
  const t = this.attrIndex(e);
  let n = null;
  return t >= 0 && (n = this.attrs[t][1]), n;
};
R.prototype.attrJoin = function(e, t) {
  const n = this.attrIndex(e);
  n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = this.attrs[n][1] + " " + t;
};
function _0(u, e, t) {
  this.src = u, this.env = t, this.tokens = [], this.inlineMode = !1, this.md = e;
}
_0.prototype.Token = R;
const He = /\r\n?|\n/g, Ze = /\0/g;
function Ve(u) {
  let e;
  e = u.src.replace(He, `
`), e = e.replace(Ze, "�"), u.src = e;
}
function Ge(u) {
  let e;
  u.inlineMode ? (e = new u.Token("inline", "", 0), e.content = u.src, e.map = [0, 1], e.children = [], u.tokens.push(e)) : u.md.block.parse(u.src, u.md, u.env, u.tokens);
}
function We(u) {
  const e = u.tokens;
  for (let t = 0, n = e.length; t < n; t++) {
    const r = e[t];
    r.type === "inline" && u.md.inline.parse(r.content, u.md, u.env, r.children);
  }
}
function Je(u) {
  return /^<a[>\s]/i.test(u);
}
function Qe(u) {
  return /^<\/a\s*>/i.test(u);
}
function Ke(u) {
  const e = u.tokens;
  if (u.md.options.linkify)
    for (let t = 0, n = e.length; t < n; t++) {
      if (e[t].type !== "inline" || !u.md.linkify.pretest(e[t].content))
        continue;
      let r = e[t].children, c = 0;
      for (let i = r.length - 1; i >= 0; i--) {
        const o = r[i];
        if (o.type === "link_close") {
          for (i--; r[i].level !== o.level && r[i].type !== "link_open"; )
            i--;
          continue;
        }
        if (o.type === "html_inline" && (Je(o.content) && c > 0 && c--, Qe(o.content) && c++), !(c > 0) && o.type === "text" && u.md.linkify.test(o.content)) {
          const a = o.content;
          let s = u.md.linkify.match(a);
          const f = [];
          let d = o.level, b = 0;
          s.length > 0 && s[0].index === 0 && i > 0 && r[i - 1].type === "text_special" && (s = s.slice(1));
          for (let h = 0; h < s.length; h++) {
            const l = s[h].url, g = u.md.normalizeLink(l);
            if (!u.md.validateLink(g))
              continue;
            let p = s[h].text;
            s[h].schema ? s[h].schema === "mailto:" && !/^mailto:/i.test(p) ? p = u.md.normalizeLinkText("mailto:" + p).replace(/^mailto:/, "") : p = u.md.normalizeLinkText(p) : p = u.md.normalizeLinkText("http://" + p).replace(/^http:\/\//, "");
            const k = s[h].index;
            if (k > b) {
              const D = new u.Token("text", "", 0);
              D.content = a.slice(b, k), D.level = d, f.push(D);
            }
            const x = new u.Token("link_open", "a", 1);
            x.attrs = [["href", g]], x.level = d++, x.markup = "linkify", x.info = "auto", f.push(x);
            const m = new u.Token("text", "", 0);
            m.content = p, m.level = d, f.push(m);
            const _ = new u.Token("link_close", "a", -1);
            _.level = --d, _.markup = "linkify", _.info = "auto", f.push(_), b = s[h].lastIndex;
          }
          if (b < a.length) {
            const h = new u.Token("text", "", 0);
            h.content = a.slice(b), h.level = d, f.push(h);
          }
          e[t].children = r = p0(r, i, f);
        }
      }
    }
}
const m0 = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, Xe = /\((c|tm|r)\)/i, Ye = /\((c|tm|r)\)/ig, ut = {
  c: "©",
  r: "®",
  tm: "™"
};
function et(u, e) {
  return ut[e.toLowerCase()];
}
function tt(u) {
  let e = 0;
  for (let t = u.length - 1; t >= 0; t--) {
    const n = u[t];
    n.type === "text" && !e && (n.content = n.content.replace(Ye, et)), n.type === "link_open" && n.info === "auto" && e--, n.type === "link_close" && n.info === "auto" && e++;
  }
}
function nt(u) {
  let e = 0;
  for (let t = u.length - 1; t >= 0; t--) {
    const n = u[t];
    n.type === "text" && !e && m0.test(n.content) && (n.content = n.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–")), n.type === "link_open" && n.info === "auto" && e--, n.type === "link_close" && n.info === "auto" && e++;
  }
}
function rt(u) {
  let e;
  if (u.md.options.typographer)
    for (e = u.tokens.length - 1; e >= 0; e--)
      u.tokens[e].type === "inline" && (Xe.test(u.tokens[e].content) && tt(u.tokens[e].children), m0.test(u.tokens[e].content) && nt(u.tokens[e].children));
}
const ct = /['"]/, Ju = /['"]/g, Qu = "’";
function lu(u, e, t) {
  return u.slice(0, e) + t + u.slice(e + 1);
}
function it(u, e) {
  let t;
  const n = [];
  for (let r = 0; r < u.length; r++) {
    const c = u[r], i = u[r].level;
    for (t = n.length - 1; t >= 0 && !(n[t].level <= i); t--)
      ;
    if (n.length = t + 1, c.type !== "text")
      continue;
    let o = c.content, a = 0, s = o.length;
    u:
      for (; a < s; ) {
        Ju.lastIndex = a;
        const f = Ju.exec(o);
        if (!f)
          break;
        let d = !0, b = !0;
        a = f.index + 1;
        const h = f[0] === "'";
        let l = 32;
        if (f.index - 1 >= 0)
          l = o.charCodeAt(f.index - 1);
        else
          for (t = r - 1; t >= 0 && !(u[t].type === "softbreak" || u[t].type === "hardbreak"); t--)
            if (u[t].content) {
              l = u[t].content.charCodeAt(u[t].content.length - 1);
              break;
            }
        let g = 32;
        if (a < s)
          g = o.charCodeAt(a);
        else
          for (t = r + 1; t < u.length && !(u[t].type === "softbreak" || u[t].type === "hardbreak"); t++)
            if (u[t].content) {
              g = u[t].content.charCodeAt(0);
              break;
            }
        const p = ru(l) || nu(String.fromCharCode(l)), k = ru(g) || nu(String.fromCharCode(g)), x = tu(l), m = tu(g);
        if (m ? d = !1 : k && (x || p || (d = !1)), x ? b = !1 : p && (m || k || (b = !1)), g === 34 && f[0] === '"' && l >= 48 && l <= 57 && (b = d = !1), d && b && (d = p, b = k), !d && !b) {
          h && (c.content = lu(c.content, f.index, Qu));
          continue;
        }
        if (b)
          for (t = n.length - 1; t >= 0; t--) {
            let _ = n[t];
            if (n[t].level < i)
              break;
            if (_.single === h && n[t].level === i) {
              _ = n[t];
              let D, C;
              h ? (D = e.md.options.quotes[2], C = e.md.options.quotes[3]) : (D = e.md.options.quotes[0], C = e.md.options.quotes[1]), c.content = lu(c.content, f.index, C), u[_.token].content = lu(
                u[_.token].content,
                _.pos,
                D
              ), a += C.length - 1, _.token === r && (a += D.length - 1), o = c.content, s = o.length, n.length = t;
              continue u;
            }
          }
        d ? n.push({
          token: r,
          pos: f.index,
          single: h,
          level: i
        }) : b && h && (c.content = lu(c.content, f.index, Qu));
      }
  }
}
function ot(u) {
  if (u.md.options.typographer)
    for (let e = u.tokens.length - 1; e >= 0; e--)
      u.tokens[e].type !== "inline" || !ct.test(u.tokens[e].content) || it(u.tokens[e].children, u);
}
function at(u) {
  let e, t;
  const n = u.tokens, r = n.length;
  for (let c = 0; c < r; c++) {
    if (n[c].type !== "inline") continue;
    const i = n[c].children, o = i.length;
    for (e = 0; e < o; e++)
      i[e].type === "text_special" && (i[e].type = "text");
    for (e = t = 0; e < o; e++)
      i[e].type === "text" && e + 1 < o && i[e + 1].type === "text" ? i[e + 1].content = i[e].content + i[e + 1].content : (e !== t && (i[t] = i[e]), t++);
    e !== t && (i.length = t);
  }
}
const Cu = [
  ["normalize", Ve],
  ["block", Ge],
  ["inline", We],
  ["linkify", Ke],
  ["replacements", rt],
  ["smartquotes", ot],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", at]
];
function qu() {
  this.ruler = new B();
  for (let u = 0; u < Cu.length; u++)
    this.ruler.push(Cu[u][0], Cu[u][1]);
}
qu.prototype.process = function(u) {
  const e = this.ruler.getRules("");
  for (let t = 0, n = e.length; t < n; t++)
    e[t](u);
};
qu.prototype.State = _0;
function O(u, e, t, n) {
  this.src = u, this.md = e, this.env = t, this.tokens = n, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
  const r = this.src;
  for (let c = 0, i = 0, o = 0, a = 0, s = r.length, f = !1; i < s; i++) {
    const d = r.charCodeAt(i);
    if (!f)
      if (E(d)) {
        o++, d === 9 ? a += 4 - a % 4 : a++;
        continue;
      } else
        f = !0;
    (d === 10 || i === s - 1) && (d !== 10 && i++, this.bMarks.push(c), this.eMarks.push(i), this.tShift.push(o), this.sCount.push(a), this.bsCount.push(0), f = !1, o = 0, a = 0, c = i + 1);
  }
  this.bMarks.push(r.length), this.eMarks.push(r.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
O.prototype.push = function(u, e, t) {
  const n = new R(u, e, t);
  return n.block = !0, t < 0 && this.level--, n.level = this.level, t > 0 && this.level++, this.tokens.push(n), n;
};
O.prototype.isEmpty = function(e) {
  return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
};
O.prototype.skipEmptyLines = function(e) {
  for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
    ;
  return e;
};
O.prototype.skipSpaces = function(e) {
  for (let t = this.src.length; e < t; e++) {
    const n = this.src.charCodeAt(e);
    if (!E(n))
      break;
  }
  return e;
};
O.prototype.skipSpacesBack = function(e, t) {
  if (e <= t)
    return e;
  for (; e > t; )
    if (!E(this.src.charCodeAt(--e)))
      return e + 1;
  return e;
};
O.prototype.skipChars = function(e, t) {
  for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++)
    ;
  return e;
};
O.prototype.skipCharsBack = function(e, t, n) {
  if (e <= n)
    return e;
  for (; e > n; )
    if (t !== this.src.charCodeAt(--e))
      return e + 1;
  return e;
};
O.prototype.getLines = function(e, t, n, r) {
  if (e >= t)
    return "";
  const c = new Array(t - e);
  for (let i = 0, o = e; o < t; o++, i++) {
    let a = 0;
    const s = this.bMarks[o];
    let f = s, d;
    for (o + 1 < t || r ? d = this.eMarks[o] + 1 : d = this.eMarks[o]; f < d && a < n; ) {
      const b = this.src.charCodeAt(f);
      if (E(b))
        b === 9 ? a += 4 - (a + this.bsCount[o]) % 4 : a++;
      else if (f - s < this.tShift[o])
        a++;
      else
        break;
      f++;
    }
    a > n ? c[i] = new Array(a - n + 1).join(" ") + this.src.slice(f, d) : c[i] = this.src.slice(f, d);
  }
  return c.join("");
};
O.prototype.Token = R;
const st = 65536;
function Eu(u, e) {
  const t = u.bMarks[e] + u.tShift[e], n = u.eMarks[e];
  return u.src.slice(t, n);
}
function Ku(u) {
  const e = [], t = u.length;
  let n = 0, r = u.charCodeAt(n), c = !1, i = 0, o = "";
  for (; n < t; )
    r === 124 && (c ? (o += u.substring(i, n - 1), i = n) : (e.push(o + u.substring(i, n)), o = "", i = n + 1)), c = r === 92, n++, r = u.charCodeAt(n);
  return e.push(o + u.substring(i)), e;
}
function lt(u, e, t, n) {
  if (e + 2 > t)
    return !1;
  let r = e + 1;
  if (u.sCount[r] < u.blkIndent || u.sCount[r] - u.blkIndent >= 4)
    return !1;
  let c = u.bMarks[r] + u.tShift[r];
  if (c >= u.eMarks[r])
    return !1;
  const i = u.src.charCodeAt(c++);
  if (i !== 124 && i !== 45 && i !== 58 || c >= u.eMarks[r])
    return !1;
  const o = u.src.charCodeAt(c++);
  if (o !== 124 && o !== 45 && o !== 58 && !E(o) || i === 45 && E(o))
    return !1;
  for (; c < u.eMarks[r]; ) {
    const _ = u.src.charCodeAt(c);
    if (_ !== 124 && _ !== 45 && _ !== 58 && !E(_))
      return !1;
    c++;
  }
  let a = Eu(u, e + 1), s = a.split("|");
  const f = [];
  for (let _ = 0; _ < s.length; _++) {
    const D = s[_].trim();
    if (!D) {
      if (_ === 0 || _ === s.length - 1)
        continue;
      return !1;
    }
    if (!/^:?-+:?$/.test(D))
      return !1;
    D.charCodeAt(D.length - 1) === 58 ? f.push(D.charCodeAt(0) === 58 ? "center" : "right") : D.charCodeAt(0) === 58 ? f.push("left") : f.push("");
  }
  if (a = Eu(u, e).trim(), a.indexOf("|") === -1 || u.sCount[e] - u.blkIndent >= 4)
    return !1;
  s = Ku(a), s.length && s[0] === "" && s.shift(), s.length && s[s.length - 1] === "" && s.pop();
  const d = s.length;
  if (d === 0 || d !== f.length)
    return !1;
  if (n)
    return !0;
  const b = u.parentType;
  u.parentType = "table";
  const h = u.md.block.ruler.getRules("blockquote"), l = u.push("table_open", "table", 1), g = [e, 0];
  l.map = g;
  const p = u.push("thead_open", "thead", 1);
  p.map = [e, e + 1];
  const k = u.push("tr_open", "tr", 1);
  k.map = [e, e + 1];
  for (let _ = 0; _ < s.length; _++) {
    const D = u.push("th_open", "th", 1);
    f[_] && (D.attrs = [["style", "text-align:" + f[_]]]);
    const C = u.push("inline", "", 0);
    C.content = s[_].trim(), C.children = [], u.push("th_close", "th", -1);
  }
  u.push("tr_close", "tr", -1), u.push("thead_close", "thead", -1);
  let x, m = 0;
  for (r = e + 2; r < t && !(u.sCount[r] < u.blkIndent); r++) {
    let _ = !1;
    for (let C = 0, w = h.length; C < w; C++)
      if (h[C](u, r, t, !0)) {
        _ = !0;
        break;
      }
    if (_ || (a = Eu(u, r).trim(), !a) || u.sCount[r] - u.blkIndent >= 4 || (s = Ku(a), s.length && s[0] === "" && s.shift(), s.length && s[s.length - 1] === "" && s.pop(), m += d - s.length, m > st))
      break;
    if (r === e + 2) {
      const C = u.push("tbody_open", "tbody", 1);
      C.map = x = [e + 2, 0];
    }
    const D = u.push("tr_open", "tr", 1);
    D.map = [r, r + 1];
    for (let C = 0; C < d; C++) {
      const w = u.push("td_open", "td", 1);
      f[C] && (w.attrs = [["style", "text-align:" + f[C]]]);
      const I = u.push("inline", "", 0);
      I.content = s[C] ? s[C].trim() : "", I.children = [], u.push("td_close", "td", -1);
    }
    u.push("tr_close", "tr", -1);
  }
  return x && (u.push("tbody_close", "tbody", -1), x[1] = r), u.push("table_close", "table", -1), g[1] = r, u.parentType = b, u.line = r, !0;
}
function ft(u, e, t) {
  if (u.sCount[e] - u.blkIndent < 4)
    return !1;
  let n = e + 1, r = n;
  for (; n < t; ) {
    if (u.isEmpty(n)) {
      n++;
      continue;
    }
    if (u.sCount[n] - u.blkIndent >= 4) {
      n++, r = n;
      continue;
    }
    break;
  }
  u.line = r;
  const c = u.push("code_block", "code", 0);
  return c.content = u.getLines(e, r, 4 + u.blkIndent, !1) + `
`, c.map = [e, u.line], !0;
}
function dt(u, e, t, n) {
  let r = u.bMarks[e] + u.tShift[e], c = u.eMarks[e];
  if (u.sCount[e] - u.blkIndent >= 4 || r + 3 > c)
    return !1;
  const i = u.src.charCodeAt(r);
  if (i !== 126 && i !== 96)
    return !1;
  let o = r;
  r = u.skipChars(r, i);
  let a = r - o;
  if (a < 3)
    return !1;
  const s = u.src.slice(o, r), f = u.src.slice(r, c);
  if (i === 96 && f.indexOf(String.fromCharCode(i)) >= 0)
    return !1;
  if (n)
    return !0;
  let d = e, b = !1;
  for (; d++, !(d >= t || (r = o = u.bMarks[d] + u.tShift[d], c = u.eMarks[d], r < c && u.sCount[d] < u.blkIndent)); )
    if (u.src.charCodeAt(r) === i && !(u.sCount[d] - u.blkIndent >= 4) && (r = u.skipChars(r, i), !(r - o < a) && (r = u.skipSpaces(r), !(r < c)))) {
      b = !0;
      break;
    }
  a = u.sCount[e], u.line = d + (b ? 1 : 0);
  const h = u.push("fence", "code", 0);
  return h.info = f, h.content = u.getLines(e + 1, d, a, !0), h.markup = s, h.map = [e, u.line], !0;
}
function ht(u, e, t, n) {
  let r = u.bMarks[e] + u.tShift[e], c = u.eMarks[e];
  const i = u.lineMax;
  if (u.sCount[e] - u.blkIndent >= 4 || u.src.charCodeAt(r) !== 62)
    return !1;
  if (n)
    return !0;
  const o = [], a = [], s = [], f = [], d = u.md.block.ruler.getRules("blockquote"), b = u.parentType;
  u.parentType = "blockquote";
  let h = !1, l;
  for (l = e; l < t; l++) {
    const m = u.sCount[l] < u.blkIndent;
    if (r = u.bMarks[l] + u.tShift[l], c = u.eMarks[l], r >= c)
      break;
    if (u.src.charCodeAt(r++) === 62 && !m) {
      let D = u.sCount[l] + 1, C, w;
      u.src.charCodeAt(r) === 32 ? (r++, D++, w = !1, C = !0) : u.src.charCodeAt(r) === 9 ? (C = !0, (u.bsCount[l] + D) % 4 === 3 ? (r++, D++, w = !1) : w = !0) : C = !1;
      let I = D;
      for (o.push(u.bMarks[l]), u.bMarks[l] = r; r < c; ) {
        const N = u.src.charCodeAt(r);
        if (E(N))
          N === 9 ? I += 4 - (I + u.bsCount[l] + (w ? 1 : 0)) % 4 : I++;
        else
          break;
        r++;
      }
      h = r >= c, a.push(u.bsCount[l]), u.bsCount[l] = u.sCount[l] + 1 + (C ? 1 : 0), s.push(u.sCount[l]), u.sCount[l] = I - D, f.push(u.tShift[l]), u.tShift[l] = r - u.bMarks[l];
      continue;
    }
    if (h)
      break;
    let _ = !1;
    for (let D = 0, C = d.length; D < C; D++)
      if (d[D](u, l, t, !0)) {
        _ = !0;
        break;
      }
    if (_) {
      u.lineMax = l, u.blkIndent !== 0 && (o.push(u.bMarks[l]), a.push(u.bsCount[l]), f.push(u.tShift[l]), s.push(u.sCount[l]), u.sCount[l] -= u.blkIndent);
      break;
    }
    o.push(u.bMarks[l]), a.push(u.bsCount[l]), f.push(u.tShift[l]), s.push(u.sCount[l]), u.sCount[l] = -1;
  }
  const g = u.blkIndent;
  u.blkIndent = 0;
  const p = u.push("blockquote_open", "blockquote", 1);
  p.markup = ">";
  const k = [e, 0];
  p.map = k, u.md.block.tokenize(u, e, l);
  const x = u.push("blockquote_close", "blockquote", -1);
  x.markup = ">", u.lineMax = i, u.parentType = b, k[1] = u.line;
  for (let m = 0; m < f.length; m++)
    u.bMarks[m + e] = o[m], u.tShift[m + e] = f[m], u.sCount[m + e] = s[m], u.bsCount[m + e] = a[m];
  return u.blkIndent = g, !0;
}
function bt(u, e, t, n) {
  const r = u.eMarks[e];
  if (u.sCount[e] - u.blkIndent >= 4)
    return !1;
  let c = u.bMarks[e] + u.tShift[e];
  const i = u.src.charCodeAt(c++);
  if (i !== 42 && i !== 45 && i !== 95)
    return !1;
  let o = 1;
  for (; c < r; ) {
    const s = u.src.charCodeAt(c++);
    if (s !== i && !E(s))
      return !1;
    s === i && o++;
  }
  if (o < 3)
    return !1;
  if (n)
    return !0;
  u.line = e + 1;
  const a = u.push("hr", "hr", 0);
  return a.map = [e, u.line], a.markup = Array(o + 1).join(String.fromCharCode(i)), !0;
}
function Xu(u, e) {
  const t = u.eMarks[e];
  let n = u.bMarks[e] + u.tShift[e];
  const r = u.src.charCodeAt(n++);
  if (r !== 42 && r !== 45 && r !== 43)
    return -1;
  if (n < t) {
    const c = u.src.charCodeAt(n);
    if (!E(c))
      return -1;
  }
  return n;
}
function Yu(u, e) {
  const t = u.bMarks[e] + u.tShift[e], n = u.eMarks[e];
  let r = t;
  if (r + 1 >= n)
    return -1;
  let c = u.src.charCodeAt(r++);
  if (c < 48 || c > 57)
    return -1;
  for (; ; ) {
    if (r >= n)
      return -1;
    if (c = u.src.charCodeAt(r++), c >= 48 && c <= 57) {
      if (r - t >= 10)
        return -1;
      continue;
    }
    if (c === 41 || c === 46)
      break;
    return -1;
  }
  return r < n && (c = u.src.charCodeAt(r), !E(c)) ? -1 : r;
}
function pt(u, e) {
  const t = u.level + 2;
  for (let n = e + 2, r = u.tokens.length - 2; n < r; n++)
    u.tokens[n].level === t && u.tokens[n].type === "paragraph_open" && (u.tokens[n + 2].hidden = !0, u.tokens[n].hidden = !0, n += 2);
}
function xt(u, e, t, n) {
  let r, c, i, o, a = e, s = !0;
  if (u.sCount[a] - u.blkIndent >= 4 || u.listIndent >= 0 && u.sCount[a] - u.listIndent >= 4 && u.sCount[a] < u.blkIndent)
    return !1;
  let f = !1;
  n && u.parentType === "paragraph" && u.sCount[a] >= u.blkIndent && (f = !0);
  let d, b, h;
  if ((h = Yu(u, a)) >= 0) {
    if (d = !0, i = u.bMarks[a] + u.tShift[a], b = Number(u.src.slice(i, h - 1)), f && b !== 1) return !1;
  } else if ((h = Xu(u, a)) >= 0)
    d = !1;
  else
    return !1;
  if (f && u.skipSpaces(h) >= u.eMarks[a])
    return !1;
  if (n)
    return !0;
  const l = u.src.charCodeAt(h - 1), g = u.tokens.length;
  d ? (o = u.push("ordered_list_open", "ol", 1), b !== 1 && (o.attrs = [["start", b]])) : o = u.push("bullet_list_open", "ul", 1);
  const p = [a, 0];
  o.map = p, o.markup = String.fromCharCode(l);
  let k = !1;
  const x = u.md.block.ruler.getRules("list"), m = u.parentType;
  for (u.parentType = "list"; a < t; ) {
    c = h, r = u.eMarks[a];
    const _ = u.sCount[a] + h - (u.bMarks[a] + u.tShift[a]);
    let D = _;
    for (; c < r; ) {
      const W = u.src.charCodeAt(c);
      if (W === 9)
        D += 4 - (D + u.bsCount[a]) % 4;
      else if (W === 32)
        D++;
      else
        break;
      c++;
    }
    const C = c;
    let w;
    C >= r ? w = 1 : w = D - _, w > 4 && (w = 1);
    const I = _ + w;
    o = u.push("list_item_open", "li", 1), o.markup = String.fromCharCode(l);
    const N = [a, 0];
    o.map = N, d && (o.info = u.src.slice(i, h - 1));
    const uu = u.tight, gu = u.tShift[a], R0 = u.sCount[a], q0 = u.listIndent;
    if (u.listIndent = u.blkIndent, u.blkIndent = I, u.tight = !0, u.tShift[a] = C - u.bMarks[a], u.sCount[a] = D, C >= r && u.isEmpty(a + 1) ? u.line = Math.min(u.line + 2, t) : u.md.block.tokenize(u, a, t, !0), (!u.tight || k) && (s = !1), k = u.line - a > 1 && u.isEmpty(u.line - 1), u.blkIndent = u.listIndent, u.listIndent = q0, u.tShift[a] = gu, u.sCount[a] = R0, u.tight = uu, o = u.push("list_item_close", "li", -1), o.markup = String.fromCharCode(l), a = u.line, N[1] = a, a >= t || u.sCount[a] < u.blkIndent || u.sCount[a] - u.blkIndent >= 4)
      break;
    let Ou = !1;
    for (let W = 0, L0 = x.length; W < L0; W++)
      if (x[W](u, a, t, !0)) {
        Ou = !0;
        break;
      }
    if (Ou)
      break;
    if (d) {
      if (h = Yu(u, a), h < 0)
        break;
      i = u.bMarks[a] + u.tShift[a];
    } else if (h = Xu(u, a), h < 0)
      break;
    if (l !== u.src.charCodeAt(h - 1))
      break;
  }
  return d ? o = u.push("ordered_list_close", "ol", -1) : o = u.push("bullet_list_close", "ul", -1), o.markup = String.fromCharCode(l), p[1] = a, u.line = a, u.parentType = m, s && pt(u, g), !0;
}
function _t(u, e, t, n) {
  let r = u.bMarks[e] + u.tShift[e], c = u.eMarks[e], i = e + 1;
  if (u.sCount[e] - u.blkIndent >= 4 || u.src.charCodeAt(r) !== 91)
    return !1;
  function o(x) {
    const m = u.lineMax;
    if (x >= m || u.isEmpty(x))
      return null;
    let _ = !1;
    if (u.sCount[x] - u.blkIndent > 3 && (_ = !0), u.sCount[x] < 0 && (_ = !0), !_) {
      const w = u.md.block.ruler.getRules("reference"), I = u.parentType;
      u.parentType = "reference";
      let N = !1;
      for (let uu = 0, gu = w.length; uu < gu; uu++)
        if (w[uu](u, x, m, !0)) {
          N = !0;
          break;
        }
      if (u.parentType = I, N)
        return null;
    }
    const D = u.bMarks[x] + u.tShift[x], C = u.eMarks[x];
    return u.src.slice(D, C + 1);
  }
  let a = u.src.slice(r, c + 1);
  c = a.length;
  let s = -1;
  for (r = 1; r < c; r++) {
    const x = a.charCodeAt(r);
    if (x === 91)
      return !1;
    if (x === 93) {
      s = r;
      break;
    } else if (x === 10) {
      const m = o(i);
      m !== null && (a += m, c = a.length, i++);
    } else if (x === 92 && (r++, r < c && a.charCodeAt(r) === 10)) {
      const m = o(i);
      m !== null && (a += m, c = a.length, i++);
    }
  }
  if (s < 0 || a.charCodeAt(s + 1) !== 58)
    return !1;
  for (r = s + 2; r < c; r++) {
    const x = a.charCodeAt(r);
    if (x === 10) {
      const m = o(i);
      m !== null && (a += m, c = a.length, i++);
    } else if (!E(x)) break;
  }
  const f = u.md.helpers.parseLinkDestination(a, r, c);
  if (!f.ok)
    return !1;
  const d = u.md.normalizeLink(f.str);
  if (!u.md.validateLink(d))
    return !1;
  r = f.pos;
  const b = r, h = i, l = r;
  for (; r < c; r++) {
    const x = a.charCodeAt(r);
    if (x === 10) {
      const m = o(i);
      m !== null && (a += m, c = a.length, i++);
    } else if (!E(x)) break;
  }
  let g = u.md.helpers.parseLinkTitle(a, r, c);
  for (; g.can_continue; ) {
    const x = o(i);
    if (x === null) break;
    a += x, r = c, c = a.length, i++, g = u.md.helpers.parseLinkTitle(a, r, c, g);
  }
  let p;
  for (r < c && l !== r && g.ok ? (p = g.str, r = g.pos) : (p = "", r = b, i = h); r < c; ) {
    const x = a.charCodeAt(r);
    if (!E(x))
      break;
    r++;
  }
  if (r < c && a.charCodeAt(r) !== 10 && p)
    for (p = "", r = b, i = h; r < c; ) {
      const x = a.charCodeAt(r);
      if (!E(x))
        break;
      r++;
    }
  if (r < c && a.charCodeAt(r) !== 10)
    return !1;
  const k = xu(a.slice(1, s));
  return k ? (n || (typeof u.env.references > "u" && (u.env.references = {}), typeof u.env.references[k] > "u" && (u.env.references[k] = { title: p, href: d }), u.line = i), !0) : !1;
}
const mt = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], gt = "[a-zA-Z_:][a-zA-Z0-9:._-]*", kt = "[^\"'=<>`\\x00-\\x20]+", Dt = "'[^']*'", Ct = '"[^"]*"', Et = "(?:" + kt + "|" + Dt + "|" + Ct + ")", yt = "(?:\\s+" + gt + "(?:\\s*=\\s*" + Et + ")?)", g0 = "<[A-Za-z][A-Za-z0-9\\-]*" + yt + "*\\s*\\/?>", k0 = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", At = "<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->", Ft = "<[?][\\s\\S]*?[?]>", wt = "<![A-Za-z][^>]*>", vt = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", St = new RegExp("^(?:" + g0 + "|" + k0 + "|" + At + "|" + Ft + "|" + wt + "|" + vt + ")"), Tt = new RegExp("^(?:" + g0 + "|" + k0 + ")"), J = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
  [/^<!--/, /-->/, !0],
  [/^<\?/, /\?>/, !0],
  [/^<![A-Z]/, />/, !0],
  [/^<!\[CDATA\[/, /\]\]>/, !0],
  [new RegExp("^</?(" + mt.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
  [new RegExp(Tt.source + "\\s*$"), /^$/, !1]
];
function Bt(u, e, t, n) {
  let r = u.bMarks[e] + u.tShift[e], c = u.eMarks[e];
  if (u.sCount[e] - u.blkIndent >= 4 || !u.md.options.html || u.src.charCodeAt(r) !== 60)
    return !1;
  let i = u.src.slice(r, c), o = 0;
  for (; o < J.length && !J[o][0].test(i); o++)
    ;
  if (o === J.length)
    return !1;
  if (n)
    return J[o][2];
  let a = e + 1;
  if (!J[o][1].test(i)) {
    for (; a < t && !(u.sCount[a] < u.blkIndent); a++)
      if (r = u.bMarks[a] + u.tShift[a], c = u.eMarks[a], i = u.src.slice(r, c), J[o][1].test(i)) {
        i.length !== 0 && a++;
        break;
      }
  }
  u.line = a;
  const s = u.push("html_block", "", 0);
  return s.map = [e, a], s.content = u.getLines(e, a, u.blkIndent, !0), !0;
}
function Mt(u, e, t, n) {
  let r = u.bMarks[e] + u.tShift[e], c = u.eMarks[e];
  if (u.sCount[e] - u.blkIndent >= 4)
    return !1;
  let i = u.src.charCodeAt(r);
  if (i !== 35 || r >= c)
    return !1;
  let o = 1;
  for (i = u.src.charCodeAt(++r); i === 35 && r < c && o <= 6; )
    o++, i = u.src.charCodeAt(++r);
  if (o > 6 || r < c && !E(i))
    return !1;
  if (n)
    return !0;
  c = u.skipSpacesBack(c, r);
  const a = u.skipCharsBack(c, 35, r);
  a > r && E(u.src.charCodeAt(a - 1)) && (c = a), u.line = e + 1;
  const s = u.push("heading_open", "h" + String(o), 1);
  s.markup = "########".slice(0, o), s.map = [e, u.line];
  const f = u.push("inline", "", 0);
  f.content = u.src.slice(r, c).trim(), f.map = [e, u.line], f.children = [];
  const d = u.push("heading_close", "h" + String(o), -1);
  return d.markup = "########".slice(0, o), !0;
}
function zt(u, e, t) {
  const n = u.md.block.ruler.getRules("paragraph");
  if (u.sCount[e] - u.blkIndent >= 4)
    return !1;
  const r = u.parentType;
  u.parentType = "paragraph";
  let c = 0, i, o = e + 1;
  for (; o < t && !u.isEmpty(o); o++) {
    if (u.sCount[o] - u.blkIndent > 3)
      continue;
    if (u.sCount[o] >= u.blkIndent) {
      let h = u.bMarks[o] + u.tShift[o];
      const l = u.eMarks[o];
      if (h < l && (i = u.src.charCodeAt(h), (i === 45 || i === 61) && (h = u.skipChars(h, i), h = u.skipSpaces(h), h >= l))) {
        c = i === 61 ? 1 : 2;
        break;
      }
    }
    if (u.sCount[o] < 0)
      continue;
    let b = !1;
    for (let h = 0, l = n.length; h < l; h++)
      if (n[h](u, o, t, !0)) {
        b = !0;
        break;
      }
    if (b)
      break;
  }
  if (!c)
    return !1;
  const a = u.getLines(e, o, u.blkIndent, !1).trim();
  u.line = o + 1;
  const s = u.push("heading_open", "h" + String(c), 1);
  s.markup = String.fromCharCode(i), s.map = [e, u.line];
  const f = u.push("inline", "", 0);
  f.content = a, f.map = [e, u.line - 1], f.children = [];
  const d = u.push("heading_close", "h" + String(c), -1);
  return d.markup = String.fromCharCode(i), u.parentType = r, !0;
}
function It(u, e, t) {
  const n = u.md.block.ruler.getRules("paragraph"), r = u.parentType;
  let c = e + 1;
  for (u.parentType = "paragraph"; c < t && !u.isEmpty(c); c++) {
    if (u.sCount[c] - u.blkIndent > 3 || u.sCount[c] < 0)
      continue;
    let s = !1;
    for (let f = 0, d = n.length; f < d; f++)
      if (n[f](u, c, t, !0)) {
        s = !0;
        break;
      }
    if (s)
      break;
  }
  const i = u.getLines(e, c, u.blkIndent, !1).trim();
  u.line = c;
  const o = u.push("paragraph_open", "p", 1);
  o.map = [e, u.line];
  const a = u.push("inline", "", 0);
  return a.content = i, a.map = [e, u.line], a.children = [], u.push("paragraph_close", "p", -1), u.parentType = r, !0;
}
const fu = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", lt, ["paragraph", "reference"]],
  ["code", ft],
  ["fence", dt, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", ht, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", bt, ["paragraph", "reference", "blockquote", "list"]],
  ["list", xt, ["paragraph", "reference", "blockquote"]],
  ["reference", _t],
  ["html_block", Bt, ["paragraph", "reference", "blockquote"]],
  ["heading", Mt, ["paragraph", "reference", "blockquote"]],
  ["lheading", zt],
  ["paragraph", It]
];
function _u() {
  this.ruler = new B();
  for (let u = 0; u < fu.length; u++)
    this.ruler.push(fu[u][0], fu[u][1], { alt: (fu[u][2] || []).slice() });
}
_u.prototype.tokenize = function(u, e, t) {
  const n = this.ruler.getRules(""), r = n.length, c = u.md.options.maxNesting;
  let i = e, o = !1;
  for (; i < t && (u.line = i = u.skipEmptyLines(i), !(i >= t || u.sCount[i] < u.blkIndent)); ) {
    if (u.level >= c) {
      u.line = t;
      break;
    }
    const a = u.line;
    let s = !1;
    for (let f = 0; f < r; f++)
      if (s = n[f](u, i, t, !1), s) {
        if (a >= u.line)
          throw new Error("block rule didn't increment state.line");
        break;
      }
    if (!s) throw new Error("none of the block rules matched");
    u.tight = !o, u.isEmpty(u.line - 1) && (o = !0), i = u.line, i < t && u.isEmpty(i) && (o = !0, i++, u.line = i);
  }
};
_u.prototype.parse = function(u, e, t, n) {
  if (!u)
    return;
  const r = new this.State(u, e, t, n);
  this.tokenize(r, r.line, r.lineMax);
};
_u.prototype.State = O;
function ou(u, e, t, n) {
  this.src = u, this.env = t, this.md = e, this.tokens = n, this.tokens_meta = Array(n.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
ou.prototype.pushPending = function() {
  const u = new R("text", "", 0);
  return u.content = this.pending, u.level = this.pendingLevel, this.tokens.push(u), this.pending = "", u;
};
ou.prototype.push = function(u, e, t) {
  this.pending && this.pushPending();
  const n = new R(u, e, t);
  let r = null;
  return t < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), n.level = this.level, t > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], r = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(n), this.tokens_meta.push(r), n;
};
ou.prototype.scanDelims = function(u, e) {
  const t = this.posMax, n = this.src.charCodeAt(u), r = u > 0 ? this.src.charCodeAt(u - 1) : 32;
  let c = u;
  for (; c < t && this.src.charCodeAt(c) === n; )
    c++;
  const i = c - u, o = c < t ? this.src.charCodeAt(c) : 32, a = ru(r) || nu(String.fromCharCode(r)), s = ru(o) || nu(String.fromCharCode(o)), f = tu(r), d = tu(o), b = !d && (!s || f || a), h = !f && (!a || d || s);
  return { can_open: b && (e || !h || a), can_close: h && (e || !b || s), length: i };
};
ou.prototype.Token = R;
function Rt(u) {
  switch (u) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function qt(u, e) {
  let t = u.pos;
  for (; t < u.posMax && !Rt(u.src.charCodeAt(t)); )
    t++;
  return t === u.pos ? !1 : (e || (u.pending += u.src.slice(u.pos, t)), u.pos = t, !0);
}
const Lt = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function Pt(u, e) {
  if (!u.md.options.linkify || u.linkLevel > 0) return !1;
  const t = u.pos, n = u.posMax;
  if (t + 3 > n || u.src.charCodeAt(t) !== 58 || u.src.charCodeAt(t + 1) !== 47 || u.src.charCodeAt(t + 2) !== 47) return !1;
  const r = u.pending.match(Lt);
  if (!r) return !1;
  const c = r[1], i = u.md.linkify.matchAtStart(u.src.slice(t - c.length));
  if (!i) return !1;
  let o = i.url;
  if (o.length <= c.length) return !1;
  o = o.replace(/\*+$/, "");
  const a = u.md.normalizeLink(o);
  if (!u.md.validateLink(a)) return !1;
  if (!e) {
    u.pending = u.pending.slice(0, -c.length);
    const s = u.push("link_open", "a", 1);
    s.attrs = [["href", a]], s.markup = "linkify", s.info = "auto";
    const f = u.push("text", "", 0);
    f.content = u.md.normalizeLinkText(o);
    const d = u.push("link_close", "a", -1);
    d.markup = "linkify", d.info = "auto";
  }
  return u.pos += o.length - c.length, !0;
}
function Ot(u, e) {
  let t = u.pos;
  if (u.src.charCodeAt(t) !== 10)
    return !1;
  const n = u.pending.length - 1, r = u.posMax;
  if (!e)
    if (n >= 0 && u.pending.charCodeAt(n) === 32)
      if (n >= 1 && u.pending.charCodeAt(n - 1) === 32) {
        let c = n - 1;
        for (; c >= 1 && u.pending.charCodeAt(c - 1) === 32; ) c--;
        u.pending = u.pending.slice(0, c), u.push("hardbreak", "br", 0);
      } else
        u.pending = u.pending.slice(0, -1), u.push("softbreak", "br", 0);
    else
      u.push("softbreak", "br", 0);
  for (t++; t < r && E(u.src.charCodeAt(t)); )
    t++;
  return u.pos = t, !0;
}
const Lu = [];
for (let u = 0; u < 256; u++)
  Lu.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(u) {
  Lu[u.charCodeAt(0)] = 1;
});
function Nt(u, e) {
  let t = u.pos;
  const n = u.posMax;
  if (u.src.charCodeAt(t) !== 92 || (t++, t >= n)) return !1;
  let r = u.src.charCodeAt(t);
  if (r === 10) {
    for (e || u.push("hardbreak", "br", 0), t++; t < n && (r = u.src.charCodeAt(t), !!E(r)); )
      t++;
    return u.pos = t, !0;
  }
  let c = u.src[t];
  if (r >= 55296 && r <= 56319 && t + 1 < n) {
    const o = u.src.charCodeAt(t + 1);
    o >= 56320 && o <= 57343 && (c += u.src[t + 1], t++);
  }
  const i = "\\" + c;
  if (!e) {
    const o = u.push("text_special", "", 0);
    r < 256 && Lu[r] !== 0 ? o.content = c : o.content = i, o.markup = i, o.info = "escape";
  }
  return u.pos = t + 1, !0;
}
function $t(u, e) {
  let t = u.pos;
  if (u.src.charCodeAt(t) !== 96)
    return !1;
  const r = t;
  t++;
  const c = u.posMax;
  for (; t < c && u.src.charCodeAt(t) === 96; )
    t++;
  const i = u.src.slice(r, t), o = i.length;
  if (u.backticksScanned && (u.backticks[o] || 0) <= r)
    return e || (u.pending += i), u.pos += o, !0;
  let a = t, s;
  for (; (s = u.src.indexOf("`", a)) !== -1; ) {
    for (a = s + 1; a < c && u.src.charCodeAt(a) === 96; )
      a++;
    const f = a - s;
    if (f === o) {
      if (!e) {
        const d = u.push("code_inline", "code", 0);
        d.markup = i, d.content = u.src.slice(t, s).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
      }
      return u.pos = a, !0;
    }
    u.backticks[f] = s;
  }
  return u.backticksScanned = !0, e || (u.pending += i), u.pos += o, !0;
}
function jt(u, e) {
  const t = u.pos, n = u.src.charCodeAt(t);
  if (e || n !== 126)
    return !1;
  const r = u.scanDelims(u.pos, !0);
  let c = r.length;
  const i = String.fromCharCode(n);
  if (c < 2)
    return !1;
  let o;
  c % 2 && (o = u.push("text", "", 0), o.content = i, c--);
  for (let a = 0; a < c; a += 2)
    o = u.push("text", "", 0), o.content = i + i, u.delimiters.push({
      marker: n,
      length: 0,
      // disable "rule of 3" length checks meant for emphasis
      token: u.tokens.length - 1,
      end: -1,
      open: r.can_open,
      close: r.can_close
    });
  return u.pos += r.length, !0;
}
function u0(u, e) {
  let t;
  const n = [], r = e.length;
  for (let c = 0; c < r; c++) {
    const i = e[c];
    if (i.marker !== 126 || i.end === -1)
      continue;
    const o = e[i.end];
    t = u.tokens[i.token], t.type = "s_open", t.tag = "s", t.nesting = 1, t.markup = "~~", t.content = "", t = u.tokens[o.token], t.type = "s_close", t.tag = "s", t.nesting = -1, t.markup = "~~", t.content = "", u.tokens[o.token - 1].type === "text" && u.tokens[o.token - 1].content === "~" && n.push(o.token - 1);
  }
  for (; n.length; ) {
    const c = n.pop();
    let i = c + 1;
    for (; i < u.tokens.length && u.tokens[i].type === "s_close"; )
      i++;
    i--, c !== i && (t = u.tokens[i], u.tokens[i] = u.tokens[c], u.tokens[c] = t);
  }
}
function Ut(u) {
  const e = u.tokens_meta, t = u.tokens_meta.length;
  u0(u, u.delimiters);
  for (let n = 0; n < t; n++)
    e[n] && e[n].delimiters && u0(u, e[n].delimiters);
}
const D0 = {
  tokenize: jt,
  postProcess: Ut
};
function Ht(u, e) {
  const t = u.pos, n = u.src.charCodeAt(t);
  if (e || n !== 95 && n !== 42)
    return !1;
  const r = u.scanDelims(u.pos, n === 42);
  for (let c = 0; c < r.length; c++) {
    const i = u.push("text", "", 0);
    i.content = String.fromCharCode(n), u.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker: n,
      // Total length of these series of delimiters.
      //
      length: r.length,
      // A position of the token this delimiter corresponds to.
      //
      token: u.tokens.length - 1,
      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,
      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: r.can_open,
      close: r.can_close
    });
  }
  return u.pos += r.length, !0;
}
function e0(u, e) {
  const t = e.length;
  for (let n = t - 1; n >= 0; n--) {
    const r = e[n];
    if (r.marker !== 95 && r.marker !== 42 || r.end === -1)
      continue;
    const c = e[r.end], i = n > 0 && e[n - 1].end === r.end + 1 && // check that first two markers match and adjacent
    e[n - 1].marker === r.marker && e[n - 1].token === r.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    e[r.end + 1].token === c.token + 1, o = String.fromCharCode(r.marker), a = u.tokens[r.token];
    a.type = i ? "strong_open" : "em_open", a.tag = i ? "strong" : "em", a.nesting = 1, a.markup = i ? o + o : o, a.content = "";
    const s = u.tokens[c.token];
    s.type = i ? "strong_close" : "em_close", s.tag = i ? "strong" : "em", s.nesting = -1, s.markup = i ? o + o : o, s.content = "", i && (u.tokens[e[n - 1].token].content = "", u.tokens[e[r.end + 1].token].content = "", n--);
  }
}
function Zt(u) {
  const e = u.tokens_meta, t = u.tokens_meta.length;
  e0(u, u.delimiters);
  for (let n = 0; n < t; n++)
    e[n] && e[n].delimiters && e0(u, e[n].delimiters);
}
const C0 = {
  tokenize: Ht,
  postProcess: Zt
};
function Vt(u, e) {
  let t, n, r, c, i = "", o = "", a = u.pos, s = !0;
  if (u.src.charCodeAt(u.pos) !== 91)
    return !1;
  const f = u.pos, d = u.posMax, b = u.pos + 1, h = u.md.helpers.parseLinkLabel(u, u.pos, !0);
  if (h < 0)
    return !1;
  let l = h + 1;
  if (l < d && u.src.charCodeAt(l) === 40) {
    for (s = !1, l++; l < d && (t = u.src.charCodeAt(l), !(!E(t) && t !== 10)); l++)
      ;
    if (l >= d)
      return !1;
    if (a = l, r = u.md.helpers.parseLinkDestination(u.src, l, u.posMax), r.ok) {
      for (i = u.md.normalizeLink(r.str), u.md.validateLink(i) ? l = r.pos : i = "", a = l; l < d && (t = u.src.charCodeAt(l), !(!E(t) && t !== 10)); l++)
        ;
      if (r = u.md.helpers.parseLinkTitle(u.src, l, u.posMax), l < d && a !== l && r.ok)
        for (o = r.str, l = r.pos; l < d && (t = u.src.charCodeAt(l), !(!E(t) && t !== 10)); l++)
          ;
    }
    (l >= d || u.src.charCodeAt(l) !== 41) && (s = !0), l++;
  }
  if (s) {
    if (typeof u.env.references > "u")
      return !1;
    if (l < d && u.src.charCodeAt(l) === 91 ? (a = l + 1, l = u.md.helpers.parseLinkLabel(u, l), l >= 0 ? n = u.src.slice(a, l++) : l = h + 1) : l = h + 1, n || (n = u.src.slice(b, h)), c = u.env.references[xu(n)], !c)
      return u.pos = f, !1;
    i = c.href, o = c.title;
  }
  if (!e) {
    u.pos = b, u.posMax = h;
    const g = u.push("link_open", "a", 1), p = [["href", i]];
    g.attrs = p, o && p.push(["title", o]), u.linkLevel++, u.md.inline.tokenize(u), u.linkLevel--, u.push("link_close", "a", -1);
  }
  return u.pos = l, u.posMax = d, !0;
}
function Gt(u, e) {
  let t, n, r, c, i, o, a, s, f = "";
  const d = u.pos, b = u.posMax;
  if (u.src.charCodeAt(u.pos) !== 33 || u.src.charCodeAt(u.pos + 1) !== 91)
    return !1;
  const h = u.pos + 2, l = u.md.helpers.parseLinkLabel(u, u.pos + 1, !1);
  if (l < 0)
    return !1;
  if (c = l + 1, c < b && u.src.charCodeAt(c) === 40) {
    for (c++; c < b && (t = u.src.charCodeAt(c), !(!E(t) && t !== 10)); c++)
      ;
    if (c >= b)
      return !1;
    for (s = c, o = u.md.helpers.parseLinkDestination(u.src, c, u.posMax), o.ok && (f = u.md.normalizeLink(o.str), u.md.validateLink(f) ? c = o.pos : f = ""), s = c; c < b && (t = u.src.charCodeAt(c), !(!E(t) && t !== 10)); c++)
      ;
    if (o = u.md.helpers.parseLinkTitle(u.src, c, u.posMax), c < b && s !== c && o.ok)
      for (a = o.str, c = o.pos; c < b && (t = u.src.charCodeAt(c), !(!E(t) && t !== 10)); c++)
        ;
    else
      a = "";
    if (c >= b || u.src.charCodeAt(c) !== 41)
      return u.pos = d, !1;
    c++;
  } else {
    if (typeof u.env.references > "u")
      return !1;
    if (c < b && u.src.charCodeAt(c) === 91 ? (s = c + 1, c = u.md.helpers.parseLinkLabel(u, c), c >= 0 ? r = u.src.slice(s, c++) : c = l + 1) : c = l + 1, r || (r = u.src.slice(h, l)), i = u.env.references[xu(r)], !i)
      return u.pos = d, !1;
    f = i.href, a = i.title;
  }
  if (!e) {
    n = u.src.slice(h, l);
    const g = [];
    u.md.inline.parse(
      n,
      u.md,
      u.env,
      g
    );
    const p = u.push("image", "img", 0), k = [["src", f], ["alt", ""]];
    p.attrs = k, p.children = g, p.content = n, a && k.push(["title", a]);
  }
  return u.pos = c, u.posMax = b, !0;
}
const Wt = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Jt = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function Qt(u, e) {
  let t = u.pos;
  if (u.src.charCodeAt(t) !== 60)
    return !1;
  const n = u.pos, r = u.posMax;
  for (; ; ) {
    if (++t >= r) return !1;
    const i = u.src.charCodeAt(t);
    if (i === 60) return !1;
    if (i === 62) break;
  }
  const c = u.src.slice(n + 1, t);
  if (Jt.test(c)) {
    const i = u.md.normalizeLink(c);
    if (!u.md.validateLink(i))
      return !1;
    if (!e) {
      const o = u.push("link_open", "a", 1);
      o.attrs = [["href", i]], o.markup = "autolink", o.info = "auto";
      const a = u.push("text", "", 0);
      a.content = u.md.normalizeLinkText(c);
      const s = u.push("link_close", "a", -1);
      s.markup = "autolink", s.info = "auto";
    }
    return u.pos += c.length + 2, !0;
  }
  if (Wt.test(c)) {
    const i = u.md.normalizeLink("mailto:" + c);
    if (!u.md.validateLink(i))
      return !1;
    if (!e) {
      const o = u.push("link_open", "a", 1);
      o.attrs = [["href", i]], o.markup = "autolink", o.info = "auto";
      const a = u.push("text", "", 0);
      a.content = u.md.normalizeLinkText(c);
      const s = u.push("link_close", "a", -1);
      s.markup = "autolink", s.info = "auto";
    }
    return u.pos += c.length + 2, !0;
  }
  return !1;
}
function Kt(u) {
  return /^<a[>\s]/i.test(u);
}
function Xt(u) {
  return /^<\/a\s*>/i.test(u);
}
function Yt(u) {
  const e = u | 32;
  return e >= 97 && e <= 122;
}
function un(u, e) {
  if (!u.md.options.html)
    return !1;
  const t = u.posMax, n = u.pos;
  if (u.src.charCodeAt(n) !== 60 || n + 2 >= t)
    return !1;
  const r = u.src.charCodeAt(n + 1);
  if (r !== 33 && r !== 63 && r !== 47 && !Yt(r))
    return !1;
  const c = u.src.slice(n).match(St);
  if (!c)
    return !1;
  if (!e) {
    const i = u.push("html_inline", "", 0);
    i.content = c[0], Kt(i.content) && u.linkLevel++, Xt(i.content) && u.linkLevel--;
  }
  return u.pos += c[0].length, !0;
}
const en = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, tn = /^&([a-z][a-z0-9]{1,31});/i;
function nn(u, e) {
  const t = u.pos, n = u.posMax;
  if (u.src.charCodeAt(t) !== 38 || t + 1 >= n) return !1;
  if (u.src.charCodeAt(t + 1) === 35) {
    const c = u.src.slice(t).match(en);
    if (c) {
      if (!e) {
        const i = c[1][0].toLowerCase() === "x" ? parseInt(c[1].slice(1), 16) : parseInt(c[1], 10), o = u.push("text_special", "", 0);
        o.content = Ru(i) ? hu(i) : hu(65533), o.markup = c[0], o.info = "entity";
      }
      return u.pos += c[0].length, !0;
    }
  } else {
    const c = u.src.slice(t).match(tn);
    if (c) {
      const i = b0(c[0]);
      if (i !== c[0]) {
        if (!e) {
          const o = u.push("text_special", "", 0);
          o.content = i, o.markup = c[0], o.info = "entity";
        }
        return u.pos += c[0].length, !0;
      }
    }
  }
  return !1;
}
function t0(u) {
  const e = {}, t = u.length;
  if (!t) return;
  let n = 0, r = -2;
  const c = [];
  for (let i = 0; i < t; i++) {
    const o = u[i];
    if (c.push(0), (u[n].marker !== o.marker || r !== o.token - 1) && (n = i), r = o.token, o.length = o.length || 0, !o.close) continue;
    e.hasOwnProperty(o.marker) || (e[o.marker] = [-1, -1, -1, -1, -1, -1]);
    const a = e[o.marker][(o.open ? 3 : 0) + o.length % 3];
    let s = n - c[n] - 1, f = s;
    for (; s > a; s -= c[s] + 1) {
      const d = u[s];
      if (d.marker === o.marker && d.open && d.end < 0) {
        let b = !1;
        if ((d.close || o.open) && (d.length + o.length) % 3 === 0 && (d.length % 3 !== 0 || o.length % 3 !== 0) && (b = !0), !b) {
          const h = s > 0 && !u[s - 1].open ? c[s - 1] + 1 : 0;
          c[i] = i - s + h, c[s] = h, o.open = !1, d.end = i, d.close = !1, f = -1, r = -2;
          break;
        }
      }
    }
    f !== -1 && (e[o.marker][(o.open ? 3 : 0) + (o.length || 0) % 3] = f);
  }
}
function rn(u) {
  const e = u.tokens_meta, t = u.tokens_meta.length;
  t0(u.delimiters);
  for (let n = 0; n < t; n++)
    e[n] && e[n].delimiters && t0(e[n].delimiters);
}
function cn(u) {
  let e, t, n = 0;
  const r = u.tokens, c = u.tokens.length;
  for (e = t = 0; e < c; e++)
    r[e].nesting < 0 && n--, r[e].level = n, r[e].nesting > 0 && n++, r[e].type === "text" && e + 1 < c && r[e + 1].type === "text" ? r[e + 1].content = r[e].content + r[e + 1].content : (e !== t && (r[t] = r[e]), t++);
  e !== t && (r.length = t);
}
const yu = [
  ["text", qt],
  ["linkify", Pt],
  ["newline", Ot],
  ["escape", Nt],
  ["backticks", $t],
  ["strikethrough", D0.tokenize],
  ["emphasis", C0.tokenize],
  ["link", Vt],
  ["image", Gt],
  ["autolink", Qt],
  ["html_inline", un],
  ["entity", nn]
], Au = [
  ["balance_pairs", rn],
  ["strikethrough", D0.postProcess],
  ["emphasis", C0.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", cn]
];
function au() {
  this.ruler = new B();
  for (let u = 0; u < yu.length; u++)
    this.ruler.push(yu[u][0], yu[u][1]);
  this.ruler2 = new B();
  for (let u = 0; u < Au.length; u++)
    this.ruler2.push(Au[u][0], Au[u][1]);
}
au.prototype.skipToken = function(u) {
  const e = u.pos, t = this.ruler.getRules(""), n = t.length, r = u.md.options.maxNesting, c = u.cache;
  if (typeof c[e] < "u") {
    u.pos = c[e];
    return;
  }
  let i = !1;
  if (u.level < r) {
    for (let o = 0; o < n; o++)
      if (u.level++, i = t[o](u, !0), u.level--, i) {
        if (e >= u.pos)
          throw new Error("inline rule didn't increment state.pos");
        break;
      }
  } else
    u.pos = u.posMax;
  i || u.pos++, c[e] = u.pos;
};
au.prototype.tokenize = function(u) {
  const e = this.ruler.getRules(""), t = e.length, n = u.posMax, r = u.md.options.maxNesting;
  for (; u.pos < n; ) {
    const c = u.pos;
    let i = !1;
    if (u.level < r) {
      for (let o = 0; o < t; o++)
        if (i = e[o](u, !1), i) {
          if (c >= u.pos)
            throw new Error("inline rule didn't increment state.pos");
          break;
        }
    }
    if (i) {
      if (u.pos >= n)
        break;
      continue;
    }
    u.pending += u.src[u.pos++];
  }
  u.pending && u.pushPending();
};
au.prototype.parse = function(u, e, t, n) {
  const r = new this.State(u, e, t, n);
  this.tokenize(r);
  const c = this.ruler2.getRules(""), i = c.length;
  for (let o = 0; o < i; o++)
    c[o](r);
};
au.prototype.State = ou;
function on(u) {
  const e = {};
  u = u || {}, e.src_Any = s0.source, e.src_Cc = l0.source, e.src_Z = d0.source, e.src_P = zu.source, e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|"), e.src_ZCc = [e.src_Z, e.src_Cc].join("|");
  const t = "[><｜]";
  return e.src_pseudo_letter = "(?:(?!" + t + "|" + e.src_ZPCc + ")" + e.src_Any + ")", e.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", e.src_auth = "(?:(?:(?!" + e.src_ZCc + "|[@/\\[\\]()]).)+@)?", e.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", e.src_host_terminator = "(?=$|" + t + "|" + e.src_ZPCc + ")(?!" + (u["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + e.src_ZPCc + "))", e.src_path = "(?:[/?#](?:(?!" + e.src_ZCc + "|" + t + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + e.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + e.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + e.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + e.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + e.src_ZCc + "|[']).)+\\'|\\'(?=" + e.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + e.src_ZCc + "|[.]|$)|" + (u["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + // allow `,,,` in paths
  ",(?!" + e.src_ZCc + "|$)|;(?!" + e.src_ZCc + "|$)|\\!+(?!" + e.src_ZCc + "|[!]|$)|\\?(?!" + e.src_ZCc + "|[?]|$))+|\\/)?", e.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*', e.src_xn = "xn--[a-z0-9\\-]{1,59}", e.src_domain_root = // Allow letters & digits (http://test1)
  "(?:" + e.src_xn + "|" + e.src_pseudo_letter + "{1,63})", e.src_domain = "(?:" + e.src_xn + "|(?:" + e.src_pseudo_letter + ")|(?:" + e.src_pseudo_letter + "(?:-|" + e.src_pseudo_letter + "){0,61}" + e.src_pseudo_letter + "))", e.src_host = "(?:(?:(?:(?:" + e.src_domain + ")\\.)*" + e.src_domain + "))", e.tpl_host_fuzzy = "(?:" + e.src_ip4 + "|(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%)))", e.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%))", e.src_host_strict = e.src_host + e.src_host_terminator, e.tpl_host_fuzzy_strict = e.tpl_host_fuzzy + e.src_host_terminator, e.src_host_port_strict = e.src_host + e.src_port + e.src_host_terminator, e.tpl_host_port_fuzzy_strict = e.tpl_host_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_port_no_ip_fuzzy_strict = e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + e.src_ZPCc + "|>|$))", e.tpl_email_fuzzy = "(^|" + t + '|"|\\(|' + e.src_ZCc + ")(" + e.src_email_name + "@" + e.tpl_host_fuzzy_strict + ")", e.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_fuzzy_strict + e.src_path + ")", e.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_no_ip_fuzzy_strict + e.src_path + ")", e;
}
function Su(u) {
  return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
    t && Object.keys(t).forEach(function(n) {
      u[n] = t[n];
    });
  }), u;
}
function mu(u) {
  return Object.prototype.toString.call(u);
}
function an(u) {
  return mu(u) === "[object String]";
}
function sn(u) {
  return mu(u) === "[object Object]";
}
function ln(u) {
  return mu(u) === "[object RegExp]";
}
function n0(u) {
  return mu(u) === "[object Function]";
}
function fn(u) {
  return u.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
const E0 = {
  fuzzyLink: !0,
  fuzzyEmail: !0,
  fuzzyIP: !1
};
function dn(u) {
  return Object.keys(u || {}).reduce(function(e, t) {
    return e || E0.hasOwnProperty(t);
  }, !1);
}
const hn = {
  "http:": {
    validate: function(u, e, t) {
      const n = u.slice(e);
      return t.re.http || (t.re.http = new RegExp(
        "^\\/\\/" + t.re.src_auth + t.re.src_host_port_strict + t.re.src_path,
        "i"
      )), t.re.http.test(n) ? n.match(t.re.http)[0].length : 0;
    }
  },
  "https:": "http:",
  "ftp:": "http:",
  "//": {
    validate: function(u, e, t) {
      const n = u.slice(e);
      return t.re.no_http || (t.re.no_http = new RegExp(
        "^" + t.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
        // with code comments
        "(?:localhost|(?:(?:" + t.re.src_domain + ")\\.)+" + t.re.src_domain_root + ")" + t.re.src_port + t.re.src_host_terminator + t.re.src_path,
        "i"
      )), t.re.no_http.test(n) ? e >= 3 && u[e - 3] === ":" || e >= 3 && u[e - 3] === "/" ? 0 : n.match(t.re.no_http)[0].length : 0;
    }
  },
  "mailto:": {
    validate: function(u, e, t) {
      const n = u.slice(e);
      return t.re.mailto || (t.re.mailto = new RegExp(
        "^" + t.re.src_email_name + "@" + t.re.src_host_strict,
        "i"
      )), t.re.mailto.test(n) ? n.match(t.re.mailto)[0].length : 0;
    }
  }
}, bn = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", pn = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function xn(u) {
  u.__index__ = -1, u.__text_cache__ = "";
}
function _n(u) {
  return function(e, t) {
    const n = e.slice(t);
    return u.test(n) ? n.match(u)[0].length : 0;
  };
}
function r0() {
  return function(u, e) {
    e.normalize(u);
  };
}
function bu(u) {
  const e = u.re = on(u.__opts__), t = u.__tlds__.slice();
  u.onCompile(), u.__tlds_replaced__ || t.push(bn), t.push(e.src_xn), e.src_tlds = t.join("|");
  function n(o) {
    return o.replace("%TLDS%", e.src_tlds);
  }
  e.email_fuzzy = RegExp(n(e.tpl_email_fuzzy), "i"), e.link_fuzzy = RegExp(n(e.tpl_link_fuzzy), "i"), e.link_no_ip_fuzzy = RegExp(n(e.tpl_link_no_ip_fuzzy), "i"), e.host_fuzzy_test = RegExp(n(e.tpl_host_fuzzy_test), "i");
  const r = [];
  u.__compiled__ = {};
  function c(o, a) {
    throw new Error('(LinkifyIt) Invalid schema "' + o + '": ' + a);
  }
  Object.keys(u.__schemas__).forEach(function(o) {
    const a = u.__schemas__[o];
    if (a === null)
      return;
    const s = { validate: null, link: null };
    if (u.__compiled__[o] = s, sn(a)) {
      ln(a.validate) ? s.validate = _n(a.validate) : n0(a.validate) ? s.validate = a.validate : c(o, a), n0(a.normalize) ? s.normalize = a.normalize : a.normalize ? c(o, a) : s.normalize = r0();
      return;
    }
    if (an(a)) {
      r.push(o);
      return;
    }
    c(o, a);
  }), r.forEach(function(o) {
    u.__compiled__[u.__schemas__[o]] && (u.__compiled__[o].validate = u.__compiled__[u.__schemas__[o]].validate, u.__compiled__[o].normalize = u.__compiled__[u.__schemas__[o]].normalize);
  }), u.__compiled__[""] = { validate: null, normalize: r0() };
  const i = Object.keys(u.__compiled__).filter(function(o) {
    return o.length > 0 && u.__compiled__[o];
  }).map(fn).join("|");
  u.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "i"), u.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "ig"), u.re.schema_at_start = RegExp("^" + u.re.schema_search.source, "i"), u.re.pretest = RegExp(
    "(" + u.re.schema_test.source + ")|(" + u.re.host_fuzzy_test.source + ")|@",
    "i"
  ), xn(u);
}
function mn(u, e) {
  const t = u.__index__, n = u.__last_index__, r = u.__text_cache__.slice(t, n);
  this.schema = u.__schema__.toLowerCase(), this.index = t + e, this.lastIndex = n + e, this.raw = r, this.text = r, this.url = r;
}
function Tu(u, e) {
  const t = new mn(u, e);
  return u.__compiled__[t.schema].normalize(t, u), t;
}
function M(u, e) {
  if (!(this instanceof M))
    return new M(u, e);
  e || dn(u) && (e = u, u = {}), this.__opts__ = Su({}, E0, e), this.__index__ = -1, this.__last_index__ = -1, this.__schema__ = "", this.__text_cache__ = "", this.__schemas__ = Su({}, hn, u), this.__compiled__ = {}, this.__tlds__ = pn, this.__tlds_replaced__ = !1, this.re = {}, bu(this);
}
M.prototype.add = function(e, t) {
  return this.__schemas__[e] = t, bu(this), this;
};
M.prototype.set = function(e) {
  return this.__opts__ = Su(this.__opts__, e), this;
};
M.prototype.test = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
    return !1;
  let t, n, r, c, i, o, a, s, f;
  if (this.re.schema_test.test(e)) {
    for (a = this.re.schema_search, a.lastIndex = 0; (t = a.exec(e)) !== null; )
      if (c = this.testSchemaAt(e, t[2], a.lastIndex), c) {
        this.__schema__ = t[2], this.__index__ = t.index + t[1].length, this.__last_index__ = t.index + t[0].length + c;
        break;
      }
  }
  return this.__opts__.fuzzyLink && this.__compiled__["http:"] && (s = e.search(this.re.host_fuzzy_test), s >= 0 && (this.__index__ < 0 || s < this.__index__) && (n = e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null && (i = n.index + n[1].length, (this.__index__ < 0 || i < this.__index__) && (this.__schema__ = "", this.__index__ = i, this.__last_index__ = n.index + n[0].length))), this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && (f = e.indexOf("@"), f >= 0 && (r = e.match(this.re.email_fuzzy)) !== null && (i = r.index + r[1].length, o = r.index + r[0].length, (this.__index__ < 0 || i < this.__index__ || i === this.__index__ && o > this.__last_index__) && (this.__schema__ = "mailto:", this.__index__ = i, this.__last_index__ = o))), this.__index__ >= 0;
};
M.prototype.pretest = function(e) {
  return this.re.pretest.test(e);
};
M.prototype.testSchemaAt = function(e, t, n) {
  return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, n, this) : 0;
};
M.prototype.match = function(e) {
  const t = [];
  let n = 0;
  this.__index__ >= 0 && this.__text_cache__ === e && (t.push(Tu(this, n)), n = this.__last_index__);
  let r = n ? e.slice(n) : e;
  for (; this.test(r); )
    t.push(Tu(this, n)), r = r.slice(this.__last_index__), n += this.__last_index__;
  return t.length ? t : null;
};
M.prototype.matchAtStart = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length) return null;
  const t = this.re.schema_at_start.exec(e);
  if (!t) return null;
  const n = this.testSchemaAt(e, t[2], t[0].length);
  return n ? (this.__schema__ = t[2], this.__index__ = t.index + t[1].length, this.__last_index__ = t.index + t[0].length + n, Tu(this, 0)) : null;
};
M.prototype.tlds = function(e, t) {
  return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(n, r, c) {
    return n !== c[r - 1];
  }).reverse(), bu(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, bu(this), this);
};
M.prototype.normalize = function(e) {
  e.schema || (e.url = "http://" + e.url), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = "mailto:" + e.url);
};
M.prototype.onCompile = function() {
};
const Q = 2147483647, q = 36, Pu = 1, cu = 26, gn = 38, kn = 700, y0 = 72, A0 = 128, F0 = "-", Dn = /^xn--/, Cn = /[^\0-\x7F]/, En = /[\x2E\u3002\uFF0E\uFF61]/g, yn = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
}, Fu = q - Pu, L = Math.floor, wu = String.fromCharCode;
function H(u) {
  throw new RangeError(yn[u]);
}
function An(u, e) {
  const t = [];
  let n = u.length;
  for (; n--; )
    t[n] = e(u[n]);
  return t;
}
function w0(u, e) {
  const t = u.split("@");
  let n = "";
  t.length > 1 && (n = t[0] + "@", u = t[1]), u = u.replace(En, ".");
  const r = u.split("."), c = An(r, e).join(".");
  return n + c;
}
function v0(u) {
  const e = [];
  let t = 0;
  const n = u.length;
  for (; t < n; ) {
    const r = u.charCodeAt(t++);
    if (r >= 55296 && r <= 56319 && t < n) {
      const c = u.charCodeAt(t++);
      (c & 64512) == 56320 ? e.push(((r & 1023) << 10) + (c & 1023) + 65536) : (e.push(r), t--);
    } else
      e.push(r);
  }
  return e;
}
const Fn = (u) => String.fromCodePoint(...u), wn = function(u) {
  return u >= 48 && u < 58 ? 26 + (u - 48) : u >= 65 && u < 91 ? u - 65 : u >= 97 && u < 123 ? u - 97 : q;
}, c0 = function(u, e) {
  return u + 22 + 75 * (u < 26) - ((e != 0) << 5);
}, S0 = function(u, e, t) {
  let n = 0;
  for (u = t ? L(u / kn) : u >> 1, u += L(u / e); u > Fu * cu >> 1; n += q)
    u = L(u / Fu);
  return L(n + (Fu + 1) * u / (u + gn));
}, T0 = function(u) {
  const e = [], t = u.length;
  let n = 0, r = A0, c = y0, i = u.lastIndexOf(F0);
  i < 0 && (i = 0);
  for (let o = 0; o < i; ++o)
    u.charCodeAt(o) >= 128 && H("not-basic"), e.push(u.charCodeAt(o));
  for (let o = i > 0 ? i + 1 : 0; o < t; ) {
    const a = n;
    for (let f = 1, d = q; ; d += q) {
      o >= t && H("invalid-input");
      const b = wn(u.charCodeAt(o++));
      b >= q && H("invalid-input"), b > L((Q - n) / f) && H("overflow"), n += b * f;
      const h = d <= c ? Pu : d >= c + cu ? cu : d - c;
      if (b < h)
        break;
      const l = q - h;
      f > L(Q / l) && H("overflow"), f *= l;
    }
    const s = e.length + 1;
    c = S0(n - a, s, a == 0), L(n / s) > Q - r && H("overflow"), r += L(n / s), n %= s, e.splice(n++, 0, r);
  }
  return String.fromCodePoint(...e);
}, B0 = function(u) {
  const e = [];
  u = v0(u);
  const t = u.length;
  let n = A0, r = 0, c = y0;
  for (const a of u)
    a < 128 && e.push(wu(a));
  const i = e.length;
  let o = i;
  for (i && e.push(F0); o < t; ) {
    let a = Q;
    for (const f of u)
      f >= n && f < a && (a = f);
    const s = o + 1;
    a - n > L((Q - r) / s) && H("overflow"), r += (a - n) * s, n = a;
    for (const f of u)
      if (f < n && ++r > Q && H("overflow"), f === n) {
        let d = r;
        for (let b = q; ; b += q) {
          const h = b <= c ? Pu : b >= c + cu ? cu : b - c;
          if (d < h)
            break;
          const l = d - h, g = q - h;
          e.push(
            wu(c0(h + l % g, 0))
          ), d = L(l / g);
        }
        e.push(wu(c0(d, 0))), c = S0(r, s, o === i), r = 0, ++o;
      }
    ++r, ++n;
  }
  return e.join("");
}, vn = function(u) {
  return w0(u, function(e) {
    return Dn.test(e) ? T0(e.slice(4).toLowerCase()) : e;
  });
}, Sn = function(u) {
  return w0(u, function(e) {
    return Cn.test(e) ? "xn--" + B0(e) : e;
  });
}, M0 = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  version: "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  ucs2: {
    decode: v0,
    encode: Fn
  },
  decode: T0,
  encode: B0,
  toASCII: Sn,
  toUnicode: vn
}, Tn = {
  options: {
    // Enable HTML tags in source
    html: !1,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !1,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 100
  },
  components: {
    core: {},
    block: {},
    inline: {}
  }
}, Bn = {
  options: {
    // Enable HTML tags in source
    html: !1,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !1,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "text"
      ],
      rules2: [
        "balance_pairs",
        "fragments_join"
      ]
    }
  }
}, Mn = {
  options: {
    // Enable HTML tags in source
    html: !0,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !0,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "autolink",
        "backticks",
        "emphasis",
        "entity",
        "escape",
        "html_inline",
        "image",
        "link",
        "newline",
        "text"
      ],
      rules2: [
        "balance_pairs",
        "emphasis",
        "fragments_join"
      ]
    }
  }
}, zn = {
  default: Tn,
  zero: Bn,
  commonmark: Mn
}, In = /^(vbscript|javascript|file|data):/, Rn = /^data:image\/(gif|png|jpeg|webp);/;
function qn(u) {
  const e = u.trim().toLowerCase();
  return In.test(e) ? Rn.test(e) : !0;
}
const z0 = ["http:", "https:", "mailto:"];
function Ln(u) {
  const e = Mu(u, !0);
  if (e.hostname && (!e.protocol || z0.indexOf(e.protocol) >= 0))
    try {
      e.hostname = M0.toASCII(e.hostname);
    } catch {
    }
  return iu(Bu(e));
}
function Pn(u) {
  const e = Mu(u, !0);
  if (e.hostname && (!e.protocol || z0.indexOf(e.protocol) >= 0))
    try {
      e.hostname = M0.toUnicode(e.hostname);
    } catch {
    }
  return K(Bu(e), K.defaultChars + "%");
}
function z(u, e) {
  if (!(this instanceof z))
    return new z(u, e);
  e || Iu(u) || (e = u || {}, u = "default"), this.inline = new au(), this.block = new _u(), this.core = new qu(), this.renderer = new Y(), this.linkify = new M(), this.validateLink = qn, this.normalizeLink = Ln, this.normalizeLinkText = Pn, this.utils = Oe, this.helpers = pu({}, Ue), this.options = {}, this.configure(u), e && this.set(e);
}
z.prototype.set = function(u) {
  return pu(this.options, u), this;
};
z.prototype.configure = function(u) {
  const e = this;
  if (Iu(u)) {
    const t = u;
    if (u = zn[t], !u)
      throw new Error('Wrong `markdown-it` preset "' + t + '", check name');
  }
  if (!u)
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  return u.options && e.set(u.options), u.components && Object.keys(u.components).forEach(function(t) {
    u.components[t].rules && e[t].ruler.enableOnly(u.components[t].rules), u.components[t].rules2 && e[t].ruler2.enableOnly(u.components[t].rules2);
  }), this;
};
z.prototype.enable = function(u, e) {
  let t = [];
  Array.isArray(u) || (u = [u]), ["core", "block", "inline"].forEach(function(r) {
    t = t.concat(this[r].ruler.enable(u, !0));
  }, this), t = t.concat(this.inline.ruler2.enable(u, !0));
  const n = u.filter(function(r) {
    return t.indexOf(r) < 0;
  });
  if (n.length && !e)
    throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + n);
  return this;
};
z.prototype.disable = function(u, e) {
  let t = [];
  Array.isArray(u) || (u = [u]), ["core", "block", "inline"].forEach(function(r) {
    t = t.concat(this[r].ruler.disable(u, !0));
  }, this), t = t.concat(this.inline.ruler2.disable(u, !0));
  const n = u.filter(function(r) {
    return t.indexOf(r) < 0;
  });
  if (n.length && !e)
    throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + n);
  return this;
};
z.prototype.use = function(u) {
  const e = [this].concat(Array.prototype.slice.call(arguments, 1));
  return u.apply(u, e), this;
};
z.prototype.parse = function(u, e) {
  if (typeof u != "string")
    throw new Error("Input data should be a String");
  const t = new this.core.State(u, this, e);
  return this.core.process(t), t.tokens;
};
z.prototype.render = function(u, e) {
  return e = e || {}, this.renderer.render(this.parse(u, e), this.options, e);
};
z.prototype.parseInline = function(u, e) {
  const t = new this.core.State(u, this, e);
  return t.inlineMode = !0, this.core.process(t), t.tokens;
};
z.prototype.renderInline = function(u, e) {
  return e = e || {}, this.renderer.render(this.parseInline(u, e), this.options, e);
};
const On = new z({
  html: !1,
  // Disable HTML tags in source
  xhtmlOut: !1,
  // Use '/' to close single tags (<br />)
  breaks: !0,
  // Convert '\n' in paragraphs into <br>
  linkify: !0,
  // Autoconvert URL-like text to links
  typographer: !0,
  // Enable smartquotes and other typographic replacements
  highlight: function(u, e) {
    return `<pre class="language-${e}"><code>${u}</code></pre>`;
  }
});
function I0(u) {
  return u ? On.render(u) : "";
}
const Nn = N0({
  name: "AiChatWindow",
  props: {
    client: {
      type: Object,
      required: !0
    },
    title: {
      type: String,
      default: "Chat"
    },
    placeholder: {
      type: String,
      default: "Type a message..."
    },
    initialMessages: {
      type: Array,
      default: () => []
    },
    systemPrompt: {
      type: String,
      default: "You are a helpful assistant."
    },
    streaming: {
      type: Boolean,
      default: !0
    },
    loadingText: {
      type: String,
      default: "Thinking..."
    },
    errorText: {
      type: String,
      default: "An error occurred. Please try again."
    },
    showTimestamps: {
      type: Boolean,
      default: !1
    },
    showCopyButton: {
      type: Boolean,
      default: !0
    },
    showAvatars: {
      type: Boolean,
      default: !0
    },
    userAvatar: {
      type: String,
      default: null
    },
    assistantAvatar: {
      type: String,
      default: null
    },
    theme: {
      type: String,
      default: "light",
      validator: (u) => ["light", "dark"].includes(u)
    },
    height: {
      type: String,
      default: "500px"
    },
    width: {
      type: String,
      default: "100%"
    },
    maxWidth: {
      type: String,
      default: "800px"
    },
    persistenceKey: {
      type: String,
      default: null
    }
  },
  setup(u, { emit: e }) {
    const t = ku(""), n = ku(null), r = ku(null), c = $0(() => ({
      client: u.client,
      systemPrompt: u.systemPrompt,
      initialMessages: u.initialMessages,
      streaming: u.streaming,
      persistenceKey: u.persistenceKey
    })), {
      messages: i,
      isLoading: o,
      error: a,
      sendMessage: s,
      clearMessages: f
    } = a0(c.value), d = async () => {
      if (!t.value.trim() || o.value) return;
      const p = t.value;
      t.value = "", e("message-sent", { message: p });
      try {
        await s(p), e("response-received", { message: i.value[i.value.length - 1] });
      } catch (k) {
        e("error", { error: k });
      }
    }, b = (p) => {
      p.key === "Enter" && !p.shiftKey && (p.preventDefault(), d());
    }, h = (p) => I0(p), l = (p) => p ? new Date(p).toLocaleTimeString() : "", g = (p) => {
      navigator.clipboard.writeText(p).then(() => {
        console.log("Copied to clipboard");
      }).catch((k) => {
        console.error("Failed to copy text: ", k);
      });
    };
    return o0(i, () => {
      j0(() => {
        n.value && (n.value.scrollTop = n.value.scrollHeight);
      });
    }, { deep: !0 }), i0(() => {
      r.value && r.value.focus();
    }), {
      userInput: t,
      messages: i,
      isLoading: o,
      error: a,
      messagesContainer: n,
      inputElement: r,
      handleSendMessage: d,
      handleKeyDown: b,
      clearMessages: f,
      formatMessage: h,
      formatTimestamp: l,
      copyToClipboard: g
    };
  }
}), $n = (u, e) => {
  const t = u.__vccOpts || u;
  for (const [n, r] of e)
    t[n] = r;
  return t;
}, jn = { class: "ai-chat-window__header" }, Un = { class: "ai-chat-window__title" }, Hn = {
  class: "ai-chat-window__messages",
  ref: "messagesContainer"
}, Zn = { class: "ai-chat-window__message ai-chat-window__message--user" }, Vn = {
  key: 0,
  class: "ai-chat-window__avatar ai-chat-window__avatar--user"
}, Gn = ["src"], Wn = {
  key: 1,
  class: "ai-chat-window__avatar-placeholder"
}, Jn = { class: "ai-chat-window__message-content" }, Qn = { class: "ai-chat-window__message-text" }, Kn = {
  key: 0,
  class: "ai-chat-window__message-timestamp"
}, Xn = { class: "ai-chat-window__message ai-chat-window__message--assistant" }, Yn = {
  key: 0,
  class: "ai-chat-window__avatar ai-chat-window__avatar--assistant"
}, ur = ["src"], er = {
  key: 1,
  class: "ai-chat-window__avatar-placeholder"
}, tr = { class: "ai-chat-window__message-content" }, nr = ["innerHTML"], rr = {
  key: 0,
  class: "ai-chat-window__message-timestamp"
}, cr = ["onClick"], ir = { class: "ai-chat-window__message" }, or = { class: "ai-chat-window__message-role" }, ar = { class: "ai-chat-window__message-content" }, sr = { class: "ai-chat-window__message-text" }, lr = {
  key: 0,
  class: "ai-chat-window__loading"
}, fr = { class: "ai-chat-window__loading-text" }, dr = {
  key: 1,
  class: "ai-chat-window__error"
}, hr = { class: "ai-chat-window__error-text" }, br = { class: "ai-chat-window__input-container" }, pr = { class: "ai-chat-window__input-wrapper" }, xr = ["placeholder", "disabled"], _r = ["disabled"], mr = { class: "ai-chat-window__footer" };
function gr(u, e, t, n, r, c) {
  return T(), S("div", {
    class: U0(["ai-chat-window", { "ai-chat-window--dark": u.theme === "dark" }])
  }, [
    y("div", jn, [
      $(u.$slots, "header", {}, () => [
        y("h3", Un, j(u.title), 1)
      ])
    ]),
    y("div", Hn, [
      (T(!0), S(Nu, null, H0(u.messages, (i, o) => (T(), S(Nu, {
        key: i.id || o
      }, [
        i.role === "user" ? $(u.$slots, "user-message", {
          key: 0,
          message: i,
          index: o
        }, () => [
          y("div", Zn, [
            u.showAvatars ? (T(), S("div", Vn, [
              u.userAvatar ? (T(), S("img", {
                key: 0,
                src: u.userAvatar,
                alt: "User"
              }, null, 8, Gn)) : (T(), S("div", Wn, "U"))
            ])) : U("", !0),
            y("div", Jn, [
              y("div", Qn, j(i.content), 1),
              u.showTimestamps && i.timestamp ? (T(), S("div", Kn, j(u.formatTimestamp(i.timestamp)), 1)) : U("", !0)
            ])
          ])
        ]) : i.role === "assistant" ? $(u.$slots, "assistant-message", {
          key: 1,
          message: i,
          index: o
        }, () => [
          y("div", Xn, [
            u.showAvatars ? (T(), S("div", Yn, [
              u.assistantAvatar ? (T(), S("img", {
                key: 0,
                src: u.assistantAvatar,
                alt: "Assistant"
              }, null, 8, ur)) : (T(), S("div", er, "A"))
            ])) : U("", !0),
            y("div", tr, [
              y("div", {
                class: "ai-chat-window__message-text",
                innerHTML: u.formatMessage(i.content)
              }, null, 8, nr),
              u.showTimestamps && i.timestamp ? (T(), S("div", rr, j(u.formatTimestamp(i.timestamp)), 1)) : U("", !0),
              u.showCopyButton ? (T(), S("button", {
                key: 1,
                class: "ai-chat-window__copy-button",
                onClick: (a) => u.copyToClipboard(i.content)
              }, " Copy ", 8, cr)) : U("", !0)
            ])
          ])
        ]) : $(u.$slots, "message", {
          key: 2,
          message: i,
          index: o
        }, () => [
          y("div", ir, [
            y("div", or, j(i.role), 1),
            y("div", ar, [
              y("div", sr, j(i.content), 1)
            ])
          ])
        ])
      ], 64))), 128)),
      u.isLoading ? (T(), S("div", lr, [
        $(u.$slots, "loading", {}, () => [
          y("div", fr, j(u.loadingText), 1)
        ])
      ])) : U("", !0),
      u.error ? (T(), S("div", dr, [
        $(u.$slots, "error", { error: u.error }, () => [
          y("div", hr, j(u.errorText), 1)
        ])
      ])) : U("", !0)
    ], 512),
    y("div", br, [
      $(u.$slots, "input", {
        input: u.userInput,
        sendMessage: u.handleSendMessage
      }, () => [
        y("div", pr, [
          Z0(y("textarea", {
            "onUpdate:modelValue": e[0] || (e[0] = (i) => u.userInput = i),
            class: "ai-chat-window__input",
            placeholder: u.placeholder,
            disabled: u.isLoading,
            onKeydown: e[1] || (e[1] = V0(G0((...i) => u.handleKeyDown && u.handleKeyDown(...i), ["prevent"]), ["enter"])),
            ref: "inputElement"
          }, null, 40, xr), [
            [W0, u.userInput]
          ]),
          y("button", {
            class: "ai-chat-window__send-button",
            onClick: e[2] || (e[2] = (...i) => u.handleSendMessage && u.handleSendMessage(...i)),
            disabled: u.isLoading || !u.userInput.trim()
          }, " Send ", 8, _r)
        ])
      ])
    ]),
    y("div", mr, [
      $(u.$slots, "footer", {}, () => [
        u.messages.length > 0 ? (T(), S("button", {
          key: 0,
          class: "ai-chat-window__clear-button",
          onClick: e[3] || (e[3] = (...i) => u.clearMessages && u.clearMessages(...i))
        }, " Clear Chat ")) : U("", !0)
      ])
    ])
  ], 2);
}
const kr = /* @__PURE__ */ $n(Nn, [["render", gr]]), Dr = kr, Cr = a0, Er = {
  formatMarkdown: I0
}, Ar = {
  AiChatWindow: Dr,
  useChatEngine: Cr,
  utils: Er
};
export {
  Dr as AiChatWindow,
  Ar as default,
  Cr as useChatEngine,
  Er as utils
};

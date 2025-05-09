import { ref as K, onMounted as X, watch as H, defineComponent as Z, computed as L, nextTick as de, createElementBlock as h, openBlock as u, normalizeClass as ee, createElementVNode as t, renderSlot as f, toDisplayString as T, createCommentVNode as A, Fragment as V, renderList as ce, unref as b, withDirectives as te, withKeys as ue, withModifiers as he, vModelText as me, resolveComponent as ge, createBlock as pe, mergeProps as we, vShow as ye } from "vue";
import { v4 as O } from "uuid";
import { AIClient as Y } from "@aivue/core";
import fe from "markdown-it";
function se(e) {
  let a;
  if (e.client)
    a = e.client;
  else if (e.provider)
    a = new Y({
      provider: e.provider,
      apiKey: e.apiKey,
      model: e.model || G(e.provider),
      baseUrl: e.baseUrl,
      organizationId: e.organizationId
    });
  else
    throw new Error("Either client or provider must be specified in options");
  const {
    initialMessages: i = [],
    systemPrompt: w = "You are a helpful assistant.",
    streaming: g = !0,
    persistenceKey: p = null,
    maxMessages: v = 100,
    demoMode: d = !1,
    demoResponses: x = {},
    useProxy: $ = !1,
    proxyUrl: B = "/api/chat",
    onError: P = null,
    onMessageSent: R = null,
    onResponseReceived: y = null
  } = e, r = K([]), _ = K(!1), C = K(null), D = (o) => o.map((I) => ({
    ...I,
    id: I.id || O(),
    timestamp: I.timestamp || /* @__PURE__ */ new Date()
  }));
  X(() => {
    if (p)
      try {
        const o = localStorage.getItem(p);
        if (o) {
          r.value = D(JSON.parse(o));
          return;
        }
      } catch (o) {
        console.error("Error loading chat history:", o);
      }
    r.value = D(i);
  });
  const s = () => {
    if (p)
      try {
        localStorage.setItem(p, JSON.stringify(r.value));
      } catch (o) {
        console.error("Error saving chat history:", o);
      }
  };
  return H(r, () => {
    s();
  }, { deep: !0 }), {
    messages: r,
    isLoading: _,
    error: C,
    sendMessage: async (o) => {
      var q, J, N, F;
      if (!o.trim()) return;
      C.value = null;
      const I = {
        role: "user",
        content: o,
        id: O(),
        timestamp: /* @__PURE__ */ new Date()
      };
      r.value.push(I), R && R(I), _.value = !0;
      try {
        const E = [
          { role: "system", content: w },
          ...r.value.filter((m) => m.role === "user" || m.role === "assistant").map(({ role: m, content: k }) => ({ role: m, content: k }))
        ];
        if (d) {
          let m = "I'm a demo AI assistant. This is a simulated response.";
          const k = I.content.toLowerCase();
          for (const [n, l] of Object.entries(x))
            if (k.includes(n.toLowerCase())) {
              m = l;
              break;
            }
          if (g) {
            const n = {
              role: "assistant",
              content: "",
              id: O(),
              timestamp: /* @__PURE__ */ new Date()
            };
            r.value.push(n);
            let l = "";
            (async () => {
              for (const j of m)
                await new Promise((z) => setTimeout(z, 20)), l += j, n.content = l;
              _.value = !1, y && y(n), p && s();
            })();
            return;
          } else {
            const n = {
              role: "assistant",
              content: m,
              id: O(),
              timestamp: /* @__PURE__ */ new Date()
            };
            r.value.push(n), _.value = !1, y && y(n), p && s();
            return;
          }
        }
        if (g) {
          let m = "";
          const k = {
            role: "assistant",
            content: "",
            id: O(),
            timestamp: /* @__PURE__ */ new Date()
          };
          r.value.push(k);
          const n = {
            onStart: () => {
              console.log("Stream started");
            },
            onToken: (l) => {
              m += l;
              const M = r.value[r.value.length - 1];
              M && M.role === "assistant" && (M.content = m);
            },
            onComplete: (l) => {
              if (_.value = !1, console.log("Stream completed"), y) {
                const M = r.value[r.value.length - 1];
                M && M.role === "assistant" && y(M);
              }
              p && s();
            },
            onError: (l) => {
              console.error("Stream error:", l), C.value = l, _.value = !1, P && P(l);
            }
          };
          if ($)
            try {
              const l = await fetch(B, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  messages: E,
                  model: e.model,
                  stream: !0
                })
              });
              if (!l.ok)
                throw new Error(`Proxy request failed with status ${l.status}`);
              if (l.body) {
                const M = l.body.getReader(), j = new TextDecoder();
                for ((q = n.onStart) == null || q.call(n); ; ) {
                  const { done: z, value: re } = await M.read();
                  if (z) break;
                  const le = j.decode(re, { stream: !0 });
                  (J = n.onToken) == null || J.call(n, le);
                }
                (N = n.onComplete) == null || N.call(n, m);
              }
            } catch (l) {
              (F = n.onError) == null || F.call(n, l);
            }
          else
            await a.chatStream(E, n);
        } else {
          let m;
          if ($)
            try {
              const n = await fetch(B, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  messages: E,
                  model: e.model,
                  stream: !1
                })
              });
              if (!n.ok)
                throw new Error(`Proxy request failed with status ${n.status}`);
              const l = await n.json();
              m = l.content || l.message || l.response || "";
            } catch (n) {
              throw new Error(`Proxy request failed: ${n.message}`);
            }
          else
            m = await a.chat(E);
          const k = {
            role: "assistant",
            content: m,
            id: O(),
            timestamp: /* @__PURE__ */ new Date()
          };
          r.value.push(k), y && y(k), _.value = !1;
        }
        if (r.value.length > v) {
          const m = r.value.filter((n) => n.role === "system"), k = r.value.slice(-v);
          r.value = [...m, ...k];
        }
      } catch (E) {
        C.value = new Error(`Failed to send message: ${E.message}`), _.value = !1, P && P(C.value);
      }
    },
    clearMessages: () => {
      r.value = [], C.value = null;
    },
    setMessages: (o) => {
      r.value = D(o);
    },
    addMessage: (o) => {
      r.value.push({
        ...o,
        id: o.id || O(),
        timestamp: o.timestamp || /* @__PURE__ */ new Date()
      });
    },
    resetError: () => {
      C.value = null;
    },
    updateConfig: (o) => {
      (o.provider || o.apiKey || o.model || o.baseUrl || o.organizationId) && (a = new Y({
        provider: o.provider || e.provider,
        apiKey: o.apiKey || e.apiKey,
        model: o.model || e.model || G(o.provider || e.provider),
        baseUrl: o.baseUrl || e.baseUrl,
        organizationId: o.organizationId || e.organizationId
      })), Object.assign(e, o);
    }
  };
}
function G(e) {
  switch (e) {
    case "openai":
      return "gpt-3.5-turbo";
    case "claude":
      return "claude-3-sonnet-20240229";
    case "gemini":
      return "gemini-pro";
    case "huggingface":
      return "mistralai/Mistral-7B-Instruct-v0.2";
    case "ollama":
      return "llama2";
    case "deepseek":
      return "deepseek-chat";
    default:
      return "gpt-3.5-turbo";
  }
}
const ve = new fe({
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
  highlight: function(e, a) {
    return `<pre class="language-${a}"><code>${e}</code></pre>`;
  }
});
function ae(e) {
  return e ? ve.render(e) : "";
}
const _e = { class: "ai-chat-window__header" }, Ce = { class: "ai-chat-window__title" }, ke = { class: "ai-chat-window__message ai-chat-window__message--user" }, Me = {
  key: 0,
  class: "ai-chat-window__avatar ai-chat-window__avatar--user"
}, Se = ["src"], be = {
  key: 1,
  class: "ai-chat-window__avatar-placeholder"
}, Te = { class: "ai-chat-window__message-content" }, Ae = { class: "ai-chat-window__message-text" }, $e = {
  key: 0,
  class: "ai-chat-window__message-timestamp"
}, Ie = { class: "ai-chat-window__message ai-chat-window__message--assistant" }, Oe = {
  key: 0,
  class: "ai-chat-window__avatar ai-chat-window__avatar--assistant"
}, Ke = ["src"], Pe = {
  key: 1,
  class: "ai-chat-window__avatar-placeholder"
}, Ee = { class: "ai-chat-window__message-content" }, xe = ["innerHTML"], Be = {
  key: 0,
  class: "ai-chat-window__message-timestamp"
}, Re = ["onClick"], De = { class: "ai-chat-window__message" }, Ue = { class: "ai-chat-window__message-role" }, je = { class: "ai-chat-window__message-content" }, ze = { class: "ai-chat-window__message-text" }, Le = {
  key: 0,
  class: "ai-chat-window__loading"
}, He = { class: "ai-chat-window__loading-text" }, We = {
  key: 1,
  class: "ai-chat-window__error"
}, qe = { class: "ai-chat-window__error-text" }, Je = { class: "ai-chat-window__input-container" }, Ne = { class: "ai-chat-window__input-wrapper" }, Fe = ["placeholder", "disabled", "onKeydown"], Ve = ["disabled"], Ye = { class: "ai-chat-window__footer" }, W = /* @__PURE__ */ Z({
  __name: "AiChatWindow",
  props: {
    // Provider configuration (either client or provider is required)
    client: {
      type: Object,
      default: null
    },
    provider: {
      type: String,
      default: null
    },
    apiKey: {
      type: String,
      default: null
    },
    model: {
      type: String,
      default: null
    },
    baseUrl: {
      type: String,
      default: null
    },
    organizationId: {
      type: String,
      default: null
    },
    // API security options
    useProxy: {
      type: Boolean,
      default: !1
    },
    proxyUrl: {
      type: String,
      default: "/api/chat"
    },
    // Demo mode
    demoMode: {
      type: Boolean,
      default: !1
    },
    demoResponses: {
      type: Object,
      default: () => ({
        hello: "Hello! I'm a demo AI assistant. How can I help you today?",
        help: "I can help you with various tasks. Just ask me a question!",
        features: "This chatbot component supports markdown, code highlighting, streaming responses, and more!"
      })
    },
    // Chat configuration
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
    // UI configuration
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
      validator: (e) => ["light", "dark"].includes(e)
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
  emits: ["message-sent", "response-received", "error"],
  setup(e, { emit: a }) {
    const i = e, w = a, g = K(""), p = K(null), v = K(null);
    !i.client && !i.provider && console.error("Either client or provider must be specified in AiChatWindow props");
    const d = L(() => ({
      // Provider configuration
      client: i.client,
      provider: i.provider,
      apiKey: i.apiKey,
      model: i.model,
      baseUrl: i.baseUrl,
      organizationId: i.organizationId,
      // API security
      useProxy: i.useProxy,
      proxyUrl: i.proxyUrl,
      // Chat behavior
      systemPrompt: i.systemPrompt,
      initialMessages: i.initialMessages,
      streaming: i.streaming,
      persistenceKey: i.persistenceKey,
      demoMode: i.demoMode,
      demoResponses: i.demoResponses,
      // Callbacks
      onError: (s) => {
        w("error", { error: s });
      },
      onMessageSent: (s) => {
        w("message-sent", { message: s });
      },
      onResponseReceived: (s) => {
        w("response-received", { message: s });
      }
    })), {
      messages: x,
      isLoading: $,
      error: B,
      sendMessage: P,
      clearMessages: R
    } = se(d.value), y = async () => {
      if (!g.value.trim() || $.value) return;
      const s = g.value;
      g.value = "";
      try {
        await P(s);
      } catch {
      }
    }, r = (s) => {
      s.key === "Enter" && !s.shiftKey && (s.preventDefault(), y());
    }, _ = (s) => ae(s), C = (s) => s ? new Date(s).toLocaleTimeString() : "", D = (s) => {
      navigator.clipboard.writeText(s).then(() => {
        console.log("Copied to clipboard");
      }).catch((S) => {
        console.error("Failed to copy text: ", S);
      });
    };
    return H(x, () => {
      de(() => {
        p.value && (p.value.scrollTop = p.value.scrollHeight);
      });
    }, { deep: !0 }), X(() => {
      v.value && v.value.focus();
    }), (s, S) => (u(), h("div", {
      class: ee(["ai-chat-window", { "ai-chat-window--dark": e.theme === "dark" }])
    }, [
      t("div", _e, [
        f(s.$slots, "header", {}, () => [
          t("h3", Ce, T(e.title), 1)
        ])
      ]),
      t("div", {
        class: "ai-chat-window__messages",
        ref_key: "messagesContainer",
        ref: p
      }, [
        (u(!0), h(V, null, ce(b(x), (c, U) => (u(), h(V, {
          key: c.id || U
        }, [
          c.role === "user" ? f(s.$slots, "user-message", {
            key: 0,
            message: c,
            index: U
          }, () => [
            t("div", ke, [
              e.showAvatars ? (u(), h("div", Me, [
                e.userAvatar ? (u(), h("img", {
                  key: 0,
                  src: e.userAvatar,
                  alt: "User"
                }, null, 8, Se)) : (u(), h("div", be, "U"))
              ])) : A("", !0),
              t("div", Te, [
                t("div", Ae, T(c.content), 1),
                e.showTimestamps && c.timestamp ? (u(), h("div", $e, T(C(c.timestamp)), 1)) : A("", !0)
              ])
            ])
          ]) : c.role === "assistant" ? f(s.$slots, "assistant-message", {
            key: 1,
            message: c,
            index: U
          }, () => [
            t("div", Ie, [
              e.showAvatars ? (u(), h("div", Oe, [
                e.assistantAvatar ? (u(), h("img", {
                  key: 0,
                  src: e.assistantAvatar,
                  alt: "Assistant"
                }, null, 8, Ke)) : (u(), h("div", Pe, "A"))
              ])) : A("", !0),
              t("div", Ee, [
                t("div", {
                  class: "ai-chat-window__message-text",
                  innerHTML: _(c.content)
                }, null, 8, xe),
                e.showTimestamps && c.timestamp ? (u(), h("div", Be, T(C(c.timestamp)), 1)) : A("", !0),
                e.showCopyButton ? (u(), h("button", {
                  key: 1,
                  class: "ai-chat-window__copy-button",
                  onClick: (ie) => D(c.content)
                }, " Copy ", 8, Re)) : A("", !0)
              ])
            ])
          ]) : f(s.$slots, "message", {
            key: 2,
            message: c,
            index: U
          }, () => [
            t("div", De, [
              t("div", Ue, T(c.role), 1),
              t("div", je, [
                t("div", ze, T(c.content), 1)
              ])
            ])
          ])
        ], 64))), 128)),
        b($) ? (u(), h("div", Le, [
          f(s.$slots, "loading", {}, () => [
            t("div", He, T(e.loadingText), 1)
          ])
        ])) : A("", !0),
        b(B) ? (u(), h("div", We, [
          f(s.$slots, "error", { error: b(B) }, () => [
            t("div", qe, T(e.errorText), 1)
          ])
        ])) : A("", !0)
      ], 512),
      t("div", Je, [
        f(s.$slots, "input", {
          input: g.value,
          sendMessage: y
        }, () => [
          t("div", Ne, [
            te(t("textarea", {
              "onUpdate:modelValue": S[0] || (S[0] = (c) => g.value = c),
              class: "ai-chat-window__input",
              placeholder: e.placeholder,
              disabled: b($),
              onKeydown: ue(he(r, ["prevent"]), ["enter"]),
              ref_key: "inputElement",
              ref: v
            }, null, 40, Fe), [
              [me, g.value]
            ]),
            t("button", {
              class: "ai-chat-window__send-button",
              onClick: y,
              disabled: b($) || !g.value.trim()
            }, " Send ", 8, Ve)
          ])
        ])
      ]),
      t("div", Ye, [
        f(s.$slots, "footer", {}, () => [
          b(x).length > 0 ? (u(), h("button", {
            key: 0,
            class: "ai-chat-window__clear-button",
            onClick: S[1] || (S[1] = //@ts-ignore
            (...c) => b(R) && b(R)(...c))
          }, " Clear Chat ")) : A("", !0)
        ])
      ])
    ], 2));
  }
}), Ge = Z({
  name: "AiChatToggle",
  components: {
    AiChatWindow: W
  },
  props: {
    // Toggle behavior
    position: {
      type: String,
      default: "bottom",
      validator: (e) => ["bottom", "top"].includes(e)
    },
    defaultOpen: {
      type: Boolean,
      default: !1
    },
    title: {
      type: String,
      default: "Chat with AI"
    },
    // Provider configuration (either client or provider is required)
    client: {
      type: Object,
      default: null
    },
    provider: {
      type: String,
      default: null
    },
    apiKey: {
      type: String,
      default: null
    },
    model: {
      type: String,
      default: null
    },
    // Pass all AiChatWindow props
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
    theme: {
      type: String,
      default: "light"
    },
    showAvatars: {
      type: Boolean,
      default: !0
    },
    persistenceKey: {
      type: String,
      default: null
    },
    // Demo mode
    demoMode: {
      type: Boolean,
      default: !1
    },
    demoResponses: {
      type: Object,
      default: () => ({
        hello: "Hello! I'm a demo AI assistant. How can I help you today?",
        help: "I can help you with various tasks. Just ask me a question!",
        features: "This chatbot component supports markdown, code highlighting, streaming responses, and more!"
      })
    }
  },
  emits: ["toggle", "message-sent", "response-received", "error"],
  setup(e, { emit: a, slots: i }) {
    const w = K(e.defaultOpen), g = L(() => !i.default), p = L(() => {
      const d = {
        placeholder: e.placeholder,
        initialMessages: e.initialMessages,
        systemPrompt: e.systemPrompt,
        streaming: e.streaming,
        theme: e.theme,
        showAvatars: e.showAvatars,
        persistenceKey: e.persistenceKey,
        demoMode: e.demoMode,
        demoResponses: e.demoResponses
      };
      return e.client ? d.client = e.client : e.provider && (d.provider = e.provider, e.apiKey && (d.apiKey = e.apiKey), e.model && (d.model = e.model)), d;
    }), v = () => {
      w.value = !w.value, a("toggle", w.value);
    };
    return H(() => e.defaultOpen, (d) => {
      w.value = d;
    }), {
      isOpen: w,
      toggleChat: v,
      useDefaultChat: g,
      chatProps: p
    };
  }
}), Qe = (e, a) => {
  const i = e.__vccOpts || e;
  for (const [w, g] of a)
    i[w] = g;
  return i;
}, Xe = ["aria-label", "title"], Ze = {
  key: 0,
  class: "ai-chat-toggle__icon ai-chat-toggle__icon--open"
}, et = {
  key: 1,
  class: "ai-chat-toggle__icon ai-chat-toggle__icon--close"
}, tt = { class: "ai-chat-toggle__window" }, st = {
  key: 0,
  class: "ai-chat-toggle__header"
}, at = { class: "ai-chat-toggle__title" }, ot = { class: "ai-chat-toggle__content" };
function nt(e, a, i, w, g, p) {
  const v = ge("AiChatWindow");
  return u(), h("div", {
    class: ee(["ai-chat-toggle", { "ai-chat-toggle--open": e.isOpen, "ai-chat-toggle--bottom": e.position === "bottom", "ai-chat-toggle--top": e.position === "top" }])
  }, [
    t("button", {
      class: "ai-chat-toggle__button",
      onClick: a[0] || (a[0] = (...d) => e.toggleChat && e.toggleChat(...d)),
      "aria-label": e.isOpen ? "Close chat" : "Open chat",
      title: e.isOpen ? "Close chat" : "Open chat"
    }, [
      e.isOpen ? (u(), h("span", et, [
        f(e.$slots, "close-icon", {}, () => [
          a[6] || (a[6] = t("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            t("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }),
            t("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })
          ], -1))
        ])
      ])) : (u(), h("span", Ze, [
        f(e.$slots, "toggle-icon", {}, () => [
          a[5] || (a[5] = t("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            t("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
          ], -1))
        ])
      ]))
    ], 8, Xe),
    te(t("div", tt, [
      e.title ? (u(), h("div", st, [
        t("h3", at, T(e.title), 1),
        t("button", {
          class: "ai-chat-toggle__close",
          onClick: a[1] || (a[1] = (...d) => e.toggleChat && e.toggleChat(...d)),
          "aria-label": "Close chat"
        }, a[7] || (a[7] = [
          t("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            t("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }),
            t("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })
          ], -1)
        ]))
      ])) : A("", !0),
      t("div", ot, [
        e.useDefaultChat ? (u(), pe(v, we({ key: 0 }, e.chatProps, {
          onMessageSent: a[2] || (a[2] = (d) => e.$emit("message-sent", d)),
          onResponseReceived: a[3] || (a[3] = (d) => e.$emit("response-received", d)),
          onError: a[4] || (a[4] = (d) => e.$emit("error", d))
        }), null, 16)) : f(e.$slots, "default", { key: 1 })
      ])
    ], 512), [
      [ye, e.isOpen]
    ])
  ], 2);
}
const oe = /* @__PURE__ */ Qe(Ge, [["render", nt]]), {
  createCompatComponent: ne,
  registerCompatComponent: Q,
  createCompatPlugin: it
} = require("@aivue/core"), rt = ne(W), lt = ne(oe), dt = se, ct = {
  formatMarkdown: ae
}, ut = it({
  install(e) {
    Q(e, "AiChatWindow", W), Q(e, "AiChatToggle", oe);
  }
}), ft = {
  AiChatWindow: rt,
  AiChatToggle: lt,
  useChatEngine: dt,
  utils: ct,
  AiChatPlugin: ut
};
export {
  ut as AiChatPlugin,
  lt as AiChatToggle,
  rt as AiChatWindow,
  ft as default,
  dt as useChatEngine,
  ct as utils
};
//# sourceMappingURL=index.mjs.map

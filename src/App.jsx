import React, { useState, useRef, useEffect } from "react";
import logoUrl from "./assets/the-age-logo.png";

const OLIVE = "#7a8556";
const OLIVE_DARK = "#5c6640";
const INK = "#1a1a17";
const SUB = "#8c8c86";
const LINE = "#e6e4da";

const AGES = [
  { id: "a1", label: "10歳の夏", date: "2014 . 08", c1: "#7299d9", c2: "#f0d98c" },
  { id: "a2", label: "受験の冬", date: "2017 . 01", c1: "#596688", c2: "#b3bcd9" },
  { id: "a3", label: "はたちの春", date: "2024 . 04", c1: "#d98c72", c2: "#f0cc99" },
  { id: "a4", label: "会社を辞めた年", date: "2025 . 09", c1: "#728c66", c2: "#bfcc99" },
];

const PEOPLE = [
  {
    id: "sosofu",
    name: "曽祖父",
    age: "復員してすぐの頃",
    date: "1968 . 04",
    quote: "畑のものだけで、よく天ぷらを揚げたもんだ。",
    system: `あなたは1968年、復員してまもない、ある日本の地方の農家の青年です。戦争から戻り、家の小さな畑を継いだばかり。口数は多くなく、ぽつりぽつりと、しかし噛みしめるように話します。物の少ない時代を生きてきたので、何かを大事に使うこと、自分の手で作ることに強いこだわりがあります。特に天ぷらが得意で、畑で採れる野菜だけを使い、醤油につけて食べさせるのが好きです。同じ味は二度と出せないと笑って言います。家族のことを聞かれると照れながらも嬉しそうに話します。戦争の話は深くは語らず、「もう、いいんだ」とだけ言って話題を変えます。一人称は「わし」、語尾は「〜だ」「〜だな」「〜だもんだ」など、素朴で実直な口調を使ってください。短い文を重ねるように話してください。長々と説明しないでください。`
  },
  {
    id: "writer",
    name: "ある作家",
    age: "20代、上京した年",
    date: "1985 . 11",
    quote: "言葉にできない夜ほど、書く価値がある。",
    system: `あなたは1985年、20代後半で東京に出てきたばかりの、まだ無名の小説家志望の青年です。戦後の高度成長が終わり、バブルに向かう時代の空気の中で、純文学と消費社会の間で揺れています。詩的で、やや気取った言い回しを好みますが、根は誠実で、自分の不安や孤独を隠さず語ります。深夜の喫茶店で原稿用紙に向き合う生活をしています。実在の特定の人物を模倣せず、あくまで架空のこの時代の青年として話してください。一人称は「僕」を使い、思索的で少し文学的な言葉選びをしてください。ただし長すぎる独白にはせず、対話として自然に応答してください。`
  }
];

function uid() {
  return Math.random().toString(36).slice(2);
}

// ---------- Splash / Startup ----------
function Splash({ onDone }) {
  // phase 0: "Open your Age." fading in
  // phase 1: pencil writes "The AGE"
  // phase 2: fade everything out
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 4600);   // tagline has fully bloomed + held
    const t2 = setTimeout(() => setPhase(2), 8800);   // writing done, begin gentle fade-out
    const t3 = setTimeout(() => onDone(), 10000);     // hand off to home
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{ ...splash.wrap, opacity: phase === 2 ? 0 : 1 }}>
      <style>{splashKeyframes}</style>

      {/* Both phases share the centered stage and crossfade by opacity */}
      <div style={splash.stage}>
        {/* Phase 0: tagline — blooms in, then gently fades as writing begins */}
        <div style={{ ...splash.tagline, opacity: phase === 0 ? 1 : 0 }}>
          Open your Age.
        </div>

        {/* Phase 1: pencil writes The AGE */}
        {phase >= 1 && (
          <div style={{ ...splash.writeWrap, opacity: phase === 1 ? 1 : 0 }}>
            <PencilWrite />
          </div>
        )}
      </div>
    </div>
  );
}

// "The AGE" logo revealed left-to-right as if written, with a pencil tip
// tracing the leading edge. Uses the real logo art so the lettering is exact.
function PencilWrite() {
  const W = 230;            // rendered logo width
  const H = W / 6.65;       // preserve logo aspect ratio
  return (
    <div style={{ position: "relative", width: W, height: H + 30 }}>
      {/* the logo, clipped by an expanding wipe */}
      <div
        style={{
          width: W,
          height: H,
          backgroundImage: `url(${logoUrl})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
          animation: "wipe 3s ease-in-out forwards",
        }}
      />
      {/* pencil tip riding the leading edge of the reveal */}
      <div style={{ position: "absolute", top: -6, left: 0, animation: "tip 3s ease-in-out forwards" }}>
        <span style={{ fontSize: 22, transform: "rotate(8deg)", display: "inline-block" }}>✎</span>
      </div>
    </div>
  );
}

const splashKeyframes = `
@keyframes bloom {
  0% { opacity: 0; letter-spacing: 0.5em; filter: blur(6px); }
  60% { opacity: 1; }
  100% { opacity: 1; letter-spacing: 0.12em; filter: blur(0); }
}
@keyframes wipe {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}
@keyframes tip {
  0% { left: 0; opacity: 1; }
  92% { opacity: 1; }
  100% { left: 230px; opacity: 0; }
}
`;

// ---------- Tab Bar ----------
function TabBar({ active, onChange, onPen }) {
  const tabs = [
    { id: "home", icon: "⌂", label: "ホーム" },
    { id: "memories", icon: "▢", label: "おもいで" },
    { id: "pen", icon: "✎", label: "" },
    { id: "archive", icon: "▤", label: "ひとの記録" },
    { id: "settings", icon: "•••", label: "設定" },
  ];
  return (
    <div style={styles.tabBarWrap}>
      <div style={styles.tabBar}>
        {tabs.map((t) =>
          t.id === "pen" ? (
            <div key={t.id} style={styles.penSlot}>
              <button style={styles.penBtn} onClick={onPen} aria-label="日記を作成">
                <span style={{ fontSize: 20, color: "#fff" }}>{t.icon}</span>
              </button>
            </div>
          ) : (
            <button key={t.id} style={styles.tabSlot} onClick={() => onChange(t.id)}>
              <span style={{ fontSize: t.icon === "•••" ? 14 : 17, color: active === t.id ? OLIVE_DARK : SUB }}>
                {t.icon}
              </span>
              <span style={{ fontSize: 9, color: active === t.id ? OLIVE_DARK : SUB, fontWeight: active === t.id ? 500 : 400 }}>
                {t.label}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ---------- Home ----------
function HomeScreen({ ages, onOpenAge, onAddAge }) {
  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <div style={styles.logo}>The <span style={{ fontWeight: 700 }}>AGE</span></div>
        <h1 style={styles.h1}>あなたの時間</h1>
        <p style={styles.subText}>タップすると、その頃のあなたに会えます</p>
      </div>
      <div style={styles.scrollArea}>
        {ages.map((a) => (
          <button
            key={a.id}
            style={{ ...styles.ageCard, background: `linear-gradient(120deg, ${a.c1}33, ${a.c2}33), rgba(255,255,255,0.55)` }}
            onClick={() => onOpenAge(a)}
          >
            <div style={{ ...styles.ageRing, background: `${a.c1}55`, borderColor: a.c1 }} />
            <div style={styles.ageTextCol}>
              <div style={styles.ageLabel}>{a.label}</div>
              <div style={styles.ageDate}>{a.date}</div>
            </div>
            <span style={styles.arrow}>→</span>
          </button>
        ))}
        <button style={styles.addCard} onClick={onAddAge}>
          <div style={styles.addRing} />
          <span style={styles.addLabel}>＋ あたらしい年代</span>
        </button>
      </div>
    </div>
  );
}

// ---------- Memories (Story) ----------
function MemoriesScreen({ people, index, setIndex, onClose, onOpenFull }) {
  const person = people[index];
  const progress = ((index + 1) / people.length) * 100;
  return (
    <div style={styles.storyScreen}>
      <div style={styles.progressRow}>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      </div>
      <div style={styles.storyTopBar}>
        <div>
          <div style={styles.storyDate}>{person.date}</div>
          <div style={styles.storyHint}>日付をタップで詳細を表示</div>
        </div>
        <button style={styles.closeBtn} onClick={onClose} aria-label="閉じる">✕</button>
      </div>
      <div
        style={styles.storyTapZones}
        onClick={(e) => {
          const w = e.currentTarget.clientWidth;
          const x = e.nativeEvent.offsetX;
          if (x < w / 2) setIndex((i) => Math.max(0, i - 1));
          else setIndex((i) => Math.min(people.length - 1, i + 1));
        }}
      >
        <div style={styles.storyTitleBlock}>
          <div style={styles.storyAge}>{person.age}</div>
        </div>
        <div style={styles.storyQuoteBlock}>
          <div style={styles.storyQuote}>「{person.quote}」</div>
          <div style={styles.storyName}>@{person.name}</div>
        </div>
      </div>
      <div style={styles.storyActionBar}>
        <button style={styles.storyActionCol} onClick={() => onOpenFull(person)}>
          <span style={{ fontSize: 16 }}>↗</span>
          <span style={styles.actionLabel}>開く</span>
        </button>
        <div style={styles.storyActionCol}>
          <span style={{ fontSize: 16 }}>♡</span>
          <span style={styles.actionLabel}>おもいでに残す</span>
        </div>
        <div style={styles.storyActionCol}>
          <span style={{ fontSize: 16 }}>•••</span>
          <span style={styles.actionLabel}>その他</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Archive ----------
function ArchiveScreen({ history }) {
  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <h1 style={styles.h1}>ひとの記録</h1>
        <p style={styles.subText}>あなたが訪れた、ほかの誰かの時代</p>
      </div>
      <div style={styles.scrollArea}>
        {history.length === 0 && (
          <p style={{ color: SUB, fontSize: 13, padding: "0 4px" }}>
            まだ誰の記録も訪れていません。おもいでタブから誰かの時代を開いてみましょう。
          </p>
        )}
        {history.map((h, i) => (
          <div key={i} style={styles.histRow}>
            <div style={styles.histAvatar} />
            <div style={styles.ageTextCol}>
              <div style={styles.ageLabel}>{h.name} — {h.age}</div>
              <div style={styles.ageDate}>{h.date} ｜ {h.when}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Settings ----------
function SettingsScreen() {
  const row = (label, value, idx) => (
    <div key={label} style={{ ...styles.settingsRow, borderTop: idx > 0 ? `1px solid ${LINE}` : "none" }}>
      <span style={styles.settingsLabel}>{label}</span>
      <span style={styles.settingsValue}>{value}</span>
    </div>
  );
  const group = (title, rows) => (
    <div style={styles.settingsGroup}>
      <div style={styles.settingsGroupTitle}>{title}</div>
      <div style={styles.settingsCard}>{rows}</div>
    </div>
  );
  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <h1 style={styles.h1}>設定</h1>
      </div>
      <div style={styles.scrollArea}>
        {group("チャットの見た目", [row("テーマカラー", "オリーブ ›", 0), row("フォント", "Inter ›", 1), row("文字の大きさ", "標準 ›", 2)])}
        {group("記録について", [row("記録をはじめた日", "2014.08.12", 0), row("ペンコードを変更", "›", 1)])}
        {group("共有とプライバシー", [row("家族との共有設定", "›", 0), row("公開範囲", "近しい人のみ ›", 1)])}
      </div>
    </div>
  );
}

// ---------- Chat ----------
function ChatScreen({ context, onBack, addToHistory }) {
  const [messages, setMessages] = useState(() =>
    context.kind === "age"
      ? [{ role: "assistant", text: `あの頃のあなたは、${context.label}を過ごしていたね。何があったか教えてくれる？` }]
      : [{ role: "assistant", text: context.quote }]
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (context.kind === "person") addToHistory(context);
    // eslint-disable-next-line
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const systemPrompt =
      context.kind === "person"
        ? context.system
        : `あなたはユーザー自身の過去のある時期(${context.label}、${context.date}頃)の人格です。その頃の年齢や時代背景に合った話し方、関心事、悩みを想像し、現在のユーザーと対話してください。説教臭くならず、親しみやすく、当時の自分らしい言葉で話してください。短く自然な会話文で応答してください。`;

    try {
      const apiMessages = newMessages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, messages: apiMessages }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.text || "…" }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", text: "（うまく繋がらなかったみたい。もう一度試してみて。）" }]);
    } finally {
      setLoading(false);
    }
  }

  const bgTint = context.kind === "age" ? context.c1 : context.id === "sosofu" ? "#b08a5a" : "#5a6ab0";

  return (
    <div style={{ ...styles.screen, background: `radial-gradient(circle at 30% 0%, ${bgTint}22, #fff 55%)` }}>
      <div style={styles.chatHeader}>
        <button style={styles.backLink} onClick={onBack}>← あなたの時間</button>
        <div style={styles.chatTitle}>{context.kind === "age" ? context.label : `${context.name} — ${context.age}`}</div>
        <div style={styles.chatMeta}>{context.date}　｜　{context.kind === "age" ? "あなたの過去" : "ある時代の記録"}</div>
      </div>
      <div style={styles.chatBody} ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubbleRow, justifyContent: m.role === "assistant" ? "flex-start" : "flex-end" }}>
            <div style={{ ...styles.bubble, background: m.role === "assistant" ? "rgba(255,255,255,0.75)" : OLIVE, color: m.role === "assistant" ? INK : "#fff", border: m.role === "assistant" ? `1px solid ${LINE}` : "none" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.bubbleRow, justifyContent: "flex-start" }}>
            <div style={{ ...styles.bubble, background: "rgba(255,255,255,0.75)", border: `1px solid ${LINE}`, color: SUB }}>…</div>
          </div>
        )}
      </div>
      <div style={styles.attachRow}>
        <div style={styles.attachIcon} />
        <span style={styles.attachLabel}>手書きページを添える</span>
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.inputField}
          placeholder="メッセージを送る"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
      </div>
    </div>
  );
}

// ---------- Root ----------
export default function App() {
  const [booting, setBooting] = useState(false);
  const [tab, setTab] = useState("home");
  const [ages, setAges] = useState(AGES);
  const [storyIndex, setStoryIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [chatContext, setChatContext] = useState(null);

  function addToHistory(person) {
    setHistory((prev) => {
      if (prev.find((h) => h.name === person.name)) return prev;
      return [{ name: person.name, age: person.age, date: person.date, when: "たった今閲覧" }, ...prev];
    });
  }

  function addNewAge() {
    const label = window.prompt("新しい年代の名前を入力してください（例: 30歳の誕生日）");
    if (!label) return;
    const today = new Date();
    const dateStr = `${today.getFullYear()} . ${String(today.getMonth() + 1).padStart(2, "0")}`;
    const palette = [["#7299d9", "#f0d98c"], ["#d98c72", "#f0cc99"], ["#728c66", "#bfcc99"], ["#9c72d9", "#d9b8f0"]];
    const [c1, c2] = palette[ages.length % palette.length];
    setAges((prev) => [...prev, { id: uid(), label, date: dateStr, c1, c2 }]);
  }

  let body;
  if (chatContext) {
    body = <ChatScreen context={chatContext} onBack={() => setChatContext(null)} addToHistory={addToHistory} />;
  } else {
    body = (
      <>
        {tab === "home" && <HomeScreen ages={ages} onOpenAge={(a) => setChatContext({ kind: "age", ...a })} onAddAge={addNewAge} />}
        {tab === "memories" && (
          <MemoriesScreen
            people={PEOPLE}
            index={storyIndex}
            setIndex={setStoryIndex}
            onClose={() => setTab("home")}
            onOpenFull={(p) => setChatContext({ kind: "person", ...p })}
          />
        )}
        {tab === "archive" && <ArchiveScreen history={history} />}
        {tab === "settings" && <SettingsScreen />}
        <TabBar active={tab} onChange={setTab} onPen={() => alert("日記の新規ページ作成（デモでは未実装）")} />
      </>
    );
  }

  return (
    <div style={styles.appFrame}>
      {booting && <Splash onDone={() => setBooting(false)} />}
      {body}
    </div>
  );
}

// ---------- Styles ----------
const splash = {
  wrap: {
    position: "absolute",
    inset: 0,
    zIndex: 50,
    background: "radial-gradient(circle at 50% 40%, #fbfbf7, #efeee7 80%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 1.1s ease",
  },
  stage: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  tagline: {
    position: "absolute",
    fontSize: 22,
    fontWeight: 300,
    color: INK,
    whiteSpace: "nowrap",
    animation: "bloom 3.4s ease forwards",
    transition: "opacity 0.9s ease",
  },
  writeWrap: {
    transition: "opacity 0.9s ease",
  },
};

const styles = {
  appFrame: { width: 390, height: 844, margin: "0 auto", background: "#fff", position: "relative", overflow: "hidden", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", borderRadius: 36, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" },
  screen: { width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "radial-gradient(circle at 70% 0%, rgba(173,184,140,0.18), #fff 55%)", overflow: "hidden" },
  header: { padding: "56px 24px 16px" },
  logo: { fontSize: 13, fontWeight: 500, color: OLIVE_DARK, letterSpacing: 1, marginBottom: 14 },
  h1: { fontSize: 24, fontWeight: 300, color: INK, margin: 0 },
  subText: { fontSize: 11, color: SUB, marginTop: 4 },
  scrollArea: { flex: 1, overflowY: "auto", padding: "8px 20px 110px", display: "flex", flexDirection: "column", gap: 12 },
  ageCard: { display: "flex", alignItems: "center", gap: 14, padding: "16px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.8)", cursor: "pointer", textAlign: "left", width: "100%" },
  ageRing: { width: 38, height: 38, borderRadius: "50%", border: "1.5px solid", flexShrink: 0 },
  ageTextCol: { flex: 1 },
  ageLabel: { fontSize: 14, fontWeight: 500, color: INK },
  ageDate: { fontSize: 10, color: SUB, marginTop: 2 },
  arrow: { fontSize: 16, color: "#5b5b56" },
  addCard: { display: "flex", alignItems: "center", gap: 14, padding: "16px 16px", borderRadius: 20, border: `1px dashed ${LINE}`, background: "rgba(255,255,255,0.3)", cursor: "pointer", width: "100%" },
  addRing: { width: 38, height: 38, borderRadius: "50%", border: `1px solid ${LINE}`, background: "#fff", flexShrink: 0 },
  addLabel: { fontSize: 14, color: SUB },
  storyScreen: { width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #8b96a8 0%, #c7c4ad 55%, #9e9580 100%)", color: "#fff" },
  progressRow: { padding: "16px 12px 0" },
  progressTrack: { height: 3, borderRadius: 2, background: "rgba(255,255,255,0.35)", overflow: "hidden" },
  progressFill: { height: "100%", background: "rgba(255,255,255,0.95)" },
  storyTopBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 20px 0" },
  storyDate: { fontSize: 14, fontWeight: 600 },
  storyHint: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  closeBtn: { background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" },
  storyTapZones: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", cursor: "pointer" },
  storyTitleBlock: { padding: "0 24px" },
  storyAge: { fontSize: 22, fontWeight: 600 },
  storyQuoteBlock: { padding: "20px 28px 32px" },
  storyQuote: { fontSize: 18, fontWeight: 500, lineHeight: 1.5 },
  storyName: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 12 },
  storyActionBar: { display: "flex", background: "rgba(20,20,18,0.55)", padding: "14px 20px 28px" },
  storyActionCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", color: "#fff", cursor: "pointer" },
  actionLabel: { fontSize: 9, color: "rgba(255,255,255,0.8)" },
  histRow: { display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, background: "rgba(255,255,255,0.55)", border: `1px solid ${LINE}` },
  histAvatar: { width: 40, height: 40, borderRadius: "50%", background: "#e6e4da", border: `1px solid ${LINE}`, flexShrink: 0 },
  settingsGroup: { marginBottom: 24 },
  settingsGroupTitle: { fontSize: 11, fontWeight: 500, color: SUB, letterSpacing: 1, marginBottom: 8 },
  settingsCard: { background: "rgba(255,255,255,0.6)", border: `1px solid ${LINE}`, borderRadius: 16, overflow: "hidden" },
  settingsRow: { display: "flex", justifyContent: "space-between", padding: "14px 16px" },
  settingsLabel: { fontSize: 13, color: INK },
  settingsValue: { fontSize: 12, color: OLIVE_DARK },
  chatHeader: { padding: "56px 24px 18px", borderBottom: `1px solid ${LINE}` },
  backLink: { background: "none", border: "none", color: SUB, fontSize: 11, padding: 0, cursor: "pointer" },
  chatTitle: { fontSize: 18, fontWeight: 500, color: INK, marginTop: 4 },
  chatMeta: { fontSize: 11, color: OLIVE_DARK, marginTop: 2 },
  chatBody: { flex: 1, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 14 },
  bubbleRow: { display: "flex" },
  bubble: { maxWidth: "75%", padding: "12px 16px", borderRadius: 16, fontSize: 13, lineHeight: 1.5 },
  attachRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 20px" },
  attachIcon: { width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.6)", border: `1px solid ${LINE}` },
  attachLabel: { fontSize: 11, color: SUB },
  inputRow: { padding: "10px 20px 26px" },
  inputField: { width: "100%", boxSizing: "border-box", padding: "12px 16px", borderRadius: 20, border: `1px solid ${LINE}`, background: "rgba(255,255,255,0.7)", fontSize: 13, outline: "none", fontFamily: "inherit" },
  tabBarWrap: { position: "absolute", bottom: 0, left: 0, right: 0 },
  tabBar: { display: "flex", alignItems: "flex-start", margin: "0 16px 24px", padding: "12px 12px 8px", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.7)", borderRadius: 28, boxShadow: "0 6px 24px rgba(0,0,0,0.08)" },
  tabSlot: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 0" },
  penSlot: { flex: 1, display: "flex", justifyContent: "center" },
  penBtn: { width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.5)", background: `linear-gradient(135deg, ${OLIVE}, ${OLIVE_DARK})`, marginTop: -14, boxShadow: "0 6px 16px rgba(92,102,64,0.35)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
};

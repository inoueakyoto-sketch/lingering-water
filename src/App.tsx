import React, { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";

// --- itoアプリ用 お題100選（イラスト用アイコン付き） ---
const THEMES = [
  { title: "カバンに入っていたら嬉しいもの", min: "嬉しくない", max: "嬉しい", icon: "💼" },
  { title: "朝ごはんに食べたいもの", min: "食べたくない", max: "食べたい", icon: "🥞" },
  { title: "奇跡の体験", min: "少し奇跡", max: "超奇跡", icon: "✨" },
  { title: "お尻から出てきたらビックリするもの", min: "少しビックリ", max: "超ビックリ", icon: "🍑" },
  { title: "科学者になって考えよう 発明したい薬", min: "いらない", max: "絶対に欲しい", icon: "🧪" },
  { title: "中学生になって考えよう カッコいいもの", min: "カッコわるい", max: "カッコいい", icon: "😎" },
  { title: "桃太郎になって考えよう 頼りになる家来", min: "頼りにならない", max: "超頼りになる", icon: "🐕" },
  { title: "赤ちゃんになって考えよう 最高の瞬間", min: "最悪", max: "最高", icon: "👶" },
  { title: "魔王になって考えよう こんな勇者はイヤだ", min: "まだマシ", max: "超イヤだ", icon: "😈" },
  { title: "1000円くらいまででできる楽しいこと", min: "そこそこ楽しい", max: "超楽しい", icon: "🪙" },
  { title: "学校の先生に怒られそうなこと", min: "怒られない", max: "絶対怒られる", icon: "👨‍🏫" },
  { title: "ショックを受けた好きな人のクセ", min: "少しショック", max: "超ショック", icon: "💔" },
  { title: "ふだん聞く言葉の頻度", min: "あまり聞かない", max: "よく聞く", icon: "🗣️" },
  { title: "動物園にいる動物の人気", min: "人気ない", max: "大人気", icon: "🦁" },
  { title: "祖父母になって考えよう 孫の嬉しい言葉", min: "ふつう", max: "超嬉しい", icon: "👴" },
  { title: "踏んだら痛そうなもの", min: "痛くない", max: "激痛", icon: "💥" },
  { title: "勇気ある行動", min: "勇気いらない", max: "超勇気いる", icon: "🛡️" },
  { title: "分身ができたらやってほしいこと", min: "やってほしくない", max: "絶対やってほしい", icon: "👥" },
  { title: "変顔の度合い（言葉で表現）", min: "ふつうの顔", max: "やばい変顔", icon: "🤪" },
  { title: "おみやげにもらったら嬉しいもの", min: "嬉しくない", max: "超嬉しい", icon: "🎁" },
  { title: "猫になって考えよう 心地のいい場所", min: "落ち着かない", max: "最高に心地いい", icon: "🐈" },
  { title: "幸せを感じること", min: "小さな幸せ", max: "最大の幸せ", icon: "🍀" },
  { title: "無人島に持っていきたいもの", min: "役に立たない", max: "絶対必要", icon: "🏝️" },
  { title: "宇宙人になって考えよう 地球の不思議なもの", min: "普通", max: "超不思議", icon: "👽" },
  { title: "テンションが上がる曲", min: "上がらない", max: "爆上がり", icon: "🎵" },
  { title: "コンビニでつい買ってしまうもの", min: "買わない", max: "絶対買う", icon: "🏪" },
  { title: "ゾンビの世界で生き残るための武器", min: "すぐ死ぬ", max: "最強", icon: "🧟" },
  { title: "もらって困るプレゼント", min: "困らない", max: "超困る", icon: "📦" },
  { title: "大人の趣味", min: "つまらない", max: "超楽しい", icon: "⛳" },
  { title: "子供の頃の夢", min: "なりたくない", max: "絶対なりたい", icon: "🚀" },
  { title: "かっこいい必殺技の名前", min: "ダサい", max: "超かっこいい", icon: "⚡" },
  { title: "怖いもの", min: "全然怖くない", max: "超怖い" , icon: "👻"},
  { title: "あったら便利な魔法", min: "使えない", max: "超便利", icon: "🪄" },
  { title: "犬になって考えよう 嬉しいこと", min: "ふつう", max: "超嬉しい", icon: "🐕" },
  { title: "言われて嬉しい褒め言葉", min: "嬉しくない", max: "超嬉しい", icon: "👏" },
  { title: "歴史上の人物の強さ", min: "最弱", max: "最強", icon: "⚔️" },
  { title: "美味しいラーメンのトッピング", min: "いらない", max: "マスト", icon: "🍜" },
  { title: "タイムスリップするなら", min: "行きたくない", max: "絶対行きたい", icon: "⏳" },
  { title: "理想のプロポーズ", min: "最悪", max: "最高", icon: "💍" },
  { title: "あったら嫌な法律", min: "まだ許せる", max: "絶対ムリ", icon: "⚖️" },
  { title: "自分の好きなところ", min: "ふつう", max: "大好き", icon: "❤️" },
  { title: "旅行で行きたい国", min: "行きたくない", max: "絶対行きたい", icon: "✈️" },
  { title: "かっこいい漢字一文字", min: "ダサい", max: "超かっこいい", icon: "✍️" },
  { title: "理想の休日", min: "退屈", max: "最高", icon: "🛌" },
  { title: "なってみたい生き物", min: "なりたくない", max: "絶対なりたい", icon: "🦅" },
  { title: "憧れの有名人", min: "憧れない", max: "超憧れる", icon: "⭐" },
  { title: "泣けるシチュエーション", min: "泣けない", max: "😭" },
  { title: "100万円あったら何に使う？", min: "しょうもない", max: "有意義", icon: "💰" },
  { title: "最高のごちそう", min: "ふつう", max: "最高", icon: "🥩" },
  { title: "秘密基地に置きたいもの", min: "いらない", max: "絶対置きたい", icon: "⛺" },
  { title: "かっこいい乗り物", min: "ダサい", max: "超かっこいい", icon: "🏎️" },
  { title: "一番落ち着く場所", min: "落ち着かない", max: "超落ち着く", icon: "🏠" },
  { title: "やってみたいアルバイト", min: "やりたくない", max: "絶対やりたい", icon: "☕" },
  { title: "好きなテレビ番組", min: "見ない", max: "絶対見る", icon: "📺" },
  { title: "理想の家", min: "住みたくない", max: "最高", icon: "🏰" },
  { title: "お弁当に入っていて嬉しいおかず", min: "テンション下がる", max: "最高", icon: "🍱" },
  { title: "一番怖いお化け", min: "怖くない", max: "超怖い", icon: "👁️" },
  { title: "かっこいい苗字", min: "ふつう", max: "超かっこいい", icon: "📛" },
  { title: "可愛い動物", min: "可愛くない", max: "超可愛い", icon: "🐼" },
  { title: "無駄遣いしてしまったこと", min: "少し後悔", max: "大後悔", icon: "💸" },
  { title: "好きなファストフード", min: "食べない", max: "毎日食べたい", icon: "🍔" },
  { title: "憧れの超能力", min: "いらない", max: "絶対欲しい", icon: "🔮" },
  { title: "総理大臣になって考えよう やりたいこと", min: "どうでもいい", max: "絶対やる", icon: "👔" },
  { title: "好きな寿司ネタ", min: "食べない", max: "大好物", icon: "🍣" },
  { title: "絶対にやりたくない罰ゲーム", min: "余裕", max: "絶対ムリ", icon: "📣" }
];

export default function App() {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  
  const [players, setPlayers] = useState<any>({});
  const [board, setBoard] = useState<string[]>([]);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [revealMode, setRevealMode] = useState<"asc"|"desc">("asc");
  const [currentTheme, setCurrentTheme] = useState<{title: string, min: string, max: string, icon?: string} | null>(null);

  const [myWord, setMyWord] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  const [customTitle, setCustomTitle] = useState("");
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");

  // アニメーション用CSSの注入
  useEffect(() => {
    const styleId = "ito-animation-styles";
    if (!document.getElementById(styleId)) {
      const styleNode = document.createElement("style");
      styleNode.id = styleId;
      styleNode.innerHTML = `
        @keyframes ito-flip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); filter: brightness(1.5); }
          100% { transform: rotateY(0deg); }
        }
        @keyframes ito-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.03); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }
        }
        @keyframes ito-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 71, 87, 0.4); }
          50% { box-shadow: 0 0 30px rgba(255, 71, 87, 0.8); }
        }
        .animate-flip {
          animation: ito-flip 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-active-card {
          animation: ito-bounce 2s ease-in-out infinite, ito-glow 2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(styleNode);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get("room");
    if (urlRoom) setRoomId(urlRoom);
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const baseUrl = window.location.origin + window.location.pathname;
    setShareUrl(`${baseUrl}?room=${encodeURIComponent(roomId)}`);

    const playersRef = ref(db, `rooms/${roomId}/players`);
    onValue(playersRef, (snapshot) => {
      setPlayers(snapshot.val() || {});
    });

    const boardRef = ref(db, `rooms/${roomId}/board`);
    onValue(boardRef, (snapshot) => {
      setBoard(snapshot.val() || []);
    });

    const revealRef = ref(db, `rooms/${roomId}/reveal`);
    onValue(revealRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRevealIndex(data.index);
        setRevealMode(data.mode);
      } else {
        setRevealIndex(-1);
      }
    });

    const themeRef = ref(db, `rooms/${roomId}/theme`);
    onValue(themeRef, (snapshot) => {
      setCurrentTheme(snapshot.val() || null);
    });
  }, [roomId]);

  const joinGame = (hostFlag: boolean) => {
    if (roomId === "") return alert("部屋の名前（合言葉）を入力してください！");
    if (name === "") return alert("あなたの名前を入力してください！");
    
    setIsHost(hostFlag);
    setIsJoined(true);

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    
    set(ref(db, `rooms/${roomId}/players/${name}`), {
      name: name,
      number: randomNumber,
      word: "",
    });
    
    const newBoard = board.includes(name) ? [...board] : [...board, name];
    set(ref(db, `rooms/${roomId}/board`), newBoard);
  };

  const submitWord = () => {
    if (!myWord) return alert("お題に沿った言葉を入力してください！");
    set(ref(db, `rooms/${roomId}/players/${name}/word`), myWord);
  };

  const pickRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * THEMES.length);
    set(ref(db, `rooms/${roomId}/theme`), THEMES[randomIndex]);
  };

  const submitCustomTheme = () => {
    if (!customTitle || !customMin || !customMax) {
      return alert("お題、1の基準、100の基準をすべて入力してください！");
    }
    const newTheme = {
      title: customTitle,
      min: customMin,
      max: customMax,
      icon: "✍️"
    };
    set(ref(db, `rooms/${roomId}/theme`), newTheme);
    setCustomTitle("");
    setCustomMin("");
    setCustomMax("");
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("このお部屋専用の招待URLをコピーしました！LINEなどで友達に送ってください。");
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("dragIndex", index.toString());
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"));
    if (dragIndex === dropIndex) return;

    const newBoard = [...board];
    const [draggedItem] = newBoard.splice(dragIndex, 1);
    newBoard.splice(dropIndex, 0, draggedItem);
    
    set(ref(db, `rooms/${roomId}/board`), newBoard);
  };

  const startReveal = (mode: "asc"|"desc") => {
    set(ref(db, `rooms/${roomId}/reveal`), { index: 0, mode: mode });
  };
  const nextReveal = () => {
    set(ref(db, `rooms/${roomId}/reveal/index`), revealIndex + 1);
  };
  const resetGame = () => {
    if (window.confirm("ゲームをリセットして次のラウンドへ進みますか？")) {
      set(ref(db, `rooms/${roomId}`), null);
      window.location.href = shareUrl;
    }
  };

  const totalPlayersCount = Object.keys(players).length;
  const submittedPlayersCount = Object.values(players).filter((p: any) => p.word !== "").length;
  const isAllSubmitted = totalPlayersCount > 0 && totalPlayersCount === submittedPlayersCount;

  // --- 🎨 スタイル定義 ---
  const containerStyle: React.CSSProperties = {
    fontFamily: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif",
    background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    minHeight: "100vh",
    padding: "20px 15px",
    color: "#333",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    marginBottom: "20px",
    border: "2px solid #fff"
  };

  const buttonStyle = (bgColor: string): React.CSSProperties => ({
    padding: "12px 20px",
    backgroundColor: bgColor,
    color: "white",
    border: "none",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
    transition: "all 0.2s"
  });

  const inputStyle: React.CSSProperties = {
    width: "94%",
    padding: "10px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "2px solid #eee",
    marginBottom: "10px"
  };

  if (!isJoined) {
    return (
      <div style={{ ...containerStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ ...cardStyle, maxWidth: "420px", width: "100%", textAlign: "center", borderTop: "10px solid #ff6b6b" }}>
          <h1 style={{ color: "#ff6b6b", fontSize: "36px", margin: "0 0 5px 0", fontWeight: 900, letterSpacing: "1px" }}>itoアプリ</h1>
          <p style={{ color: "#777", fontSize: "13px", marginBottom: "30px" }}>価値観のズレを楽しむ、ハラハラ協力ゲーム</p>
          
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", fontSize: "14px", display: "block", marginBottom: "6px", color: "#555" }}>🔑 部屋の名前（合言葉）</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="例: ぼくらのお部屋、room1"
              style={{ ...inputStyle, width: "94%" }}
            />
          </div>

          <div style={{ textAlign: "left", marginBottom: "35px" }}>
            <label style={{ fontWeight: "bold", fontSize: "14px", display: "block", marginBottom: "6px", color: "#555" }}>👤 あなたのニックネーム</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: まーくん"
              style={{ ...inputStyle, width: "94%" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button onClick={() => joinGame(true)} style={buttonStyle("#ff9f43")}>👑 部屋を作って参加（ホスト）</button>
            <button onClick={() => joinGame(false)} style={buttonStyle("#10ac84")}>👤 この部屋に参加（ゲスト）</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* URL共有バナー */}
        <div style={{ ...cardStyle, background: "linear-gradient(45deg, #54a0ff, #00d2d3)", color: "white", padding: "15px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "10px" }}>部屋: {roomId}</span>
              <div style={{ fontSize: "15px", fontWeight: "bold", marginTop: "5px" }}>📱 友達をLINEで誘おう！</div>
            </div>
            <button onClick={copyUrl} style={{ padding: "8px 16px", backgroundColor: "white", color: "#54a0ff", border: "none", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" }}>招待リンクをコピー</button>
          </div>
        </div>

        {/* 📋 リアルタイム参加状況カウンター */}
        <div style={{ 
          ...cardStyle, 
          background: isAllSubmitted ? "linear-gradient(45deg, #10ac84, #1dd1a1)" : "#fff", 
          color: isAllSubmitted ? "white" : "#333",
          textAlign: "center",
          padding: "15px",
          border: "2px dashed " + (isAllSubmitted ? "#fff" : "#ff6b6b")
        }}>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            {isAllSubmitted ? "🎉 全員が言葉を提出しました！答え合わせを始めよう！" : "⏳ みんなの提出状況を待機中..."}
          </div>
          <div style={{ fontSize: "24px", fontWeight: "900", marginTop: "5px" }}>
            提出済み： <span style={{ color: isAllSubmitted ? "#fff" : "#ff6b6b", fontSize: "32px" }}>{submittedPlayersCount}</span> / {totalPlayersCount} 人
          </div>
        </div>

        {/* お題表示エリア */}
        <div style={{ ...cardStyle, background: "#fff", border: "3px solid #ff6b6b", textAlign: "center" }}>
          <div style={{ backgroundColor: "#ff6b6b", color: "white", padding: "4px 14px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold", display: "inline-block" }}>🎯 今回のお題</div>
          
          {currentTheme ? (
            <div>
              <div style={{ fontSize: "56px", margin: "15px 0 5px 0" }}>{currentTheme.icon || "🃏"}</div>
              <h2 style={{ margin: "0 0 20px 0", color: "#2d3436", fontSize: "26px", fontWeight: "900" }}>{currentTheme.title}</h2>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "15px", border: "1px solid #eee" }}>
                <div style={{ textAlign: "left" }}>
                  <span style={{ color: "#0984e3", fontWeight: "bold", fontSize: "12px", display: "block" }}>🟦 1（一番低い）</span>
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>{currentTheme.min}</span>
                </div>
                <div style={{ color: "#b2bec3", fontSize: "12px" }}>◀ 価値観の軸 ▶</div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "#d63031", fontWeight: "bold", fontSize: "12px", display: "block" }}>🟥 100（一番高い）</span>
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>{currentTheme.max}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "30px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>🎲</div>
              <p style={{ fontSize: "16px", color: "#999", fontWeight: "bold" }}>ホストがお題を決めるのを待っています...</p>
            </div>
          )}
          
          {isHost && (
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #eee", textAlign: "left" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#e65100" }}>⚙️ お題の変更設定（ホスト専用）</h4>
              
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                <button onClick={pickRandomTheme} style={{ ...buttonStyle("#ff6b6b"), fontSize: "14px", padding: "10px 24px", width: "100%" }}>
                  🎲 100種類の山札からランダムに引く
                </button>
              </div>

              <div style={{ backgroundColor: "#fdf2e9", padding: "12px", borderRadius: "10px", border: "1px solid #f5cba7" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#d35400", display: "block", marginBottom: "8px" }}>✏️ その場でオリジナルお題を作る</span>
                <input 
                  type="text" 
                  placeholder="お題（例：ゾンビに勝てそうな有名人）" 
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  style={{ ...inputStyle, width: "93%" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input 
                    type="text" 
                    placeholder="1 の基準（例：絶対すぐやられる）" 
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    style={{ ...inputStyle, width: "45%" }}
                  />
                  <input 
                    type="text" 
                    placeholder="100 の基準（例：1人で世界を救う）" 
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                    style={{ ...inputStyle, width: "45%" }}
                  />
                </div>
                <button onClick={submitCustomTheme} style={{ ...buttonStyle("#e65100"), fontSize: "13px", padding: "8px 15px", width: "100%", borderRadius: "8px" }}>
                  ✍️ 作成したお題を全員に適用する
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* 自分の秘密の数字カード */}
        <div style={{ ...cardStyle, background: "linear-gradient(135deg, #2d3436 0%, #000000 100%)", color: "white", textAlign: "center", border: "3px solid #ffd700" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#ffd700", fontWeight: "bold" }}>Your Secret Card</span>
          <div style={{ fontSize: "68px", fontWeight: "900", color: "#ffd700", textShadow: "0 0 15px rgba(255,215,0,0.6)", margin: "5px 0" }}>
            {players[name]?.number}
          </div>
          <p style={{ fontSize: "13px", color: "#dfe6e9", marginBottom: "15px" }}>この数字の大きさを例える「言葉」を入力して送信してね！</p>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={myWord}
              onChange={(e) => setMyWord(e.target.value)}
              placeholder="例：ギリギリ怒られない遅刻"
              style={{ padding: "14px 20px", flex: 1, fontSize: "16px", borderRadius: "30px", border: "none", color: "#333", fontWeight: "bold" }}
            />
            <button onClick={submitWord} style={buttonStyle("#ff4757")}>送信</button>
          </div>
          {players[name]?.word && (
            <div style={{ fontSize: "12px", color: "#2ed573", marginTop: "10px", fontWeight: "bold" }}>✔ 送信完了しました！</div>
          )}
        </div>

        {/* みんなの並べ替えエリア */}
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 5px 0", fontSize: "18px", fontWeight: "900", color: "#2d3436" }}>🧩 みんなの並べ替えボード</h3>
          <p style={{ fontSize: "12px", color: "#74b9ff", margin: "0 0 15px 0", fontWeight: "bold" }}>💡 カードをドラッグして、数字が小さい順に並び替えよう！</p>
          
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#b2bec3", fontWeight: "bold", marginBottom: "5px" }}>
            <span>◀ 小さい (1)</span>
            <span>大きい (100) ▶</span>
          </div>
          
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "20px 5px", minHeight: "210px", alignItems: "center", backgroundColor: "#f1f2f6", borderRadius: "15px" }}>
            {board.map((playerName, index) => {
              const p = players[playerName];
              if (!p) return null;
              
              // 現在めくられているカードかどうかを判定
              let isRevealed = false;
              let isJustRevealed = false; // まさに今めくられたカードか

              if (revealMode === "asc") {
                if (index <= revealIndex) isRevealed = true;
                if (index === revealIndex) isJustRevealed = true;
              } else {
                if ((board.length - 1 - index) <= revealIndex) isRevealed = true;
                if ((board.length - 1 - index) === revealIndex) isJustRevealed = true;
              }

              // 数字に応じたグラデーションカラー（1に近いほど青、100に近いほど鮮やかな赤）
              const num = p.number || 50;
              const revealedCardBg = `linear-gradient(135deg, rgb(${Math.floor(200 + num * 0.55)}, ${Math.floor(250 - num * 2)}, ${Math.floor(255 - num * 2)}) 0%, rgb(${Math.floor(255)}, ${Math.floor(230 - num * 1.5)}, ${Math.floor(150 - num * 1.2)}) 100%)`;

              return (
                <div
                  key={playerName}
                  draggable={revealIndex === -1}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`${isJustRevealed ? "animate-flip" : ""} ${isJustRevealed ? "animate-active-card" : ""}`}
                  style={{
                    borderRadius: "15px",
                    width: "115px",
                    minWidth: "115px",
                    height: "170px",
                    background: isRevealed ? revealedCardBg : "#ffffff",
                    border: isJustRevealed 
                      ? "4px solid #ff4757" 
                      : isRevealed 
                        ? "2px solid #ffa502" 
                        : p.word 
                          ? "3px solid #ff6b6b" 
                          : "2px dashed #ccc",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: revealIndex === -1 ? "grab" : "default",
                    boxShadow: isJustRevealed 
                      ? "0 20px 35px rgba(255, 71, 87, 0.4)" 
                      : isRevealed 
                        ? "0 6px 12px rgba(0,0,0,0.08)" 
                        : "0 8px 16px rgba(0,0,0,0.05)",
                    transform: isJustRevealed ? "scale(1.08)" : "scale(1)",
                    zIndex: isJustRevealed ? 10 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "4px", textAlign: "center" }}>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: isRevealed ? "#1e272e" : "#2d3436", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  </div>
                  
                  <div style={{ fontSize: "13px", color: p.word ? "#2d3436" : "#b2bec3", fontWeight: "bold", textAlign: "center", wordBreak: "break-all", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "5px 0" }}>
                    {p.word || "考え中..."}
                  </div>
                  
                  <div style={{ textAlign: "center", backgroundColor: isRevealed ? "rgba(255,255,255,0.7)" : "#f1f2f6", borderRadius: "10px", padding: "6px 0", border: isRevealed ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    {isRevealed ? (
                      <span style={{ fontSize: "26px", fontWeight: "900", color: num > 75 ? "#ff4757" : num < 25 ? "#2f3542" : "#ff6b81", textShadow: "1px 1px 0px white" }}>{p.number}</span>
                    ) : (
                      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#a4b0be" }}>?</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ホスト専用の答え合わせパネル */}
        {isHost && (
          <div style={{ ...cardStyle, backgroundColor: "#fff9db", border: "2px solid #fab005" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#f57c00", fontSize: "16px", fontWeight: "bold" }}>👑 ホスト進行コントローラー</h3>
            
            {board.length === 0 ? (
              <p style={{ color: "#888", fontSize: "13px" }}>参加者がお部屋に入るのを待っています...</p>
            ) : revealIndex === -1 ? (
              <div>
                <p style={{ fontSize: "13px", marginBottom: "12px", color: "#666" }}>全員の「言葉」が出揃い、並び替えが終わったらオープンしてください：</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => startReveal("asc")} style={{ ...buttonStyle("#2ed573"), fontSize: "14px", flex: 1 }}>1（小さい順）からめくる</button>
                  <button onClick={() => startReveal("desc")} style={{ ...buttonStyle("#1e90ff"), fontSize: "14px", flex: 1 }}>100（大きい順）からめくる</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e65100" }}>
                  📢 オープン中: {revealMode === "asc" ? "【小さい順】" : "【大きい順】"}
                </div>
                <button onClick={nextReveal} disabled={revealIndex >= board.length - 1} style={buttonStyle("#ff9f43")}>
                  {revealIndex >= board.length - 1 ? "🎉 すべてオープンしました！" : "🔥 次のカードをめくる！"}
                </button>
                <button onClick={resetGame} style={{ padding: "8px", backgroundColor: "transparent", color: "#ff4757", border: "1px solid #ff4757", borderRadius: "20px", cursor: "pointer", marginTop: "10px", fontSize: "12px", fontWeight: "bold" }}>
                  次のゲームを始める（部屋のデータをリセット）
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

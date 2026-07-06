import React, { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";

// --- ito レインボー風 お題100選（1と100の基準付き） ---
const THEMES = [
  { title: "カバンに入っていたら嬉しいもの", min: "嬉しくない", max: "嬉しい" },
  { title: "朝ごはんに食べたいもの", min: "食べたくない", max: "食べたい" },
  { title: "奇跡の体験", min: "少し奇跡", max: "超奇跡" },
  { title: "お尻から出てきたらビックリするもの", min: "少しビックリ", max: "超ビックリ" },
  { title: "科学者になって考えよう 発明したい薬", min: "いらない", max: "絶対に欲しい" },
  { title: "中学生になって考えよう カッコいいもの", min: "カッコわるい", max: "カッコいい" },
  { title: "桃太郎になって考えよう 頼りになる家来", min: "頼りにならない", max: "超頼りになる" },
  { title: "赤ちゃんになって考えよう 最高の瞬間", min: "最悪", max: "最高" },
  { title: "魔王になって考えよう こんな勇者はイヤだ", min: "まだマシ", max: "超イヤだ" },
  { title: "1000円くらいまででできる楽しいこと", min: "そこそこ楽しい", max: "超楽しい" },
  { title: "学校の先生に怒られそうなこと", min: "怒られない", max: "絶対怒られる" },
  { title: "ショックを受けた好きな人のクセ", min: "少しショック", max: "超ショック" },
  { title: "ふだん聞く言葉の頻度", min: "あまり聞かない", max: "よく聞く" },
  { title: "動物園にいる動物の人気", min: "人気ない", max: "大人気" },
  { title: "祖父母になって考えよう 孫の嬉しい言葉", min: "ふつう", max: "超嬉しい" },
  { title: "踏んだら痛そうなもの", min: "痛くない", max: "激痛" },
  { title: "勇気ある行動", min: "勇気いらない", max: "超勇気いる" },
  { title: "分身ができたらやってほしいこと", min: "やってほしくない", max: "絶対やってほしい" },
  { title: "変顔の度合い（言葉で表現）", min: "ふつうの顔", max: "やばい変顔" },
  { title: "おみやげにもらったら嬉しいもの", min: "嬉しくない", max: "超嬉しい" },
  { title: "猫になって考えよう 心地のいい場所", min: "落ち着かない", max: "最高に心地いい" },
  { title: "幸せを感じること", min: "小さな幸せ", max: "最大の幸せ" },
  { title: "無人島に持っていきたいもの", min: "役に立たない", max: "絶対必要" },
  { title: "宇宙人になって考えよう 地球の不思議なもの", min: "普通", max: "超不思議" },
  { title: "テンションが上がる曲", min: "上がらない", max: "爆上がり" },
  { title: "コンビニでつい買ってしまうもの", min: "買わない", max: "絶対買う" },
  { title: "ゾンビの世界で生き残るための武器", min: "すぐ死ぬ", max: "最強" },
  { title: "もらって困るプレゼント", min: "困らない", max: "超困る" },
  { title: "大人の趣味", min: "つまらない", max: "超楽しい" },
  { title: "子供の頃の夢", min: "なりたくない", max: "絶対なりたい" },
  { title: "かっこいい必殺技の名前", min: "ダサい", max: "超かっこいい" },
  { title: "怖いもの", min: "全然怖くない", max: "超怖い" },
  { title: "あったら便利な魔法", min: "使えない", max: "超便利" },
  { title: "犬になって考えよう 嬉しいこと", min: "ふつう", max: "超嬉しい" },
  { title: "言われて嬉しい褒め言葉", min: "嬉しくない", max: "超嬉しい" },
  { title: "歴史上の人物の強さ", min: "最弱", max: "最強" },
  { title: "美味しいラーメンのトッピング", min: "いらない", max: "マスト" },
  { title: "タイムスリップするなら", min: "行きたくない", max: "絶対行きたい" },
  { title: "理想のプロポーズ", min: "最悪", max: "最高" },
  { title: "あったら嫌な法律", min: "まだ許せる", max: "絶対ムリ" },
  { title: "自分の好きなところ", min: "ふつう", max: "大好き" },
  { title: "旅行で行きたい国", min: "行きたくない", max: "絶対行きたい" },
  { title: "かっこいい漢字一文字", min: "ダサい", max: "超かっこいい" },
  { title: "理想の休日", min: "退屈", max: "最高" },
  { title: "なってみたい生き物", min: "なりたくない", max: "絶対なりたい" },
  { title: "憧れの有名人", min: "憧れない", max: "超憧れる" },
  { title: "泣けるシチュエーション", min: "泣けない", max: "号泣" },
  { title: "100万円あったら何に使う？", min: "しょうもない", max: "有意義" },
  { title: "最高のごちそう", min: "ふつう", max: "最高" },
  { title: "秘密基地に置きたいもの", min: "いらない", max: "絶対置きたい" },
  { title: "かっこいい乗り物", min: "ダサい", max: "超かっこいい" },
  { title: "一番落ち着く場所", min: "落ち着かない", max: "超落ち着く" },
  { title: "やってみたいアルバイト", min: "やりたくない", max: "絶対やりたい" },
  { title: "好きなテレビ番組", min: "見ない", max: "絶対見る" },
  { title: "理想の家", min: "住みたくない", max: "最高" },
  { title: "お弁当に入っていて嬉しいおかず", min: "テンション下がる", max: "最高" },
  { title: "一番怖いお化け", min: "怖くない", max: "超怖い" },
  { title: "かっこいい苗字", min: "ふつう", max: "超かっこいい" },
  { title: "可愛い動物", min: "可愛くない", max: "超可愛い" },
  { title: "無駄遣いしてしまったこと", min: "少し後悔", max: "大後悔" },
  { title: "好きなファストフード", min: "食べない", max: "毎日食べたい" },
  { title: "憧れの超能力", min: "いらない", max: "絶対欲しい" },
  { title: "総理大臣になって考えよう やりたいこと", min: "どうでもいい", max: "絶対やる" },
  { title: "好きな寿司ネタ", min: "食べない", max: "大好物" },
  { title: "絶対にやりたくない罰ゲーム", min: "余裕", max: "絶対ムリ" }
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
  const [currentTheme, setCurrentTheme] = useState<{title: string, min: string, max: string} | null>(null);

  const [myWord, setMyWord] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  // URLから自動的にルームIDを読み込む（招待用URLの処理）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get("room");
    if (urlRoom) {
      setRoomId(urlRoom);
    }
  }, []);

  // 部屋が決まったらFirebaseと同期を開始する
  useEffect(() => {
    if (!roomId) return;

    // 招待用URLの作成
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
    
    // 重複を避けて盤面に追加
    const newBoard = board.includes(name) ? [...board] : [...board, name];
    set(ref(db, `rooms/${roomId}/board`), newBoard);
  };

  const submitWord = () => {
    set(ref(db, `rooms/${roomId}/players/${name}/word`), myWord);
  };

  const pickRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * THEMES.length);
    set(ref(db, `rooms/${roomId}/theme`), THEMES[randomIndex]);
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
      // お題とカードだけリセットするためリロード
      window.location.href = shareUrl;
    }
  };

  // --- 🎨 デザイン用のスタイルオブジェクト定義 ---
  const containerStyle: React.CSSProperties = {
    fontFamily: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    padding: "20px 15px",
    color: "#333",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: "20px",
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "all 0.2s"
  });

  // ================= 参加前の画面 =================
  if (!isJoined) {
    return (
      <div style={{ ...containerStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ ...cardStyle, maxWidth: "420px", width: "100%", textAlign: "center", borderTop: "8px solid #ff4081" }}>
          <h1 style={{ color: "#ff4081", fontSize: "32px", margin: "0 0 10px 0", letterSpacing: "2px" }}>ito Rainbow</h1>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "25px" }}>価値観のニュアンスを合わせる協力ゲーム</p>
          
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", fontSize: "14px", display: "block", marginBottom: "6px" }}>🔑 部屋の名前（合言葉）</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="例: たなか家、room123 など"
              style={{ width: "94%", padding: "12px", fontSize: "16px", borderRadius: "8px", border: "2px solid #ddd" }}
            />
          </div>

          <div style={{ textAlign: "left", marginBottom: "30px" }}>
            <label style={{ fontWeight: "bold", fontSize: "14px", display: "block", marginBottom: "6px" }}>👤 あなたのニックネーム</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: たろう"
              style={{ width: "94%", padding: "12px", fontSize: "16px", borderRadius: "8px", border: "2px solid #ddd" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button onClick={() => joinGame(true)} style={buttonStyle("#ff9800")}>👑 部屋を作って参加（ホスト）</button>
            <button onClick={() => joinGame(false)} style={buttonStyle("#4caf50")}>👤 この部屋に参加（ゲスト）</button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 参加後のゲーム画面 =================
  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* URL共有バナー（おしゃれ版） */}
        <div style={{ ...cardStyle, background: "linear-gradient(45deg, #2196f3, #00bcd4)", color: "white", padding: "12px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "12px", opacity: 0.9 }}>お部屋の合言葉: <strong>{roomId}</strong></span>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>📱 LINE等で友達を招待しよう！</div>
            </div>
            <button onClick={copyUrl} style={{ padding: "8px 16px", backgroundColor: "white", color: "#2196f3", border: "none", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" }}>リンクをコピー</button>
          </div>
        </div>

        {/* お題表示エリア（レインボーカード風） */}
        <div style={{ ...cardStyle, background: "linear-gradient(135deg, #fff5f5 0%, #fff0f6 100%)", border: "3px solid #ff758c", textAlign: "center" }}>
          <div style={{ display: "inline-block", backgroundColor: "#ff758c", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", marginBottom: "10px" }}>🎯 今ラウンドのお題</div>
          
          {currentTheme ? (
            <div>
              <h2 style={{ margin: "5px 0 15px 0", color: "#4a0e17", fontSize: "24px" }}>{currentTheme.title}</h2>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.8)", padding: "12px 15px", borderRadius: "12px", border: "1px solid #ffb3c1" }}>
                <span style={{ color: "#1e88e5", fontWeight: "bold", fontSize: "13px" }}>🟦 1 : {currentTheme.min}</span>
                <span style={{ color: "#aaa" }}>◀ グラデーション ▶</span>
                <span style={{ color: "#e53935", fontWeight: "bold", fontSize: "13px" }}>🟥 100 : {currentTheme.max}</span>
              </div>
            </div>
          ) : (
            <p style={{ margin: "15px 0", fontSize: "18px", color: "#999", fontWeight: "bold" }}>ホストがお題を引くのを待っています...</p>
          )}
          
          {isHost && (
            <button onClick={pickRandomTheme} style={{ ...buttonStyle("#ff758c"), marginTop: "15px", fontSize: "14px", padding: "8px 20px" }}>
              {currentTheme ? "🔄 べつのお題を引く" : "🎲 お題をランダムで決める"}
            </button>
          )}
        </div>
        
        {/* 自分の秘密の数字カード（ITOカード風デザイン） */}
        <div style={{ ...cardStyle, background: "linear-gradient(135deg, #111 0%, #333 100%)", color: "white", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }}></div>
          <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.6 }}>Secret Number</span>
          <h3 style={{ margin: "5px 0", fontSize: "16px" }}>あなたの秘密の数字</h3>
          <div style={{ fontSize: "64px", fontWeight: "bold", color: "#ffd700", textShadow: "0 0 12px rgba(255,215,0,0.4)", margin: "10px 0" }}>
            {players[name]?.number}
          </div>
          
          <p style={{ fontSize: "13px", color: "#ccc", marginBottom: "12px" }}>数字の大きさを「言葉」に例えて全員に送信してください</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={myWord}
              onChange={(e) => setMyWord(e.target.value)}
              placeholder="例：ドアノブの静電気"
              style={{ padding: "12px", flex: 1, fontSize: "16px", borderRadius: "25px", border: "none", color: "#333" }}
            />
            <button onClick={submitWord} style={{ padding: "0 25px", backgroundColor: "#ff4081", color: "white", border: "none", borderRadius: "25px", fontWeight: "bold", cursor: "pointer" }}>送信</button>
          </div>
        </div>

        {/* みんなの並べ替えエリア */}
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>🧩 みんなの並べ替えエリア</h3>
          <p style={{ fontSize: "12px", color: "#888", margin: "0 0 15px 0" }}>💡 カードをドラッグして並び替えられます（全員に同期）</p>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#bbb", fontWeight: "bold", padding: "0 5px" }}>
            <span>◀ 小さい（1に近い）</span>
            <span>大きい（100に近い） ▶</span>
          </div>
          
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "15px 5px", minHeight: "180px", alignItems: "center" }}>
            {board.map((playerName, index) => {
              const p = players[playerName];
              if (!p) return null;
              
              let isRevealed = false;
              if (revealMode === "asc" && index <= revealIndex) isRevealed = true;
              if (revealMode === "desc" && (board.length - 1 - index) <= revealIndex) isRevealed = true;

              return (
                <div
                  key={playerName}
                  draggable={revealIndex === -1}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{
                    borderRadius: "12px",
                    width: "110px",
                    minWidth: "110px",
                    height: "150px",
                    background: isRevealed ? "linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)" : "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                    border: isRevealed ? "3px solid #fbc02d" : "2px solid #e0e0e0",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: revealIndex === -1 ? "grab" : "default",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.05)",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "4px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  </div>
                  
                  <div style={{ fontSize: "12px", color: p.word ? "#444" : "#bbb", fontWeight: p.word ? "bold" : "normal", textAlign: "center", wordBreak: "break-all", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "5px 0" }}>
                    {p.word || "入力待ち..."}
                  </div>
                  
                  <div style={{ textAlign: "center", backgroundColor: isRevealed ? "#fbc02d" : "#eee", borderRadius: "6px", padding: "4px 0" }}>
                    {isRevealed ? (
                      <span style={{ fontSize: "22px", fontWeight: "bold", color: "#d32f2f" }}>{p.number}</span>
                    ) : (
                      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#aaa" }}>?</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ホスト専用の答え合わせパネル */}
        {isHost && (
          <div style={{ ...cardStyle, backgroundColor: "#fff8e1", border: "2px solid #ffe082" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#f57c00", fontSize: "16px" }}>👑 ホスト専用 進行コントローラー</h3>
            
            {board.length === 0 ? (
              <p style={{ color: "#888", fontSize: "13px" }}>参加者が入室するのを待っています...</p>
            ) : revealIndex === -1 ? (
              <div>
                <p style={{ fontSize: "13px", marginBottom: "12px", color: "#666" }}>並び替えが終わったら、どちらからオープンするか全員に発表して選んでください：</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => startReveal("asc")} style={{ ...buttonStyle("#4caf50"), fontSize: "14px", flex: 1 }}>1（小さい順）から</button>
                  <button onClick={() => startReveal("desc")} style={{ ...buttonStyle("#2196f3"), fontSize: "14px", flex: 1 }}>100（大きい順）から</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e65100" }}>
                  📢 モード: {revealMode === "asc" ? "【小さい順】にオープン中！" : "【大きい順】にオープン中！"}
                </div>
                <button onClick={nextReveal} disabled={revealIndex >= board.length - 1} style={buttonStyle("#f57c00")}>
                  {revealIndex >= board.length - 1 ? "🎉 すべてめくりました！" : "🔥 次のカードをめくる！"}
                </button>
                <button onClick={resetGame} style={{ padding: "6px", backgroundColor: "transparent", color: "#f44336", border: "1px solid #f44336", borderRadius: "20px", cursor: "pointer", marginTop: "10px", fontSize: "12px", fontWeight: "bold" }}>
                  次ラウンドへ（部屋データをリセット）
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

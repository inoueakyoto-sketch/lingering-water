import React, { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
// @ts-ignore
import { db } from "./firebase";

// --- ito レインボー風 お題100選（1と100の基準付き） ---
const THEMES = [
  { title: "カバンに入っていたら嬉しいもの", min: "嬉しくない", max: "嬉しい" },
  { title: "朝ごはんに食べたいもの", min: "食べたくない", max: "食べたい" },
  { title: "奇跡の体験", min: "少し奇跡", max: "超奇跡" },
  {
    title: "お尻から出てきたらビックリするもの",
    min: "少しビックリ",
    max: "超ビックリ",
  },
  {
    title: "科学者になって考えよう 発明したい薬",
    min: "いらない",
    max: "絶対に欲しい",
  },
  {
    title: "中学生になって考えよう カッコいいもの",
    min: "カッコわるい",
    max: "カッコいい",
  },
  {
    title: "桃太郎になって考えよう 頼りになる家来",
    min: "頼りにならない",
    max: "超頼りになる",
  },
  { title: "赤ちゃんになって考えよう 最高の瞬間", min: "最悪", max: "最高" },
  {
    title: "魔王になって考えよう こんな勇者はイヤだ",
    min: "まだマシ",
    max: "超イヤだ",
  },
  {
    title: "1000円くらいまででできる楽しいこと",
    min: "そこそこ楽しい",
    max: "超楽しい",
  },
  {
    title: "学校の先生に怒られそうなこと",
    min: "怒られない",
    max: "絶対怒られる",
  },
  {
    title: "ショックを受けた好きな人のクセ",
    min: "少しショック",
    max: "超ショック",
  },
  { title: "ふだん聞く言葉の頻度", min: "あまり聞かない", max: "よく聞く" },
  { title: "動物園にいる動物の人気", min: "人気ない", max: "大人気" },
  {
    title: "祖父母になって考えよう 孫の嬉しい言葉",
    min: "ふつう",
    max: "超嬉しい",
  },
  { title: "踏んだら痛そうなもの", min: "痛くない", max: "激痛" },
  { title: "勇気ある行動", min: "勇気いらない", max: "超勇気いる" },
  {
    title: "分身ができたらやってほしいこと",
    min: "やってほしくない",
    max: "絶対やってほしい",
  },
  { title: "変顔の度合い（言葉で表現）", min: "ふつうの顔", max: "やばい変顔" },
  {
    title: "おみやげにもらったら嬉しいもの",
    min: "嬉しくない",
    max: "超嬉しい",
  },
  {
    title: "猫になって考えよう 心地のいい場所",
    min: "落ち着かない",
    max: "最高に心地いい",
  },
  { title: "幸せを感じること", min: "小さな幸せ", max: "最大の幸せ" },
  { title: "無人島に持っていきたいもの", min: "役に立たない", max: "絶対必要" },
  {
    title: "宇宙人になって考えよう 地球の不思議なもの",
    min: "普通",
    max: "超不思議",
  },
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
  {
    title: "お弁当に入っていて嬉しいおかず",
    min: "テンション下がる",
    max: "最高",
  },
  { title: "一番怖いお化け", min: "怖くない", max: "超怖い" },
  { title: "かっこいい苗字", min: "ふつう", max: "超かっこいい" },
  { title: "可愛い動物", min: "可愛くない", max: "超可愛い" },
  { title: "無駄遣いしてしまったこと", min: "少し後悔", max: "大後悔" },
  { title: "好きなファストフード", min: "食べない", max: "毎日食べたい" },
  { title: "憧れの超能力", min: "いらない", max: "絶対欲しい" },
  {
    title: "総理大臣になって考えよう やりたいこと",
    min: "どうでもいい",
    max: "絶対やる",
  },
  { title: "好きな寿司ネタ", min: "食べない", max: "大好物" },
  { title: "絶対にやりたくない罰ゲーム", min: "余裕", max: "絶対ムリ" },
  {
    title: "幽霊になって考えよう 驚かせる方法",
    min: "驚かない",
    max: "気絶する",
  },
  {
    title: "サンタクロースになって考えよう 配りたいもの",
    min: "いらない",
    max: "超嬉しい",
  },
  {
    title: "YouTuberになって考えよう バズる企画",
    min: "スベる",
    max: "大バズり",
  },
  {
    title: "社長になって考えよう 社員へのボーナス",
    min: "ケチ",
    max: "太っ腹",
  },
  {
    title: "映画監督になって考えよう 撮りたいジャンル",
    min: "つまらない",
    max: "超大作",
  },
  {
    title: "忍者になって考えよう 使える忍術",
    min: "役に立たない",
    max: "最強",
  },
  {
    title: "探偵になって考えよう 解決したい事件",
    min: "退屈な事件",
    max: "世紀の大事件",
  },
  {
    title: "勇者になって考えよう 最初の村の住人",
    min: "冷たい",
    max: "超親切",
  },
  {
    title: "アイドルになって考えよう 嬉しいファンサ",
    min: "嬉しくない",
    max: "超嬉しい",
  },
  { title: "神様になって考えよう 作りたい世界", min: "地獄", max: "天国" },
  {
    title: "鳥になって考えよう 飛びたい場所",
    min: "行きたくない",
    max: "絶景",
  },
  { title: "魚になって考えよう 泳ぎたい海", min: "ドブ川", max: "綺麗な海" },
  { title: "虫になって考えよう 嫌なこと", min: "まだマシ", max: "最悪" },
  { title: "花になって考えよう 咲きたい場所", min: "過酷", max: "最高の環境" },
  {
    title: "星になって考えよう 見られたい時",
    min: "見えない",
    max: "一番輝く",
  },
  { title: "風になって考えよう 吹きたい場所", min: "そよ風", max: "暴風" },
  { title: "雪になって考えよう 降りたい日", min: "迷惑", max: "ロマンチック" },
  {
    title: "炎になって考えよう 燃やしたいもの",
    min: "燃えない",
    max: "大炎上",
  },
  {
    title: "水になって考えよう 流れつきたい場所",
    min: "泥水",
    max: "オアシス",
  },
  { title: "土になって考えよう 育てたい植物", min: "雑草", max: "美しい花" },
  { title: "光になって考えよう 照らしたいもの", min: "闇", max: "希望" },
  {
    title: "闇になって考えよう 隠したいもの",
    min: "バレバレ",
    max: "絶対秘密",
  },
  {
    title: "時間になって考えよう 止めたい瞬間",
    min: "どうでもいい",
    max: "永遠にしたい",
  },
  { title: "空間になって考えよう 広げたい場所", min: "狭い", max: "無限" },
  {
    title: "重力になって考えよう 引き寄せたいもの",
    min: "反発",
    max: "超引力",
  },
  {
    title: "運命になって考えよう 出会わせたい人",
    min: "最悪の相性",
    max: "運命の人",
  },
  { title: "奇跡になって考えよう 起こしたいこと", min: "日常", max: "大奇跡" },
  { title: "夢になって考えよう 見せたい世界", min: "悪夢", max: "最高の夢" },
  {
    title: "希望になって考えよう 与えたいもの",
    min: "絶望",
    max: "大いなる希望",
  },
  { title: "愛になって考えよう 伝えたい言葉", min: "無関心", max: "最大の愛" },
  { title: "心になって考えよう 感じたいこと", min: "無感情", max: "大感動" },
  { title: "魂になって考えよう 宿りたいもの", min: "抜け殻", max: "最高の器" },
  { title: "命になって考えよう 生きたい長さ", min: "一瞬", max: "永遠" },
  {
    title: "未来になって考えよう 見せたい景色",
    min: "ディストピア",
    max: "ユートピア",
  },
  {
    title: "過去になって考えよう やり直したいこと",
    min: "後悔なし",
    max: "絶対やり直す",
  },
  {
    title: "現在になって考えよう 楽しみたいこと",
    min: "退屈",
    max: "最高に楽しい",
  },
];

export default function App() {
  const [name, setName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const [players, setPlayers] = useState<any>({});
  const [board, setBoard] = useState<string[]>([]);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [revealMode, setRevealMode] = useState<"asc" | "desc">("asc");
  const [currentTheme, setCurrentTheme] = useState<{
    title: string;
    min: string;
    max: string;
  } | null>(null);

  const [myWord, setMyWord] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    const playersRef = ref(db, "gameRoom/players");
    onValue(playersRef, (snapshot) => {
      if (snapshot.val()) setPlayers(snapshot.val());
      else setPlayers({});
    });

    const boardRef = ref(db, "gameRoom/board");
    onValue(boardRef, (snapshot) => {
      if (snapshot.val()) setBoard(snapshot.val());
      else setBoard([]);
    });

    const revealRef = ref(db, "gameRoom/reveal");
    onValue(revealRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRevealIndex(data.index);
        setRevealMode(data.mode);
      } else {
        setRevealIndex(-1);
      }
    });

    const themeRef = ref(db, "gameRoom/theme");
    onValue(themeRef, (snapshot) => {
      if (snapshot.val()) setCurrentTheme(snapshot.val());
      else setCurrentTheme(null);
    });
  }, []);

  const joinGame = (hostFlag: boolean) => {
    if (name === "") return alert("名前を入力してください！");

    setIsHost(hostFlag);
    setIsJoined(true);

    const randomNumber = Math.floor(Math.random() * 100) + 1;

    set(ref(db, "gameRoom/players/" + name), {
      name: name,
      number: randomNumber,
      word: "",
    });

    setBoard((prev) => {
      if (prev.includes(name)) return prev;
      const newBoard = [...prev, name];
      set(ref(db, "gameRoom/board"), newBoard);
      return newBoard;
    });
  };

  const submitWord = () => {
    set(ref(db, "gameRoom/players/" + name + "/word"), myWord);
  };

  const pickRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * THEMES.length);
    const selectedTheme = THEMES[randomIndex];
    set(ref(db, "gameRoom/theme"), selectedTheme);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    alert("URLをコピーしました！友達にLINEなどで送ってください。");
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("dragIndex", index.toString());
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"));
    if (dragIndex === dropIndex) return;

    const newBoard = [...board];
    const [draggedItem] = newBoard.splice(dragIndex, 1);
    newBoard.splice(dropIndex, 0, draggedItem);

    set(ref(db, "gameRoom/board"), newBoard);
  };

  const startReveal = (mode: "asc" | "desc") => {
    set(ref(db, "gameRoom/reveal"), { index: 0, mode: mode });
  };
  const nextReveal = () => {
    set(ref(db, "gameRoom/reveal/index"), revealIndex + 1);
  };
  const resetGame = () => {
    if (window.confirm("ゲームをリセットして最初から遊びますか？")) {
      set(ref(db, "gameRoom"), null);
      window.location.reload();
    }
  };

  // 参加前の画面
  if (!isJoined) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          fontFamily: "sans-serif",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <h1>ito ウェブアプリ</h1>
        <p style={{ color: "#666" }}>
          ニックネームを入力して参加方法を選んでください
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="あなたのニックネーム"
          style={{
            padding: "12px",
            fontSize: "16px",
            marginBottom: "20px",
            width: "90%",
            border: "2px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div
            style={{
              backgroundColor: "#fff3e0",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <button
              onClick={() => joinGame(true)}
              style={{
                padding: "12px 20px",
                backgroundColor: "#ff9800",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
                width: "100%",
                fontWeight: "bold",
              }}
            >
              👑 部屋を作る（ホスト）
            </button>
          </div>
          <div
            style={{
              backgroundColor: "#e8f5e9",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <button
              onClick={() => joinGame(false)}
              style={{
                padding: "12px 20px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
                width: "100%",
                fontWeight: "bold",
              }}
            >
              👤 ゲストとして参加する
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 参加後の画面
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* 直接書き込んだURL共有エリア */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "10px",
          borderRadius: "6px",
          marginBottom: "20px",
          fontSize: "14px",
          border: "1px dashed #ccc",
        }}
      >
        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
          📱 みんなに共有するURL：
        </p>
        <div style={{ display: "flex", gap: "5px" }}>
          <input
            type="text"
            readOnly
            value={currentUrl}
            style={{ flex: 1, padding: "5px", color: "#666" }}
          />
          <button
            onClick={copyUrl}
            style={{
              padding: "5px 10px",
              cursor: "pointer",
              backgroundColor: "#e0e0e0",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            コピー
          </button>
        </div>
      </div>

      <h2>{isHost ? "👑 ホスト画面" : "👤 参加者画面"}</h2>

      <div
        style={{
          backgroundColor: "#fce4ec",
          border: "2px solid #f8bbd0",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h3
          style={{ margin: "0 0 10px 0", color: "#c2185b", fontSize: "16px" }}
        >
          🎯 今ラウンドのお題
        </h3>

        {currentTheme ? (
          <div>
            <p
              style={{
                margin: "0 0 15px 0",
                fontSize: "22px",
                fontWeight: "bold",
                color: "#880e4f",
              }}
            >
              {currentTheme.title}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: "10px 15px",
                borderRadius: "8px",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <span style={{ color: "#2196f3", fontSize: "14px" }}>
                ◀ 1: {currentTheme.min}
              </span>
              <span style={{ fontSize: "20px", color: "#ccc" }}>〜</span>
              <span style={{ color: "#f44336", fontSize: "14px" }}>
                100: {currentTheme.max} ▶
              </span>
            </div>
          </div>
        ) : (
          <p
            style={{
              margin: "10px 0",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#880e4f",
            }}
          >
            （ホストがお題を決定中...）
          </p>
        )}

        {isHost && (
          <button
            onClick={pickRandomTheme}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#e91e63",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {currentTheme ? "🔄 お題を引き直す" : "🎲 お題をランダムで決める"}
          </button>
        )}
      </div>

      <div
        style={{
          backgroundColor: "#e3f2fd",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>
          あなたの数字:{" "}
          <span style={{ color: "#d32f2f", fontSize: "28px" }}>
            {players[name]?.number}
          </span>
        </h3>
        <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#555" }}>
          お題に沿った言葉を入力して送信してください
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={myWord}
            onChange={(e) => setMyWord(e.target.value)}
            placeholder="例：ドアノブの静電気"
            style={{ padding: "10px", flex: 1, fontSize: "16px" }}
          />
          <button
            onClick={submitWord}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            送信
          </button>
        </div>
      </div>

      <hr style={{ margin: "25px 0" }} />

      <h3>みんなの並べ替えエリア</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>
        💡 カードをドラッグ＆ドロップで動かせます（全員の画面で同期）
        <br />← 1に近い 100に近い →
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          padding: "10px 0",
          minHeight: "150px",
        }}
      >
        {board.map((playerName, index) => {
          const p = players[playerName];
          if (!p) return null;

          let isRevealed = false;
          if (revealMode === "asc" && index <= revealIndex) isRevealed = true;
          if (revealMode === "desc" && board.length - 1 - index <= revealIndex)
            isRevealed = true;

          return (
            <div
              key={playerName}
              draggable={revealIndex === -1}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              style={{
                border: "2px solid #ccc",
                borderRadius: "8px",
                width: "120px",
                minWidth: "120px",
                backgroundColor: isRevealed ? "#fff9c4" : "white",
                padding: "10px",
                cursor: revealIndex === -1 ? "grab" : "default",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
              }}
            >
              <p
                style={{
                  margin: "0 0 10px 0",
                  fontWeight: "bold",
                  fontSize: "14px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "5px",
                }}
              >
                {p.name}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: p.word ? "#333" : "#999",
                  minHeight: "40px",
                  wordBreak: "break-all",
                }}
              >
                {p.word || "考え中..."}
              </p>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  height: "30px",
                }}
              >
                {isRevealed ? (
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#d32f2f",
                    }}
                  >
                    {p.number}
                  </span>
                ) : (
                  <span style={{ fontSize: "28px", color: "#ccc" }}>?</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isHost && (
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "#fff3e0",
            borderRadius: "8px",
            border: "1px solid #ffe0b2",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#e65100" }}>
            👑 ホスト専用 進行コントローラー
          </h3>

          {board.length === 0 ? (
            <p style={{ color: "#666", fontSize: "14px" }}>
              現在、参加者の入室を待っています...
            </p>
          ) : revealIndex === -1 ? (
            <div>
              <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                全員のカードの並び替えが終わったら、どちらからオープンするか選んでください：
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => startReveal("asc")}
                  style={{
                    padding: "12px",
                    flex: 1,
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  1（小さい方）からめくる
                </button>
                <button
                  onClick={() => startReveal("desc")}
                  style={{
                    padding: "12px",
                    flex: 1,
                    backgroundColor: "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  100（大きい方）からめくる
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{ display: "flex", gap: "10px", flexDirection: "column" }}
            >
              <p style={{ fontSize: "14px", margin: 0 }}>
                ...オープン中：
                <strong>
                  {revealMode === "asc"
                    ? "小さい方から順にオープン中"
                    : "大きい方から順にオープン中"}
                </strong>
              </p>
              <button
                onClick={nextReveal}
                disabled={revealIndex >= board.length - 1}
                style={{
                  padding: "15px",
                  fontSize: "18px",
                  backgroundColor: "#ff9800",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              >
                {revealIndex >= board.length - 1
                  ? "🎉 すべてめくりました！"
                  : "🔥 次のカードをめくる！"}
              </button>
              <button
                onClick={resetGame}
                style={{
                  padding: "8px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "15px",
                  fontSize: "12px",
                }}
              >
                ゲームをリセットして次のラウンドへ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

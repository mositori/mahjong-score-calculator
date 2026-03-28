import { useState } from 'react';
import type { FuInputData } from '../types';

type Props = {
  onSubmit: (data: FuInputData) => void;
};

type MentsuType = {
  id: string;
  label: string;
  fu: number;
};

const basicMentsu: MentsuType[] = [
  { id: 'minko_chun', label: '明刻（2〜8）', fu: 2 },
  { id: 'minko_yao', label: '明刻（1,9,字）', fu: 4 },
  { id: 'anko_chun', label: '暗刻（2〜8）', fu: 4 },
  { id: 'anko_yao', label: '暗刻（1,9,字）', fu: 8 },
];

const kanMentsu: MentsuType[] = [
  { id: 'minkan_chun', label: '明槓（2〜8）', fu: 8 },
  { id: 'minkan_yao', label: '明槓（1,9,字）', fu: 16 },
  { id: 'ankan_chun', label: '暗槓（2〜8）', fu: 16 },
  { id: 'ankan_yao', label: '暗槓（1,9,字）', fu: 32 },
];

export function StepFuInput({ onSubmit }: Props) {
  const [waitType, setWaitType] = useState<'open' | 'closed'>('open');
  const [isYakuhaiHead, setIsYakuhaiHead] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showKan, setShowKan] = useState(false);

  const updateCount = (id: string, delta: number) => {
    setCounts((prev) => {
      const next = Math.max(0, Math.min(4, (prev[id] ?? 0) + delta));
      return { ...prev, [id]: next };
    });
  };

  const mentsuFu = [...basicMentsu, ...kanMentsu].reduce(
    (sum, m) => sum + m.fu * (counts[m.id] ?? 0),
    0,
  );

  const handleSubmit = () => {
    onSubmit({ waitType, isYakuhaiHead, mentsuFu });
  };

  const handleNoKotsu = () => {
    onSubmit({ waitType, isYakuhaiHead, mentsuFu: 0 });
  };

  return (
    <div className="step">
      <h2 className="step-question">符の計算</h2>

      <div className="fu-section">
        <h3 className="fu-section-title">待ちの形</h3>
        <p className="step-hint">待ち牌が2種以上なら両面系</p>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${waitType === 'open' ? 'active' : ''}`}
            onClick={() => setWaitType('open')}
          >
            両面・シャンポン
          </button>
          <button
            className={`toggle-btn ${waitType === 'closed' ? 'active' : ''}`}
            onClick={() => setWaitType('closed')}
          >
            嵌張・辺張・単騎
          </button>
        </div>
      </div>

      <div className="fu-section">
        <h3 className="fu-section-title">雀頭（頭）</h3>
        <p className="step-hint">白・發・中・場風牌・自風牌</p>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${!isYakuhaiHead ? 'active' : ''}`}
            onClick={() => setIsYakuhaiHead(false)}
          >
            役牌以外
          </button>
          <button
            className={`toggle-btn ${isYakuhaiHead ? 'active' : ''}`}
            onClick={() => setIsYakuhaiHead(true)}
          >
            役牌
          </button>
        </div>
      </div>

      <div className="fu-section">
        <h3 className="fu-section-title">刻子・槓子</h3>
        <button className="shortcut-btn" onClick={handleNoKotsu}>
          刻子なし（順子のみ）→ 次へ
        </button>

        <div className="counter-list">
          {basicMentsu.map((m) => (
            <div key={m.id} className="counter-row">
              <span className="counter-label">
                {m.label}
                <span className="counter-fu">+{m.fu}符</span>
              </span>
              <div className="counter-controls">
                <button className="counter-btn" onClick={() => updateCount(m.id, -1)}>-</button>
                <span className="counter-value">{counts[m.id] ?? 0}</span>
                <button className="counter-btn" onClick={() => updateCount(m.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {!showKan && (
          <button className="expand-btn" onClick={() => setShowKan(true)}>
            槓子がある
          </button>
        )}

        {showKan && (
          <div className="counter-list">
            {kanMentsu.map((m) => (
              <div key={m.id} className="counter-row">
                <span className="counter-label">
                  {m.label}
                  <span className="counter-fu">+{m.fu}符</span>
                </span>
                <div className="counter-controls">
                  <button className="counter-btn" onClick={() => updateCount(m.id, -1)}>-</button>
                  <span className="counter-value">{counts[m.id] ?? 0}</span>
                  <button className="counter-btn" onClick={() => updateCount(m.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {mentsuFu > 0 && (
          <div className="fu-total">刻子・槓子の符: +{mentsuFu}</div>
        )}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>次へ</button>
    </div>
  );
}

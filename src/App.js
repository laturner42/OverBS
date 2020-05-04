import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css';

const client = new W3CWebSocket('ws://127.0.0.1:6557/socket');


function App() {
  const [loading, setLoading] = useState(true);
  const [beatmap, setBeatmap] = useState(null);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      setLoading(false);
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const { event, status } = data;

      if (event === 'songStart' || event === 'menu' || event === 'hello') {
        setBeatmap(status.beatmap);
        setPerformance(status.performance);
      } else if (event === 'scoreChanged' || event ==='noteMissed') {
        setPerformance(status.performance);
      }
    };
  }, []);

  const renderPerformance = () => {
    if (!performance) return null;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'absolute',
          left: 10,
          top: 5,
        }}
      >
        <span style={{ fontSize: 30, marginBottom: -8 }}>Notes: {performance.hitNotes}/{performance.passedNotes} ({((performance.hitNotes/performance.passedNotes)*100).toFixed(1)}%)</span>
        <span style={{ fontSize: 30, marginBottom: -8 }}>Score: {performance.score} ({performance.rank})</span>
        <span style={{ fontSize: 30, marginBottom: -8 }}>Combo: {performance.combo}</span>
      </div>
    );
  }

  const renderPerformance2 = () => {
    if (!performance || !beatmap) return null;

    const progression = ((beatmap.length - (new Date().getTime() - beatmap.start))/1000);
    const mins = Math.floor(progression / 60);
    const secs = Math.floor(progression % 60);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          position: 'absolute',
          right: 10,
          top: 5,
        }}
      >
        <span style={{ fontSize: 30, marginBottom: -8 }}>Difficulty: {beatmap.difficulty}</span>
      <span style={{ fontSize: 30, marginBottom: -8 }}>Remaining: {mins > 0 && `${mins}m`}{secs}s</span>
        <span style={{ fontSize: 30, marginBottom: -8 }}>Max Combo: {performance.maxCombo}</span>
      </div>
    );
  }

  const renderBeatmap = () => {
    if (!beatmap) return null;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span style={{ fontSize: 35, marginBottom: -12 }}>{beatmap.songName} {beatmap.songSubName}</span>
        <span style={{ fontSize: 25, marginBottom: -8 }}>by {beatmap.songAuthorName}</span>
        { beatmap.levelAuthorName && <span style={{ fontSize: 23 }}>beatmap by {beatmap.levelAuthorName}</span> }
      </div>
    );
  };

  return (
    <div className="App">
      {loading && <span style={{ color: 'red' }}>OverBS could not connect to Beat Saber HTTP Status</span>}
      {renderBeatmap()}
      {renderPerformance()}
      {renderPerformance2()}
    </div>
  );
}

export default App;

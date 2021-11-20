import { useState } from "react";

const useVisualMode = function (initial) {
  const [mode, setMode] = useState(initial);
  // history = [first, second, third]
  // [FIRST, SECOND]
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    if (replace) {
      return setMode(mode);
    }
    
    setMode(mode);
    setHistory([...history, mode]);
  }

  function back() {
    if (history.length >= 2) {
      const newHistory = history.slice(0, history.length - 1);
      setHistory(newHistory);
      setMode(newHistory[newHistory.length - 1]);
    }
  }
  
  return { mode, transition, back };
};

export default useVisualMode;
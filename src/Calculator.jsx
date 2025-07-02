import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaBackspace, FaMemory, FaHistory } from 'react-icons/fa';
import './App.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState('');
  const [operation, setOperation] = useState(null);
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleNumber = (value) => {
    if (waitingForOperand) {
      setDisplay(value);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? value : display + value);
    }
  };

  const handleOperation = (op) => {
    if (display === '0' && previous === '') return;
    
    const inputValue = parseFloat(display);
    
    if (previous === '') {
      setPrevious(inputValue.toString());
    } else if (operation) {
      const result = performCalculation();
      setDisplay(result.toString());
      setPrevious(result.toString());
    }
    
    setOperation(op);
    setWaitingForOperand(true);
  };

  const performCalculation = () => {
    const prev = parseFloat(previous);
    const current = parseFloat(display);
    
    switch (operation) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '*': return prev * current;
      case '/': return current === 0 ? NaN : prev / current;
      case '^': return Math.pow(prev, current);
      default: return current;
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevious('');
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleClearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const toggleSign = () => {
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };

  const calculatePercent = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  // Memory functions
  const memoryAdd = () => {
    const currentValue = parseFloat(display) || 0;
    setMemory(memory + currentValue);
  };

  const memorySubtract = () => {
    const currentValue = parseFloat(display) || 0;
    setMemory(memory - currentValue);
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
    setWaitingForOperand(false);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  // Scientific functions
  const squareRoot = () => {
    const num = parseFloat(display);
    setDisplay(num >= 0 ? Math.sqrt(num).toString() : 'Error');
  };

  const powerOfTwo = () => {
    setDisplay((parseFloat(display) ** 2).toString());
  };

  const reciprocal = () => {
    const num = parseFloat(display);
    setDisplay(num !== 0 ? (1 / num).toString() : 'Error');
  };

  const calculate = () => {
    if (operation === null || previous === '') return;
    
    const result = performCalculation();
    
    if (isNaN(result)) {
      setDisplay('Error');
    } else {
      const entry = `${previous} ${operation} ${display} = ${result}`;
      setHistory([entry, ...history.slice(0, 9)]);
      setDisplay(result.toString());
    }
    
    setPrevious('');
    setOperation(null);
    setWaitingForOperand(true);
  };

  const handleKeyDown = (e) => {
    const key = e.key;
    if (/[0-9]/.test(key)) handleNumber(key);
    else if (['+', '-', '*', '/', '^'].includes(key)) handleOperation(key);
    else if (key === 'Enter' || key === '=') calculate();
    else if (key === 'Backspace') handleBackspace();
    else if (key === 'Escape') handleClear();
    else if (key === '.') {
      if (!display.includes('.')) {
        handleNumber('.');
      }
    }
    else if (key === '%') calculatePercent();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className={`calculator-container ${darkMode ? 'dark' : ''}`}>
      <div className="calculator">
        <div className="top-controls">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
            <FaHistory />
          </button>
        </div>

        {showHistory && (
          <div className="history-panel">
            <h3>Calculation History</h3>
            <ul>
              {history.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="memory-functions">
          <button onClick={memoryClear}>MC</button>
          <button onClick={memoryRecall}>MR</button>
          <button onClick={memoryAdd}>M+</button>
          <button onClick={memorySubtract}>M-</button>
          <span className="memory-value">M: {memory}</span>
        </div>

        <div className="display">
          <div className="previous-operation">
            {previous} {operation}
          </div>
          <div className="current-display">{display}</div>
        </div>

        <div className="buttons-grid">
          <div className="scientific-buttons">
            <button onClick={squareRoot}>√</button>
            <button onClick={powerOfTwo}>x²</button>
            <button onClick={reciprocal}>1/x</button>
            <button onClick={() => handleOperation('^')}>x^y</button>
          </div>

          <div className="main-buttons">
            <button className="clear" onClick={handleClear}>AC</button>
            <button className="clear-entry" onClick={handleClearEntry}>CE</button>
            <button onClick={handleBackspace}><FaBackspace /></button>
            <button onClick={toggleSign}>+/-</button>
            <button onClick={calculatePercent}>%</button>

            <button onClick={() => handleNumber('7')}>7</button>
            <button onClick={() => handleNumber('8')}>8</button>
            <button onClick={() => handleNumber('9')}>9</button>
            <button className="operator" onClick={() => handleOperation('/')}>÷</button>

            <button onClick={() => handleNumber('4')}>4</button>
            <button onClick={() => handleNumber('5')}>5</button>
            <button onClick={() => handleNumber('6')}>6</button>
            <button className="operator" onClick={() => handleOperation('*')}>×</button>

            <button onClick={() => handleNumber('1')}>1</button>
            <button onClick={() => handleNumber('2')}>2</button>
            <button onClick={() => handleNumber('3')}>3</button>
            <button className="operator" onClick={() => handleOperation('-')}>−</button>

            <button className="zero" onClick={() => handleNumber('0')}>0</button>
            <button onClick={() => {
              if (!display.includes('.')) {
                handleNumber('.');
              }
            }}>.</button>
            <button className="equals" onClick={calculate}>=</button>
            <button className="operator" onClick={() => handleOperation('+')}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

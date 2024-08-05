import { useEffect } from "react";
import { useState } from "react";

let id = 0;

function History({ history }) {
  let component;

  if (history.type === 'long-break') {
    component = <div className="history history-break"></div>;
  } else {
    component = <div className="history"></div>;
  }

  return component;
}

function HistoryContainer({ histories }) {
  let components = histories.map(history => <History key={history.id} history={history} />);
  return (
    <div className="history-container">{components}</div>
  );
}

function Timer({ isStart, todo, onTimeChange }) {
  if (isStart) {
    setTimeout(onTimeChange, 1000);
  }

  const minuteText = `${todo.minute}`.padStart(2, 0);
  const secondText = `${todo.second}`.padStart(2, 0);

  return (
    <div className="timer">{minuteText}:{secondText}</div>
  );
}

function Control({ isStart, onBtnClick }) {
  const text = isStart ? 'stop' : 'start';

  return (
    <div className="control" onClick={onBtnClick}>
      {text}
    </div>
  );
}

function Pomodoro() {
  const [isStart, setIsStart] = useState(false);
  const [histories, setHistories] = useState([]);
  const [todo, setTodo] = useState({
    id: ++id,
    minute: 25,
    second: 0,
    type: 'todo'
  });

  useEffect(() => {
    if (histories.length > 0) {
      let todoData = {id: ++id};
      let isLongBreak = histories.length % 4 === 0;
      if (isLongBreak) {
        todoData = {
          ...todoData,
          minute: 15,
          second: 0,
          type: 'long-break'
        };
      } else {
        const lastTodo = histories[histories.length - 1];
        if (lastTodo.type === 'todo') {
          todoData = {
            ...todoData,
            minute: 5,
            second: 0,
            type: 'short-break'
          };
        } else if (lastTodo.type === 'short-break' || lastTodo.type === 'long-break') {
          todoData = {
            ...todoData,
            minute: 25,
            second: 0,
            type: 'todo'
          };
        }
      }
      setTodo(todoData);
    }
  }, [histories]);

  function onTimeChange() {
    if (todo.minute === 0 && todo.second === 0) {
      setIsStart(false);
      setHistories([...histories, { id: todo.id, type: todo.type }]);
      return;
    }

    let newTodo = { ...todo };
    if (newTodo.second == 0 && newTodo.minute != 0) {
      newTodo.second = 59;
      newTodo.minute = newTodo.minute - 1;
    } else if (newTodo.second > 0) {
      newTodo.second = newTodo.second - 1;
    }
    setTodo(newTodo);
  }

  function handleBtnClick() {
    setIsStart(!isStart);
  }

  let title;
  switch (todo.type) {
    case 'todo':
      title = 'focus';
      break;
    case 'short-break':
    case 'long-break':
      title = 'relax';
      break;
  }

  return (
    <div className="pomodoro">
        <h2 className="title">{title}</h2>
        <Timer isStart={isStart} todo={todo} onTimeChange={onTimeChange} />
        <Control isStart={isStart} onBtnClick={handleBtnClick} />
        <HistoryContainer histories={histories} />
    </div>
  );
}

function App() {
  return (
    <div className="app">
     <Pomodoro />
    </div>
  )
}

export default App

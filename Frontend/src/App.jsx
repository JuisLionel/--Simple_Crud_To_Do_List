import { FaTrashCan } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import Confirmation from "./Components/confirmation.jsx";
import Loading from "./Components/Loading.jsx";
import Error from "./Components/Error.jsx";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);
  const [textValue, setTextValue] = useState("");

  const [confirmation, setConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const inputRef = useRef(null);
  const clickTimeout = useRef(null);

  // --- Helpers ---
  const api = axios.create({
    baseURL: "http://localhost:9000/api",
    timeout: 10000,
  });

  // --- Fetch tasks on mount ---
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/data");
        if (!mounted) return;
        setTasks(res.data || []);
      } catch (err) {
        setErrorMessage(`Error fetching data: ${err.message}`);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
      clearTimeout(clickTimeout.current);
    };
  }, []);

  // --- Add task ---
  const addTask = async () => {
    if (taskInput.trim() === "") return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.post("/data", { task: taskInput.trim(), finish: false });
      setTasks((prev) => [...prev, res.data]);
      setTaskInput("");
    } catch (err) {
      setErrorMessage(`Error adding task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Clear all tasks ---
  const clearAllTasks = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await api.delete("/data");
      setTasks([]);
    } catch (err) {
      setErrorMessage(`Error deleting all tasks: ${err.message}`);
    } finally {
      setLoading(false);
      setConfirmation(false);
    }
  };

  // --- Start editing by array index ---
  const startEditing = (arrIndex) => {
    if (arrIndex < 0 || arrIndex >= tasks.length) return;
    setEditingIndex(arrIndex);
    setTextValue(tasks[arrIndex].task);
    // focus next tick
    setTimeout(() => inputRef.current?.focus(), 20);
  };

  // --- Save edit ---
  const handleSave = async (arrIndex) => {
    const taskToUpdate = tasks[arrIndex];
    if (!taskToUpdate) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.put(`/data/${taskToUpdate.index}`, {
        task: textValue,
        finish: taskToUpdate.finish,
      });
      setTasks((prev) => {
        const copy = [...prev];
        copy[arrIndex] = res.data;
        return copy;
      });
      setEditingIndex(null);
    } catch (err) {
      setErrorMessage(`Error updating task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setEditingIndex(null);

  // --- Toggle finish by array index (double-click target) ---
  const toggleFinish = async (arrIndex) => {
    const task = tasks[arrIndex];
    if (!task) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.put(`/data/${task.index}`, {
        task: task.task,
        finish: !task.finish,
      });
      setTasks((prev) => {
        const copy = [...prev];
        copy[arrIndex] = res.data;
        return copy;
      });
    } catch (err) {
      setErrorMessage(`Error toggling finish: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete single task by DB id ---
  const deleteTaskById = async (id) => {
    if (id == null) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      await api.delete(`/data/${id}`);
      setTasks((prev) => prev.filter((t) => t.index !== id));
    } catch (err) {
      setErrorMessage(`Error deleting task: ${err.message}`);
    } finally {
      setLoading(false);
      setConfirmation(false);
      setDeleteIndex(null);
    }
  };

  const handleSingleClick = (arrIndex) => {
    clearTimeout(clickTimeout.current);

    clickTimeout.current = setTimeout(() => {
      if (editingIndex !== arrIndex) startEditing(arrIndex);
    }, 200);
  };

  const handleDoubleClick = (arrIndex) => {
    clearTimeout(clickTimeout.current);
    toggleFinish(arrIndex);
  };

  // --- Render guards ---
  if (loading) return <Loading />;
  if (errorMessage) return <Error Message={errorMessage} />;

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 w-screen h-screen">
      <div className="bg-white w-[500px] h-[600px] rounded p-5 shadow-[0_0_5px_2px_#4d4d4d65]">
        <h1 className="text-4xl font-bold mb-5">Todo App</h1>

        {/* Input Section */}
        <div className="flex items-center gap-2">
          <input
            value={taskInput}
            placeholder="Type here..."
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
              else if (e.key === "Escape") setTaskInput("");
            }}
            onChange={(e) => setTaskInput(e.target.value)}
            className="h-[50px] w-[400px] border border-gray-500 text-gray-500 rounded p-3 text-[15px]"
          />
          <button
            onClick={addTask}
            className="w-[50px] h-[50px] hover:bg-purple-800 hover:scale-105 transition-all duration-150 ease-in-out bg-purple-700 rounded text-2xl text-white flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>

        {/* Tasks List */}
        <div className="overflow-y-auto w-full h-[65%] mt-5 mb-5 no-scroll">
          {tasks.map((item, arrIndex) => (
            <div className="flex items-center gap-2 mb-[11px] group relative" key={item.index}>

              {/* Confirmation modal for single delete */}
              {confirmation && deleteIndex === item.index && (
                <Confirmation
                  deleteTask={() => deleteTaskById(item.index)}
                  setConfirmation={setConfirmation}
                  index={item.index}
                />
              )}

              <div
                className={`h-[50px] font-bold ${editingIndex === arrIndex ? "bg-gray-400 border border-gray-600" : "bg-gray-200 group-hover:w-[400px]"
                  } p-2 rounded flex items-center transition-all duration-200 w-full`}
              >
                {editingIndex === arrIndex ? (
                  <input
                    ref={inputRef}
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave(arrIndex);
                      if (e.key === "Escape") handleCancel();
                    }}
                    autoFocus
                    className="text-[16px] outline-none ring-0 w-full"
                  />
                ) : (
                  <div
                    onClick={() => handleSingleClick(arrIndex)}
                    onDoubleClick={() => handleDoubleClick(arrIndex)}
                    className="cursor-pointer w-full h-full flex items-center justify-between"
                  >
                    <h1 className={`text-[16px] ${item.finish ? "line-through text-gray-500" : "text-black"}`}>
                      {item.task}
                    </h1>
                  </div>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.7 }}
                onClick={() => {
                  setDeleteIndex(item.index); 
                  setConfirmation(true);
                }}
                transition={{ type: "spring", stiffness: 600, damping: 50 }}
                className={`absolute right-1 w-[50px] h-[50px] rounded bg-red-600 flex justify-center items-center text-white text-3xl transition-all duration-500
                    ${editingIndex === arrIndex
                    ? "opacity-0 invisible pointer-events-none"
                    : "opacity-0 invisible pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible"
                  }`}
              >
                <FaTrashCan />
              </motion.button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-bold">You have {tasks.length} pending tasks</h1>
          <button
            onClick={() => {
              if (tasks.length === 0) return;
              setDeleteIndex(null); 
              setConfirmation(true);
            }}
            className="w-[150px] h-[50px] hover:bg-purple-800 hover:scale-105 transition-all duration-150 ease-in-out bg-purple-700 rounded text-white flex items-center justify-center"
          >
            Clear All Task
          </button>
        </div>
        
        {confirmation && deleteIndex === null && (
          <Confirmation deleteTask={clearAllTasks} setConfirmation={setConfirmation} index={null} />
        )}
      </div>
    </div>
  );
}

export default App;

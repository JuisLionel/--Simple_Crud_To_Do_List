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

    // Fetch tasks on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:9000/api/data");
                setTasks(response.data);
            } catch (err) {
                setErrorMessage(`Error fetching data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addTask = async () => {
        if (taskInput.trim() === "") return;
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:9000/api/data", {
                task: taskInput,
                finish: false
            });
            setTasks([...tasks, response.data]);
            setTaskInput("");
        } catch (err) {
            setErrorMessage(`Error adding task: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const clearAllTasks = async () => {
        setLoading(true);
        try {
            await axios.delete("http://localhost:9000/api/data");
            setTasks([]);
        } catch (err) {
            setErrorMessage(`Error deleting all tasks: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setTextValue(tasks[index].task);
    };

    const handleSave = async (index) => {
        const taskToUpdate = tasks[index];
        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:9000/api/data/${taskToUpdate.index}`,
                {
                    task: textValue,
                    finish: taskToUpdate.finish
                }
            );
            const updatedTasks = [...tasks];
            updatedTasks[index] = response.data;
            setTasks(updatedTasks);
            setEditingIndex(null);
        } catch (err) {
            setErrorMessage(`Error updating task: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => setEditingIndex(null);

    const toggleFinish = async (index) => {
        const taskToToggle = tasks[index];
        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:9000/api/data/${taskToToggle.index}`,
                {
                    task: taskToToggle.task,
                    finish: !taskToToggle.finish
                }
            );
            const updatedTasks = [...tasks];
            updatedTasks[index] = response.data;
            setTasks(updatedTasks);
        } catch (err) {
            setErrorMessage(`Error toggling finish: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (index) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:9000/api/data/${index}`);
            setTasks(tasks.filter((t) => t.index !== index));
        } catch (err) {
            setErrorMessage(`Error deleting task: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (errorMessage) return <Error Message={errorMessage} />;

    return (
        <div className='flex justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 w-screen h-screen'>
            <div className='bg-white w-[500px] h-[600px] rounded p-5 shadow-[0_0_5px_2px_#4d4d4d65]'>
                <h1 className='text-4xl font-bold mb-5'>Todo App</h1>

                {/* Input Section */}
                <div className='flex items-center gap-2'>
                    <input
                        value={taskInput}
                        placeholder="Type here..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") addTask();
                            else if (e.key === "Escape") setTaskInput("");
                        }}
                        onChange={(e) => setTaskInput(e.target.value)}
                        className='h-[50px] w-[400px] border border-gray-500 text-gray-500 rounded p-3 text-[15px]'
                    />
                    <button
                        onClick={addTask}
                        className='w-[50px] h-[50px] hover:bg-purple-800 hover:scale-105 transition-all duration-150 ease-in-out bg-purple-700 rounded text-2xl text-white flex items-center justify-center'
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Tasks List */}
                <div className='overflow-y-auto w-full h-[65%] mt-5 mb-5 no-scroll'>
                    {tasks.map((item, index) => (
                        <div className='flex items-center gap-2 mb-[11px] group relative' key={item.index}>
                            {confirmation && deleteIndex === item.index && (
                                <Confirmation
                                    deleteTask={() => deleteTask(item.index)}
                                    setConfirmation={setConfirmation}
                                    index={item.index}
                                />
                            )}
                            <div
                                className={`h-[50px] font-bold ${
                                    editingIndex === index
                                        ? "bg-gray-400 border border-gray-600"
                                        : "bg-gray-200 group-hover:w-[400px]"
                                } p-2 rounded flex items-center transition-all duration-200 w-full`}
                            >
                                {editingIndex === index ? (
                                    <input
                                        ref={inputRef}
                                        value={textValue}
                                        onChange={(e) => setTextValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSave(index);
                                            if (e.key === "Escape") handleCancel();
                                        }}
                                        autoFocus
                                        className="text-[16px] outline-none ring-0"
                                    />
                                ) : (
                                    <div
                                        onClick={() => startEditing(index)}
                                        className="cursor-pointer w-full h-full flex items-center justify-between"
                                    >
                                        <h1
                                            className={`text-[16px] ${
                                                item.finish ? "line-through text-gray-500" : "text-black"
                                            }`}
                                        >
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
                                    ${
                                        editingIndex === index
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
                <div className='flex items-center justify-between'>
                    <h1 className="text-[18px] font-bold">You have {tasks.length} pending tasks</h1>
                    <button
                        onClick={() => {
                            if (tasks.length === 0) return;
                            setDeleteIndex(null);
                            setConfirmation(true);
                        }}
                        className='w-[150px] h-[50px] hover:bg-purple-800 hover:scale-105 transition-all duration-150 ease-in-out bg-purple-700 rounded text-white flex items-center justify-center'
                    >
                        Clear All Task
                    </button>
                </div>

                {confirmation && deleteIndex === null && (
                    <Confirmation
                        deleteTask={clearAllTasks}
                        setConfirmation={setConfirmation}
                        index={null}
                    />
                )}
            </div>
        </div>
    );
}

export default App;

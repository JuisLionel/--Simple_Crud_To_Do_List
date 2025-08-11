import { BsFillPencilFill } from "react-icons/bs";
import { FaTrashCan, FaCheck, FaXmark } from "react-icons/fa6";
import { useState, useRef } from "react";
import { motion } from 'framer-motion';

import Confirmation from "./Components/confirmation";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [textValue, setTextValue] = useState("");
    const [finishedTasks, setFinishedTasks] = useState(new Set());
    const [confirmation, setConfirmation] = useState(false);

    const inputRef = useRef(null);

    const addTask = () => {
        if (taskInput.trim() !== "") {
            setTasks([...tasks, taskInput]);
            setTaskInput("");
        }
    };

    const handleTaskInput = (e) => {
        if (e.key === 'Enter') {
            addTask();
        } else if (e.key === 'Escape') {
            setTaskInput("");
        }
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setTextValue(tasks[index]);
    };

    const handleSave = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index] = textValue;
        setTasks(updatedTasks);
        setEditingIndex(null);
    };

    const handleCancel = () => {
        setEditingIndex(null);
    };


    const toggleFinish = (index) => {
        const updatedFinished = new Set(finishedTasks);
        if (updatedFinished.has(index)) {
            updatedFinished.delete(index);
        } else {
            updatedFinished.add(index);
        }
        setFinishedTasks(updatedFinished);
    };


    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);

        setFinishedTasks(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
        });

        if (editingIndex === index) {
            setEditingIndex(null);
        }
    };

    return (
        <div className='bg-gray-900 w-screen h-screen flex flex-col justify-center items-center'>
            {/* <h1 className="absolute top-5 left-5 text-white text-4xl font-bold">To-Do List</h1>

            <div className="w-[950px] h-[800px] gap-3 flex flex-col items-center overflow-y-auto p-1 no-scroll">
                {tasks.map((item, index) => (
                    <div className="flex items-center gap-2" key={index}>
                        {confirmation && (
                            <Confirmation />
                        )}

                        <button
                            onClick={() => toggleFinish(index)}
                            className={`w-[25px] h-[25px] transition-all duration-100 ease-linear ${finishedTasks.has(index) ? "rounded-2xl bg-gray-600 hover:bg-gray-700" : "rounded bg-gray-800 hover:bg-gray-700"} relative`}
                        >
                            {finishedTasks.has(index) && (
                                <FaCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] text-green-500 " />
                            )}
                        </button>

                        {editingIndex === index ? (
                            <input
                                ref={inputRef}
                                value={textValue}
                                onChange={(e) => setTextValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSave(index);
                                    if (e.key === 'Escape') handleCancel();
                                }}
                                autoFocus
                                className="bg-gray-800 w-[765px] min-h-[50px] rounded-2xl text-white p-2 text-[16px] transition-all duration-150 ease-in-out outline-none ring-0"
                            />
                        ) : (
                            <div
                                className="bg-gray-700 w-[765px] min-h-[50px] rounded-2xl p-2 text-[16px] transition-all duration-150 ease-in-out flex items-center cursor-pointer"
                                onClick={() => startEditing(index)}
                            >
                                <h1 className={`${finishedTasks.has(index) ? "line-through text-gray-400" : "text-white"}`}>
                                    {item}
                                </h1>
                            </div>
                        )}

                        {editingIndex === index ? (
                            <>
                                <motion.button
                                    onClick={() => handleSave(index)}
                                    whileTap={{ scale: 0.7 }}
                                    transition={{ type: 'spring', stiffness: 600, damping: 50 }}
                                    className="bg-gray-800 h-[50px] w-[50px] rounded-2xl text-3xl flex justify-center items-center transition-all duration-40 ease-in-out hover:scale-105"
                                >
                                    <FaCheck className="text-green-600" />
                                </motion.button>

                                <motion.button
                                    onClick={handleCancel}
                                    whileTap={{ scale: 0.7 }}
                                    transition={{ type: 'spring', stiffness: 600, damping: 50 }}
                                    className="bg-gray-800 h-[50px] w-[50px] rounded-2xl text-3xl flex justify-center items-center transition-all duration-40 ease-in-out hover:scale-105 text-red-700"
                                >
                                    <FaXmark />
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <motion.button
                                    onClick={() => startEditing(index)}
                                    whileTap={{ scale: 0.7 }}
                                    transition={{ type: 'spring', stiffness: 600, damping: 50 }}
                                    className="bg-gray-700 h-[50px] w-[50px] rounded-2xl text-2xl flex justify-center items-center transition-all duration-40 ease-in-out hover:bg-gray-800 hover:scale-105"
                                >
                                    <BsFillPencilFill className="text-white" />
                                </motion.button>

                                <motion.button
                                    onClick={() => setConfirmation(true)} 
                                    whileTap={{ scale: 0.7 }}
                                    transition={{ type: 'spring', stiffness: 600, damping: 50 }}
                                    className="bg-gray-700 h-[50px] w-[50px] rounded-2xl text-2xl flex justify-center items-center transition-all duration-40 ease-in-out hover:bg-gray-800 hover:scale-105 text-white"
                                >
                                    <FaTrashCan />
                                </motion.button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
                <input
                    value={taskInput}
                    placeholder="Type here..."
                    onKeyDown={handleTaskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    className="bg-gray-700 rounded-2xl text-white p-2 w-[840px] h-[60px] text-[16px] transition-all duration-150 ease-in-out hover:bg-gray-800"
                />

                <button
                    onClick={addTask}
                    className="h-[60px] w-[60px] bg-gray-700 transition-all duration-150 ease-in-out hover:bg-gray-800 hover:scale-105 rounded-2xl flex justify-center items-center text-3xl text-green-700"
                >
                    <FaCheck />
                </button>
            </div> */}

            <Confirmation />
        </div>
    );
}

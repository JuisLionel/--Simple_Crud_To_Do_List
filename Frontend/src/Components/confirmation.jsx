import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useState } from "react";

// deleteTask, setConfirmation, confirmation

export default function Confirmation() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed inset-0 bg-[#000000bb] flex justify-center items-center z-100">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="w-[500px] h-[500px] bg-white rounded-2xl relative shadow-lg p-5">
                    <div className="flex justify-center mb-[150px]">
                        <div className="bg-blue-100 p-4 rounded-full ">
                            <AiOutlineExclamationCircle className="text-blue-500 text-6xl" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-semibold text-center mb-2">
                        Are you sure?
                    </h2>

                    <p className="text-gray-500 text-center text-[20px] mb-6">
                        This action can’t be undone. Please confirm if you want to proceed.
                    </p>

                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4">
                        <button
                            onClick={() => setOpen(false)}
                            className="w-[150px] h-[50px] border rounded-lg text-gray-700 hover:bg-gray-500 text-[15px] transition-colors duration-100 ease-linear"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                alert("Confirmed!");
                                setOpen(false);
                            }}
                            className="w-[150px] h-[50px] rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition-colors duration-100 ease-linear"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

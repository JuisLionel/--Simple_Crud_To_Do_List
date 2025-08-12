import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useEffect } from "react";

export default function Confirmation({ deleteTask, setConfirmation, confirmation, index }) {
    const handleConfirm = () => {
        deleteTask(index);
        setConfirmation(false);
    }

    useEffect(() => {
        const handleCancel = (e) => {
            if (e.key === "Escape") setConfirmation(false);
        };

        window.addEventListener("keydown", handleCancel);

        return () => {
            window.removeEventListener("keydown", handleCancel);
        };
    }, [index, deleteTask, setConfirmation]);


    return (
        <div className="fixed inset-0 z-20 justify-center items-center bg-[#000000d3] w-full h-full">
            <div className="w-full h-full flex items-center justify-center">
                <div style={{ padding: '40px' }} className="relative z-10 bg-white w-[600px] h-[600px] rounded-2xl m-4">
                    <div className="flex flex-col items-center justify-center w-full h-[80%]">
                        <div className="bg-red-200 rounded-full p-2 w-[90px] h-[90px] flex items-center justify-center mb-6">
                            <AiOutlineExclamationCircle className="text-red-500 text-[80px]" />
                        </div>
                        <h2 className="text-3xl font-semibold text-center mb-2">
                            Are you sure?
                        </h2>
                        <p className="text-gray-400 text-center text-[22px]">
                            This action can’t be undone. Please confirm if you want to proceed.
                        </p>
                    </div>

                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setConfirmation(false)}
                                className="w-[170px] h-[70px] border border-gray-600 rounded-lg text-gray-600 hover:bg-gray-600 hover:text-white text-[15px] transition-all duration-100 ease-linear"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="w-[170px] h-[70px] bg-red-600 rounded-lg hover:bg-red-700 text-white text-[15px] transition-all duration-100 ease-linear"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { AiOutlineExclamationCircle } from "react-icons/ai";

// deleteTask, setConfirmation, confirmation, index

export default function Confirmation({ deleteTask, setConfirmation, confirmation, index }) {
    const handleConfirm = () => {
        deleteTask(index);
        setConfirmation(false);
    }

    return (
        <div className="fixed inset-0 z-20 justify-center items-center bg-black w-full h-full">
            <div className="w-full h-full flex items-center justify-center">
                <div className="relative z-10 bg-[#1E3E62] w-[500px] h-[500px] rounded-2xl m-4">
                    <div className="flex flex-col items-center justify-center w-full h-[80%] p-8">
                        <div className="bg-red-200 rounded-full p-2 w-[70px] h-[70px] flex items-center justify-center">
                            <AiOutlineExclamationCircle className="text-red-500 text-6xl" />
                        </div>
                        <h2 className="text-3xl text-white font-semibold text-center mb-2">
                            Are you sure?
                        </h2>
                        <p className="text-gray-400 text-center text-[20px]">
                            This action can’t be undone. Please confirm if you want to proceed.
                        </p>
                    </div>

                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setConfirmation(false)}
                                className="w-[150px] h-[50px] border border-green-600 rounded-lg text-green-600 hover:bg-green-600 hover:scale-104 hover:text-white text-[15px] transition-all duration-100 ease-linear"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="w-[150px] h-[50px] bg-red-600 rounded-lg hover:scale-104 hover:bg-red-800 text-white text-[15px] transition-all duration-100 ease-linear"
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

import { CloseCircleOutlined } from '@ant-design/icons';

export default function Error({ Message = "Something went wrong." }) {

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-blue-900 to-blue-600">
            <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-[400px]">
                <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
                <h1 className='mt-5 text-[#a8071a] text-[20px]'>Error</h1>
                <p className='mt-[10px] mb-[30px] text-[#680013] text-[1.1rem]'>{Message || "Oops! Something Went Wrong :("}</p>
                <button className='bg-[#ff4d4f] py-[12px] px-[24px] rounded-[8px] text-white border-0 cursor-pointer font-[1rem] transition-all duration-300 ease-in hover:bg-[#cf1322]' onClick={() => window.location.reload()}>Reload</button>
            </div>
        </div>
    );
}

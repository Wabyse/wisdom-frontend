// Components
import NewNavbar from "../../../components/NewNavbar";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus, faPen, faPlus, faQrcode } from "@fortawesome/free-solid-svg-icons";
// tools
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
    ResponsiveContainer
} from 'recharts';

const WatomsPEDashboard = () => {
    const navigate = useNavigate();
    const data = [
        { year: 2025, performance: 80 },
        { year: 2026, performance: 0 },
        { year: 2027, performance: 0 },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 text-white p-2 rounded text-sm">
                    <p>{`Year: ${label}`}</p>
                    <p>{`Performance: ${payload[0].value}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <NewNavbar
                shareStatus={false}
            >
                <div className="flex gap-3">
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faQrcode}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faPen}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                    <button
                        className="rounded-full w-10 h-10 flex justify-center items-center bg-white/80 hover:bg-gray-200 shadow transition-all"
                        title="QRCode Scan"
                    >
                        <FontAwesomeIcon
                            icon={faFolderPlus}
                            className="text-xl text-watomsBlue"
                        />
                    </button>
                </div>
            </NewNavbar>
            <div className="w-full h-[88vh] flex bg-[#0a183d]">
                {/* left side bar navigator */}
                <div className="w-[10%] bg-white/55 flex flex-col justify-evenly items-center">
                    <div>اجراءات الحوكمة</div>
                    <button onClick={() => navigate('/watoms/pe')} className="w-[90%] h-[12%] flex justify-center items-center text-yellow-400 text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">ملفات تاكيد الهوية</button>
                    <button onClick={() => navigate('/watoms/pe/personal-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار السمات الشخصية و السلوكية<p>OCEAN</p></button>
                    <button onClick={() => navigate('/watoms/pe/theoretical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المعارف الفنية المتخصص <p>JCT</p></button>
                    <button onClick={() => navigate('/watoms/pe/practical-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الفنية المتخصصة<p>PST</p></button>
                    <button onClick={() => navigate('/watoms/pe/soft-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار المهارات الوظيفية الناعمة<p>SJT</p></button>
                    <button onClick={() => navigate('/watoms/pe/cognitive-test')} className="w-[90%] h-[12%] flex flex-col justify-center items-center text-yellow-400  text-sm text-center bg-[#0a183d] hover:bg-gray-500 px-2 rounded-xl border-blue-600 border-2">اختبار القدرات المعرفية الاساسية<p>CAT</p></button>
                </div>
                {/* user's personal test score */}
                <div className="w-[90%] flex justify-center items-center">
                    <div className="w-[95%] h-[95%] flex flex-col justify-center items-center border-white border-2 rounded-xl p-2">
                        <div className="flex gap-2 text-white">
                            <div className="flex justify-evenly items-center rounded-2xl bg-opacity-40 bg-white text-[#0a183d] w-48 h-32 cursor-pointer text-5xl gap-4 px-2">
                                <h1 className="text-base text-center font-bold">7507</h1>
                                <div className="w-0 h-20 border-l-2 border-[#0a183d]" />
                                <h1 className="text-base text-center font-bold">اجمالي عدد المتقدمين للاختبارات</h1>
                            </div>
                        </div>
                        <ResponsiveContainer width="90%" height={200}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
                                <XAxis
                                    dataKey="year"
                                    stroke="#888"
                                    fontSize={10}
                                    tick={{ fill: '#fff' }}
                                />
                                <YAxis
                                    stroke="#888"
                                    fontSize={10}
                                    tick={{ fill: '#fff' }}
                                    domain={[0, 100]}
                                    ticks={[25, 50, 75, 100]}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="performance"
                                    stroke="#facc15"
                                    strokeWidth={3}
                                    dot={(props) => (
                                        <circle
                                            cx={props.cx}
                                            cy={props.cy}
                                            r={6}
                                            fill="#facc15"
                                            stroke="#fff"
                                            strokeWidth={2}
                                            style={{ transition: 'all 0.3s ease' }}
                                        />
                                    )}
                                    activeDot={{
                                        r: 8,
                                        fill: '#facc15',
                                        stroke: '#fff',
                                        strokeWidth: 2,
                                        style: { transition: 'all 0.3s ease' }
                                    }}
                                >
                                    <LabelList
                                        dataKey="performance"
                                        position="top"
                                        offset={10}
                                        fill="#facc15"
                                        fontSize={11}
                                        fontWeight="bold"
                                        formatter={(value) => `${value}%`}
                                    />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatomsPEDashboard;
import { useEffect, useState } from "react";
import { fetchAuthorities, fetchSchools, fetchVtcEmployees } from "../services/data";
import LoadingScreen from "../components/LoadingScreen";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import NeqatyNavbar from "../components/NeqatyNavbar";
import { fetchEmployeePointsPerformance, fetchVtcPoints, fetchVtcPointsPerformance, updateUserPoints } from "../services/neqaty";
import { fetchAllTeachers } from "../services/pms";
import toast, { Toaster } from "react-hot-toast";
import background from '../assets/neqatyBackground.jpg';
import { faArrowTrendDown, faArrowTrendUp, faChartSimple, faComment, faScroll, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import person from '../assets/person.jpg';
import Uploading from '../components/Uploading';
import wabysLogo from "../assets/wabys.png";
import ebdaeduLogo from "../assets/ebad-edu.png";
import golLogo from "../assets/Gov.png";
import { cairoDate } from "../utils/cairoDate";

const chartData = [];

const NeqatySchool = () => {
    const { adminInfo } = useAdminAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVtc, setSelectedVtc] = useState("");
    // ----------------------------------------------------------
    const [popup, setPopup] = useState("");
    const [authorities, setAuthorities] = useState([]);
    const [selectedAuth, setSelectedAuth] = useState("");
    const [vtcs, setVtcs] = useState([]);
    const [filteredVtcs, setFilteredVtcs] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [points, setPoints] = useState([]);
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [monthlyPoints, setMonthlyPoints] = useState([]);
    const [employeePoints, setEmployeePoints] = useState([]);
    const [rewardSum, setRewardSum] = useState(0);
    const [punishmentSum, setPunishmentSum] = useState(0);
    const [totalSum, setTotalSum] = useState(0);

    useEffect(() => {
        const loadAuth = async () => {
            try {
                const response = await fetchAuthorities();
                const filteredAuth = response.filter(auth => auth.id !== 3)
                setAuthorities(filteredAuth)
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        const loadVtcs = async () => {
            try {
                const response = await fetchSchools();
                const filteringVtcs = response.filter(vtc => vtc.authority_id === 1 || vtc.authority_id === 2);
                setVtcs(filteringVtcs);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        const loadUsers = async () => {
            try {
                const loadedEmployees = await fetchVtcEmployees();
                const loadedTeachers = await fetchAllTeachers();
                setUsers([...loadedEmployees, ...loadedTeachers]);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        const loadPointsPerformance = async () => {
            const response = await fetchVtcPointsPerformance();
            setMonthlyPoints(response)
        };

        loadAuth();
        loadVtcs();
        loadUsers();
        loadPointsPerformance();
    }, [])
    useEffect(() => {
        const filterVtcs = () => {
            const filteringVtcs = vtcs.filter(vtc => vtc?.authority_id === Number(selectedAuth))
            setFilteredVtcs(filteringVtcs);
        }

        filterVtcs();
    }, [selectedAuth])

    useEffect(() => {
        const filterUsers = async () => {
            try {
                const filteringUsers = users.filter(
                    (employee) => employee.employee?.organization_id === Number(selectedVtc)
                );
                setFilteredUsers(filteringUsers)
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        filterUsers();
    }, [selectedVtc]);

    useEffect(() => {
        const loadEmployeePointsPerformance = async () => {
            const response = await fetchEmployeePointsPerformance(Number(selectedUser));
            if (response.employeePoints?.length) {
                const { reward, punishment } = response.employeePoints.reduce(
                    (acc, item) => {
                        if (item["point.type"] === "vtc_reward") {
                            acc.reward += item["point.points"];
                        } else if (item["point.type"] === "vtc_punishment") {
                            acc.punishment += item["point.points"];
                        }
                        return acc;
                    },
                    { reward: 0, punishment: 0 }
                );

                setRewardSum(reward);
                setPunishmentSum(punishment);
                setTotalSum(reward + punishment);
            }
            console.log(response)
            setEmployeePoints(response);
        }

        loadEmployeePointsPerformance();
    }, [selectedUser])

    const checkAuth = () => {
        if (!selectedAuth) {
            setFilteredVtcs([])
            toast.error("الرجاء اختيار جهة رئيسية");
        }
    }

    const checkVtc = () => {
        if (!selectedVtc) {
            setFilteredUsers([])
            toast.error("الرجاء اختيار جهة فرعية");
        }
    }

    const checkUser = () => {
        toast.error("الرجاء اختيار شخص");
    }

    const AddModel = ({ onClose }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
                            ×
                        </button>
                        <div className="flex text-3xl justify-center items-center gap-6">
                            <FontAwesomeIcon icon={faArrowTrendUp} />
                            <div className="border-r-2 border-white h-4" />
                            <h2 className="font-extrabold">نقاط المكافات</h2>
                        </div>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] w-full flex justify-evenly">
                    <div className="flex flex-col w-[35%] justify-center items-center ">
                        <div className="flex gap-2">
                            <p>(150)</p>
                            <p>الإجمالي العام  لنقاط المكافأة</p>
                        </div>
                        <div className="border-t-2 border-black w-1/2 my-2" />
                        <div className="flex gap-2">
                            <p>(50)</p>
                            <p>نقاط المكافأة للشهر الحالي</p>
                        </div>
                        <button type="submit" onClick={submitPoints} className="bg-blue-500 rounded-full px-4 py-2 text-white mt-10">ارسال</button>
                    </div>
                    {points.length > 0 && (
                        <div className="flex  w-[65%] justify-end">
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col">
                                    <label className="flex items-center justify-between mb-2 pl-4">
                                        <div className="w-[10%]" >
                                            التقييم
                                        </div>
                                        <div className="w-[15%]">عدد النقاط</div>
                                        <div className="flex w-[75%] justify-end">
                                            <span className="text-end">البند</span>
                                        </div>
                                    </label>
                                    <div className="border-t-black border-2 my-2" />
                                </div>
                                {rewards.map(reward => (
                                    <div key={reward.id} className="flex flex-col">
                                        <label className="flex items-center justify-between mb-2">
                                            <input
                                                type="checkbox"
                                                value={reward.name}
                                                checked={selectedPoints.includes(reward.id)}
                                                onChange={() => handlePointToggle(reward.id)}
                                                className="accent-green-600 transform scale-150 w-[10%]"
                                            />
                                            <div className="w-[10%] text-center">{`(${reward.points})`}</div>
                                            <div className="flex w-[77%] justify-end">
                                                <span className="text-end">{reward.name}</span>
                                            </div>
                                        </label>
                                        <div className="border-t-black border-2 my-2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full flex justify-center items-center mb-2"></div>
            </div>
        </div>
    );

    const SubstractModel = ({ onClose }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
                            ×
                        </button>
                        <div className="flex text-3xl justify-center items-center gap-6">
                            <FontAwesomeIcon icon={faArrowTrendDown} />
                            <div className="border-r-2 border-white h-4" />
                            <h2 className="font-extrabold">نقاط الخصم</h2>
                        </div>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] w-full flex justify-evenly">
                    <div className="flex flex-col w-[25%] justify-center items-center ">
                        <div className="flex gap-2">
                            <p>(150)</p>
                            <p>الإجمالي العام  لنقاط المكافأة</p>
                        </div>
                        <div className="border-t-2 border-black w-1/2 my-2" />
                        <div className="flex gap-2">
                            <p>(50)</p>
                            <p>نقاط المكافأة للشهر الحالي</p>
                        </div>
                        <button type="submit" onClick={submitPoints} className="bg-orange-500 rounded-full px-4 py-2 text-white mt-10">ارسال</button>
                    </div>
                    {points.length > 0 && (
                        <div className="flex  w-[75%] justify-end">
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col">
                                    <label className="flex items-center justify-between mb-2 pl-4">
                                        <div className="w-[10%]" >
                                            التقييم
                                        </div>
                                        <div className="w-[15%]">عدد النقاط</div>
                                        <div className="flex w-[75%] justify-end">
                                            <span className="text-end">البند</span>
                                        </div>
                                    </label>
                                    <div className="border-t-black border-2 my-2" />
                                </div>
                                {punishments.map(punishment => (
                                    <div key={punishment.id} className="flex flex-col">
                                        <label className="flex items-center justify-between mb-2">
                                            <input
                                                type="checkbox"
                                                value={punishment.name}
                                                checked={selectedPoints.includes(punishment.id)}
                                                onChange={() => handlePointToggle(punishment.id)}
                                                className="accent-green-600 transform scale-150 w-[10%]"
                                            />
                                            <div className="w-[10%] text-center">{`(${punishment.points})`}</div>
                                            <div className="flex w-[80%] justify-end">
                                                <span className="text-end">{punishment.name}</span>
                                            </div>
                                        </label>
                                        <div className="border-t-black border-2 my-2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full flex justify-center items-center mb-2"></div>
            </div>
        </div>
    );

    const NotesModel = ({ onClose }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden animate-modal-in">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
                            ×
                        </button>
                        <div className="flex text-3xl justify-center items-center gap-6">
                            <FontAwesomeIcon icon={faComment} />
                            <div className="border-r-2 border-white h-4" />
                            <h2 className="font-extrabold">اضافة ملاحظات</h2>
                        </div>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] w-full flex justify-evenly">
                    <div className="flex flex-col w-[35%] justify-center items-center ">
                        <div className="flex gap-2">
                            <p>(150)</p>
                            <p>اجمالي عدد الملاحظات الايجابية</p>
                        </div>
                        <div className="border-t-2 border-black w-1/2 my-2" />
                        <div className="flex gap-2">
                            <p>(50)</p>
                            <p>اجمالي عدد الملاحظات السلبية</p>
                        </div>
                        <button className="bg-yellow-600 rounded-full px-4 py-2 text-white mt-10">ارسال</button>
                    </div>
                    <div className="flex w-[65%] justify-end">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col">
                                <div className="flex">
                                    <span className="w-2/12 text-center">مرفقات</span>
                                    <span className="w-2/12 text-center">التقييم</span>
                                    <span className="w-4/12 text-center">موضوع</span>
                                    <span className="w-3/12 text-center">نوع الملحوظة</span>
                                    <span className="w-1/12 text-center">م</span>
                                </div>
                                <div className="border-t-black border-2 my-2" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <label className="w-2/12 h-12 text-center mt-0 text-slate-400 px-4 py-2 rounded cursor-pointer border-slate-400 border-2">
                                        اختر ملف
                                        <input className="w-full hidden" type="file" dir="rtl" />
                                    </label>
                                    <select className="w-2/12 border-slate-400 border-2 h-12 text-slate-400" dir="rtl">
                                        <option selected disabled>اختار</option>
                                        <option>1</option>
                                        <option>2</option>
                                    </select>
                                    <input className="w-4/12 border-slate-400 border-2 rounded h-12 px-2" dir="rtl" type="text" placeholder="اكتب هنا" />
                                    <select className="w-3/12 border-slate-400 border-2 h-12 text-slate-400" dir="rtl">
                                        <option selected disabled>اختار</option>
                                        <option>سلبي</option>
                                        <option>ايجابي</option>
                                    </select>
                                    <div className="w-1/12 text-center border-slate-400 border-2 h-12 rounded py-3">1</div>
                                </div>
                                <div className="border-t-black border-2 my-2" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center mb-2"></div>
            </div>
        </div>
    );

    const ReportModel = ({ onClose }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 flex flex-col overflow-y-auto justify-start gap-6 items-center z-50">
                <button
                    onClick={onClose} // <-- add handler if you want to close modal
                    className="absolute top-4 right-4 text-white bg-gray-700 hover:bg-gray-800 w-12 h-12 flex justify-center items-center text-2xl font-bold cursor-pointer z-50"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className="relative bg-white w-[40%] max-w-5xl h-[97vh] p-4 flex flex-col">
                    <div className="rounded-2xl border-black border-2 h-full flex flex-col items-center gap-2 py-2">
                        <div className="flex justify-between w-full p-2">
                            <div className="flex flex-col">
                                <img src={wabysLogo} className="w-14" alt="wabys logo" />
                                <img src={ebdaeduLogo} className="ml-3 w-10" alt="ebda edu logo" />
                            </div>
                            <div className="flex flex-col items-center gap-2 text-sm font-bold">
                                <h1 className="text-red-600 border-b-2 border-red-600">التقرير</h1>
                            </div>
                            <img src={golLogo} className="w-10 h-10 mr-3 mt-1" alt="gol logo" />
                        </div>
                        <div className="w-[95%] border-black border-2 flex p-1 gap-1 min-h-20">
                            <div className="flex flex-col items-center text-center gap-1 w-[15%] font-bold">
                                <div className="text-[10px] border-black border-2 w-full bg-gray-300 h-1/2 flex justify-center items-center">الصافي</div>
                                <div className="text-sm border-black border-2 w-full h-1/2 flex justify-center items-center">{totalSum}</div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-1 w-[25%] font-bold">
                                <div className="text-[10px] border-black border-2 w-full bg-gray-300 h-1/2 flex justify-center items-center">اجمالي عدد النقاط السلبية</div>
                                <div className="text-sm border-black border-2 w-full h-1/2 flex justify-center items-center">{punishmentSum}</div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-1 w-[25%] font-bold">
                                <div className="text-[10px] border-black border-2 w-full bg-gray-300 h-1/2 flex justify-center items-center">اجمالي عدد النقاط الايجابية</div>
                                <div className="text-sm border-black border-2 w-full h-1/2 flex justify-center items-center">{rewardSum}</div>
                            </div>
                            <div className="flex flex-col gap-1 w-[50%] text-[10px] font-bold justify-center items-center">
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">{users.find(user => user.id === Number(selectedUser)).employee.first_name} {users.find(user => user.id === Number(selectedUser)).employee.middle_name} {users.find(user => user.id === Number(selectedUser)).employee.last_name}</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center">{vtcs.find(vtc => vtc.id === Number(users.find(user => user.id === Number(selectedUser)).employee.organization_id)).name}</div>
                            </div>
                            <div className="flex flex-col gap-1 min-w-fit max-w-1/3 text-[10px] font-bold justify-center items-center">
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">الاسم</div>
                                <div className="border-black border-2 h-fit w-full text-center px-2 py-1 flex justify-center items-center bg-gray-300">القسم</div>
                            </div>
                            <div className="border-black border-2 p-1">
                                <img className="w-24" src={person} alt="" />
                            </div>
                            <div className="flex justify-center items-center">
                                <div className="px-2 bg-gray-300 border-black border-2 text-xs">1</div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={230}>
                            <LineChart data={employeePoints.months} margin={{ top: 6, right: 30, left: -25, bottom: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                    domain={[
                                        (dataMin) => Math.min(-100, Math.floor(dataMin)),
                                        (dataMax) => Math.max(100, Math.ceil(dataMax)),
                                    ]}
                                />                                <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', borderRadius: '6px', color: '#e2e8f0' }} />
                                <Line type="monotone" dataKey="performance" stroke="#fbbf24" strokeWidth={2} dot={true} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                        <div
                            className={`p-2 bg-slate-100 rounded-2xl shadow w-[95%] text-[10px] ${employeePoints.employeePoints.length > 10 && "overflow-y-scroll"
                                }`}
                        >
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-slate-300 text-[11px]">
                                        <th className="border px-2 py-1">التقييم</th>
                                        <th className="border px-2 py-1">الفئة</th>
                                        <th className="border px-2 py-1">الملاحظة</th>
                                        <th className="border px-2 py-1">التاريخ</th>
                                        <th className="border px-2 py-1">م</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeePoints.employeePoints.map((point, idx) => (
                                        <tr
                                            key={idx}
                                            className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                                        >
                                            <td className="border px-2 py-1">({point["point.points"]})</td>
                                            <td
                                                className={`border px-2 py-1 font-bold ${point["point.type"] === "vtc_reward"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                    }`}
                                            >
                                                {point["point.type"] === "vtc_reward" ? "مكافأة" : "خصم"}
                                            </td>
                                            <td className="border px-2 py-1">{point["point.name"]}</td>
                                            <td className="border px-2 py-1">
                                                {cairoDate(point.updatedAt).split(",")[0].trim()}
                                            </td>
                                            <td className="border px-2 py-1">{idx + 1}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
    );

    const closeModal = () => {
        setPopup("");
    };

    const submitPoints = async () => {
        try {
            setUploading(true);
            for (const point of selectedPoints) {
                const data = {
                    admin_id: adminInfo.id,
                    user_id: Number(selectedUser),
                    point
                };
                await updateUserPoints(data);
            }
            setUploading(false);
            toast.success("تم تسجيل النقاط بنجاح");
            setSelectedPoints([]);
            setPopup("");
        } catch (error) {
            toast.error("There was an error submitting points");
        }
    };

    useEffect(() => {
        const loadVtcPoints = async () => {
            try {
                const loadedVtcPoints = await fetchVtcPoints();
                setPoints(loadedVtcPoints);
            } catch (err) {
                console.error("API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        loadVtcPoints();
    }, []);

    const rewards = points?.filter((point) => point.type === "vtc_reward");
    const punishments = points?.filter((point) => point.type === "vtc_punishment");

    const handlePointToggle = (value) => {
        setSelectedPoints((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };


    if (loading) return <LoadingScreen />;
    if (error?.status === 403) return <Navigate to="/login" state={{ from: location }} replace />;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <Toaster />
            <NeqatyNavbar />
            <div className="flex flex-col h-[85vh] max-h-screen" style={{ backgroundImage: `url(${background})` }}>
                <div className="absolute left-32 top-48">
                    <div className="relative h-36 flex items-center justify-center w-[170px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 640"
                            className="absolute inset-0 w-full h-full"
                            aria-hidden="true"
                        >
                            <path
                                fill="#475569"
                                d="M208.3 64L432.3 64C458.8 64 480.4 85.8 479.4 112.2C479.2 117.5 479 122.8 478.7 128L528.3 128C554.4 128 577.4 149.6 575.4 177.8C567.9 281.5 514.9 338.5 457.4 368.3C441.6 376.5 425.5 382.6 410.2 387.1C390 415.7 369 430.8 352.3 438.9L352.3 512L416.3 512C434 512 448.3 526.3 448.3 544C448.3 561.7 434 576 416.3 576L224.3 576C206.6 576 192.3 561.7 192.3 544C192.3 526.3 206.6 512 224.3 512L288.3 512L288.3 438.9C272.3 431.2 252.4 416.9 233 390.6C214.6 385.8 194.6 378.5 175.1 367.5C121 337.2 72.2 280.1 65.2 177.6C63.3 149.5 86.2 127.9 112.3 127.9L161.9 127.9C161.6 122.7 161.4 117.5 161.2 112.1C160.2 85.6 181.8 63.9 208.3 63.9zM165.5 176L113.1 176C119.3 260.7 158.2 303.1 198.3 325.6C183.9 288.3 172 239.6 165.5 176zM444 320.8C484.5 297 521.1 254.7 527.3 176L475 176C468.8 236.9 457.6 284.2 444 320.8z"
                            />
                        </svg>
                        <span className="relative text-yellow-500 text-2xl font-bold -translate-y-4">85%</span>
                    </div>
                </div>
                <div className="absolute right-28 top-48">
                    <div className="relative h-36 flex items-center justify-center w-36">
                        <img className="rounded-2xl" src={person} alt="" />
                    </div>
                </div>
                <div className="flex px-6 justify-center w-full">
                    <div className="flex flex-col justify-center self-center py-10">
                        <h1 className="text-slate-400 text-2xl text-center">نظام نقاطي للمكافات</h1>
                    </div>
                </div>
                <div className="flex justify-center gap-6">
                    <form>
                        <fieldset className="border-2 border-gray-400 p-4 rounded-2xl shadow-white shadow-md">
                            <legend className="text-white px-2 text-center">الاسم المراد تقييمه</legend>
                            <select
                                className="mt-2 p-1 rounded-2xl text-black"
                                dir="rtl"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                onClick={checkVtc}
                            >
                                <option value="" disabled>
                                    الرجاء اختيار الشخص
                                </option>
                                {filteredUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.employee.first_name} {user.employee.middle_name} {user.employee.last_name}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                    </form>
                    <form>
                        <fieldset className="border-2 border-gray-400 p-4 rounded-2xl shadow-white shadow-md">
                            <legend className="text-white px-2 text-center">اختر الجهة الفرعية</legend>
                            <select
                                className="mt-2 p-1 rounded-2xl text-black"
                                dir="rtl"
                                value={selectedVtc}
                                onChange={(e) => setSelectedVtc(e.target.value)}
                                onClick={checkAuth}
                            >
                                <option value="" disabled>
                                    الرجاء اختيار جهة
                                </option>
                                {filteredVtcs.map((vtc) => (
                                    <option key={vtc.id} value={vtc.id}>
                                        {vtc.name}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                    </form>
                    <form>
                        <fieldset className="border-2 border-gray-400 p-4 rounded-2xl shadow-white shadow-md">
                            <legend className="text-white px-2 text-center">اختر الجهة الرئيسية</legend>
                            <select
                                className="mt-2 p-1 rounded-2xl text-black"
                                dir="rtl"
                                value={selectedAuth}
                                onChange={(e) => setSelectedAuth(e.target.value)}
                            >
                                <option value="" disabled>
                                    الرجاء اختيار جهة
                                </option>
                                {authorities.map((auth) => (
                                    <option key={auth.id} value={auth.id}>
                                        {auth.name}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                    </form>
                </div>
                <div className="flex gap-4 justify-center">
                    <div className="mt-16 w-[40%] border-white border-2 rounded-2xl shadow-white shadow-md">
                        <ResponsiveContainer width="100%" height={230}>
                            <LineChart data={employeePoints.length > 0 ? employeePoints.months : monthlyPoints} margin={{ top: 6, right: 30, left: -25, bottom: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                    domain={[
                                        (dataMin) => Math.min(-100, Math.floor(dataMin)),
                                        (dataMax) => Math.max(100, Math.ceil(dataMax)),
                                    ]}
                                />                                <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', borderRadius: '6px', color: '#e2e8f0' }} />
                                <Line type="monotone" dataKey="performance" stroke="#fbbf24" strokeWidth={2} dot={true} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <form className="mt-14 w-[55%]">
                        <fieldset className="border-2 border-gray-400 p-4 rounded-2xl shadow-white shadow-md w-[100%]">
                            <legend className="text-white px-2 text-center">عناصر التحكم</legend>
                            <div className="flex justify-evenly">
                                <div
                                    id="التقارير"
                                    className={`w-1/5 group cursor-pointer transform transition-all duration-300 hover:scale-105`}
                                    onClick={() => { selectedUser !== "" ? setPopup("report") : checkUser() }}
                                >
                                    <div className={`bg-gradient-to-br from-purple-500 to-purple-600 min-h-48 flex justify-center items-center text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 relative overflow-hidden`}>
                                        <div>

                                            {/* layer to light background's color on hover */}
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <div className="relative z-10">
                                                {/* system's logo */}
                                                <div className="text-5xl mb-3 text-center">
                                                    <FontAwesomeIcon icon={faScroll} />
                                                </div>
                                                {/* system's title */}
                                                <h3 className="text-lg font-bold mb-1 text-center">التقارير</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="ملاحظات"
                                    className={`w-1/5 group cursor-pointer transform transition-all duration-300 hover:scale-105`}
                                    onClick={() => { selectedUser !== "" ? setPopup("notes") : checkUser() }}
                                >
                                    <div className={`bg-gradient-to-br from-yellow-500 to-yellow-600 min-h-48 flex justify-center items-center text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 relative overflow-hidden`}>
                                        <div>

                                            {/* layer to light background's color on hover */}
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <div className="relative z-10">
                                                {/* system's logo */}
                                                <div className="text-5xl mb-3 text-center">
                                                    <FontAwesomeIcon icon={faComment} />
                                                </div>
                                                {/* system's title */}
                                                <h3 className="text-lg font-bold mb-1 text-center">اضافة ملاحظات</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="الخصم"
                                    className={`w-1/5 group cursor-pointer transform transition-all duration-300 hover:scale-105`}
                                    onClick={() => { selectedUser !== "" ? setPopup("remove") : checkUser() }}
                                >
                                    <div className={`bg-gradient-to-br from-orange-500 to-orange-600 min-h-48 flex justify-center items-center text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 relative overflow-hidden`}>
                                        <div>

                                            {/* layer to light background's color on hover */}
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <div className="relative z-10">
                                                {/* system's logo */}
                                                <div className="text-5xl mb-3 text-center">
                                                    <FontAwesomeIcon icon={faArrowTrendDown} />
                                                </div>
                                                {/* system's title */}
                                                <h3 className="text-lg font-bold mb-1 text-center">نقاط الخصم</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="مكافات"
                                    className={`w-1/5 group cursor-pointer transform transition-all duration-300 hover:scale-105`}
                                    onClick={() => { selectedUser !== "" ? setPopup("add") : checkUser() }}
                                >
                                    <div className={`bg-gradient-to-br from-blue-500 to-blue-600 min-h-48 flex justify-center items-center text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 relative overflow-hidden`}>
                                        <div>

                                            {/* layer to light background's color on hover */}
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <div className="relative z-10">
                                                {/* system's logo */}
                                                <div className="text-5xl mb-3 text-center">
                                                    <FontAwesomeIcon icon={faArrowTrendUp} />
                                                </div>
                                                {/* system's title */}
                                                <h3 className="text-lg font-bold mb-1 text-center">نقاط المكافات</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
            {/*
            {points.length > 0 && (
                <div className="md:grid-cols-2 gap-8 mt-10 px-6 flex justify-evenly">
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-green-700">Vtc Rewards</h2>
                        {rewards.map((reward) => (
                            <label key={reward.id} className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    value={reward.name}
                                    checked={selectedPoints.includes(reward.id)}
                                    onChange={() => handlePointToggle(reward.id)}
                                    className="accent-green-600"
                                />
                                <span>{reward.name}</span>
                            </label>
                        ))}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-red-700">Vtc Punishments</h2>
                        {punishments.map((punishment) => (
                            <label key={punishment.id} className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    value={punishment.name}
                                    checked={selectedPoints.includes(punishment.id)}
                                    onChange={() => handlePointToggle(punishment.id)}
                                    className="accent-red-600"
                                />
                                <span>{punishment.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
            {points.length > 0 && <div className="flex justify-center items-center"><button type="submit" onClick={submitPoints} className="p-2 bg-wisdomLightOrange rounded text-white hover:bg-wisdomOrange">Submit</button></div>} */}
            {popup === 'add' && <AddModel onClose={closeModal} />}
            {popup === 'remove' && <SubstractModel onClose={closeModal} />}
            {popup === 'notes' && <NotesModel onClose={closeModal} />}
            {popup === 'report' && <ReportModel onClose={closeModal} />}
            {uploading && <Uploading />}
        </>
    )
}

export default NeqatySchool;
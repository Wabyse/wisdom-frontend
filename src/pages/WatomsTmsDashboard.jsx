import DenyAccessPage from "../components/DenyAccessPage";
import NewNavbar from "../components/NewNavbar";
import { useAuth } from "../context/AuthContext";

const WatomsTmsDashboard = () => {
    const { userInfo } = useAuth();
    if (userInfo?.code === 1452) return <DenyAccessPage homePage='/watoms/dashboard' />;
    return (
        <>
            <NewNavbar />
            <div className="flex justify-evenly">
                <div className="flex flex-col">
                    <div className="rounded-2xl shadow-md shadow-black py-2 px-4">
                        <h1 className="text-center">تقييم معايير الاداء</h1>
                        <div className="flex">
                            <div className="flex flex-col">
                                <div className="flex">
                                    <div className="flex flex-col p-4 gap-2">
                                        <p>سرعة تنفيذ الاداء</p>
                                        <p>دقة تنفيذ المهام</p>
                                        <p>نسبة اكتمال المهام</p>
                                    </div>
                                    <div className="flex flex-col border-l-2 border-b-2 border-black p-4 gap-2">
                                        <div className="flex">
                                            <div className="w-full min-w-[100px]"
                                                style={{
                                                    height: 22,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <div
                                                    className="h-4"
                                                    style={{
                                                        height: '100%',
                                                        width: `60%`,
                                                        background: "red",
                                                        transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                                    }}
                                                />
                                            </div>
                                            <h1 className="ml-2">60%</h1>
                                        </div>
                                        <div className="flex">
                                            <div className="w-full min-w-[100px]"
                                                style={{
                                                    height: 22,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <div
                                                    className="h-4"
                                                    style={{
                                                        height: '100%',
                                                        width: `95%`,
                                                        background: "green",
                                                        transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                                    }}
                                                />
                                            </div>
                                            <h1>95%</h1>
                                        </div>
                                        <div className="flex">
                                            <div className="w-full min-w-[100px]"
                                                style={{
                                                    height: 22,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <div
                                                    className="h-4"
                                                    style={{
                                                        height: '100%',
                                                        width: `45%`,
                                                        background: "blue",
                                                        transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                                    }}
                                                />
                                            </div>
                                            <h1>45%</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-12 mr-4">
                                    <p>0</p>
                                    <p>50</p>
                                    <p>100</p>
                                </div>
                            </div>
                            <div className='border-l-2 border-black p-1 h-12' />
                            <div></div>
                        </div>
                    </div>
                    <div className="rounded-2xl shadow-md shadow-black"></div>
                </div>
                <div className="flex flex-col">
                    <div className="rounded-2xl"></div>
                    <div className="rounded-2xl"></div>
                </div>
            </div>
        </>
    )
}

export default WatomsTmsDashboard;
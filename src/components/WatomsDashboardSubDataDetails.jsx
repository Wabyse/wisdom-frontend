import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, LabelList
} from 'recharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faHouse, faX } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from '../context/LanguageContext';
import img from '../assets/ebda-body.jpg';
import { roundNumber } from '../utils/roundNumber';
import { useEffect, useState } from 'react';
import DonutChart from './DonutChart';
import { WATOMS_SUB_SUB_DATA_COLOR } from '../constants/constants';

const WatomsDashboardSubDataDetails = ({ isOpen, onClose, selectedMonthIdx, toggleMonth, selectedMonth, datasMonths, selectedOrg, orgSubStandards }) => {
    const { language } = useLanguage();
    console.log(orgSubStandards)

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4 top-16">
            <div className="bg-white rounded-lg w-fit max-w-7xl max-h-[84vh] overflow-y-auto flex flex-col justify-center items-center" style={{
                backgroundColor: "#2d3347"
            }}>
                {/* Navbar */}
                <div className="flex items-center justify-between px-6 py-2 w-full" style={{ backgroundColor: '#1e293b' }}>
                    <button onClick={onClose} className="hover:bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center text-white">
                        <FontAwesomeIcon icon={faX} />
                    </button>
                    <div className='flex gap-4 justify-center items-center'>
                        <h1 className='text-xl'>{selectedOrg?.name}</h1>
                        <div className='h-4 border-l-2 border-white w-0' />
                        <h1 className='text-xl'>{orgSubStandards?.name}</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col w-[90%] gap-2 p-2">
                    <div className='flex flex-col justify-center items-center w-full rounded-2xl gap-6 p-4' style={{ backgroundColor: '#1e293b' }}>
                        <div className="flex items-center gap-4">
                            {selectedMonthIdx !== 0 ? (
                                <button
                                    onClick={() => toggleMonth(false)}
                                    style={{
                                        background: '#181f2e',
                                        color: '#0af',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 36,
                                        height: 36,
                                        fontSize: 22,
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px #0006',
                                    }}
                                    title="الشهر السابق"
                                >
                                    &#8592;
                                </button>
                            ) : (
                                <div style={{ width: 36, height: 36 }} />
                            )}

                            <span
                                style={{
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    minWidth: 80,
                                    textAlign: 'center',
                                    letterSpacing: 1,
                                }}
                            >
                                {selectedMonth?.month}
                            </span>

                            {selectedMonthIdx !== datasMonths.length - 1 ? (
                                <button
                                    onClick={() => toggleMonth(true)}
                                    style={{
                                        background: '#181f2e',
                                        color: '#0af',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 36,
                                        height: 36,
                                        fontSize: 22,
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px #0006',
                                    }}
                                    title="الشهر التالي"
                                >
                                    &#8594;
                                </button>
                            ) : (
                                <div style={{ width: 36, height: 36 }} />
                            )}
                        </div>
                        <div className='flex w-full justify-center items-center gap-2'>
                            {/* Performance Bars */}
                            <div className="flex flex-col gap-1 my-2 w-full">
                                {orgSubStandards?.subData
                                    ?.slice()
                                    .sort((a, b) => b.score - a.score)
                                    .map((s) => (
                                        <div className='flex justify-between items-center mb-1'>
                                            <span className="text-sm font-bold text-white w-fit px-1">{s.score}%</span>
                                            <div
                                                className="min-w-3/5 max-w-3/5 w-3/5"
                                                style={{
                                                    height: 22,
                                                    background: '#444652',
                                                    borderRadius: 18,
                                                    boxShadow: '0 2px 8px #0002',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    transition: 'box-shadow 0.2s ease',
                                                }}
                                            >
                                                {/* Bar fill */}
                                                <div
                                                    className="h-4 rounded-full"
                                                    style={{
                                                        height: '100%',
                                                        width: `${s.score}%`,
                                                        background: s.color,
                                                        transition: 'width 0.7s cubic-bezier(.4,2,.6,1)',
                                                    }}
                                                />
                                            </div>
                                            <span className="min-w-fit max-w-1/5 w-1/5 text-xs font-medium text-white text-center">{s.name}</span>
                                        </div>
                                    ))}
                            </div>
                            {/* Overall Score Circle */}
                            <div className="flex items-center justify-center gap-2">
                                <DonutChart value={orgSubStandards?.score || 0} size={100} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                            </div>
                        </div>
                    </div>
                    {/* data's and sub-data's section */}
                    <div className='flex justify-center items-center w-full rounded-2xl p-2'>
                        <div className='flex w-full justify-center items-center gap-2'>
                            {/* each data's section */}
                            {orgSubStandards?.subData?.map((s, i) => (
                                <div className='flex flex-col rounded-2xl justfy-center items-center'>
                                    {s.codes && s.codes.length > 0 && <div className={`flex w-full`}>
                                        <div className='flex flex-col w-full gap-1 rounded-2xl p-2' style={{ backgroundColor: '#3d4f6dff' }}>
                                            <h1 className='text-white text-center text-[10px]'>{s.name}</h1>
                                            <div className='flex justify-center items-center w-full px-1 gap-2  '>
                                                {/* percentage bar for each sub data */}
                                                {s.codes.map((item, i) =>
                                                    <div className='flex flex-col justify-center items-center rounded-2xl p-2 gap-2 min-h-52' style={{ backgroundColor: '#1e293b' }}>
                                                        <h1 className='text-white text-center text-[10px] py-2 bg-sky-900 rounded-xl p-2 w-full min-w-36'>{item.name}</h1>
                                                        <div className='bg-sky-900 w-full flex justify-center items-center p-2 rounded-xl'>
                                                            <DonutChart value={roundNumber(item.average_score * 100) || 0} size={70} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                                                        </div>
                                                        <div className='bg-sky-900 rounded-xl py-2 w-full flex justify-center items-center gap-2 px-4'>
                                                            <h1 className='min-w-fit text-sm'>{s.scores.filter(f => f.code === item.code).length}</h1>
                                                            <div className='h-4 border-l-2 border-white w-0'/>
                                                            <h1 className='min-w-fit text-sm'>عدد التقييمات</h1>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatomsDashboardSubDataDetails;
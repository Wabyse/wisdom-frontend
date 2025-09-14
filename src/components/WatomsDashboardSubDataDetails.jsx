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

const WatomsDashboardSubDataDetails = ({ isOpen, onClose, selectedMonthIdx, toggleMonth, selectedMonth, datasMonths, arrangedOrg, arrangedOrgIdx, orgStandards, orgSubStandards }) => {
    const { language } = useLanguage();
    // console.log(selectedMonth)
    // console.log(datasMonths)
    // console.log(arrangedOrg)
    console.log(orgSubStandards)

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4 top-16">
            <div className="bg-white rounded-lg w-full max-w-7xl max-h-[84vh] overflow-y-auto flex flex-col justify-center items-center" style={{
                backgroundColor: "#2d3347"
            }}>
                {/* Navbar */}
                <div className="flex items-center justify-between px-6 py-2 w-full" style={{ backgroundColor: '#1e293b' }}>
                    <button onClick={onClose} className="hover:bg-gray-700 w-10 h-10 rounded-full flex justify-center items-center text-white">
                        <FontAwesomeIcon icon={faX} />
                    </button>
                    <h1 className='text-2xl'>{orgSubStandards?.name}</h1>
                </div>

                {/* Main Content */}
                <div className="flex w-[90%] gap-6">
                    {/* data's and sub-data's section */}
                    <div className='flex flex-1 justify-center items-center w-full rounded-2xl my-4 p-2' style={{ backgroundColor: '#1e293b' }}>
                        <div className='flex w-full'>
                            {/* each data's section */}
                            {orgSubStandards?.subData?.map((s, i) => (
                                <div className={`flex w-1/${orgSubStandards?.subData.length}`}>
                                    <div className='flex flex-col w-full gap-1'>
                                        <div className='flex justify-center w-full px-1'>
                                            {/* percentage bar for each sub data */}
                                            {s.codes.map((item, i) =>
                                                <div
                                                    className="flex-1"
                                                    key={item.name || `cat${i}`}
                                                    style={{
                                                        maxWidth: `20%`,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {/* Percentage above bar */}
                                                    <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>{roundNumber(item.average_score * 100)}%</div>
                                                    {/* Vertical bar */}
                                                    <div
                                                        className="relative flex items-end justify-center w-[80%] max-w-[25px] bg-[#444652] overflow-hidden mb-0 pb-0"
                                                        style={{
                                                            height: 120,
                                                            borderRadius: 8,
                                                        }}
                                                    >
                                                        {/* colored bar fill */}
                                                        <div
                                                            className={`w-full bottom-0 left-0 absolute`}
                                                            style={{
                                                                backgroundColor: WATOMS_SUB_SUB_DATA_COLOR[i],
                                                                height: roundNumber(item.average_score * 100),
                                                                borderRadius: 8,
                                                                transition: "height 0.7s cubic-bezier(.4,2,.6,1)",
                                                            }}
                                                        />

                                                        {/* vertical text inside the bar */}
                                                        <span className="flex justify-center items-center text-center font-cold text-white absolute pointer-events-none inset-0 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 text-[8px]">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                </div>)}
                                        </div>
                                        {/* the data's title and top separater between it and the sub data's related to it */}
                                        <div className={`border-t-2 border-white h-[85%] ${(i + 1 === orgSubStandards.length) && "w-[90%]"} ${(i === 0) && "w-[90%] self-end"}`} />
                                        <h1 className='text-white text-center text-[10px] py-2'>{s.name}</h1>
                                    </div>
                                    {/* white line separating the data's title */}
                                    {orgSubStandards.length !== i + 1 && <div className='border-l-2 border-white h-[90%]' />}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-1 flex-col rounded-2xl my-4' style={{ backgroundColor: '#1e293b' }}>
                        <div className="mt-2" style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 18,
                        }}>
                            {selectedMonthIdx !== 0 ? <button
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
                                    transition: 'background 0.2s',
                                }}
                                title="الشهر السابق"
                            >
                                &#8592;
                            </button> : <div
                                style={{
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 36,
                                    height: 36,
                                    fontSize: 22,
                                    fontWeight: 900,
                                    display: "hidden",
                                }}></div>}
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, minWidth: 80, textAlign: 'center', letterSpacing: 1 }}>
                                {selectedMonth?.month}
                            </span>
                            {selectedMonthIdx !== (datasMonths.length - 1) ? <button
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
                                    transition: 'background 0.2s',
                                }}
                                title="الشهر التالي"
                            >
                                &#8594;
                            </button> : <div
                                style={{
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 36,
                                    height: 36,
                                    fontSize: 22,
                                    fontWeight: 900,
                                    display: "hidden",
                                }}></div>}
                        </div>
                        <div className="flex items-center justify-between gap-2 px-1">
                            {/* Overall Score Circle */}
                            <div className="flex flex-col items-center justify-center px-2 pt-0 pb-4">
                                <DonutChart value={roundNumber(arrangedOrg[arrangedOrgIdx]?.months[selectedMonthIdx]?.performance || 0)} size={100} color='url(#circularBlueGradient)' bg='#23263a' textColor='#fff' />
                                <span className='text-white mt-2'>الكفاءة و الفاعلية</span>
                            </div>
                            {/* Performance Bars */}
                            <div className="flex flex-col gap-1 my-2 w-1/2">
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
                                            <span className="min-w-1/5 max-w-1/5 w-1/5 text-xs font-medium text-white text-center">{s.name}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex w-[90%] rounded-2xl p-2 my-4' style={{ backgroundColor: '#1e293b' }}>
                    {orgSubStandards?.subData?.map((s, i) => (
                        <div className={`flex w-1/${orgSubStandards?.subData.length}`}>
                            <div className='flex flex-col w-full gap-1'>
                                <div className='flex justify-center w-full px-1'>
                                    {/* percentage bar for each sub data */}
                                    {s.codes.map((item, i) =>
                                        <div
                                            className="flex-1"
                                            key={item.name || `cat${i}`}
                                            style={{
                                                maxWidth: `20%`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {/* Percentage above bar */}
                                            <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>{roundNumber(item.average_score * 100)}%</div>
                                            {/* Vertical bar */}
                                            <div
                                                className="relative flex items-end justify-center w-[80%] max-w-[25px] bg-[#444652] overflow-hidden mb-0 pb-0"
                                                style={{
                                                    height: 120,
                                                    borderRadius: 8,
                                                }}
                                            >
                                                {/* colored bar fill */}
                                                <div
                                                    className={`w-full bottom-0 left-0 absolute`}
                                                    style={{
                                                        backgroundColor: WATOMS_SUB_SUB_DATA_COLOR[i],
                                                        height: roundNumber(item.average_score * 100),
                                                        borderRadius: 8,
                                                        transition: "height 0.7s cubic-bezier(.4,2,.6,1)",
                                                    }}
                                                />

                                                {/* vertical text inside the bar */}
                                                <span className="flex justify-center items-center text-center font-cold text-white absolute pointer-events-none inset-0 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 text-[8px]">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </div>)}
                                </div>
                                {/* the data's title and top separater between it and the sub data's related to it */}
                                <div className={`border-t-2 border-white h-[85%] ${(i + 1 === orgSubStandards.length) && "w-[90%]"} ${(i === 0) && "w-[90%] self-end"}`} />
                                <h1 className='text-white text-center text-[10px] py-2'>{s.name}</h1>
                            </div>
                            {/* white line separating the data's title */}
                            {orgSubStandards.length !== i + 1 && <div className='border-l-2 border-white h-[90%]' />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WatomsDashboardSubDataDetails;
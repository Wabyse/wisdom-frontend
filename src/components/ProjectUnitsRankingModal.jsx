import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, LabelList 
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';

const ProjectUnitsRankingModal = ({ isOpen, onClose, data, loading, centerInfo }) => {
    const { language } = useLanguage(); // true for English, false for Arabic
    
    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Add debugging for received data
    console.log('=== MODAL RENDERING ===');
    console.log('Modal data received:', data);
    console.log('Center info:', centerInfo);
    console.log('Loading state:', loading);
    
    if (data?.annualPerformance) {
        console.log('✅ Using REAL API data with', data.annualPerformance.length, 'months');
        console.log('API months:', data.annualPerformance.map(item => item.month));
    } else {
        console.log('⚠️ Using FALLBACK data');
    }

        // Generate fallback data that respects current month limitation
    const generateFallbackData = () => {
        const currentMonth = new Date().getMonth(); // 0-11
        const monthsToShow = currentMonth + 1;
        const allMonths = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        
        const performanceValues = [75, 82, 84, 83, 85, 88, 93, 89, 92, 90, 87, 91];
        
        const annualPerformance = allMonths.slice(0, monthsToShow).map((month, index) => ({
            month,
            performance: performanceValues[index] || 75
        }));
        
        console.log(`Fallback data: showing ${monthsToShow} months (up to ${allMonths[currentMonth]})`);
        
        return {
            statistics: {
                students: 50,
                trainers: 10,
                supervisors: 7,
                generalManagers: 5,
                boardOfTrustees: 3,
                trainers2: 2,
                workshops: 5,
                labs: 3,
                specializations: 5
            },
            globalStandards: {
                "ODBM": { 
                    value: 65, 
                    color: '#22c55e',
                    nameEn: "ODBM - Organizational Development & Behavior Management",
                    nameAr: "ODBM - إدارة التطوير والسلوك",
                    details: {
                        attendance: { value: 68, nameEn: "Attendance & Presence", nameAr: "الحضور والغياب" },
                        commitment: { value: 62, nameEn: "Commitment & Discipline", nameAr: "الالتزام والانضباط" },
                        behavior: { value: 58, nameEn: "Institutional Behavior", nameAr: "السلوك المؤسسي" },
                        engagement: { value: 72, nameEn: "Participation & Engagement", nameAr: "المشاركة والتفاعل" }
                    }
                },
                "APBM": { 
                    value: 55, 
                    color: '#f59e0b',
                    nameEn: "APBM - Academic Performance & Business Management",
                    nameAr: "APBM - الأداء الأكاديمي والإداري",
                    details: {
                        academic: { value: 52, nameEn: "Academic Performance", nameAr: "الأداء الأكاديمي" },
                        projects: { value: 58, nameEn: "Applied Projects", nameAr: "المشاريع التطبيقية" },
                        practical: { value: 57, nameEn: "Practical Application", nameAr: "التطبيق العملي" },
                        management: { value: 53, nameEn: "Executive Management", nameAr: "الإدارة التنفيذية" }
                    }
                },
                "TQBM": { 
                    value: 75, 
                    color: '#22c55e',
                    nameEn: "TQBM - Training Quality & Business Management",
                    nameAr: "TQBM - جودة التدريب والأعمال",
                    details: {
                        quality: { value: 73, nameEn: "Training Quality", nameAr: "جودة التدريب" },
                        resources: { value: 82, nameEn: "Resources & Capabilities", nameAr: "الموارد والإمكانيات" },
                        methodology: { value: 76, nameEn: "Training Methodology", nameAr: "المنهجية التدريبية" },
                        effectiveness: { value: 74, nameEn: "Effectiveness & Impact", nameAr: "الفعالية والتأثير" }
                    }
                },
                "Community": { 
                    value: 60, 
                    color: '#ef4444',
                    nameEn: "Community Engagement",
                    nameAr: "Community - المشاركة المجتمعية",
                    details: {
                        interaction: { value: 52, nameEn: "Community Interaction", nameAr: "التفاعل المجتمعي" },
                        outreach: { value: 68, nameEn: "Community Outreach", nameAr: "الوصول المجتمعي" },
                        partnerships: { value: 60, nameEn: "Cooperation & Partnerships", nameAr: "التعاون والشراكات" },
                        impact: { value: 56, nameEn: "Community Impact", nameAr: "التأثير المجتمعي" }
                    }
                },
                "Institutional": { 
                    value: 77, 
                    color: '#3b82f6',
                    nameEn: "Institutional Excellence",
                    nameAr: "Institutional - التميز المؤسسي",
                    details: {
                        governance: { value: 75, nameEn: "Institutional Governance", nameAr: "الحوكمة المؤسسية" },
                        infrastructure: { value: 79, nameEn: "Infrastructure", nameAr: "البنية التحتية" },
                        policies: { value: 77, nameEn: "Policies & Procedures", nameAr: "السياسات والإجراءات" },
                        compliance: { value: 76, nameEn: "Compliance & Quality", nameAr: "الامتثال والجودة" }
                    }
                }
            },
            annualPerformance,
            overallScore: 75
        };
    };

    // Use real data or dynamic fallback
    const modalData = data || generateFallbackData();

    const { statistics, globalStandards, annualPerformance, overallScore } = modalData;
    
    // Debug: Log the global standards structure
    console.log('🔍 Modal globalStandards:', globalStandards);
    Object.entries(globalStandards).forEach(([key, value]) => {
        console.log(`📊 ${key}:`, value.details);
    });
    
    // Debug: Log for verification
    console.log('🎯 Short standard names will be shown:', Object.keys(globalStandards));
    console.log('🔍 Full globalStandards keys:', Object.keys(globalStandards));
    console.log('🔍 Looking for Community data:', globalStandards.Community || globalStandards['Community'] || 'NOT FOUND');
    
    // Check all keys that might contain Community
    Object.keys(globalStandards).forEach(key => {
        if (key.toLowerCase().includes('community')) {
            console.log('📍 Found Community-related key:', key, globalStandards[key]);
        }
    });

    // Prepare data for charts with short standard names
    const globalStandardsData = Object.entries(globalStandards).map(([key, value]) => {
        // Force short standard names mapping
        let shortName = key;
        if (key.includes('ODBM')) shortName = 'ODBM';
        else if (key.includes('APBM')) shortName = 'APBM';
        else if (key.includes('TQBM')) shortName = 'TQBM';
        else if (key.includes('Community')) shortName = 'Community';
        else if (key.includes('Institutional')) shortName = 'Institutional';
        
        return {
            name: shortName, // Use short name
            value: value.value,
            color: value.color || '#3b82f6'
        };
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-y-auto" style={{ backgroundColor: '#1e293b' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-600">
                    <div className="flex items-center space-x-4 space-x-reverse">
                        {/* Rank Badge */}
                        <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center">
                            <span className="text-black font-bold text-2xl">5</span>
                        </div>
                        
                        {/* WATOMS Branding */}
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <div className="bg-blue-600 rounded w-10 h-10 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <div>
                                <div className="text-blue-400 font-bold text-xl">WATOMS</div>
                                <div className="text-yellow-400 text-sm">منظومة تقييم جودة الأداء العام</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-700 rounded text-white">
                            <span className="text-xl">‹</span>
                        </button>
                        <button className="p-2 hover:bg-gray-700 rounded text-white">
                            <span className="text-xl">›</span>
                        </button>
                        <button className="p-2 hover:bg-gray-700 rounded text-white">
                            <span className="text-xl">⌂</span>
                        </button>
                    </div>
                </div>

                {/* Title Section */}
                <div className="text-center py-6 border-b border-gray-600">
                    <h1 className="text-3xl font-bold text-white mb-2">الترتيب العام لوحدات المشروع</h1>
                    <p className="text-gray-300">
                        {centerInfo?.name || 'مركز تدريب مهني الشرقية'}
                        {centerInfo?.id && (
                            <span className="text-xs text-gray-400 block">
                                (معرف المركز: {centerInfo.id})
                            </span>
                        )}
                    </p>
                </div>

                {/* Main Content */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Statistics Table */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">أهم الاحصائيات</h3>
                            <div className="bg-white rounded p-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-center py-2 text-gray-800">الطلاب</th>
                                            <th className="text-center py-2 text-gray-800">المدربين</th>
                                            <th className="text-center py-2 text-gray-800">المشرفين</th>
                                            <th className="text-center py-2 text-gray-800">مديرين العموم</th>
                                            <th className="text-center py-2 text-gray-800">مجلس الامناء</th>
                                            <th className="text-center py-2 text-gray-800">المدربين</th>
                                            <th className="text-center py-2 text-gray-800">الورش</th>
                                            <th className="text-center py-2 text-gray-800">المعامل</th>
                                            <th className="text-center py-2 text-gray-800">التخصصات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center py-3 font-bold text-gray-800">{statistics.students}</td>
                                            <td className="text-center py-3 font-bold text-gray-800">{statistics.trainers}</td>
                                            <td className="text-center py-3 font-bold text-gray-800">{statistics.supervisors}</td>
                                            <td className="text-center py-3 font-bold text-gray-800">{statistics.generalManagers}</td>
                                            <td className="text-center py-3 font-bold text-gray-800">{statistics.boardOfTrustees}</td>
                                            <td className="text-center py-3 font-bold text-gray-800">{statistics.trainers2}</td>
                                            <td className="text-center py-3 font-bold text-gray-800">{statistics.workshops}</td>
                                            <td className="text-center py-3 font-bold text-gray-800">{statistics.labs}</td>
                                            <td className="text-center py-3 font-bold text-gray-800">{statistics.specializations}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>

                        {/* Global Standards Chart */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">
                                {language ? 'Project Standards from Global Criteria' : 'نسب المشروع من المعايير العالمية'}
                            </h3>
                            <div className="bg-white rounded p-4" style={{ minWidth: '600px', overflowX: 'auto' }}>
                                <ResponsiveContainer width="100%" height={350} minWidth={600}>
                                    <BarChart 
                                        data={Object.entries(globalStandards).map(([key, standard]) => {
                                            const details = standard.details || {};
                                            const detailKeys = Object.keys(details);
                                            
                                            // Force short standard names mapping
                                            let shortName = key;
                                            if (key.includes('ODBM')) shortName = 'ODBM';
                                            else if (key.includes('APBM')) shortName = 'APBM';
                                            else if (key.includes('TQBM')) shortName = 'TQBM';
                                            else if (key.includes('Community')) shortName = 'Community';
                                            else if (key.includes('Institutional')) shortName = 'Institutional';
                                            
                                            // Create object with short standard names
                                            const dataPoint = {
                                                name: shortName, // Use the short name
                                                overall: standard.value,
                                            };
                                            
                                            // Add each detail with its value and store names for tooltip
                                            detailKeys.forEach((detailKey, index) => {
                                                const detailObj = details[detailKey];
                                                const value = detailObj.value || detailObj;
                                                dataPoint[`detail${index + 1}`] = value;
                                                // Store both language names for tooltip
                                                dataPoint[`detail${index + 1}_nameEn`] = detailObj.nameEn || detailKey;
                                                dataPoint[`detail${index + 1}_nameAr`] = detailObj.nameAr || detailKey;
                                            });
                                            
                                            // Store original standard key and details for fallback
                                            dataPoint._standardKey = key;
                                            dataPoint._details = details;
                                            
                                            return dataPoint;
                                        })}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip 
                                            content={({ active, payload, label }) => {
                                                if (!active || !payload || !payload.length) return null;
                                                
                                                console.log('🔍 Custom Tooltip Debug:', { active, payload, label });
                                                
                                                return (
                                                    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg" style={{ direction: language ? 'ltr' : 'rtl' }}>
                                                        <p className="font-semibold mb-2">
                                                            {language ? `Standard: ${label}` : `المعيار: ${label}`}
                                                        </p>
                                                        {payload.map((entry, index) => {
                                                            let displayName = entry.name;
                                                            
                                                            // For detail components, get real names
                                                            if (entry.dataKey && entry.dataKey.startsWith('detail')) {
                                                                const nameEnKey = `${entry.dataKey}_nameEn`;
                                                                const nameArKey = `${entry.dataKey}_nameAr`;
                                                                const nameEn = entry.payload[nameEnKey];
                                                                const nameAr = entry.payload[nameArKey];
                                                                
                                                                if (nameEn && nameAr) {
                                                                    displayName = language ? nameEn : nameAr;
                                                                } else {
                                                                    // Fallback: find real name from globalStandards
                                                                    const standardKey = entry.payload._standardKey;
                                                                    if (standardKey && globalStandards[standardKey]) {
                                                                        const standard = globalStandards[standardKey];
                                                                        const detailKeys = Object.keys(standard.details || {});
                                                                        const detailIndex = parseInt(entry.dataKey.replace('detail', '')) - 1;
                                                                        
                                                                        if (detailIndex >= 0 && detailIndex < detailKeys.length) {
                                                                            const detailKey = detailKeys[detailIndex];
                                                                            const detailObj = standard.details[detailKey];
                                                                            displayName = language ? 
                                                                                (detailObj.nameEn || detailKey) : 
                                                                                (detailObj.nameAr || detailKey);
                                                                        }
                                                                    }
                                                                }
                                                            } else if (entry.dataKey === 'overall') {
                                                                displayName = language ? 'Overall' : 'الإجمالي';
                                                            }
                                                            
                                                            return (
                                                                <p key={index} className="text-sm" style={{ color: entry.color }}>
                                                                    <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: entry.color }}></span>
                                                                    {displayName}: {entry.value}%
                                                                </p>
                                                            );
                                                        })}
                            </div>
                                                );
                                            }}
                                        />
                                        <Bar dataKey="detail1" stackId="a" fill="#22c55e" name={language ? "Component 1" : "المكون الأول"}>
                                            <LabelList 
                                                dataKey="detail1" 
                                                position="center" 
                                                fill="#fff"
                                                fontSize={10}
                                                fontWeight="bold"
                                                formatter={(value) => value > 5 ? `${value}%` : ''}
                                            />
                                        </Bar>
                                        <Bar dataKey="detail2" stackId="a" fill="#f59e0b" name={language ? "Component 2" : "المكون الثاني"}>
                                            <LabelList 
                                                dataKey="detail2" 
                                                position="center" 
                                                fill="#fff"
                                                fontSize={10}
                                                fontWeight="bold"
                                                formatter={(value) => value > 5 ? `${value}%` : ''}
                                            />
                                        </Bar>
                                        <Bar dataKey="detail3" stackId="a" fill="#ef4444" name={language ? "Component 3" : "المكون الثالث"}>
                                            <LabelList 
                                                dataKey="detail3" 
                                                position="center" 
                                                fill="#fff"
                                                fontSize={10}
                                                fontWeight="bold"
                                                formatter={(value) => value > 5 ? `${value}%` : ''}
                                            />
                                        </Bar>
                                        <Bar dataKey="detail4" stackId="a" fill="#8b5cf6" name={language ? "Component 4" : "المكون الرابع"}>
                                            <LabelList 
                                                dataKey="detail4" 
                                                position="center" 
                                                fill="#fff"
                                                fontSize={10}
                                                fontWeight="bold"
                                                formatter={(value) => value > 5 ? `${value}%` : ''}
                                            />
                                        </Bar>
                                        {/* Overall comparison bars */}
                                        <Bar dataKey="overall" fill="#3b82f6" fillOpacity={0.3}>
                                            <LabelList 
                                                dataKey="overall" 
                                                position="top" 
                                                offset={5}
                                                fill="#1e40af"
                                                fontSize={12}
                                                fontWeight="bold"
                                                formatter={(value) => `${value}%`}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                {/* Dynamic Legend showing detail names based on language */}
                                <div className="mt-4 p-3 bg-gray-50 rounded">
                                    <h4 className="text-sm font-bold text-gray-800 mb-2 text-center">
                                        {language ? 'Standards Components:' : 'مكونات المعايير:'}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                        {Object.entries(globalStandards).map(([standardKey, standard]) => (
                                            <div key={standardKey} className="space-y-1">
                                                                                                <div className="font-semibold text-gray-700">
                                                    {(() => {
                                                        // Force short standard names mapping
                                                        if (standardKey.includes('ODBM')) return 'ODBM';
                                                        else if (standardKey.includes('APBM')) return 'APBM';
                                                        else if (standardKey.includes('TQBM')) return 'TQBM';
                                                        else if (standardKey.includes('Community')) return 'Community';
                                                        else if (standardKey.includes('Institutional')) return 'Institutional';
                                                        return standardKey;
                                                    })()}:
                                                </div>
                                                {Object.entries(standard.details || {}).map(([detailKey, detailObj], index) => {
                                                    const value = detailObj.value || detailObj;
                                                    const name = language ? 
                                                        (detailObj.nameEn || detailKey) : 
                                                        (detailObj.nameAr || detailKey);
                                                    return (
                                                        <div key={detailKey} className="flex items-center space-x-2 space-x-reverse">
                                                            <div 
                                                                className="w-3 h-3 rounded"
                                                                style={{ 
                                                                    backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'][index] 
                                                                }}
                                                            ></div>
                                                            <span className="text-gray-600">{name}: {value}%</span>
                            </div>
                                                    );
                                                })}
                            </div>
                                        ))}
                            </div>
                            </div>
                                <p className="text-xs text-gray-600 mt-2 text-center">
                                    {language ? 
                                        'Note: Human element performance is evaluated according to the highest global standards in real-time to assess the actual situation and develop it.' :
                                        'ملحوظة : يتم تقييم الاداء العنصر البشري طبقاً لاعلي المعايير العالمية بشكل الحظي للوقوف على الوضع الحقيقي وتطويره.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Annual Performance Chart */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">
                                {language ? 'Total Assessment Rate of Active Centers' : 'إجمالي نسبة تقييم المراكز المفعلة'}
                            </h3>
                            <div className="bg-white rounded p-4" style={{ backgroundColor: '#2d3748' }}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={annualPerformance} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                        <XAxis 
                                            dataKey="month" 
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#a0aec0', fontSize: 12 }}
                                        />
                                        <YAxis 
                                            domain={[0, 100]} 
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#a0aec0', fontSize: 12 }}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [`${value}%`, language ? 'Performance' : 'الأداء']}
                                            contentStyle={{
                                                backgroundColor: '#1a202c',
                                                border: '1px solid #4a5568',
                                                borderRadius: '6px',
                                                color: '#e2e8f0'
                                            }}
                                        />
                                <Line 
                                    type="monotone" 
                                    dataKey="performance" 
                                            stroke="#fbbf24" 
                                            strokeWidth={3}
                                            dot={{ fill: '#fbbf24', strokeWidth: 2, r: 8 }}
                                            activeDot={{ r: 10, fill: '#f59e0b' }}
                                        >
                                            <LabelList 
                                                dataKey="performance" 
                                                position="top" 
                                                offset={10}
                                                fill="#fbbf24"
                                                fontSize={12}
                                                fontWeight="bold"
                                                formatter={(value) => `${value}%`}
                                            />
                                        </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    </div>

                        {/* Performance Evaluation */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">
                                {language ? 'Performance Standards Evaluation' : 'تقييم معايير الاداء'}
                            </h3>
                            <div className="bg-white rounded p-4 flex items-center justify-between">
                                {/* Performance Bars */}
                            <div className="flex-1">
                                    {Object.entries(globalStandards).map(([key, value], index) => (
                                        <div key={key} className="mb-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {(() => {
                                                        // Force short standard names mapping
                                                        if (key.includes('ODBM')) return 'ODBM';
                                                        else if (key.includes('APBM')) return 'APBM';
                                                        else if (key.includes('TQBM')) return 'TQBM';
                                                        else if (key.includes('Community')) return 'Community';
                                                        else if (key.includes('Institutional')) return 'Institutional';
                                                        return key;
                                                    })()}
                                                </span>
                                                <span className="text-sm font-bold text-gray-800">{value.value}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-4 relative">
                                                <div 
                                                    className="h-4 rounded-full flex items-center justify-center" 
                                                    style={{ 
                                                        width: `${value.value}%`,
                                                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]
                                                    }}
                                                >
                                                    {value.value > 15 && (
                                                        <span className="text-xs font-bold text-white">
                                                            {value.value}%
                                                        </span>
                                                    )}
                                                </div>
                                                {value.value <= 15 && (
                                                    <span 
                                                        className="text-xs font-bold absolute right-2 top-0 h-full flex items-center"
                                                        style={{ color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5] }}
                                                    >
                                                        {value.value}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                                
                                {/* Overall Score Circle */}
                                <div className="flex items-center justify-center ml-8">
                                    <div className="relative">
                                        <ResponsiveContainer width={120} height={120}>
                                    <PieChart>
                                        <Pie
                                                    data={[
                                                        { name: language ? 'Score' : 'النتيجة', value: overallScore, fill: '#3b82f6' },
                                                        { name: language ? 'Remaining' : 'المتبقي', value: 100 - overallScore, fill: '#e5e7eb' }
                                                    ]}
                                            cx="50%"
                                            cy="50%"
                                                    innerRadius={30}
                                                    outerRadius={50}
                                                    startAngle={90}
                                                    endAngle={-270}
                                            dataKey="value"
                                                />
                                    </PieChart>
                                </ResponsiveContainer>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-blue-600">%{overallScore}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center p-6 border-t border-gray-600">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectUnitsRankingModal;
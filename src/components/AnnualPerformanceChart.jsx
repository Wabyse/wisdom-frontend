import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import DotPatternBackground from './DotPatternBackground';

const AnnualPerformanceChart = ({ data, title = "تقييم الاداء السنوي", loading = false }) => {
  if (loading) {
    return (
      <div className="flex-1 rounded-2xl flex flex-col p-5" style={{
        background: '#202a3a',
        boxShadow: '0 2px 12px #0004',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#facc15', textAlign: 'center' }}>
          {title}
        </div>
        <div style={{ color: '#888', textAlign: 'center' }}>
          جاري تحميل البيانات...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex-1 rounded-2xl flex flex-col p-5" style={{
        background: '#202a3a',
        boxShadow: '0 2px 12px #0004',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#facc15', textAlign: 'center' }}>
          {title}
        </div>
        <div style={{ color: '#888', textAlign: 'center' }}>
          لا توجد بيانات متاحة
        </div>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(32, 42, 58, 0.95)',
          border: '1px solid #444',
          borderRadius: 8,
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          color: '#fff',
          fontSize: 14,
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#facc15' }}>
            {label}
          </p>
          <p style={{ margin: 0, color: payload[0].payload.color }}>
            الأداء: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 rounded-2xl flex flex-col p-5" style={{
      background: '#202a3a',
      boxShadow: '0 2px 12px #0004',
      alignItems: 'stretch',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeInUp 0.6s ease-out',
    }}>
      {/* Dotted pattern background */}
      <DotPatternBackground id="dots-annual" />

      {/* Overlay to darken pattern under content */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(32,42,58,0.15)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Content above pattern/overlay */}
      <div className="relative z-20 self-center w-[450px] flex flex-col">
        <div style={{ fontWeight: 700, fontSize: 16, color: '#facc15', textAlign: 'center', letterSpacing: 0.5 }}>
          {title}
        </div>

        <ResponsiveContainer width="90%" height={150}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
            <XAxis
              dataKey="month"
              stroke="#888"
              fontSize={10}
              tick={{ fill: '#fff' }}
            />
            <YAxis
              stroke="#888"
              fontSize={12}
              tick={{ fill: '#fff' }}
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
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
                  fill={props.payload.color}
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
                offset={15}
                fill="#facc15"
                fontSize={11}
                fontWeight="bold"
                formatter={(value) => `${value}%`}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>

        {/* Performance indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 20,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
            <span style={{ color: '#fff', fontSize: 12 }}>أداء عالي (70%+)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
            <span style={{ color: '#fff', fontSize: 12 }}>أداء متوسط (40-69%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
            <span style={{ color: '#fff', fontSize: 12 }}>أداء منخفض (&lt;40%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualPerformanceChart;

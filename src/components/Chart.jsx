import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const rawData = [
    { name: "جودة التدريب", a: 30, b: 50, c: 20 },
    { name: "الحوكمة", a: 40, b: 60 },
    { name: "المقياس الاكاديمي", a: 35, b: 55, c: 25, d: 55, e: 25 },
    { name: "المشاركة المجتمعية", d: 40 },
    { name: "التنمية المهنة", d: 10 },
    { name: "الاشراف اليومي", d: 10 },
];

// Define all series keys + their colors + labels
const SERIES_META = {
    a: { color: "#d32f2f", label: "الجودة" },
    b: { color: "#388e3c", label: "الحوكمة" },
    c: { color: "#fbc02d", label: "الأكاديمي" },
    d: { color: "#8b5cf6", label: "المجتمعي" },
    e: { color: "#0e4db7", label: "المهني" },
};

const SERIES_KEYS = Object.keys(SERIES_META);

// Normalize missing values → 0
const data = rawData.map((row) => {
    const filled = {};
    SERIES_KEYS.forEach((k) => {
        filled[k] = Number(row[k] ?? 0);
    });
    return { name: row.name, ...filled };
});

const CustomKeyLabel = ({ x, y, width, height, labelText }) => {
    if (height <= 0) return null; // skip zero-height bars
    const cx = x + width / 2;
    const cy = y + height / 2;
    return (
        <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90, ${cx}, ${cy})`}
            fill="#fff"
            fontSize={11}
            fontWeight="bold"
        >
            {labelText}
        </text>
    );
};

export default function Chart() {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 20, right: 0, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => SERIES_META[value]?.label || value} />
                {SERIES_KEYS.map((key) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={SERIES_META[key].color}
                        label={<CustomKeyLabel labelText={SERIES_META[key].label} />}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

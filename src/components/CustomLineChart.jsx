import {
    ResponsiveContainer,
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
} from "recharts";

const CustomLineChart = ({ chartWidth = "100%", chartHeight = 140, data }) => {
    return (
        <ResponsiveContainer width={chartWidth} height={chartHeight}>
            <RechartsLineChart
                data={data}
                margin={{ top: 20, right: 10, left: -35, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
                <XAxis
                    dataKey="month"
                    stroke="#888"
                    fontSize={10}
                />
                <YAxis
                    stroke="#888"
                    fontSize={12}
                    domain={[0, 100]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                />
                <Tooltip />
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
                            style={{ transition: "all 0.3s ease" }}
                        />
                    )}
                    activeDot={{
                        r: 8,
                        fill: "#facc15",
                        stroke: "#fff",
                        strokeWidth: 2,
                    }}
                >
                    <LabelList
                        dataKey="performance"
                        position="top"
                        offset={15}
                        fill="#facc15"
                        fontSize={11}
                        fontWeight="bold"
                        content={({ x, y, value }) => (
                            <text
                                x={x}
                                y={y - 10}
                                fill="#facc15"
                                fontSize={11}
                                fontWeight="bold"
                                textAnchor="middle"
                            >
                                {value}%
                            </text>
                        )}
                    />
                </Line>
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

export default CustomLineChart;
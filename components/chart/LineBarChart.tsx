import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";

const CustomBar = (props: any) => {
  const { fill, x, y, width, height } = props;

  return (
    <Rectangle
      {...props}
      radius={[20, 20, 0, 0]}
      fill={fill}
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
};

// 假设这是你的数据，长度为30，每个对象包含name、completed和quit字段
const data = [
  {},
  ...Array.from({ length: 30 }, (_, i) => ({
    name: `Page ${i + 1}`,
    completed: Math.floor(Math.random() * 1000),
    quit: Math.floor(Math.random() * 1000),
    day: new Date(Date.now() - i * 24 * 60 * 60 * 1000).getDate(),
  })),
];

const LineBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 60,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis dataKey="day" scale="point" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="quit" // 修改为quit
          barSize={30}
          fill="#3b82f6"
          shape={<CustomBar></CustomBar>}
        />
        <Line
          type="natural"
          dataKey="completed"
          stroke="#3b82f6"
          strokeWidth={3}
        />{" "}
        {/* 修改为completed */}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export { LineBarChart };

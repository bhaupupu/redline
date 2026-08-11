import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TelemetryDataPoint } from '../types/telemetry';

interface TelemetryChartProps {
  data: TelemetryDataPoint[];
  driverName: string;
}

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: TelemetryDataPoint = payload[0].payload;
    return (
      <div className="chart-tooltip-box">
        <div className="tooltip-header">TIMESTAMP: {label}</div>
        <div className="tooltip-row red">
          <span>STRESS SCORE:</span>
          <strong>{data.smoothedStress} / 100</strong>
        </div>
        <div className="tooltip-row green">
          <span>LAP TIME:</span>
          <strong>{data.lapTime}s</strong>
        </div>
        <div className="tooltip-divider" />
        <div className="tooltip-row">
          <span>PITCH (F0):</span>
          <span>{data.pitch} Hz</span>
        </div>
        <div className="tooltip-row">
          <span>RMS ENERGY:</span>
          <span>{data.rmsEnergy}</span>
        </div>
        <div className="tooltip-row">
          <span>SPEAKING RATE:</span>
          <span>{data.speechRate} syll/s</span>
        </div>
        <div className="tooltip-row">
          <span>SECTORS (S1/S2/S3):</span>
          <span>{data.sector1}s / {data.sector2}s / {data.sector3}s</span>
        </div>
      </div>
    );
  }
  return null;
};

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ data, driverName }) => {
  return (
    <div className="telemetry-chart-card">
      <div className="chart-card-header">
        <div className="chart-title">
          <span>STRESS VS. LAP PERFORMANCE TELEMETRY TIMELINE</span>
          <span className="driver-name-sub">// {driverName.toUpperCase()}</span>
        </div>
        <div className="chart-legend-pills">
          <span className="legend-pill red">DRIVER STRESS (0-100)</span>
          <span className="legend-pill green">LAP TIME (SEC)</span>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e20613" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#e20613" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />

            <XAxis
              dataKey="timestampStr"
              stroke="#777"
              fontSize={11}
              fontFamily="var(--font-sub)"
              tickLine={false}
            />

            {/* Left Y-Axis: Stress Score 0-100 */}
            <YAxis
              yAxisId="stress"
              domain={[0, 100]}
              stroke="#e20613"
              fontSize={11}
              fontFamily="var(--font-sub)"
              tickLine={false}
              axisLine={false}
            />

            {/* Right Y-Axis: Lap Time */}
            <YAxis
              yAxisId="lap"
              orientation="right"
              domain={['auto', 'auto']}
              stroke="#36b37e"
              fontSize={11}
              fontFamily="var(--font-sub)"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Area Fill for Driver Stress */}
            <Area
              yAxisId="stress"
              type="monotone"
              dataKey="smoothedStress"
              name="Driver Stress Index"
              stroke="#e20613"
              strokeWidth={3}
              fill="url(#stressGradient)"
            />

            {/* Line for Lap Performance */}
            <Line
              yAxisId="lap"
              type="monotone"
              dataKey="lapTime"
              name="Lap Time (s)"
              stroke="#36b37e"
              strokeWidth={2}
              dot={{ r: 4, fill: '#36b37e' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

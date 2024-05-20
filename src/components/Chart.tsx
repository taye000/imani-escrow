import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(
    time: string,
    amount?: number,
): { time: string; amount: number | null } {
    return { time, amount: amount ?? null };
}

const data = [
    createData('00:00', 0),
    createData('03:00', 300),
    createData('06:00', 600),
    createData('09:00', 800),
    createData('12:00', 1500),
    createData('15:00', 2000),
    createData('18:00', 2400),
    createData('21:00', 2400),
    createData('24:00'),
];

export default function Chart() {
    const theme = useTheme();

    return (
        <React.Fragment>
            <Title>Today</Title>
            <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data}> {/* Single child within ResponsiveContainer */}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis
                        label={{
                            value: "Sales ($)",
                            angle: -90,
                            position: "insideLeft",
                            style: theme.typography.body1, // Corrected style property
                            fill: theme.palette.text.primary,
                        }}
                        domain={[0, 2500]}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2} // Add some stroke width for visibility
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}
import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Radio } from 'antd';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { baseURL } from '../utils/constants';

interface ProvinceData {
  population: number;
  provinceName: string;
  stations_count: number;
}

interface ApiResponse {
  correlation: number;
  data: ProvinceData[];
}

const StationsTable: React.FC = () => {
  const [data, setData] = useState<ProvinceData[]>([]);
  const [correlation, setCorrelation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<string>('large');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(`${baseURL}/get-stations`);
        setData(response.data.data);
        setCorrelation(response.data.correlation);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSizeChange = (e: any) => {
    setView(e.target.value);
  };

  const columns = [
    {
      title: 'Województwo',
      dataIndex: 'provinceName',
      key: 'provinceName',
    },
    {
      title: 'Populacja',
      dataIndex: 'population',
      key: 'population',
    },
    {
      title: 'Ilość stacji',
      dataIndex: 'stations_count',
      key: 'stations_count',
    },
  ];

  // Sort data for chart
  const sortedData = [...data].sort((a, b) => b.population - a.population);

  return (
    <div>
      <Typography.Title level={4}>Współczynnik korelacji: <Tag color="green">{correlation.toFixed(2)}</Tag></Typography.Title>
      
      <Radio.Group value={view} onChange={handleSizeChange} style={{marginBottom: 16}}>
        <Radio.Button value="large">Tabela</Radio.Button>
        <Radio.Button value="middle">Wykres</Radio.Button>
      </Radio.Group>

      {view === 'large' ? (
        <Table dataSource={data} columns={columns} loading={loading} rowKey="provinceName" />
      ) : (
        <div style={{ marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={sortedData}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    // style={{ background: '#131722' }}
>
    <CartesianGrid strokeDasharray="3 3" stroke="#3A4750" />
    <XAxis dataKey="provinceName" stroke="#7B8DA4" /> 
    <YAxis yAxisId="left" orientation="left" stroke="#7B8DA4" />
    <YAxis yAxisId="right" orientation="right" stroke="#7B8DA4" />
    <Tooltip
      contentStyle={{ backgroundColor: '#1F2A36', borderColor: '#7B8DA4' }}
      itemStyle={{ color: '#A9B8D3' }}
      cursor={{ fill: 'rgba(255,255,255,0.1)' }}
    />
    <Legend wrapperStyle={{ color: '#A9B8D3' }} />
    <Bar yAxisId="left" dataKey="population" fill="#204469" name="Population" />
    <Bar yAxisId="right" dataKey="stations_count" fill="#2980B9" name="Stations Count" />
  </BarChart>
</ResponsiveContainer>

        </div>
      )}
    </div>
  );
};

export default StationsTable;

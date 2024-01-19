import { Table } from "antd";
import { useEffect, useState } from "react";
import { Select, Button, Spin, Alert, Descriptions, Tag, Typography } from 'antd';
import { TableOutlined } from "@ant-design/icons";

const { Title } = Typography;
export interface Station {
    id: number;
    stationName: string;
    gegrLat: string;
    gegrLon: string;
    city: {
        id: number;
        name: string;
        commune: {
            communeName: string;
            districtName: string;
            provinceName: string;
        };
    };
    addressStreet: string | null;
}

const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: (a: any, b: any) => a.id - b.id,
    },
    {
        title: "Nazwa stacji",
        dataIndex: "stationName",
        key: "stationName",
    },
    // {
    //     title: "Szerokość geograficzna",
    //     dataIndex: "gegrLat",
    //     key: "gegrLat",
    // },
    // {
    //     title: "Długość geograficzna",
    //     dataIndex: "gegrLon",
    //     key: "gegrLon",
    // },
    {
        title: "Miasto",
        dataIndex: ["city", "name"],
        key: "cityName",
    },
    // {
    //     title: "Gmina",
    //     dataIndex: ["city", "commune", "communeName"],
    //     key: "communeName",
    // },
    // {
    //     title: "Dzielnica",
    //     dataIndex: ["city", "commune", "districtName"],
    //     key: "districtName",
    // },
    // {
    //     title: "Województwo",
    //     dataIndex: ["city", "commune", "provinceName"],
    //     key: "provinceName",
    // },
    {
        title: "Adres",
        dataIndex: "addressStreet",
        key: "addressStreet",
        render: (text: any) => text || "Brak danych"
    },
];

const ComponentA: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);

    // W Twoim komponencie React

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch('/api/gios-data');
                const response = await fetch('http://159.69.183.243:3000/api/gios-data');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStations(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div>
            <Title level={3}> Lista stacji pomiarowych</Title>
            <Table dataSource={stations} columns={columns} rowKey="id" />

        </div>
    );
};

export default ComponentA;

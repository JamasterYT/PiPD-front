import React, { useEffect, useState } from "react";
import {
  Select,
  Button,
  Spin,
  Alert,
  Descriptions,
  Tag,
  Typography,
} from "antd";
import { baseURL } from "../utils/constants";
import { Row, Col } from "antd";
const { Title } = Typography;
const { Option } = Select;
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

export interface IndexLevel {
  id: number;
  indexLevelName: string;
}

export interface AirQualityIndex {
  id: number;
  stCalcDate?: string;
  stIndexLevel?: IndexLevel;
  no2CalcDate?: string;
  no2IndexLevel?: IndexLevel;
  no2SourceDataDate?: string;
  o3CalcDate?: string;
  o3IndexLevel?: IndexLevel | null;
  o3SourceDataDate?: string;
  pm10CalcDate?: string;
  pm10IndexLevel?: IndexLevel | null;
  pm10SourceDataDate?: string;
  pm25CalcDate?: string;
  pm25IndexLevel?: IndexLevel | null;
  pm25SourceDataDate?: string | null;
  so2CalcDate?: string;
  so2IndexLevel?: IndexLevel | null;
  so2SourceDataDate?: string;
  stIndexCrParam?: string;
  stIndexStatus?: boolean;
  stSourceDataDate?: string;
}

export const getTagColor = (indexLevelName?: string): string => {
  switch (indexLevelName) {
    case "Bardzo dobry":
      return "green";
    case "Dobry":
      return "green";
    case "Umiarkowany":
      return "orange";
    case "Dostateczny":
      return "volcano";
    case "Zły":
      return "red";
    default:
      return "gray";
  }
};

const ComponentB = ({ stations }: { stations: Station[] }) => {
  const [stationId, setStationId] = useState(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityIndex | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [selectedStationId, setSelectedStationId] = useState(undefined);

  const renderDescriptionItem = (
    label: string,
    data: any,
    indexLevel?: IndexLevel | null
  ) => {
    if (data) {
      return (
        <Descriptions.Item label={label}>
          {indexLevel ? (
            <Tag color={getTagColor(indexLevel.indexLevelName)}>
              {indexLevel.indexLevelName}
            </Tag>
          ) : (
            data
          )}
        </Descriptions.Item>
      );
    }
    return null;
  };

  const fetchAirQualityData = async () => {
    if (!stationId) {
      setError("Proszę wybrać ID stacji.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseURL}/air-quality-index/${stationId}`);
      if (!response.ok) {
        throw new Error("Problem z odpowiedzią serwera");
      }
      const data = await response.json();
      setAirQualityData(data);
    } catch (err: any) {
      setError(err.message);
      setAirQualityData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} lg={12}>
        {" "}
        {/* Adjust the span as needed for different screen sizes */}
        <Title level={3}>Indeksy zanieczyszczenia dla danej stacji</Title>
        <Select
          showSearch
          style={{ width: 200 }}
          // onSearch={fetchAirQualityData}
          placeholder="Wybierz ID stacji"
          optionFilterProp="children"
          notFoundContent={loading ? <Spin size="small" /> : null}
          onChange={(value) => setStationId(value)}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {stations.map((station) => (
            <Option key={station.id} value={station.id}>
              {station.stationName}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={fetchAirQualityData}
          disabled={!stationId}
          style={{ marginTop: 16, marginBottom: 16, marginLeft: 15 }}
        >
          Pobierz dane
        </Button>
        {/* Spinners, alerts, and descriptions here */}
        {airQualityData && (
          <div>
            <Descriptions bordered size="small" column={1}>
              {renderDescriptionItem(
                "Ogólny stan powietrza",
                airQualityData.stIndexLevel?.indexLevelName,
                airQualityData.stIndexLevel
              )}
              {renderDescriptionItem(
                "NO2 - Indeks jakości",
                airQualityData.no2IndexLevel?.indexLevelName,
                airQualityData.no2IndexLevel
              )}
              {renderDescriptionItem(
                "O3 - Indeks jakości",
                airQualityData.o3IndexLevel?.indexLevelName,
                airQualityData.o3IndexLevel
              )}
              {renderDescriptionItem(
                "PM10 - Indeks jakości",
                airQualityData.pm10IndexLevel?.indexLevelName,
                airQualityData.pm10IndexLevel
              )}
              {renderDescriptionItem(
                "PM25 - Indeks jakości",
                airQualityData.pm25IndexLevel?.indexLevelName,
                airQualityData.pm25IndexLevel
              )}
              {renderDescriptionItem("Data pomiaru", airQualityData.stCalcDate)}
            </Descriptions>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default ComponentB;

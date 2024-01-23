import React, { useState, useEffect } from 'react';

interface HistoricData {
    // Updated to match the provided JSON schema
    "26 maks (S8max) [µg/m3]": number;
    "AOT40 V-VII [µg/m3]*h": number;
    "Czas uśredniania": string;
    "Kod stacji": string;
    "Kod strefy": string;
    "Kompl. lato [%]": number;
    "Kompl. zima [%]": number;
    "Kompletność [%]": number;
    "Liczba Lato/Zima": number;
    "Liczba kompletnych mies. letnich (IV-IX)": number;
    "Liczba pomiarów": number;
    "Max [µg/m3]": number;
    "Min [µg/m3]": number;
    "Nazwa strefy": string;
    "Per. S93.2 (S8max) [µg/m3]": number;
    "Rok": number;
    "SOMO35 [µg/m3]*d": number;
    "Województwo": string;
    "Wskaźnik": string;
    "id": number;
    "Średnia [µg/m3]": number;
}

function HistoricDataForm() {
    const [indicator, setIndicator] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [sort, setSort] = useState<string>('');
    const [wojewodztwo, setWojewodztwo] = useState<string>('');
    const [data, setData] = useState<HistoricData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const constructQueryString = () => {
        const queryParams = new URLSearchParams();
        if (indicator) queryParams.append('indicator', indicator);
        if (page) queryParams.append('page', page.toString());
        if (size) queryParams.append('size', size.toString());
        if (sort) queryParams.append('sort', sort);
        if (wojewodztwo) queryParams.append('wojewodztwo', wojewodztwo);
        return queryParams.toString();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const queryString = constructQueryString();
            const apiUrl = `http://159.69.183.243:5001/api/gios-historic-data?${queryString}`;
            console.log(apiUrl)
            const response = await fetch(apiUrl);
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const unpardesResponseData = await response.json();
            const responseData = JSON.parse(unpardesResponseData);
            // Check if the responseData has the 'Lista statystyk' key and it is an array
            if (responseData && Array.isArray(responseData)) {
                setData(responseData);
            } else {
                throw new Error('Data format error: Expected an array in "Lista statystyk"');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to generate table headers based on the keys of the data objects
    const generateTableHeaders = () => {
        if (data.length > 0) {
            return Object.keys(data[0]).map((key, index) => (
                <th key={index}>{key}</th>
            ));
        }
    };

    const generateTableRows = () => {
        return data.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {Object.keys(row).map((key, cellIndex) => (
                    <td key={cellIndex}>{row[key as keyof HistoricData]}</td>
                ))}
            </tr>
        ));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Form inputs remain unchanged */}
                <input 
                    type="text"
                    value={indicator}
                    onChange={(e) => setIndicator(e.target.value)}
                    placeholder="Indicator"
                />
                <input 
                    type="number"
                    value={page}
                    onChange={(e) => setPage(parseInt(e.target.value, 10))}
                    placeholder="Page"
                />
                <input 
                    type="number"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value, 10))}
                    placeholder="Size"
                />
                <input 
                    type="text"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    placeholder="Sort"
                />
                <input 
                    type="text"
                    value={wojewodztwo}
                    onChange={(e) => setWojewodztwo(e.target.value)}
                    placeholder="Wojewodztwo"
                />
                <button type="submit">Submit</button>
            </form>
    
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
    
            <table>
                <thead>
                    <tr>
                        {generateTableHeaders()}
                    </tr>
                </thead>
                <tbody>
                    {generateTableRows()}
                </tbody>
            </table>
        </div>
    );
}

export default HistoricDataForm;
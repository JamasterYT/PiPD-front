from flask import Flask, jsonify, request
import pandas as pd
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Przykładowe dane populacji dla województw
population_data = {
    'DOLNOŚLĄSKIE': 2900000,
    'KUJAWSKO-POMORSKIE': 2100000,
    'LUBELSKIE': 2121000,
    'LUBUSKIE': 1017000,
    'ŁÓDZKIE': 2493000,
    'MAŁOPOLSKIE': 3406000,
    'MAZOWIECKIE': 5431000,
    'OPOLSKIE': 986000,
    'PODKARPACKIE': 2122000,
    'PODLASKIE': 1185000,
    'POMORSKIE': 2338000,
    'ŚLĄSKIE': 4575000,
    'ŚWIĘTOKRZYSKIE': 1233000,
    'WARMIŃSKO-MAZURSKIE': 1431000,
    'WIELKOPOLSKIE': 3473000,
    'ZACHODNIOPOMORSKIE': 1701000
}


@app.route('/api/gios-data')
def get_gios_data():
        try:
                response = requests.get('https://api.gios.gov.pl/pjp-api/rest/station/findAll')
                response.raise_for_status()
                data = response.json()
                return jsonify(data)
        except requests.RequestException as e:
                return jsonify({'error': str(e)}), 500

@app.route('/api/air-quality-index/<int:stationId>')
def get_air_quality_index(stationId):
        try:
                response = requests.get(f'https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/{stationId}')
                response.raise_for_status()
                data = response.json()
                return jsonify(data)
        except requests.RequestException as e:
                return jsonify({'error': str(e)}), 500

@app.route('/api/get-stations', methods=['GET'])
def get_stations():
    # Pobieranie danych z API
    url = "https://api.gios.gov.pl/pjp-api/rest/station/findAll"
    response = requests.get(url)
    data = response.json()

    # Przetwarzanie danych
    processed_data = []
    for item in data:
        province_name = item['city']['commune']['provinceName'] if item['city'] else None
        processed_data.append({
            'id': item['id'],
            'stationName': item['stationName'],
            'provinceName': province_name
        })

    # Tworzenie DataFrame
    df = pd.DataFrame(processed_data)

    # Grupowanie według województwa i dodanie populacji
    grouped_df = df.groupby('provinceName').size().reset_index(name='stations_count')
    grouped_df['population'] = grouped_df['provinceName'].map(population_data)

    # Obliczanie korelacji
    correlation = grouped_df['stations_count'].corr(grouped_df['population'])

    # Dodanie informacji o korelacji do wyników
    results = {
        'data': grouped_df.to_dict(orient='records'),
        'correlation': correlation
    }

    return jsonify(results)


def get_gios_historic_data_internal(indicator='', page='0', size='20', sort='', wojewodztwo=''):
    # Construct the GIOŚ API URL with query parameters
    api_url = f"https://api.gios.gov.pl/pjp-api/v1/rest/statistics/getStatisticsForPollutants?indicator={indicator}&page={page}&size={size}&sort={sort}&filter[wojewodztwo]={wojewodztwo}"

    # Make the request to the GIOŚ API
    response = requests.get(api_url)
    response.raise_for_status()  # This will raise an exception for HTTP errors
    data = response.json()
    lista_statystyk = data.get("Lista statystyk", [])
    # Return the modified list as JSON
    return json_array_to_dataframe(lista_statystyk)

@app.route('/api/gios-historic-data-avg', methods=['GET'])
def get_historic_data_avg():
    try:
        # Retrieve query parameters
        indicator = request.args.get('indicator', default='SO2')
        page = request.args.get('page', default='0')
        size = request.args.get('size', default='20')
        wojewodztwo = request.args.get('wojewodztwo', default='wielkopolskie')

        # Call the internal function to get the data
        df = get_gios_historic_data_internal(indicator, page, size, '', wojewodztwo)

        # Group by 'Rok' and calculate mean of 'Średnia [µg/m3]'
        grouped_df = df.groupby('Rok')['Średnia [µg/m3]'].mean().reset_index()

        # Convert DataFrame to JSON
        result = grouped_df.to_dict(orient='records')

        return jsonify(result)
    except Exception as e:
        # Return error message for any other issues that arise
        return jsonify({'error': str(e)}), 500

# Helper function to convert JSON array to DataFrame
def json_array_to_dataframe(json_array):
    # Assuming json_array is a list of dictionaries
    return pd.DataFrame(json_array)

if __name__ == '__main__':
    app.run(debug=True)
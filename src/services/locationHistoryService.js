import axios from 'axios';
import { apiRoute, getApiHeader } from '../utils/helpers';

class LocationHistoryService {
    static searchVehicleLocationHistory(searchData) {
        const requestOptions = {
            headers: getApiHeader()
        };
        let paramsdata = JSON.stringify(searchData);

        return axios.post(apiRoute("/v2/vehicle/history"), paramsdata, requestOptions);
    }
}

export default LocationHistoryService;
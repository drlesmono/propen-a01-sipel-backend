import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:2020/api/test/';
const API_URL_FILE = 'http://localhost:2020/api/report/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  getManagerBoard() {
    return axios.get(API_URL + 'manager', { headers: authHeader() });
  }

  getEngineerBoard() {
    return axios.get(API_URL + 'engineer', { headers: authHeader() });
  }

  getDataEntryBoard() {
    return axios.get(API_URL + 'data-entry', { headers: authHeader() });
  }

  getPreviewFile(urlFile){
    return axios.get(API_URL_FILE + urlFile +'/preview', { headers: authHeader() });
  }

  getDownloadFile(urlFile){
    return axios.get(API_URL_FILE + urlFile, { headers: authHeader() });
  }

}

export default new UserService();

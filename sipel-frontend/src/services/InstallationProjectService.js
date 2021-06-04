import axios from 'axios';
import authHeader from './auth-header';

const DELIVERY_PROGRESS_API_BASE_URL = "http://localhost:2020/api/v1/delivery-progress";
const LIST_TASK_API_BASE_URL = "http://localhost:2020/api/v1/list-task";
const ADD_TASK_API_BASE_URL = "http://localhost:2020/api/v1/addTask";
const GET_TASK_API_BASE_URL = "http://localhost:2020/api/v1/retrieve-task";

class InstallationProjectService {

    getVerifiedOrderPi(){
        return axios.get(DELIVERY_PROGRESS_API_BASE_URL, { headers: authHeader() });
    }

    getListTaskByIdPi(idOrderPi){
       return axios.get(LIST_TASK_API_BASE_URL + '/' + idOrderPi, { headers: authHeader() });
    }

    createTask(task, idOrderPi){
        return axios.post(LIST_TASK_API_BASE_URL + '/' + idOrderPi, task, { headers: authHeader() });
    }

    getTaskByIdTask(idTask){
        return axios.get(GET_TASK_API_BASE_URL+'/'+idTask, { headers: authHeader() });
    }

    updateTaskModel(task, idTask){
        return axios.put(LIST_TASK_API_BASE_URL+'/'+idTask, task, { headers: authHeader() });
    }

    deleteTask(idTask){
        return axios.delete(LIST_TASK_API_BASE_URL+'/'+idTask, { headers: authHeader() });
    }

}

export default new InstallationProjectService()
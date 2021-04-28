import axios from 'axios';

const DELIVERY_PROGRESS_API_BASE_URL = "http://localhost:2020/api/v1/delivery-progress";
const LIST_TASK_API_BASE_URL = "http://localhost:2020/api/v1/list-task";
const ADD_TASK_API_BASE_URL = "http://localhost:2020/api/v1/addTask";
const GET_TASK_API_BASE_URL = "http://localhost:2020/api/v1/retrieve-task";

class InstallationProjectService {

    getVerifiedOrderPi(){
        return axios.get(DELIVERY_PROGRESS_API_BASE_URL);
    }

    getListTaskByIdPi(idOrderPi){
       return axios.get(LIST_TASK_API_BASE_URL + '/' + idOrderPi);
    }

    createTask(task, idOrderPi){
        return axios.post(LIST_TASK_API_BASE_URL + '/' + idOrderPi, task);
    }

    getTaskByIdTask(idTask){
        return axios.get(GET_TASK_API_BASE_URL+'/'+idTask);
    }

    updateTaskModel(task, idTask){
        return axios.put(LIST_TASK_API_BASE_URL+'/'+idTask, task);
    }

}

export default new InstallationProjectService()
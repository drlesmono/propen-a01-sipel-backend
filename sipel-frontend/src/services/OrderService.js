import axios from 'axios';
import authHeader from './auth-header';

const ORDER_NOT_VERIFIED_API_BASE_URL = "http://localhost:2020/api/v1/order-verification";
const ORDER_DETAILS_API_BASE_URL = "http://localhost:2020/api/v1/order-details";
const ORDER_VERIFICATION_API_BASE_URL = "http://localhost:2020/api/v1/verification"

class OrderService {

    getAllNotVerifiedOrders(){
        return axios.get(ORDER_NOT_VERIFIED_API_BASE_URL, { headers: authHeader() });
    }

    getOrderByIdOrder(idOrder){
        return axios.get(ORDER_DETAILS_API_BASE_URL + '/' + idOrder, { headers: authHeader() });
    }

    updateStatusVerifikasi(order, idOrder){
        return axios.get(ORDER_VERIFICATION_API_BASE_URL+'/'+idOrder, order, { headers: authHeader() });
    }

}

export default new OrderService()
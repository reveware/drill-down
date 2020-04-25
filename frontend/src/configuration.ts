import { toast } from 'react-toastify';

export class Configuration {
    static SERVER_URL = process.env.REACT_APP_SERVER_URL;

    static getToastConfig = () => ({
        autoClose: 1000,
        newestOnTop: true,
        position: toast.POSITION.TOP_RIGHT,
    });
}

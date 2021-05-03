import logo from './logo.svg';
import './App.css';
import BastPi from "./containers/BastPi";
import Bast from "./containers/Bast";
import Laporan from "./containers/Laporan";
import Generate from "./components/Generate";
import { jsPDF } from "jspdf";
import Layout from "./components/Layout";
import Homepage from "./containers/Homepage";


function App() {
  return (
    <div>
        <Layout>
            <Homepage/>
        </Layout>
    </div>
  );
}

export default App;

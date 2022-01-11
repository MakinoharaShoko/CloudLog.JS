import styles from './App.module.scss';
import 'antd/dist/antd.css';
import {Select} from 'antd';
import {useState} from "react";
import axios from "axios";

const {Option} = Select;

function App() {
    const backendUrl = 'http://localhost:3001';
    const [collections, setCollections] = useState([]);
    const [mongoUrl, setMongoUrl] = useState('mongodb://localhost:27017/');
    const [currentShow, setCurrentShow] = useState('');
    const [showNumber, setShowNumber] = useState(100);
    const [currentLog, setCurrentLog] = useState([]);
    const handleChange = (value) => {
        console.log(`selected ${value}`);
        if (value === undefined) {
            console.log('reset');
            setCurrentShow('');
        } else
            setCurrentShow(value);
    }

    const getAllCollection = () => {
        const data = {
            mongoUrl: mongoUrl
        }
        axios.post(backendUrl + '/getCollection', data).then(r => {
            console.log(r.data);
            let collectionList = [];
            for (const e of r.data) {
                collectionList.push(e.name);
            }
            console.log(collectionList)
            setCollections(collectionList);
        }).catch(err => {
            console.log(err);
        })
    }

    const getLog = () => {
        if (currentShow !== '') {
            const data = {
                mongoUrl: mongoUrl,
                collection: currentShow,
                num: showNumber
            }
            axios.post(backendUrl + '/getLog', data).then(r => {
                console.log(r.data);
            }).catch(e => {

            })
        }
    }

    const toSelect = [];
    collections.map(e => {
        const t = <Option value={e} key={e}>{e}</Option>;
        toSelect.push(t);
    })
    const showLog = [];
    currentLog.map(e => {
        
    })

    return (
        <div className="App">
            <div className={styles.head}>
                <span className={styles.title}>CloudLOG</span>
                <Select style={{width: 120}} allowClear onChange={handleChange}>
                    {toSelect}
                </Select>
                <span onClick={getAllCollection}>测试连接</span>
                <span onClick={getLog}>测试获取</span>
            </div>
            <main className={styles.main}>

            </main>
        </div>
    );
}

export default App;

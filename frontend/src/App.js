import styles from './App.module.scss';
import 'antd/dist/antd.css';
import {Button, Input, Select} from 'antd';
import {useEffect, useState} from "react";
import axios from "axios";
import runtime from "./runtime";

const {Option} = Select;

function App() {
    const backendUrl = 'http://localhost:3001';
    const [collections, setCollections] = useState([]);
    // const [mongoUrl, setMongoUrl] = useState('mongodb://localhost:27017/');
    const [currentShow, setCurrentShow] = useState('');
    const [showNumber, setShowNumber] = useState(100);
    const [currentLog, setCurrentLog] = useState([]);
    const getLog = (collection) => {
        console.log('开始获取');
        let current = collection;
        console.log(current);
        if (current !== '') {
            const data = {
                mongoUrl: runtime.mongoUrl, collection: current, num: showNumber
            }
            axios.post(backendUrl + '/getLog', data).then(r => {
                console.log(r.data);
                setCurrentLog(r.data);
            }).catch(e => {
            })
        } else {
            setCurrentLog([]);
        }
    }

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        if (value === undefined) {
            console.log('reset');
            setCurrentShow('');
            runtime.currentShow = '';
        } else {
            setCurrentShow(value);
            runtime.currentShow = value;
            getLog(runtime.currentShow);
        }
    }

    useEffect(() => {
        setInterval(() => {
            getLog(runtime.currentShow)
        }, 1000);
    }, [])

    const getAllCollection = () => {
        const data = {
            mongoUrl: runtime.mongoUrl
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

    const connect = () => {
        runtime.mongoUrl = document.getElementById('mongoInput').value;
        getAllCollection();
    }

    const toSelect = [];
    collections.map(e => {
        const t = <Option value={e} key={e}>{e}</Option>;
        toSelect.push(t);
    })
    const showLog = [];
    currentLog.map(e => {
        let title = '';
        title = e.level;
        let time = '';
        let logTime = new Date(e.now);
        time = logTime.toLocaleString();
        let info = '';
        info = e.info;
        let color = 'black';
        switch (title) {
            case 'TRACE':
                color = '#005CAF';
                break;
            case 'DEBUG':
                color = '#0089A7';
                break;
            case 'INFO':
                color = '#00896C';
                break;
            case 'WARN':
                color = '#DDA52D';
                break;
            case 'ERROR':
                color = '#AB3B3A';
                break;
            case 'FATAL':
                color = '#E16B8C';
                break;
        }
        let showLogData = [];
        if (e.hasOwnProperty('data')) {
            let dataString = JSON.stringify(e.data, null, 4);
            let t = <div>{dataString}</div>
            showLogData.push(t);
        }
        let t = <div className={styles.logItem}>
            <div className={styles.logTitle}>
                <span className={styles.logTitleText} style={{backgroundColor: color}}>{title}</span>
                <span className={styles.logTitleDate} style={{color: 'rgba(0,0,0,0.7)'}}>{time}</span>
            </div>
            <div>
                <span className={styles.infoText}>
                    {info}
                </span>
            </div>
            <div>
                {showLogData}
            </div>
        </div>
        showLog.push(t);
    })

    return (<div className="App">
        <div className={styles.head}>
            <span className={styles.title}>CloudLOG</span>
            <div className={styles.option}>
                <div>
                    <Input id={'mongoInput'} style={{width: 220}} placeholder="数据库链接"/>
                    <Button onClick={connect} type="primary">连接</Button>
                </div>
                <div style={{padding: '0 0 0 20px'}}>
                    <Select style={{width: 150}} allowClear onChange={handleChange}>
                        {toSelect}
                    </Select>
                </div>
            </div>
        </div>
        <main className={styles.main}>
            <div className={styles.logList}>
                {showLog}
            </div>
        </main>
    </div>);
}

export default App;

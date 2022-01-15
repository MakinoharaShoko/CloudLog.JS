import styles from './App.module.scss';
import 'antd/dist/antd.css';
import '@icon-park/react/styles/index.css';
import {Button, Collapse, Descriptions, Input, InputNumber, Select} from 'antd';
import {useEffect, useState} from "react";
import axios from "axios";
import runtime from "./runtime";
import {Alarm, Bug, Caution, Close, CloseOne, Filter, Info, Trace} from "@icon-park/react";
import {Table, Tag, Space} from 'antd';
import {DatePicker} from 'antd';
import isLevelShow from "./util/getLevel";

const {RangePicker} = DatePicker;
const {Option} = Select;
const {Panel} = Collapse;

function App() {
    const backendUrl = '';
    const [collections, setCollections] = useState([]);
    // const [mongoUrl, setMongoUrl] = useState('mongodb://localhost:27017/');
    const [currentShow, setCurrentShow] = useState('');
    const start = new Date('1970/1/1');
    const end = new Date('2100/1/1');
    const [showTime, setShowTime] = useState({start: start, end: end});
    const [showPicker, setShowPicker] = useState(false);
    const [level, setLevel] = useState('ALL');
    const [currentLog, setCurrentLog] = useState([]);
    const [sourceList, setSourceList] = useState([]);
    const [showManage, setShowManage] = useState(false);
    const getLog = (collection) => {
        // console.log('开始获取');
        let current = collection;
        // console.log(current);
        if (current !== '') {
            const data = {
                mongoUrl: runtime.mongoUrl, collection: current, num: runtime.showNumber
            }
            axios.post(backendUrl + '/getLog', data).then(r => {
                // console.log(r.data);
                setCurrentLog(r.data);
            }).catch(e => {
            })
        } else {
            setCurrentLog([]);
        }
    }

    const handleChange = (value) => {
        // console.log(`selected ${value}`);
        if (value === undefined) {
            // console.log('reset');
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
        if (localStorage.getItem('dataSource')) {
            let currentList = JSON.parse(localStorage.getItem('dataSource'));
            setSourceList(currentList);
        }
    }, [])

    const getAllCollection = () => {
        const data = {
            mongoUrl: runtime.mongoUrl
        }
        axios.post(backendUrl + '/getCollection', data).then(r => {
            // console.log(r.data);
            let collectionList = [];
            for (const e of r.data) {
                collectionList.push(e.name);
            }
            // console.log(collectionList)
            setCollections(collectionList);
        }).catch(err => {
            // console.log(err);
        })
    }

    const connect = (value) => {
        runtime.mongoUrl = value;
        getAllCollection();
    }

    const toSelect = [];
    collections.map(e => {
        const t = <Option value={e} key={e}>{e}</Option>;
        toSelect.push(t);
    })
    const toSourceList = [];
    let count = 0;
    sourceList.map(e => {
        count++;
        const t = <Option value={e.source} key={count}>{e.name}</Option>;
        toSourceList.push(t);
    })

    const deleteAdetaSource = (key) => {
        let arr = JSON.parse(localStorage.getItem('dataSource'));
        arr.map((e, i) => {
            if (e.key === key) {
                arr.splice(i, 1);
            }
        });
        localStorage.setItem('dataSource', JSON.stringify(arr));
        setSourceList(JSON.parse(localStorage.getItem('dataSource')));
    }

    const toManageSource = [];
    sourceList.map(e => {
        count++;
        const t = <div className={styles.sourceItem} key={count}>
            <span className={styles.sourceItemTitle}>{e.name}</span>
            <CloseOne className={styles.deleteItemIcon} onClick={() => {
                deleteAdetaSource(e.key)
            }} theme="filled" size="18" fill="#333"/>
        </div>
        toManageSource.push(t);
    })

    const showLog = [];
    currentLog.map(e => {
        let title = '';
        title = e.level;
        let time = '';
        let logTime = new Date(e.now);
        time = logTime.toLocaleString('chinese', {hour12: false});
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
        let icon = <div/>;
        switch (title) {
            case 'TRACE':
                icon = <Trace theme="filled" size="24" fill={color}/>;
                break;
            case 'DEBUG':
                icon = <Bug theme="filled" size="24" fill={color}/>;
                break;
            case 'INFO':
                icon = <Info theme="filled" size="24" fill={color}/>;
                break;
            case 'WARN':
                icon = <Caution theme="filled" size="24" fill={color}/>;
                break;
            case 'ERROR':
                icon = <CloseOne theme="filled" size="24" fill={color}/>;
                break;
            case 'FATAL':
                icon = <Alarm theme="filled" size="24" fill={color}/>;
                break;
        }
        let showBlank = false;
        if (title === 'INFO' || title === 'WARN') {
            showBlank = true;
        }
        let showLogData = [];
        let hasLogData = false;
        if (e.hasOwnProperty('data')) {
            let dataString = JSON.stringify(e.data, null, '\t');
            // console.log(dataString);
            let t = <div>{dataString}</div>
            showLogData.push(t);
            hasLogData = true;
        }
        let t = <div className={styles.logItem}>
            <div className={styles.logTitle}>
                {icon}
                <span className={styles.logTitleText} style={{color: color}}>{title}{showBlank &&
                    <span>{'\u00a0'}</span>}</span>
                <span className={styles.logTitleDate} style={{color: 'rgba(0,0,0,0.7)'}}>{time}</span>
            </div>
            <div>
                <span className={styles.infoText}>
                    {info}
                </span>
            </div>
            <div>{hasLogData && <div><Collapse defaultActiveKey={[]}>
                <Panel header="展示数据" key="1">
                    <pre className={styles.code}>{showLogData}</pre>
                </Panel>
            </Collapse></div>
            }
            </div>
        </div>
        let start = showTime.start;
        let end = showTime.end;
        let show = true;
        if (logTime.getTime() > end.getTime() || logTime.getTime() < start.getTime()) {
            show = false;
        }
        if (!isLevelShow(e.level, level)) {
            show = false;
        }
        if (show) {
            showLog.push(t);
        }
    })

    const AddDataSource = () => {
        let newSource = document.getElementById('mongoInput').value;
        let newSourceName = document.getElementById('nameInput').value;
        let r = Math.random();
        let newSourceObj = {name: newSourceName, source: newSource, key: r};
        if (localStorage.getItem('dataSource')) {
            let pre = localStorage.getItem('dataSource');
            pre = JSON.parse(pre);
            pre.push(newSourceObj);
            pre = JSON.stringify(pre);
            localStorage.setItem('dataSource', pre);
        } else {
            let arr = [newSourceObj];
            let s = JSON.stringify(arr);
            localStorage.setItem('dataSource', s);
        }
        let currentList = JSON.parse(localStorage.getItem('dataSource'));
        setSourceList(currentList);
    }

    const RemoveDataSource = () => {
        localStorage.removeItem('dataSource');
        setSourceList([]);
        setCollections([]);
        runtime.currentShow = '';
    }

    const changePickerV = () => {
        if (showPicker) {
            setShowPicker(false);
            document.getElementById('pickerMain').style.display = 'none';
        } else {
            setShowPicker(true);
            document.getElementById('pickerMain').style.display = 'block';
        }
    }

    const pickLevel = (value) => {
        setLevel(value);
    }

    const changeShowNumber = () => {
        let value = document.getElementById('pickNumber').value;
        value = parseInt(value);
        runtime.showNumber = value;
    }

    const getDateRange = (date, dateString) => {
        const start = date[0]['_d'];
        const end = date[1]['_d'];
        const timeRange = {start: start, end: end};
        setShowTime(timeRange);
    }

    return (
        <div className="App">
            <div className={styles.picker}>
                <div className={styles.pickerIcon} onClick={changePickerV}>
                    {!showPicker && <Filter theme="filled" size="28" fill="#333"/>}
                    {showPicker && <Close theme="filled" size="28" fill="#333"/>}
                </div>
                <div>

                </div>
                <div id={'pickerMain'} className={styles.pickerMain}>
                    <div style={{margin: '0 0 10px 0'}}><span className={styles.pickerTitle}>筛选</span></div>
                    <div>
                        <div className={styles.pickerItemTitle}>选择日期</div>
                        <RangePicker showTime onChange={getDateRange}/>
                        <div className={styles.pickerItemTitle}>选择级别</div>
                        <Select defaultValue="ALL" onChange={pickLevel} style={{width: '100px'}}>
                            <Option value="ALL">ALL</Option>
                            <Option value="TRACE">TRACE</Option>
                            <Option value="DEBUG">DEBUG</Option>
                            <Option value="INFO">INFO</Option>
                            <Option value="WARN">WARN</Option>
                            <Option value="ERROR">ERROR</Option>
                            <Option value="FATAL">FATAL</Option>
                            <Option value="NONE">NONE</Option>
                        </Select>
                        <div className={styles.pickerItemTitle}>选择获取条数（筛选前条数）</div>
                        <InputNumber min={1} max={100000} defaultValue={100} id={'pickNumber'}/>
                        <Button onClick={changeShowNumber}>设置</Button>
                    </div>
                </div>
            </div>
            {showManage && <div className={styles.sourceManage}>
                <Close className={styles.closeIcon} theme="filled" size="24" fill="#333" onClick={() => {
                    setShowManage(false)
                }}/>
                <div className={styles.sMtitle}>数据源管理</div>
                <div>
                    <div>
                        <span className={styles.sMelementTitle}>添加数据源</span>
                        <Input id={'mongoInput'} style={{width: 200}} placeholder="数据库链接"/>
                        <span style={{padding: '0 0 0 10px'}}> </span>
                        <Input id={'nameInput'} style={{width: 150}} placeholder="别名"/>
                        <span style={{padding: '0 0 0 10px'}}> </span>
                        <Button onClick={AddDataSource} type="primary">添加数据源</Button>
                        <span style={{padding: '0 0 0 10px'}}> </span>
                        <Button onClick={RemoveDataSource} type="primary">清除所有数据源</Button>
                    </div>
                    <div>
                        <div style={{
                            borderBottom: '1px solid rgba(0,0,0,0.2)',
                            padding: '0 0 3px 0',
                            margin: '10px 0 7px 0'
                        }}>
                            <span className={styles.sMelementTitle}>数据源列表</span>
                        </div>
                        <div className={styles.sourceList}>
                            {toManageSource}
                        </div>
                    </div>
                </div>
            </div>}
            <div className={styles.head}>
                <span className={styles.title}>CloudLOG</span>
                <div className={styles.option}>
                    <div>
                        <Button onClick={() => {
                            setShowManage(true)
                        }} type="primary">管理数据源</Button>
                    </div>
                    <div style={{padding: '0 0 0 20px'}}>
                        <Select style={{width: 150}} allowClear onChange={connect}>
                            {toSourceList}
                        </Select>
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
        </div>
    );
}

export default App;


import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { colDefs1 } from './coldefs/reportDefs';

const Report = () => {
    const navigate = useNavigate();
    const [rspMsg, setRspMsg] = useState('');
    const [record_no, setRecord_no] = useState();
    const [weapons, setWeapons] = useState([]);
    const [crimes, setCrimes] = useState([]);
    const [descents, setDescents] = useState([]);
    const [premises, setPremises] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [rowData1, setRowData1] = useState([]);
    const [myRecords, setMyRecords] = useState([]);
    const user_id = localStorage.getItem('user_id');

    const onGridReady = (params) => {
        // Access the grid API and call autoSizeColumns method
        params.api.autoSizeColumns();
    };

    const gridOptions = {
        pagination: true,
    };

    useEffect(() => {
        if (user_id === '' || user_id === undefined) {
            navigate('/unauth');
            return;
        }
        fetch(`http://localhost:3001/getrecordno?user_id=${user_id}`).then((response) => response.json()).then((resp) => {
            setMyRecords(resp.map(({ record_no }) => ({ value: record_no, label: record_no })));
        });
        fetch(`http://localhost:3001/getReport?User=${user_id}`).then((response) => response.json()).then((report) => {
            setRowData1(report)
        });
        fetch(`http://localhost:3001/getStatuses`).then((response) => response.json()).then((resp) => {
            console.log(resp)
            setStatuses(resp.map(({ status_cd, status_desc }) => ({ value: status_cd, label: status_desc })))
        });
    }, [])


    if (weapons.length < 1) {
        fetch(`http://localhost:3001/getWeapons`).then((response) => response.json()).then((report) => {

            setWeapons(report.map(({ weapon_cd, weapon_desc }) => ({ value: weapon_cd, label: weapon_desc })));

        });
    }
    if (crimes.length < 1) {
        fetch(`http://localhost:3001/getCrimes`).then((response) => response.json()).then((report) => {

            setCrimes(report.map(({ crm_cd, crm_desc }) => ({ value: crm_cd, label: crm_desc })));

        });
    }
    if (descents.length < 1) {
        fetch(`http://localhost:3001/getDescents`).then((response) => response.json()).then((report) => {

            setDescents(report.map(({ vict_descent }) => ({ value: vict_descent, label: vict_descent })));

        });
    }
    if (premises.length < 1) {
        fetch(`http://localhost:3001/getPremises`).then((response) => response.json()).then((report) => {

            setPremises(report.map(({ premise_cd, premise_desc }) => ({ value: premise_cd, label: premise_desc })));

        });
    }
    const submitReport = async () => {

        // fetch(`http://localhost:3001/nextRecordNo`).then((response) => response.text()).then((report) => {

        //     setRecord_no(report);
        // });




        // var record_no = document.getElementById('record_no').value
        // record_no = Number(record_no.replace(/\D/g, ""));
        // record_no += 1;
        // console.log(record_no);
        const crime = document.getElementById('crime').value;
        const age = document.getElementById('age').value;
        const sex = document.getElementById('sex').value;
        const descent = document.getElementById('descent').value;
        const weapon = document.getElementById('weapon').value;
        const premise = document.getElementById('premise').value;
        const location = document.getElementById('location').value;
        const status = document.getElementById('status').value;
        const user_id = localStorage.getItem('user_id');
        console.log(user_id);


        fetch(`http://localhost:3001/report?crime=${crime}&age=${age}&sex=${sex}&descent=${descent}&weapon=${weapon}&premise=${premise}&location=${location}&user_id=${user_id}&status=${status}`).then((response) => response.text()).then((msg) => {
            setRspMsg(msg);
            window.location.reload();
            setTimeout(() => { setRspMsg(''); }, 1500);
        });
    }

    function updateReport() {
        const record_no = document.getElementById('Urecord_no').value
        const crime = document.getElementById('Ucrime').value;
        const age = document.getElementById('Uage').value;
        const sex = document.getElementById('Usex').value;
        const descent = document.getElementById('Udescent').value;
        const weapon = document.getElementById('Uweapon').value;
        const premise = document.getElementById('Upremise').value;
        const location = document.getElementById('Ulocation').value;
        const status = document.getElementById('Ustatus').value;

        fetch(`http://localhost:3001/updateReport?record_no=${record_no}&crime=${crime}&age=${age}&sex=${sex}&descent=${descent}&weapon=${weapon}&premise=${premise}&location=${location}&status=${status}`).then((response) => response.text()).then((msg) => {
            setRspMsg(msg);
            window.location.reload();
            setTimeout(() => { setRspMsg(''); }, 1500);
        });
    }

    return (
        <div className='reportContainer'>
            <h1>Report</h1>

            <p hidden> <input type="text " value={record_no} id="record_no" /></p>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div className='reportForm' style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'left' }}>
                    <label>Crime:</label>
                    <div class="select-box">
                        <div class="options-container">
                            <select className="option" id="crime">
                                <option value="">Select a Crime.. </option>
                                {crimes.map(({ label, value }) => (
                                    <option value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <label>Victime Age:</label>
                    <input type="text " id="age" size="10" />

                    <label>Victim Sex:</label>
                    <div class="select-box">
                        <div class="options-container">
                            <select className="option" id="sex">
                                <option value="">Select a Sex.. </option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="X">Other</option>
                            </select>
                        </div>
                    </div>

                    <label>Victim Descent:</label>
                    <div class="select-box">
                        <div class="options-container">
                            <select className="option" id="descent">
                                <option value="">Select a Descent.. </option>
                                {descents.map(({ label, value }) => (
                                    <option value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <label>Weapon:</label>
                    <div class="select-box">
                        <div class="options-container">
                            <select className="option" id="weapon">
                                <option value="">Select a Weapon.. </option>
                                {weapons.map(({ label, value }) => (
                                    <option value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <label>Premise:</label>
                    <div class="select-box">
                        <div class="options-container">
                            <select className="option" id="premise">
                                <option value="">Select a Premise.. </option>
                                {premises.map(({ label, value }) => (
                                    <option value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <label>Location:</label>
                    <input type="text " id="location" size="50" />
                    <label>Status:</label>
                    <div class="select-box">
                        <div class="options-container">
                            <select className="option" id="status">
                                <option value="">Select Status </option>
                                {statuses.map(({ label, value }) => (
                                    <option value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button onClick={submitReport}>Add Report</button>
                </div >
                <div>
                    <div className='reportForm' style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'left' }}>
                        <label>Record No:</label>
                        <div class="select-box">
                            <div class="options-container">
                                <select className="option" id="Urecord_no">
                                    <option value="">Select a record number </option>
                                    {myRecords.map(({ label, value }) => (
                                        <option value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label>Crime:</label>
                        <div class="select-box">
                            <div class="options-container">
                                <select className="option" id="Ucrime">
                                    <option value="">Select a Crime.. </option>
                                    {crimes.map(({ label, value }) => (
                                        <option value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label>Victime Age:</label>
                        <input type="text " id="Uage" size="10" />

                        <label>Victim Sex:</label>
                        <div class="select-box">
                            <div class="options-container">
                                <select className="option" id="Usex">
                                    <option value="">Select a Sex.. </option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="X">Other</option>
                                </select>
                            </div>
                        </div>

                        <label>Victim Descent:</label>
                        <div class="select-box">
                            <div class="options-container">
                                <select className="option" id="Udescent">
                                    <option value="">Select a Descent.. </option>
                                    {descents.map(({ label, value }) => (
                                        <option value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label>Weapon:</label>
                        <div class="select-box">
                            <div class="options-container">
                                <select className="option" id="Uweapon">
                                    <option value="">Select a Weapon.. </option>
                                    {weapons.map(({ label, value }) => (
                                        <option value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label>Premise:</label>
                        <div class="select-box">
                            <div class="options-container">
                                <select className="option" id="Upremise">
                                    <option value="">Select a Premise.. </option>
                                    {premises.map(({ label, value }) => (
                                        <option value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label>Location:</label>
                        <input type="text " id="Ulocation" size="50" />
                        <label>Status:</label>
                        <div class="select-box">
                            <div class="options-container">
                                <select className="option" id="Ustatus">
                                    <option value="">Select Status </option>
                                    {statuses.map(({ label, value }) => (
                                        <option value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button onClick={updateReport}>Update Report</button>
                    </div>
                </div>
            </div>
            <div className='tables'>
                <div id='grid1' className="ag-theme-quartz" style={{ height: 200, width: '100vw' }}>
                    <h3>My Reports</h3>
                    <AgGridReact gridOptions={gridOptions} rowData={rowData1} onGridReady={onGridReady} columnDefs={colDefs1} />
                </div>
            </div>
        </div >
    )
}

export default Report
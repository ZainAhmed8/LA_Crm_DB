import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { colDefs1 } from './coldefs/reportDefs';
const DelReport = () => {
    const user_id = localStorage.getItem('user_id');
    const [record_no, setRecord_No] = useState([]);
    const [rowData1, setRowData1] = useState([]);

    fetch(`http://localhost:3001/getReport?User=${user_id}`).then((response) => response.json()).then((report) => {

        setRowData1(report)

    });

    if (record_no.length < 1) {
        fetch(`http://localhost:3001/getrecordno?user_id=${user_id}`).then((response) => response.json()).then((report) => {

            setRecord_No(report.map(({ record_no }) => ({ value: record_no })));

        });
    }

    const deleteReport = async () => {

        var record_no = document.getElementById('record_no').value

        fetch(`http://localhost:3001/delreport?record_no=${record_no}`).then((response) => response.text()).then((msg) => {
        });
    }

    const gridOptions = {
        pagination: true,
    };
    return (
        <div className='DelReportContainer'>
            <h1>Delete Report</h1>

            <div className='delreportForm' style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'left' }}>
                <label>Select record no. to delete:</label>
                <div class="select-box">
                    <div class="options-container">
                        <select className="option" id="record_no">
                            <option value="">Record No. </option>
                            {record_no.map(({ value }) => (
                                <option value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className='tables'>
                <div id='grid1' className="ag-theme-quartz" style={{ height: 250, width: '50vw' }}>
                    <h3>My Reports</h3>
                    <AgGridReact gridOptions={gridOptions} rowData={rowData1} columnDefs={colDefs1} />
                </div>
            </div>
            <button onClick={deleteReport}>Delete Report</button>
        </div >
    )
}
export default DelReport
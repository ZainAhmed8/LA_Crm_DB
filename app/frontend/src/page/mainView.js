import React, { useRef, useEffect, useState } from 'react'
import '../styles/mainView.css'
import mapboxgl from 'mapbox-gl';
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { colDefs1, colDefs2 } from './coldefs/reportDefs';
import { useNavigate } from "react-router-dom";
import Report from './report';
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9uYWh0amFuZHJhIiwiYSI6ImNsMDF2ZDI0YTB5MnUzZW5mNjN2eDFnMWsifQ.sUJWXMNTqYfTXYpnC7agtw';

const MainView = () => {
    const navigate = useNavigate();
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-118.243683);
    const [lat, setLat] = useState(34.052235);
    const [zoom, setZoom] = useState(10);
    const [auth, setAuth] = useState(false);
    const [user_id, setUserId] = useState(localStorage.getItem('user_id'));
    const [rowData1, setRowData1] = useState([]);
    const [rowData2, setRowData2] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [d1Obj, setD1Obj] = useState(null);
    const [d2Obj, setD2Obj] = useState(null);
    const [cmpList, setCmpList] = useState([]);
    const [currMarkers, setCurrMarkers] = useState([]);

    const onGridReady = (params) => {
        // Access the grid API and call autoSizeColumns method
        params.api.autoSizeColumns();
    };

    const displayAllMarkers = () => {
        fetch('http://localhost:3001/getReport').then((response) => response.json()).then((report) => {
            setRowData2(report)
            // add markers to map
            const markers = []
            for (let i = 0; i < report.length; ++i) {
                const lat = report[i].latitude;
                const lng = report[i].longitude;
                const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current);
                markers.push(marker);
                const markerElement = marker.getElement();
                markerElement.style.width = '20px'; // Set the width of the marker
                markerElement.style.height = '20px'; // Set the height of the marker
            }
            setCurrMarkers(markers);
        });
    }

    useEffect(() => {
        console.log(localStorage.getItem('user_id'))
        if (user_id === '' || user_id === undefined) {
            navigate('/unauth');
        } else {
            if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom
            });
            // fetching reports
            fetch(`http://localhost:3001/getReport?User=${user_id}`).then((response) => response.json()).then((report) => {
                setRowData1(report)
            });
            displayAllMarkers();
        }
    });

    function clearMarkers() {
        for (let i = 0; i < currMarkers.length; ++i) {
            currMarkers[i].remove();
        }
    }

    const logout = () => {
        navigate('/');
        localStorage.setItem('user_id', '');
    }

    const report = () => {
        navigate('/report');
    }

    const delreport = () => {
        navigate('/delreport');
    }

    const gridOptions = {
        pagination: true,
    };

    const getSuggestions = (e) => {
        const search = e.target.value;
        if (search.length === 0) {
            setSuggestions([]);
            return;
        }
        const url = `http://localhost:3001/autocompleteCrm?search=${search}`
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setSuggestions(data);
            })
    }

    function compare(e) {
        // clear
        setD1Obj(null);
        setD2Obj(null);

        const dist1E = document.getElementById('dist1');
        const dist2E = document.getElementById('dist2');
        const dist1 = dist1E.value;
        const dist2 = dist2E.value;
        const crm_descE = document.getElementById('crmSearch');
        const crm_desc = crm_descE.value;
        // fetch advanced SP
        // demo 1385, 377
        let url = `http://localhost:3001/quickCompare?dist1=${dist1E.value}&dist2=${dist2E.value}`
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                let data = resp[0];
                for (let i = 0; i < data.length; ++i) {
                    console.log(data);
                    if (data[i].crmDesc === crm_desc) {
                        if (data[i].district === 'District 1') {
                            // set district 1 obj
                            data[i].district = dist1;
                            setD1Obj(data[i]);
                        } else {
                            // set district 2 obj
                            data[i].district = dist2;
                            setD2Obj(data[i]);
                        }
                    }
                }
            })

        // fetch dist1 and dist2 data
        url = `http://localhost:3001/getCmpInfo?dist1=${dist1E.value}&dist2=${dist2E.value}&crm_desc=${crm_desc}`
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                setCmpList(resp);
            })

        // clear 
        dist1E.value = '';
        dist2E.value = '';
        crm_descE.value = '';
    }

    function displaySuggestions() {
        const suggestionDivs = []
        for (let i = 0; i < suggestions.length; ++i) {
            suggestionDivs.push(
                <div onClick={() => {
                    const crmInput = document.getElementById('crmSearch');
                    crmInput.value = suggestions[i].crm_desc;
                    setSuggestions([]);
                }} key={i} id={i} className='suggestion-cell'>{`${suggestions[i].crm_desc}`}</div>
            );
        }
        return suggestionDivs;
    }

    function visualizeCmp() {
        if (cmpList.length) {
            const markers = {}
            for (let i = 0; i < cmpList.length; ++i) {
                if (cmpList[i].dist_no in markers) {
                    // console.log(cmpList[i])
                    markers[cmpList[i].dist_no].push([cmpList[i].longitude, cmpList[i].latitude]);
                } else {
                    markers[cmpList[i].dist_no] = [[cmpList[i].longitude, cmpList[i].latitude]];
                }
            }
            clearMarkers();
            // add markers to map
            const markerList = []
            let ct = 0
            console.log(markers);
            for (const distNo in markers) {
                console.log(markers[distNo])
                for (let i = 0; i < markers[distNo].length; ++i) {
                    const e = markers[distNo][i];
                    let color = ct ? '#1D58A7' : '#FF5F05'
                    const lng = e[0];
                    const lat = e[1];
                    // console.log(lng, lat)
                    if (lng && lat) {
                        // console.log([lng, lat]);
                        const marker = new mapboxgl.Marker({ color: color }).setLngLat([lng, lat]).setPopup(
                            new mapboxgl.Popup({ offset: 25 })
                                .setHTML(
                                    `<p>${distNo}</p>`
                                )
                        ).addTo(map.current);
                        markerList.push(marker);
                        const markerElement = marker.getElement();
                        markerElement.style.width = '20px'; // Set the width of the marker
                        markerElement.style.height = '20px'; // Set the height of the marker
                    }
                }
                ct += 1;
            }
            setCurrMarkers(markerList);
        }
    }

    return (
        <div className='MainViewContainer'>
            <div className='header'>
                <h3 style={{ alignSelf: 'center' }}>{auth !== '' ? 'LACrimeRisk 🚔' : 'Unauthorized Access! Please login.'}</h3>
                <p>User: {user_id}</p>
                <button onClick={logout}>Log out</button>
                {/* <button onClick={delreport}>Delete Report</button> */}
            </div>
            <div className='midRow'>
                <div ref={mapContainer} className="map-container" />
                <div className='stats'>
                    <h3>QuickCompare</h3>
                    <input id='dist1' type="text " placeholder='Enter first district' />
                    <input id='dist2' type="text " placeholder='Enter second district' />
                    <input id='crmSearch' type="text " placeholder='Enter crime' onChange={getSuggestions} />
                    <button onClick={compare}>Compare</button>
                    <div className='suggestions'>
                        {displaySuggestions()}
                    </div>
                    <div className='quickCmpRes'>
                        <table>
                            <tr>
                                <th>District</th>
                                <th>Average Victim Age</th>
                                <th>Num of Crimes</th>
                                <th>Risk Level</th>
                                <th>Crime</th>
                                <th>District</th>
                                <th>Average Victim Age</th>
                                <th>Num of Crimes</th>
                                <th>Risk Level</th>
                            </tr>
                            <tr>
                                <td> {d1Obj ? d1Obj.district : ''}</td>
                                <td> {d1Obj ? d1Obj.avgVictAge : ''}</td>
                                <td> {d1Obj ? d1Obj.totalCrimes : ''}</td>
                                <td> {d1Obj ? d1Obj.riskLevel : ''}</td>
                                <td> {d1Obj ? d1Obj.crmDesc : (d2Obj ? d2Obj.crmDesc : '')}</td>
                                <td> {d2Obj ? d2Obj.district : ''}</td>
                                <td> {d2Obj ? d2Obj.avgVictAge : ''}</td>
                                <td> {d2Obj ? d2Obj.totalCrimes : ''}</td>
                                <td> {d2Obj ? d2Obj.riskLevel : ''}</td>
                            </tr>
                        </table>
                    </div>
                    <button onClick={visualizeCmp}>Visualize</button>
                </div>
            </div>
            <div className='tables'>
                <div id='grid1' className="ag-theme-quartz" style={{ height: 250, width: '50vw' }}>
                    <h3>My Reports <button style={{ marginLeft: '10px' }} onClick={report}>Edit My Report</button></h3>
                    <AgGridReact gridOptions={gridOptions} onGridReady={onGridReady} rowData={rowData1} columnDefs={colDefs1} />
                </div>
                <div id='grid2' className="ag-theme-quartz" style={{ height: 250, width: '50vw' }}>
                    <h3>All Reports</h3>
                    <AgGridReact gridOptions={gridOptions} onGridReady={onGridReady} rowData={rowData2} columnDefs={colDefs2} />
                </div>
            </div>
        </div >
    )
}

export default MainView
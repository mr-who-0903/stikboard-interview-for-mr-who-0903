import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Modal, Button, Spinner } from 'react-bootstrap';
import logo from '../images/spacex.svg';

const Dashboard = () => {

    const history = useHistory();
    const [launch, setLaunch] = useState([]);
    const [modalInfo, setModalInfo] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [inputChange, setInputChange] = useState("");
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const callDashPage = async () => {
        try{
            const res = await fetch('/dashboard', {
                method:"GET",
                headers:{
                    Accept: "application/json",    // Accept is the media-type of the response it is expecting.
                    "Content-Type": "application/json" // content-type is the media-type of the request being sent from client.
                },
                credentials:"include",
            });

            const data = await res.json();
            console.log(data);
 
            if(res.status !== 200){
                throw new Error(res.error);
            }
        }
        catch(err){
            console.log(err);
            history.push('/signin');
        }
    }

    const getLaunchData = async() =>{

        const launchType = document.getElementById('select1').value;
        console.log(launchType);
        try{
            const data = await axios.get(`https://api.spacexdata.com/v3/launches/${launchType}`);
            setLaunch(data.data);
            setLoading(true);
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(() => {
        callDashPage();
    }, []);

    useEffect(() =>{
        getLaunchData();
    }, [inputChange]);
    
    
    const columns = [
        { dataField:"flight_number", text:"No." },
        { dataField:"launch_date_utc", text:"Launched (UTC)", formatter: dateFormatter },
        { dataField:"launch_site.site_name", text:"Location" },
        { dataField:"mission_name", text:"Mission" },
        { dataField:"rocket.second_stage.payloads[0].orbit", text:"Orbit" },
        { dataField:"launch_success", text:"Launch Status", formatter: statusFormatter },
        { dataField:"rocket.rocket_name", text:"Rocket" }
    ]
    
    function statusFormatter(cell, row, rowIndex, formatExtraData) {
        if(cell){
            return(<div className="s_cell">Success</div>)
        }
        else{
            return(<div className="f_cell">Failure</div>)
        }
    }

    function dateFormatter(cell, row, rowIndex, formatExtraData){

        var allDateTime = cell.split('T');
        var allDate = allDateTime[0];  // 2008-08-03 (yyyy mm dd)
        var allTime = allDateTime[1];  // 03:34:00.000Z
        var allDateArr = allDate.split('-'); // [2008, 08, 03]
        var allTimeArr = allTime.split(':'); // [03, 34, 00.000z]
        var months = [ "Jan", "Feb", "Mar", "April", "May", "June", 
           "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

        var resDate = allDateArr[2]+" "+months[allDateArr[1] - 1]+" "+allDateArr[0];
        var resTime = allTimeArr[0]+':'+allTimeArr[1];

        return (resDate+" at "+resTime);
    }

    const rowEvents={
        onClick: (e, row) =>{
            setModalInfo(row);
            toggleTrueFalse();
        }
    }

    const toggleTrueFalse = () =>{
        setShowModal(handleShow);
    }

    const changeDropdownState = (event) =>{      // setInputChange whenever dropdown is changed
        setInputChange(event.target.value);
    }

    const ModalContent = () =>{
        return(
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="container modalCont">
                            <div className="row">
                                <div className="col-4"><img className="modalLogo" src={modalInfo.links.mission_patch} alt="logo" /></div>
                                <div className="col-8">
                                     {modalInfo.mission_name} 
                                     <h6>{modalInfo.rocket.rocket_name}</h6>

                                     <a href={modalInfo.links.article_link} target="_blank">
                                        <img className="nasalogo" src="https://www.pinclipart.com/picdir/middle/71-713438_nasa-logo-font-nasa-black-and-white-clipart.png" alt="nasa" />
                                     </a>
                                     <a href={modalInfo.links.wikipedia} target="_blank">
                                        <i className="fa fa-wikipedia-w"></i>
                                     </a>
                                     <a href={modalInfo.links.video_link} target="_blank">
                                        <i className="fa fa-youtube-play"></i>
                                     </a>
                                     
                                </div>
                            </div>
                        </div>
                        
                         
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalInfo.details}</p>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Flight Number</td>
                                <td>{modalInfo.flight_number}</td>
                            </tr>
                            <tr>
                                <td>Mission Name</td>
                                <td>{modalInfo.mission_name}</td>
                            </tr>
                            <tr>
                                <td>Rocket Type</td>
                                <td>{modalInfo.rocket.rocket_type}</td>
                            </tr>
                            <tr>
                                <td>Rocket Name</td>
                                <td>{modalInfo.rocket.rocket_name}</td>
                            </tr>
                            <tr>
                                <td>Manufacturer</td>
                                <td>{modalInfo.rocket.second_stage.payloads[0].manufacturer}</td>
                            </tr>
                            <tr>
                                <td>Nationality</td>
                                <td>{modalInfo.rocket.second_stage.payloads[0].nationality}</td>
                            </tr>
                            <tr>
                                <td>Launch Date</td>
                                <td>{dateFormatter(modalInfo.launch_date_utc)}</td>
                            </tr>
                            <tr>
                                <td>Payload Type</td>
                                <td>{modalInfo.rocket.second_stage.payloads[0].payload_type}</td>
                            </tr>
                            <tr>
                                <td>Orbit</td>
                                <td>{modalInfo.rocket.second_stage.payloads[0].orbit}</td>
                            </tr>
                            <tr>
                                <td>Launch Site</td>
                                <td>{modalInfo.launch_site.site_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>

            </Modal>
        );
    }
    
    return (
        <div>
            <div className="centerLogoCont">
                <img src={logo} alt="logo" className="centerLogo"/>
            </div>
            
            <div className="container">

            <div className="selectDiv" onChange={changeDropdownState}>
                    <i className="fa fa-filter"></i>
                    <select id="select1">
                        <option value=" ">All Launches</option>
                        <option value="upcoming">Upcoming Launches</option>
                        <option value="past">Past Launches</option>
                    </select>
            </div> 

            {loading ? 
                <BootstrapTable 
                    keyField="flight_number"
                    data={launch}
                    columns={columns}
                    pagination={paginationFactory()}
                    rowEvents={rowEvents}
                />
            : 
            <div style={{textAlign: 'center' }}>
                <Spinner animation="border" /> 
            </div>
            }

            </div>
            { show ? <ModalContent/> : null }
        </div>
        
    )
}

export default Dashboard

import { Box, Button, Typography, Toolbar, AppBar } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../images/AOWL.png';
import { makeStyles } from "@mui/styles";
import Header from "./Header";
import { useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles({
    title: {
        textAlign: 'center',
        fontSize: '4rem',
        fontWeight: 500,
        color: '#444',
        marginBottom: '1rem',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '82vh',
    },
    upperSection: {
        background: 'linear-gradient(to bottom, #BE50F2, #3888FF)',
        width: '100%',
    },
    leftpart: {
        alignItems: 'left',
    },

});

const PositionPage = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const { state } = useLocation()
    const { firstName, lastName, roomCode } = state.formInput
    const studentID = state.studentID;
    const roomName = state.roomName
    const teachingAssistantName = state.teachingAssistantName
    console.log(firstName, lastName, roomCode, studentID, roomName, teachingAssistantName)
    const [studentCount, setStudentCount] = useState(0);

    const removeStudent = async (studentID) => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        console.log(studentID);
        let url = `http://localhost:4000/student/leaveWaitingRoom`
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                studentID_pk: studentID
            }),
        })
        navigate('/dashboard')
    }

    const countlist = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());
        
        
            let url = `http://localhost:4000/student/studentFind`
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    
                    studentID_pk: studentID,
                    room_code_pk: roomCode
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                } else {
                    return response.json();
                }
            })
                .then(data => {
                   let position = data["message"];
                    setStudentCount(position);
                    
                })
               
        
    }

    
    useEffect(() => {
        countlist()

        const interval = setInterval(() => {
            countlist();
        }, 5000);

        return () => clearInterval(interval);
    }, [roomCode,studentCount])

    /*const checkStatus = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());
    
        if (roomCode) {
            let url = `http://localhost:4000/student/studentFind`
            fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    studentID_pk: studentID,
                    room_code_pk: roomCode
                }),
            })
                .then(res => res.json())
                .then(data => {
                    
                    let students = data["message"]
                    setStudentCount(students)
                    const studentInList=students.some(student=>student.studentID_pk==studentID)
                    if(!studentInList){
                       navigate('/dashboard')
                    }
                })
        }
    }
    useEffect(() => {
        checkStatus()

        const interval = setInterval(() => {
            checkStatus();
        }, 5000);

        return () => clearInterval(interval);
    }, [roomCode,studentCount,studentID]) */


    return (
        <Box>
            <AppBar position="static" sx={{ background: 'linear-gradient(to bottom, #BE50F2, #3888FF)' }}>
                <Toolbar>
                    <img src={logo} alt="Logo" className="header-logo" />
                    <Typography variant="h4" component="h4" className="waiting-room-name" style={{ fontWeight: 'bold' }}>
                        {roomName}
                    </Typography>
                    <Typography variant="h4" component="h4" className="waiting-room-ta" style={{ fontWeight: 'bold' }}>
                        TA: {teachingAssistantName}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box className={classes.container}>
                <div className={classes.title}>
                    <Typography variant="h3">
                        <b>Your Position</b>
                    </Typography>
                    <Typography fontSize={200}>
                        <b>{studentCount}</b>
                    </Typography>
                </div>
                <Box style={{ marginTop: '50px' }} onClick={() => removeStudent(studentID)}>
                    <Button variant="contained" className="shadow" sx={{
                        color: 'white', borderRadius: '30px', minWidth: '35%',
                        minHeight: '3rem', background: 'red', '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                    }}>
                        Leave Room
                    </Button>
                </Box>
                <Box style={{ marginTop: '50px' }} onClick={() => navigate("/dashboard")}>
                    <Button variant="contained" className="shadow" sx={{
                        color: 'white', borderRadius: '30px', minWidth: '35%',
                        minHeight: '3rem', background: 'black', '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                    }}>
                        Back to Dashboard
                    </Button>
                </Box>
            </Box>
            <Box display="flex" >
                <Typography variant="h4" className={classes.leftpart}>
                    &nbsp;<b>Name: {firstName} {lastName}</b>
                </Typography>
                <div className="room-code-container">
                    <div className="room-code" sx={{ background: 'linear-gradient(to bottom, #BE50F2, #3888FF)' }}>Room Code: {roomCode}</div>
                </div>
            </Box>

        </Box>
    );
}

export default PositionPage;


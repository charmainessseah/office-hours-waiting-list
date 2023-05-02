import {Box, Button, Typography, Grid, IconButton} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        padding: "1rem",
        [theme.breakpoints.down('xs')]: {
            padding: '0.5rem',
        },
    },
    title: {
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: 500,
        color: "#444",
        marginBottom: "1rem",
        [theme.breakpoints.down('xs')]: {
            fontSize: '1.5rem',
        },
    },
    background: {
        background: 'linear-gradient(135deg, #5B247A 0%, #1B1464 100%)',
        minHeight: '100vh',
        minWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    root: {
        background: '#FFF',
        borderRadius: '10px',
        padding: '1rem',
    },
}));

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
        <Grid container className={classes.background}>
            <Grid item xs={12} sm={12} md={10} lg={8} xl={6} className={`${classes.container} ${classes.root}`}>
        <Box>
            <Box onClick={() => navigate("/dashboard")}>
                <IconButton sx={{
                    color: 'black', background: 'white', borderRadius: '50%', '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                }}>
                    <ArrowBackIcon sx={{ fontSize: '40px' }} />
                </IconButton>
            </Box>
            <Typography
                variant="h4"
                className={classes.title}
                style={{ color: "black", fontWeight: "bold" }}
            >
                Waiting List
            </Typography>
            <Typography
                variant="h6"
                style={{ textAlign: "center", fontWeight: "bold", marginBottom: "1rem" }}
            >
                Room: {roomName} | TA: {teachingAssistantName}
            </Typography>

            <Grid container justifyContent="center">
            <Box sx={{marginTop: '40px'}}>
                <Typography variant="h6" className={classes.leftpart}>
                    &nbsp;Joined as, <b>{firstName} {lastName}</b>
                </Typography>
            </Box>
            </Grid>

                <div className={classes.title}>
                    <Typography variant="h3">
                        <b>Your Position</b>
                    </Typography>
                    <Typography fontSize={200}>
                        <b>{studentCount}</b>
                    </Typography>
                </div>
                <Grid container justifyContent="right" style={{ marginBottom: '-20px' }}>
                <Box style={{ marginTop: '150px' }}>
                    <Button onClick={() => removeStudent(studentID)} variant="contained" className="shadow" sx={{
                        fontWeight: 'bold', color: 'white', borderRadius: '12px', minWidth: '100%',
                        minHeight: '3rem', background: '#ff0021', '&:hover': { background: '#660900', opacity: 0.9, transition: '.2s' }
                    }}>
                        Leave Room
                    </Button>
                </Box>
            </Grid>
            <Grid>
                <Typography sx={{fontWeight: 'bold'}}>Room Code: {roomCode}</Typography>
            </Grid>
        </Box>
            </Grid>
        </Grid>
    );
}

export default PositionPage;


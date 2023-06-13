import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, IconButton } from '@mui/material';
import joinGraphic from '../images/join_graphic.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from "../firebase"
import logo from "../images/AOWL.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const JoinPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('')
    const [studentID, setStudentID] = useState([])

    const { state } = useLocation()
    const firstName = state.firstName
    const lastName = state.lastName

    const [roomName, setRoomName] = useState('')
    const [roomCode, setRoomCode] = useState('')

    const isEmpty = (str) => {
        return (!str || str.trim().length === 0);
    }

    const joinWaitingListApi = async () => {
        let lastInsertedId = -1
        let roomName = ''
        let teachingAssistantName = ''
        let hasError = false;

        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        let url = `http://localhost:4000/student/joinWaitingRoom`
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                room_code: roomCode
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
                lastInsertedId = data["last_inserted_id"]
                roomName = data["waiting_list_name"]
                teachingAssistantName = data["first_name"] + ' ' + data["last_name"]
                setStudentID(lastInsertedId)
                setRoomName(roomName)
            }).catch((error) => {
                if (error.message === '403') {
                    setError('You have already joined the list.')
                } else if (error.message === '404') {
                    setError('This waiting list does not exist.')
                }
                hasError = true;
            });

        return hasError ? [-1, -1, -1] : [lastInsertedId, roomName, teachingAssistantName]
    }

    const formIsValid = async () => {
        if (isEmpty(roomCode) || hasWhiteSpace(roomCode)) {
            setError('Error: Input cannot contain whitespace')
            return false;
        }

        const [lastInsertedId, roomName, teachingAssistantName] = await joinWaitingListApi();
        if (lastInsertedId === -1 && roomName && -1 && teachingAssistantName === -1) {
            return false;
        }

        console.log('firstname: ', firstName)
        console.log('lastname: ', lastName)
        console.log('studentID', lastInsertedId)
        console.log('roomname', roomName)
        console.log('roomcodeL: ', roomCode)
        console.log('teaching assistnat name', teachingAssistantName)

        navigate('/position-page', {
            state: {
                firstName: firstName,
                lastName: lastName,
                studentID: lastInsertedId,
                roomName: roomName,
                roomCode: roomCode,
                teachingAssistantName: teachingAssistantName
            }
        });

        return true;
    }

    const hasWhiteSpace = (s) => {
        return /\s/g.test(s);
    };

    return (
        <Grid container>
            <Grid item xs={12} sm={6}>
                <Box m={3} display="flex" justifyContent="left" onClick={() => navigate("/dashboard")}>
                    <IconButton sx={{
                        color: 'black', background: 'white', borderRadius: '50%', '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                    }}>
                        <ArrowBackIcon sx={{ fontSize: '40px' }} />
                    </IconButton>
                </Box>
                <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
                    <img src={joinGraphic} alt="Computer graphic" style={{ maxWidth: '90%', maxHeight: '90%' }} />
                </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(to bottom, #7b50f2, #b792de)', // Add the gradient background here
            }}>
                <Box height="100vh" bgcolor="gradient.linear(to-r, #2D7DD2, #0FA3B1)" display="flex"
                    flexDirection="column" justifyContent="center" alignItems="center">
                    <img src={logo} alt="Logo" className={"join-logo"} />

                    <Box
                        sx={{
                            background: 'white',
                            borderRadius: 2,
                            width: '180%',
                            padding: 5,
                            boxShadow: 3,
                        }}
                    >
                        <Typography variant="h4" component="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black', marginBottom: '2rem', textAlign: 'left' }}>
                            Join a Room
                        </Typography>

                        <Box mt={2}>
                            <TextField
                                name="roomCode"
                                label="Room Code"
                                variant="outlined"
                                value={roomCode}
                                fullWidth
                                onChange={(e) => setRoomCode(e.target.value)}
                            />
                        </Box>
                        <Box mt={2}>
                            {error && <Typography color="error">{error}</Typography>}
                        </Box>
                        <Button onClick={formIsValid} variant="contained" sx={{
                            marginTop: '20px',
                            color: 'white',
                            borderRadius: '30px',
                            minWidth: '100%',
                            minHeight: '3rem',
                            background: '#000000',
                            '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                        }}>
                            Join
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default JoinPage;


import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import createGraphic from '../images/create-graphic.jpg';
import { auth } from "../firebase"
import logo from "../images/AOWL.png";

const CreateListPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation()
    const firstName = state.firstName
    const lastName = state.lastName

    const [waitingListName, setWaitingListName] = useState('')

    const isEmpty = (str) => {
        return (!str || str.trim().length === 0);
    }

    const createWaitingListApi = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        let url = `http://localhost:4000/waitingList/createWaitingList`
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                waiting_list_name: waitingListName
            }),
        })
        let jsonResponse = await response.json()
        let roomCode = jsonResponse["room_code"]

        return roomCode
    }

    const formIsValid = async () => {
        if (isEmpty(waitingListName)) {
            return false;
        }
        const roomCode = await createWaitingListApi()
        console.log('create list api result: ', roomCode)
        navigate('/waiting-list', { state: { firstName: firstName, lastName: lastName, waitingListName: waitingListName, roomCode: roomCode } });
        return true;
    }

    return (
        <Grid container style={{ height: '100vh' }}>
            <Grid item xs={12} md={6} sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(to bottom, #7b50f2, #b792de)', // Add the gradient background here
            }}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%"
                    p={3}>
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
                        <Typography variant="h4" component="h4" gutterBottom
                            style={{ fontWeight: 'bold', marginBottom: '2rem' }}>
                            Create a List
                        </Typography>
                        <Box display="flex" flexDirection="column" width="100%">
                            <Box mt={2}>
                                <TextField
                                    name="waitingListName"
                                    label="Waiting list name"
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setWaitingListName(e.target.value)}
                                />
                            </Box>
                            <Box mt={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={formIsValid}
                                    sx={{
                                        marginTop: '20px',
                                        color: 'white',
                                        borderRadius: '30px',
                                        minWidth: '100%',
                                        minHeight: '3rem',
                                        background: '#000000',
                                        '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                                    }}>
                                    Create
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <img src={createGraphic} alt="Computer graphic" style={{ width: '100%', maxWidth: '800px' }} />
                </Box>
            </Grid>
        </Grid>
    );
};

export default CreateListPage;

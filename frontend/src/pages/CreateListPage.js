import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import createGraphic from '../images/create-graphic.jpg';
import { auth } from "../firebase"
import logo from "../images/AOWL.png";

const CreateListPage = () => {
    const navigate = useNavigate();
    const [formInput, setFormInput] = useState({
        firstName: "",
        lastName: "",
        roomName: "",
    })

    const handleFormInputChange = (event) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setFormInput({ ...formInput, [inputName]: inputValue })
    }

    const isEmpty = (str) => {
        return (!str || str.trim().length === 0);
    }

    const createWaitingListApi = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        let url = `http://localhost:4000/waitingRoom/createWaitingRoom`
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                teaching_assistant_first_name: formInput["firstName"],
                teaching_assistant_last_name: formInput["lastName"],
                waiting_room_name: formInput["roomName"]
            }),
        })
        let jsonResponse = await response.json()
        let roomCode = jsonResponse["room_code"]

        return roomCode
    }

    const formIsValid = async () => {
        for (const property in formInput) {
            if (isEmpty(formInput[property]) && property !== "roomCode") {
                return false;
            }
        }
        const roomCode = await createWaitingListApi()
        navigate('/waiting-list', { state: { formInput: formInput, roomCode: roomCode } });
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
                                    name="firstName"
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    onChange={handleFormInputChange}
                                />
                            </Box>
                            <Box mt={2}>
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    onChange={handleFormInputChange}
                                />
                            </Box>
                            <Box mt={2}>
                                <TextField
                                    name="roomName"
                                    label="Room Name"
                                    variant="outlined"
                                    fullWidth
                                    onChange={handleFormInputChange}
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

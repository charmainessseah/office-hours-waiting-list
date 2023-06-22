import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
    },
    title: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
    },
    signUpLink: {
        marginTop: theme.spacing(2),
        textAlign: 'center',
    },
    root: {
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(45deg, #C5AAE5FF 30%, #7e50f2 90%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(4),
        backgroundColor: 'white',
        borderRadius: theme.spacing(1),
    },
    error: {
        color: 'red'
    }
}));

const Dashboard = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [openWaitingLists, setOpenWaitingLists] = useState([])
    const [joinedWaitingLists, setJoinedWaitingLists] = useState([])

    const getAllOpenWaitingLists = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        let url = `http://localhost:4000/dashboard/getAllCreatedWaitingLists`
        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                let openWaitingLists = data["query_result"]
                setOpenWaitingLists(openWaitingLists)
            })
    }

    const getAllJoinedWaitingLists = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        let url = `http://localhost:4000/dashboard/getAllJoinedWaitingLists`
        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                let joinedWaitingLists = data["query_result"]
                setJoinedWaitingLists(joinedWaitingLists)
            })
    }

    const getUserDetails = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        let url = `http://localhost:4000/user/getUser`
        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                } else {
                    return response.json();
                }
            })
            .then(data => {
                setFirstName(data['first_name'])
                setLastName(data['last_name'])
            })
    }

    // useEffect(() => {
    //     getAllJoinedWaitingLists()

    //     const interval = setInterval(() => {
    //         getAllJoinedWaitingLists();
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, [joinedWaitingLists])

    useEffect(() => {
        getUserDetails()
    }, [])

    useEffect(() => {
        getAllJoinedWaitingLists()
    }, [])

    useEffect(() => {
        getAllOpenWaitingLists()
    }, [])

    // useEffect(() => {
    //     getAllOpenWaitingLists()

    //     const interval = setInterval(() => {
    //         getAllOpenWaitingLists();
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, [])

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/login");
        }).catch((error) => {
            console.log('An error occurred while logging out.')
        });
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                console.log("SIGNED IN - uid: ", uid)
            } else {
                console.log("LOGGED OUT")
            }
        });

    }, [openWaitingLists])

    const navigateToWaitingListAdminPage = (firstName, lastName, roomName, roomCode) => {
        navigate('/waiting-list', {
            state: {
                firstName: firstName,
                lastName: lastName,
                roomName: roomName,
                roomCode: roomCode
            }
        })
    }

    const navigateToJoinedListPage = (firstName, lastName, studentID, roomName, roomCode, teachingAssistantName) => {
        navigate('/position-page', {
            state: {
                firstName: firstName,
                lastName: lastName,
                studentID: studentID,
                roomName: roomName,
                roomCode: roomCode,
                teachingAssistantName: teachingAssistantName
            }
        });
    }

    return (
        <div className={classes.root}>
            <Container maxWidth="lg">
                <Box mt={4} p={4} bgcolor="white" borderRadius={2} boxShadow={3}>
                    <Typography variant="h3" sx={{ fontWeight: "bold" }} gutterBottom>
                        Dashboard
                        <Typography variant="h5" sx={{ marginTop: -5, textAlign: "right" }} gutterBottom>
                            Welcome,
                        </Typography>

                        {auth.currentUser ? (
                            <Typography variant="h6" sx={{ marginTop: -1, textAlign: "right" }} gutterBottom>
                                <strong> {firstName} </strong>
                                <strong> {lastName} </strong>
                            </Typography>
                        ) : (
                            <Typography variant="h6" gutterBottom>
                                Not signed in
                            </Typography>
                        )}
                    </Typography>
                    <Grid

                        container spacing={2} mt={2}
                    >
                        <Grid item xs={12} sm={6}
                            onClick={() => navigate('/join-page', { state: { firstName: firstName, lastName: lastName } })}>
                            <Button
                                component={Link}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    color: "black", borderWidth: "3px", borderColor: "black", fontSize: "30px", fontWeight: "bold", borderRadius: 1, paddingY: 20, '&:hover': {
                                        background: "rgba(0, 0, 0, 0.1)", borderWidth: "3px", borderColor: "black"
                                    }
                                }}
                            >
                                Join A List
                            </Button>
                        </Grid>

                        <Grid
                            onClick={() => navigate('/create-list-page', { state: { firstName: firstName, lastName: lastName } })}
                            item xs={12}
                            sm={6}>
                            <Button
                                component={Link}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    color: "black", borderWidth: "3px", borderColor: "black", fontSize: "30px", fontWeight: "bold", borderRadius: 1, paddingY: 20, '&:hover': {
                                        background: "rgba(0, 0, 0, 0.1)", borderWidth: "3px", borderColor: "black"
                                    }
                                }}
                            >
                                Create A List
                            </Button>
                        </Grid>
                    </Grid>

                    <Box mt={2}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleLogout}
                            sx={{ background: "#000000", fontWeight: "bold", borderRadius: 1, paddingY: 2, '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' } }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, paddingTop: 2, marginTop: 3 }}>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "Bold", marginBottom: 3 }}>Created Lists</Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="open waiting lists">
                        <TableHead>
                            <TableRow>
                                <TableCell>Room Name</TableCell>
                                <TableCell>Room Code</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {openWaitingLists.map(waitingList => {
                                let firstName = waitingList["first_name"]
                                let lastName = waitingList["last_name"]
                                let roomName = waitingList["waiting_list_name"]
                                let roomCode = waitingList["room_code_pk"]

                                return (
                                    <TableRow key={roomCode}>
                                        <TableCell>{roomName}</TableCell>
                                        <TableCell>{roomCode}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" className="shadow" sx={{
                                                color: 'white', borderRadius: '30px', minWidth: '35%',
                                                minHeight: '3rem', background: '#000000', '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                                            }} onClick={() => navigateToWaitingListAdminPage(firstName, lastName, roomName, roomCode)}>
                                                Enter
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, paddingTop: 2, marginTop: 3, marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "Bold", marginBottom: 3 }}>Joined Lists</Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="joined waiting lists">
                        <TableHead>
                            <TableRow>
                                <TableCell>Room Name</TableCell>
                                <TableCell>Room Code</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {joinedWaitingLists.map(joinedList => {
                                // let firstName = joinedList["student_first_name"]
                                // let lastName = joinedList["student_last_name"]
                                // let studentID = joinedList["studentid_pk"]
                                // let roomName = joinedList["waiting_list_name"]
                                // let roomCode = joinedList["room_code_pk"]
                                // let teachingAssistantName = joinedList["teaching_assistant_first_name"] + ' ' + joinedList["teaching_assistant_last_name"]
                                let studentID = joinedList["studentid_pk"]
                                let roomName = joinedList["waiting_list_name"]
                                let roomCode = joinedList["room_code_pk"]
                                let teachingAssistantName = joinedList["ta_first_name"] + joinedList["ta_last_name"]

                                return (
                                    <TableRow key={studentID}>
                                        <TableCell>{roomName}</TableCell>
                                        <TableCell>{roomCode}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" className="shadow" sx={{
                                                color: 'white', borderRadius: '30px', minWidth: '35%',
                                                minHeight: '3rem', background: '#000000', '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                                            }} onClick={() => navigateToJoinedListPage(firstName, lastName, studentID, roomName, roomCode, teachingAssistantName)}>
                                                Enter
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div >
    );
};

export default Dashboard;
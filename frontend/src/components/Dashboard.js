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
    const [openWaitingLists, setOpenWaitingLists] = useState([])
    const [joinedWaitingLists, setJoinedWaitingLists] = useState([])

    const getAllOpenWaitingLists = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        let url = `http://localhost:4000/dashboard/get-all-open-waiting-lists`
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

        let url = `http://localhost:4000/dashboard/getAllJoinedWaitingRooms`
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
                console.log(joinedWaitingLists)
                setJoinedWaitingLists(joinedWaitingLists)
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
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                console.log("SIGNED IN - uid: ", uid)
            } else {
                console.log("LOGGED OUT")
            }
        });

    }, [openWaitingLists])

    const navigateToWaitingListPage = (firstName, lastName, roomName, roomCode) => {
        let formInput = {
            firstName: firstName,
            lastName: lastName,
            roomName: roomName
        }
        navigate('/waiting-list', { state: { formInput: formInput, roomCode: roomCode } })
    }

    const navigateToJoinedListPage = (firstName, lastName, roomCode, studentID, roomName, teachingAssistantName) => {
        let formInput = {
            firstName: firstName,
            lastName: lastName,
            roomCode: roomCode
        }
        navigate('/student-view', { state: { formInput: formInput, studentID: studentID, roomName: roomName, teachingAssistantName: teachingAssistantName } });
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
                                <strong> {auth.currentUser.email} </strong>
                            </Typography>
                        ) : (
                            <Typography variant="h6" gutterBottom>
                                Not signed in
                            </Typography>
                        )}
                    </Typography>
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                component={Link}
                                to="/join-page"
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

                        <Grid item xs={12} sm={6}>
                            <Button
                                component={Link}
                                to="/create-list-page"
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
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "Bold", marginBottom: 3 }}>Open Lists</Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="open waiting lists">
                        <TableHead>
                            <TableRow>
                                <TableCell>TA Name</TableCell>
                                <TableCell>Room Name</TableCell>
                                <TableCell>Room Code</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {openWaitingLists.map(waitingList => {
                                let firstName = waitingList["teaching_assistant_first_name"]
                                let lastName = waitingList["teaching_assistant_last_name"]
                                let roomName = waitingList["waiting_room_name"]
                                let roomCode = waitingList["room_code_pk"]

                                return (
                                    <TableRow key={roomCode}>
                                        <TableCell>{firstName} {lastName}</TableCell>
                                        <TableCell>{roomName}</TableCell>
                                        <TableCell>{roomCode}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" className="shadow" sx={{
                                                color: 'white', borderRadius: '30px', minWidth: '35%',
                                                minHeight: '3rem', background: '#000000', '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                                            }} onClick={() => navigateToWaitingListPage(firstName, lastName, roomName, roomCode)}>
                                                Enter
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, paddingTop: 2, marginTop: 3 }}>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "Bold", marginBottom: 3 }}>Joined Lists</Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="joined waiting lists">
                        <TableHead>
                            <TableRow>
                                <TableCell>Your Name</TableCell>
                                {/*<TableCell>Room Name</TableCell>*/}
                                <TableCell>Room Code</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {joinedWaitingLists.map(joinedList => {
                                let firstName = joinedList["student_first_name"]
                                let lastName = joinedList["student_last_name"]
                                let roomCode = joinedList["room_code_pk"]
                                let studentID = joinedList["studentid_pk"]
                                let roomName = joinedList["waiting_room_name"]
                                let teachingAssistantName = joinedList["teaching_assistant_first_name"] + ' ' + joinedList["teaching_assistant_last_name"]

                                return (
                                    <TableRow key={studentID}>
                                        <TableCell>{firstName} {lastName}</TableCell>
                                        {/*<TableCell>{roomName}</TableCell>*/}
                                        <TableCell>{roomCode}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" className="shadow" sx={{
                                                color: 'white', borderRadius: '30px', minWidth: '35%',
                                                minHeight: '3rem', background: '#000000', '&:hover': { background: '#000000', opacity: 0.7, transition: '.2s' }
                                            }} onClick={() => navigateToJoinedListPage(firstName, lastName, roomCode, studentID, roomName, teachingAssistantName)}>
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
        </div>
    );
};

export default Dashboard;
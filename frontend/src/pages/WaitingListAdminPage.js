import {
    Avatar,
    Box,
    Button,
    IconButton,
    ListItemAvatar,
    ListItemSecondaryAction,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { auth } from "../firebase";
import { Grid } from "@mui/material";

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

const WaitingList = () => {
    const classes = useStyles();

    const navigate = useNavigate();
    const { state } = useLocation()
    const firstName = state.firstName
    const lastName = state.lastName
    const roomName = state.waitingListName
    const roomCode = state.roomCode

    const [studentList, setStudentList] = useState([])

    const updateList = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        if (roomCode) {
            let url = `http://localhost:4000/waitingList/getAllStudentsInWaitingList/?roomCode=${roomCode}`
            fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => res.json())
                .then(data => {
                    let students = data["query_result"]
                    setStudentList(students)
                })
        }
    }

    const removeStudent = async (studentID) => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        let url = `http://localhost:4000/student/leaveWaitingList`
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
    }

    const deleteRoom = async () => {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        let url = `http://localhost:4000/waitingList/destroyWaitingList`
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                room_code_pk: roomCode
            }),
        })
    }

    useEffect(() => {
        updateList()

        const interval = setInterval(() => {
            updateList();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Grid container className={classes.background}>
            <Grid item xs={12} sm={12} md={10} lg={8} xl={6} className={`${classes.container} ${classes.root}`}>
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
                    Room: {roomName} | TA: {firstName} {lastName}
                </Typography>
                <List>
                    {studentList.map((item) => (
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    {item["first_name"][0]}
                                    {item["last_name"][0]}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText>
                                {item["first_name"]} {item["last_name"]}
                            </ListItemText>
                            <ListItemSecondaryAction>
                                <Button variant="outlined" onClick={() => removeStudent(item["studentid_pk"])}>
                                    Remove
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                <Grid container justifyContent="right" style={{ marginBottom: '-20px' }}>
                    <Box style={{ marginTop: '50px' }} onClick={() => navigate("/dashboard")}>
                        <Button onClick={() => deleteRoom()} variant="contained" className="shadow" sx={{
                            fontWeight: 'bold', color: 'white', borderRadius: '12px', minWidth: '100%',
                            minHeight: '3rem', background: '#ff0021', '&:hover': { background: '#660900', opacity: 0.9, transition: '.2s' }
                        }}>
                            End Room
                        </Button>
                    </Box>
                </Grid>
                <Grid>
                    <Typography sx={{ fontWeight: 'bold' }}>Room Code: {roomCode}</Typography>
                </Grid>

            </Grid>
        </Grid>
    )
}

export default WaitingList;
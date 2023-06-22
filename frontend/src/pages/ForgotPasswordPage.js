import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Button, Container, TextField, Typography, Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import logo from "../images/AOWL.png";

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
        color: 'red',
    },
    infoMessage: {
        color: 'black'
    }
}));

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [confirmationMessage, setConfirmationMessage] = useState('')

    const onResetPassword = async (e) => {
        e.preventDefault()

        if (email.length < 2 || !email.includes("@")) {
            setError('Error: Please enter a valid email address')
            return
        }

        await sendPasswordResetEmail(auth, email)
            .then(() => {
                setError('')
                setConfirmationMessage('Password reset link has been sent to your email.')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <img src={logo} alt="Logo" className={"auth-Logo"} />
            <Container maxWidth="xs" className={classes.paper}>
                <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: "5%" }} className={classes.title}>
                    Password Reset
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: "5%" }} className={classes.infoMessage}>
                    Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.
                </Typography>
                <form>
                    <div className={classes.formContainer}>
                        <TextField
                            type="email"
                            label="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                        />

                        {error && (
                            <Typography variant="body2" className={classes.error}>
                                {error}
                            </Typography>
                        )}
                        {confirmationMessage && (
                            <Typography variant="body2" className={classes.confirmationMessage}>
                                {confirmationMessage}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={onResetPassword}
                            fullWidth
                            sx={{ borderRadius: "25px" }}
                        >
                            Reset My Password
                        </Button>
                    </div>
                </form>

            </Container>
        </div>
    );
};

export default ForgotPasswordPage;
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
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
        color: 'red'
    }
}));

const LoginPage = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/dashboard")
                console.log('SIGNED IN SUCCESSFULLY - your user is: ', user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError('The username and/or password you specified are not correct.')
            });

    }

    return (
        <div className={classes.root}>
            <img src={logo} alt="Logo" className={"auth-Logo"} />
            <Container maxWidth="xs" className={classes.paper}>
                <Container maxWidth="xs">
                    <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "5%" }} className={classes.title}>
                        Login
                    </Typography>

                    <form>
                        <div className={classes.formContainer}>
                            <TextField
                                id="email-address"
                                label="Email address"
                                type="email"
                                required
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                required
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && (
                                <Typography variant="body2" className={classes.error}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onLogin}
                                fullWidth
                                sx={{ borderRadius: "25px" }}
                            >
                                Login
                            </Button>
                        </div>
                    </form>

                    <Typography className={classes.signUpLink}>
                        No account yet?{' '}
                        <Link component={NavLink} to="/signup" color="secondary">
                            Sign up
                        </Link>
                    </Typography>
                    <Typography className={classes.signUpLink}>
                        <Link component={NavLink} to="/resetPassword" color="secondary">
                            Forgot password?
                        </Link>
                    </Typography>
                </Container>
            </Container>
        </div>
    );
};

export default LoginPage;
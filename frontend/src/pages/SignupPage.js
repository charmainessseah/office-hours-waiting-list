import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
}));

const SignupPage = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()

        if (firstName.trim().length === 0 || lastName.trim().length === 0) {
            setError('Error: Name fields cannot be empty')
            return
        }

        if (password1.trim().length === 0 || password2.trim().length === 0) {
            setError('Error: Password fields cannot be empty')
            return
        }

        if (password1 !== password2) {
            setError('Error: Passwords do not match')
            return
        }

        await createUserWithEmailAndPassword(auth, email, password1)
            .then((userCredential) => {
                // created successfully
                const user = userCredential.user;
                user.auth.first_name = firstName
                user.auth.last_name = lastName

                console.log('CREATED ACCOUNT SUCCESSFULLY - your user is: ', user);
                return Promise.resolve([firstName, lastName, user.accessToken])
            })
            .then(([firstName, lastName, token]) => {
                createUser(firstName, lastName, token)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const createUser = async (firstName, lastName, token) => {
        let url = `http://localhost:4000/user/createUser`

        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
            }),
        })

        navigate('/login')
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <img src={logo} alt="Logo" className={"auth-Logo"} />
            <Container maxWidth="xs" className={classes.paper}>
                <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "5%" }} className={classes.title}>
                    Signup
                </Typography>

                <form>
                    <div className={classes.formContainer}>
                        <TextField
                            type="firstName"
                            label="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            fullWidth
                        />

                        <TextField
                            type="lastName"
                            label="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            fullWidth
                        />

                        <TextField
                            type="email"
                            label="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                        />

                        <TextField
                            type="password"
                            label="Create password"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            required
                            fullWidth
                        />

                        <TextField
                            type="password"
                            label="Confirm password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            fullWidth
                        />

                        {error && (
                            <Typography variant="body2" className={classes.error}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={onSubmit}
                            fullWidth
                            sx={{ borderRadius: "25px" }}
                        >
                            Sign up
                        </Button>
                    </div>
                </form>

                <Typography className={classes.signUpLink}>
                    Already have an account?{' '}
                    <Link component={NavLink} to="/login" color="secondary">
                        Sign in
                    </Link>
                </Typography>
            </Container>
        </div>
    );
};

export default SignupPage;
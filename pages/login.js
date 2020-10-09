import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { useRouter } from 'next/router';
import CssBaseline from '@material-ui/core/CssBaseline';

export default function login() {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const login = () => {
        setLoading(true);
        fetch('http://sikuat.com:8051/machine-counter/apiv1/user/authentication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then(res => res.json())
            .then(result => {
                if (!result.error) {
                    try {
                        window.localStorage.removeItem('token_machine');
                        window.localStorage.setItem('token_machine', result.data.token);
                        router.push('/');
                    } catch (e) {
                        console.log(e,"error localstorage");
                        if (e.code == 22) {
                            // Storage full, maybe notify user or do some clean-up
                        }
                    }
                } else {
                    setError(result.message)
                }
                setLoading(false);
            }).catch(error => {
            });
    }
    const buttonLogin = (loading) ? <Button onClick={() => login()} variant="contained" color="primary" fullWidth disabled> Login </Button> : <Button onClick={() => login()} variant="contained" color="primary" fullWidth > Login </Button>;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Login
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" >
                <Card className={classes.cardLogin} style={{ marginTop: '100px' }} >
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="h3" component="h4">
                            Login
                        </Typography>
                        {
                            (error == '') ? '' : <Alert severity="error">{error}</Alert>
                        }
                        <form noValidate autoComplete="off">
                            <TextField
                                required
                                label="Username"
                                defaultValue=""
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                required
                                label="Password"
                                type="password"
                                defaultValue=""
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </form>
                    </CardContent>
                    <CardActions>
                        {buttonLogin}
                    </CardActions>
                </Card>
            </Container>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    cardLogin: {
        marginTop: theme.spacing(10),
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
}));
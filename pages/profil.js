import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Navigasi from '../component/navigasi';
import setting from '../component/setting';

const profil = () => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [notelp, setNotelp] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState('');

    useEffect(()=>{
        getProfil();
    },[]);

    const getProfil = ()=>{
        fetch(setting.base_url+'user/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.message=='Unauthorized access') {
                    localStorage.removeItem('token');
                    router.push('/login');
                } else {
                    setUsername(result.data[0].username);
                    setNotelp(result.data[0].notelp);
                    setEmail(result.data[0].email);
                }
            }).catch(error => {
            });
    }

    const simpan = () => {
        fetch(setting.base_url+'user/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
            body : JSON.stringify(
                {
                    "notelp": notelp,
                    "email": email,
                    "password": password
                }
            )
        })
            .then(res => res.json())
            .then(result => {
                if (result.message=='Unauthorized access') {
                    localStorage.removeItem('token');
                    router.push('/login');
                } else {

                }
            }).catch(error => {
            });
    }
    return (
        <div className={classes.root}>
            <Navigasi />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <h2>Profil</h2>
                <Container >
                    <form noValidate autoComplete="off">
                        <TextField
                            required
                            label="Username"
                            defaultValue=""
                            fullWidth
                            value={username}
                            disabled
                            // onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            required
                            label="Email"
                            type="email"
                            defaultValue=""
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            required
                            label="No Telp"
                            defaultValue=""
                            fullWidth
                            value={notelp}
                            onChange={(e) => setNotelp(e.target.value)}
                        />
                        <TextField
                            required
                            label="Password"
                            type="password"
                            defaultValue=""
                            fullWidth
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={() => simpan()} className={classes.marginTop} variant="contained" color="primary">
                            Save
                        </Button>
                    </form>
                </Container>
            </main>
        </div>

    );
}
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    marginTop : {
        marginTop: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));
export default profil;
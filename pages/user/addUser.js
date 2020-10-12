import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Navigasi from '../../component/navigasi';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import setting from '../../component/setting';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
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
    margin: {
        marginTop: theme.spacing(2)
    },
    cardCreate: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(1),

    }
}));

const Create = () => {
    const classes = useStyles();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [noTelp, setNoTelp] = useState('');
    const [password, setPassword] = useState('');
    const [available, setAvailable] = useState(false);

    const [validusername, setValidUsername] = useState(false);
    const [validemail, setValidEmail] = useState(false);
    const [validnoTelp, setValidNoTelp] = useState(false);

    useEffect(()=>{
        if(username!=''){
            cekUsername();
        }
    },[username]);

    useEffect(()=>{
        if(email!=''){
            cekEmail();
        }
    },[email]);

    useEffect(()=>{
        if(noTelp!=''){
            cekNoTelp();
        }
    },[noTelp]);

    useEffect(()=>{
        if(validusername && validemail && validnoTelp){
            setAvailable(true);
        }else{
            setAvailable(false);
        }
    },[validusername, validemail, validnoTelp]);

    const cekUsername = () =>{
        fetch(setting.base_url+'user/validation-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
            body : JSON.stringify({
                'username' : username
            })
        })
            .then(res => res.json())
            .then(result => {
                if(result.message=='Username valid'){
                    setValidUsername(true);
                }else{
                    setValidUsername(false);
                }
            }).catch(error => {
            });
    }
    const cekEmail = () =>{
        fetch(setting.base_url+'user/validation-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
            body : JSON.stringify({
                'email' : email
            })
        })
            .then(res => res.json())
            .then(result => {
                if(result.message=='Email valid'){
                    setValidEmail(true);
                }else{
                    setValidEmail(false);
                }
            }).catch(error => {
            });
    }
    const cekNoTelp = () =>{
        fetch(setting.base_url+'user/validation-notelp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
            body : JSON.stringify({
                'notelp' : noTelp
            })
        })
            .then(res => res.json())
            .then(result => {
                if(result.message=='Notelp valid'){
                    setValidNoTelp(true);
                }else{
                    setValidNoTelp(false);
                }
            }).catch(error => {
            });
    }

    const simpan = ()=>{
		fetch(setting.base_url+'user/adduser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "notelp": noTelp,
                "password": password
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.message=='Unauthorized access') {
                    localStorage.removeItem('token_machine');
                    router.push('/login');
                } else {
                    router.push('/user/listUser');
                }
            }).catch(error => {
            });
    }

    return (
        <div className={classes.root}>
            <Navigasi />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <h2>Create User</h2>
                <Container >
                    <form noValidate autoComplete="off">
                        {
                            (validusername || username=='') ? 
                                <TextField
                                    required
                                    label="Username"
                                    defaultValue=""
                                    fullWidth
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                :
                                <TextField
                                    required
                                    label="Username"
                                    defaultValue=""
                                    fullWidth
                                    error
                                    helperText="Username invalid"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                        }
                        {
                            (validemail || email=='') ? 
                                <TextField
                                    required
                                    label="Email"
                                    type="email"
                                    defaultValue=""
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                :
                                <TextField
                                    required
                                    label="Email"
                                    type="email"
                                    defaultValue=""
                                    fullWidth
                                    error
                                    helperText="Email invalid"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                        }
                        {
                            (validnoTelp || noTelp=='') ?
                                <TextField
                                    required
                                    label="No Telp"
                                    defaultValue=""
                                    fullWidth
                                    value={noTelp}
                                    onChange={(e) => setNoTelp(e.target.value)}
                                />
                                :
                                <TextField
                                    required
                                    label="No Telp"
                                    defaultValue=""
                                    fullWidth
                                    error
                                    helperText="No Telp invalid"
                                    value={noTelp}
                                    onChange={(e) => setNoTelp(e.target.value)}
                                />
                        }
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
                    {
                        available ? 
                            <Button onClick={() => simpan()} variant="contained" color="primary" className={classes.margin}> Save </Button>: 
                            <Button variant="contained" disabled className={classes.margin}> Save </Button>
                    }
                </Container>
            </main>
        </div>
    );
}
export default Create;

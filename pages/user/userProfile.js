import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Paper, Card, Container, CardContent } from '@material-ui/core';
import Navigasi from '../../component/navigasi';
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
        marginTop: theme.spacing(3)
    },
    Card: {
        marginTop: theme.spacing(1)
    }
}));

export default function userProfile() {
    const classes = useStyles();
    const [title] = useState('Profile');
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch(setting.base_url+'user/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
        })
            .then(res => res.json())
            .then(result => {
                if (!result.error) {
                    setData(result.data)
                } else {
                    localStorage.removeItem('token_machine');
                    router.push('/login');
                }
            }).catch(error => {
            });
    }, [])

    return (
        <div className={classes.root}>
            <Navigasi />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Card>
                    <Container >
                        <CardContent>
                        </CardContent><br />
                        <br />
                        <br />
                        <Avatar className={classes.purple}>OP</Avatar>
                        <h2>{data.username}</h2>
                    </Container>
                </Card>
            </main>
        </div>
    );
}
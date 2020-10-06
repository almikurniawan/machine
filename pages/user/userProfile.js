import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Paper,Card} from '@material-ui/core';
import Navigasi from '../../component/navigasi';
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
}));

export default function userProfile() {
    const classes = useStyles();
    const [title] = useState('Profile');
    const [data, setData] = useState([]);

    // useEffect(() => {
    //     fetch('http://sikuat.com:8051/machine-counter/apiv1/user/list', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': localStorage.getItem('token')
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(result => {
    //             console.log(result)
    //             if (!result.error) {
    //                 setData(result.data)
    //             } else {
    //                 localStorage.removeItem('token');
    //                 router.push('/login');
    //             }
    //         }).catch(error => {
    //         });
    // }, [])

    return (
        <div className={classes.root}>
            <Navigasi />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <h2>{title}</h2>
                <Card elevation={3} >
                    <Avatar className={classes.purple}>OPdfasdfasdfasfd</Avatar>
                    <Avatar className={classes.purple}>OP</Avatar>
                    <Avatar className={classes.purple}>OP</Avatar>
                    <Avatar className={classes.purple}>OP</Avatar>
                    <Avatar className={classes.purple}>OP</Avatar>


                </Card>
            </main>
        </div>
    );
}
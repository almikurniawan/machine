import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Navigasi from '../../component/navigasi';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
    margin: {
        marginBottom: theme.spacing(2)
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function listUser() {
    const classes = useStyles();
    const router = useRouter();
    const [title] = useState('List User');
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://sikuat.com:8051/machine-counter/apiv1/user/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                if (!result.error) {
                    setData(result.data)
                } else {
                    localStorage.removeItem('token');
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
                <h2>{title}</h2>
                <Link href="/user/addUser">
                    <Button variant="contained" color="primary" className={classes.margin}>
                        Add New User
					</Button>
                </Link>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" style={{ minWidth: 650 }} aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Username</b></TableCell>
                                <TableCell><b>Email</b></TableCell>
                                <TableCell><b>No Telp</b></TableCell>
                                <TableCell><b>Created At</b></TableCell>
                                <TableCell><b>Action</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={Math.random()}>
                                    <TableCell component="th" scope="row">
                                        {row.username}
                                    </TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.notelp}</TableCell>
                                    <TableCell>{row.created_at}</TableCell>
                                    <TableCell>
                                        <Link href={'/user/' + row.id}>
                                            <Button variant="contained" color="primary">
                                                Edit
												</Button>
                                        </Link>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </main>
        </div>
    );
}
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
import Moment from 'react-moment';
import Grid from '@material-ui/core/Grid';
import BarLoader from "react-spinners/BarLoader";
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
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(setting.base_url+'user/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
        })
            .then(res => res.json())
            .then(result => {
                if (!result.error) {
                    setData(result.data);
                    setLoading(false);
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
                <h2>{title}</h2>
                <Link href="/user/addUser">
                    <Button variant="contained" color="primary" className={classes.margin}>
                        Add New User
					</Button>
                </Link>
                <TableContainer component={Paper} style={{ minHeight: '50px' }}>
                    {
                        (loading) ?
                            <Grid container justify="center">
                                <Grid item xs={12}>
                                    <BarLoader
                                        height={5}
                                        width="100%"
                                        color={"#123abc"}
                                        loading={loading}
                                    />
                                </Grid>
                            </Grid>
                            :
                            <Table className={classes.table} size="small" style={{ minWidth: 650 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Username</b></TableCell>
                                        <TableCell><b>Email</b></TableCell>
                                        <TableCell><b>No Telp</b></TableCell>
                                        <TableCell><b>Created At</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(data.length == 0) ?
                                        <TableRow key={Math.random()}>
                                            <TableCell align="center" component="th" colSpan={4} scope="row">No Data</TableCell>
                                        </TableRow>
                                        :
                                        data.map((row) => (
                                            <TableRow key={Math.random()}>
                                                <TableCell component="th" scope="row">
                                                    {row.username}
                                                </TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.notelp}</TableCell>
                                                <TableCell><Moment format="YYYY-MM-DD HH:MM">{row.created_at}</Moment></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                    }
                </TableContainer>
            </main>
        </div>
    );
}
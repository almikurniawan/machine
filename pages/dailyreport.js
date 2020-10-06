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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Navigasi from '../component/navigasi';
import { useRouter } from 'next/router'
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
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
const Dailyreport = ()=> {
    const classes = useStyles();
    const router = useRouter();
    const [title] = useState('Daily Report');
    const [filterMesin, setFilterMesin] = useState();
    const [data, setData] = useState([]);
    const [dataMesin, setDataMesin] = useState([]);

    useEffect(() => {
        getDataDailyReport();
    },[filterMesin]);

    useEffect(()=>{
        getDataMesin();
    },[]);
    
    const getDataMesin = ()=>{
        fetch('http://sikuat.com:8051/machine-counter/apiv1/machine/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
        })
        .then(res => res.json())
        .then(result => {
            if (!result.error) {
                setDataMesin(result.data);
            } else {
                localStorage.removeItem('token');
                router.push('/login');
            }
        }).catch(error => {
        });
    }

    const getDataDailyReport = ()=>{
        fetch('http://sikuat.com:8051/machine-counter/apiv1/machine/daily-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body : JSON.stringify({
                'machine_id' : filterMesin
            })    
        })
        .then(res => res.json())
        .then(result => {
            if (!result.error) {
                setData(result.data);
            } else {
                localStorage.removeItem('token');
                router.push('/login');
            }
        }).catch(error => {
        });
    }

    return (
        <div className={classes.root}>
            <Navigasi />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <h2>{title}</h2>
                <h5>Filter</h5>
                <FormControl className={classes.formControl}>
                    <InputLabel>Mesin</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filterMesin}
                        autoWidth
                        onChange={(e)=> setFilterMesin(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Semua</em>
                        </MenuItem>
                        {
                            dataMesin.map((value, key)=>{
                                return <MenuItem key={Math.random()} value={value.id}>{value.title}</MenuItem>;
                            })
                        }
                    </Select>
                </FormControl>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" style={{ minWidth: 650 }} aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Mesin</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={Math.random()}>
                                    <TableCell component="th" scope="row">
                                        {row.title}
                                    </TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </main>
        </div>
    );
}

export default Dailyreport;
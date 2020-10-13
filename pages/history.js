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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Navigasi from '../component/navigasi';
import TextField from '@material-ui/core/TextField';
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';
import BarLoader from "react-spinners/BarLoader";
import setting from '../component/setting';

const History = () => {
    const classes = useStyles();
    const router = useRouter();
    const [title] = useState('History Production');
    const [loading, setLoading] = useState(true);
    const [filterMesin, setFilterMesin] = useState();
    const [filterTglAwal, setFilterTglAwal] = useState('');
    const [filterTglAkhir, setFilterTglAkhir] = useState('');
    const [dataMesin, setDataMesin] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        getHistory();
    }, [filterMesin, filterTglAwal, filterTglAkhir]);

    useEffect(() => {
        getDataMesin();
    }, []);

    const getHistory = () => {
        fetch(setting.base_url+'machine/history-production', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
            body: JSON.stringify({
                'machine_id': filterMesin,
                'start_date': filterTglAwal,
                'end_date': filterTglAkhir,
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.message == 'Unauthorized access') {
                    localStorage.removeItem('token');
                    router.push('/login');
                } else {
                    setData(result.data);
                    setLoading(false);
                }
            }).catch(error => {
            });
    }

    const getDataMesin = () => {
        fetch(setting.base_url+'machine/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
        })
            .then(res => res.json())
            .then(result => {
                if (result.message == 'Unauthorized access') {
                    localStorage.removeItem('token_machine');
                    router.push('/login');
                } else {
                    setDataMesin(result.data);
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
                        onChange={(e) => setFilterMesin(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Semua</em>
                        </MenuItem>
                        {
                            dataMesin.map((value, key) => {
                                return <MenuItem key={Math.random()} value={value.id}>{value.title}</MenuItem>;
                            })
                        }
                    </Select>
                </FormControl>
                <TextField
                    id="date"
                    label="Tanggal Awal"
                    type="date"
                    className={classes.formControl}
                    // defaultValue="2017-05-24"
                    value={filterTglAwal}
                    onChange={(e) => setFilterTglAwal(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="date"
                    label="Tanggal Akhir"
                    type="date"
                    className={classes.formControl}
                    // defaultValue="2017-05-24"
                    value={filterTglAkhir}
                    onChange={(e) => setFilterTglAkhir(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button className={classes.formControl} variant="outlined" color="secondary" onClick={(e) => {
                    setFilterMesin('');
                    setFilterTglAwal('');
                    setFilterTglAkhir('');
                }}>Clear</Button>
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
                                        <TableCell>Mesin</TableCell>
                                        <TableCell>Description</TableCell>
                                        {/* <TableCell>Jam</TableCell> */}
                                        <TableCell>Widht</TableCell>
                                        <TableCell>Length</TableCell>
                                        <TableCell>Thick</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Volume</TableCell>
                                        <TableCell>Tanggal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        (data.length == 0) ?
                                            <TableRow key={Math.random()}>
                                                <TableCell align="center" component="th" colSpan={8} scope="row">No Data</TableCell>
                                            </TableRow>
                                            :
                                            data.map((row) => (
                                                <TableRow key={Math.random()}>
                                                    <TableCell component="th" scope="row">
                                                        {row.title}
                                                    </TableCell>
                                                    <TableCell>{row.description}</TableCell>
                                                    {/* <TableCell>{row.hours}</TableCell> */}
                                                    <TableCell>{row.width}</TableCell>
                                                    <TableCell>{row.length}</TableCell>
                                                    <TableCell>{row.thick}</TableCell>
                                                    <TableCell>{row.total}</TableCell>
                                                    <TableCell>{row.volume}</TableCell>
                                                    <TableCell>{row.tanggal}</TableCell>
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

export default History;
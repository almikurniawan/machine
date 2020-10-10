import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Navigasi from '../component/navigasi';
import { Container, Paper, Card, Grid, GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import BarLoader from "react-spinners/BarLoader";
import {
	ArgumentAxis,
	ValueAxis,
	Chart,
	BarSeries,
} from '@devexpress/dx-react-chart-material-ui';

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
	paper: {
		height: 140,
		width: 100,
	},
}));

const Index = () => {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const [grid, setGrid] = useState([]);
	const [ukuranXS, setUkuranXS] = useState(4)
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			getDataGrid();
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			getDataDailyReport();
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	const getDataDailyReport = () => {
		fetch('http://sikuat.com:8051/machine-counter/apiv1/machine/grafik-report', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.getItem('token_machine')
			}
		})
			.then(res => res.json())
			.then(result => {
				if (result.message == 'Unauthorized access') {
					localStorage.removeItem('token_machine');
					router.push('/login');
				} else {
					let data_ku = result.data.map((row) => {
						return {
							"argument": row.title,
							"value": row.total
						};
					});
					setData(data_ku);
					setLoading(false);
				}
			}).catch(error => {
			});
	}
	const getDataGrid = () => {
		fetch('http://sikuat.com:8051/machine-counter/apiv1/machine/daily-report', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.getItem('token_machine')
			}
		})
			.then(res => res.json())
			.then(result => {
				if (result.message == 'Unauthorized access') {
					localStorage.removeItem('token_machine');
					router.push('/login');
				} else {
					setGrid(result.data);
					setUkuranXS(12 / result.data.length);
					setLoading(false);
				}
			}).catch(error => {
			});
	}
	return (
		<div className={classes.root}>
			<Navigasi />
			<main className={classes.content}>
				<div className={classes.toolbar} />
				<Container >
					<h2>Monitoring Machine {loading}</h2>
					<Grid container justify="center" className={classes.root} spacing={2} style={{ marginBottom: 20, textAlign: "right" }}>
						{grid.map((value) => (
							<Grid key={value} item xs={ukuranXS}>
								<Card style={{
									padding: 10, paddingRight: 20
								}} elevation={3}>
									<h3>{value.title} ({value.width}x{value.length}x{value.height})</h3>
									<h1>Total {value.total}</h1>
									<h2>Volume {value.volume}</h2>
								</Card>
							</Grid>
						))}
					</Grid>
					<Paper style={{ padding: 20, minHeight:'50px' }}>
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
							<Chart
								data={data}>
								<ArgumentAxis />
								<ValueAxis />
								<BarSeries valueField="value" argumentField="argument" />
							</Chart>
						}
					</Paper>
				</Container>
			</main>
		</div>
	);
}
export default Index;
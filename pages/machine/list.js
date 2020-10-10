import Head from 'next/head'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useRouter, withRouter } from 'next/router';
import Navigasi from '../../component/navigasi';
import TextField from '@material-ui/core/TextField';
import Link from 'next/link';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { AirlineSeatLegroomExtra } from '@material-ui/icons';
import BarLoader from "react-spinners/BarLoader";

const styles = theme => ({
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
	margin: {
		marginBottom: theme.spacing(2),
		marginTop: theme.spacing(2),
	}
});

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: 'List Machine',
			data: [],
			filterNamaMesin: '',
			filterStatusMesin: '',
			loading : true
		}
	}

	componentDidMount() {
		this.getData();
	}

	getData(){
		const self = this;
		const token = localStorage.getItem('token_machine');
		fetch('http://sikuat.com:8051/machine-counter/apiv1/machine/list', {
			method: 'POST',
			headers: new Headers({
				'Authorization': token
			}),
			body : JSON.stringify({
				'title' : self.state.filterNamaMesin,
				'status' : self.state.filterStatusMesin,
			})
		})
		.then(res => res.json())
		.then(result => {
			if (result.error == false) {
				self.setState({ data: result.data , loading : false})
			} else {
				localStorage.removeItem('token_machine');
				self.props.router.push('/login');
			}
		});
	}

	render() {
		const { classes } = this.props;
		let dataMachine = this.state.data;
		return (
			<div className={classes.root}>
				<Navigasi />
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<h2>{this.state.title}</h2>
					<Grid container className={classes.root} spacing={2}>
						<TextField
							id="date"
							label="Nama Mesin"
							className={classes.formControl}
							value={this.state.filterNamaMesin}
							onChange={(e) => { this.setState({ filterNamaMesin: e.target.value },()=>{this.getData();}); }}
						/>
						<FormControl className={classes.formControl}>
							<InputLabel>Status</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={this.state.filterStatusMesin}
								autoWidth
								onChange={(e) => { this.setState({ filterStatusMesin: e.target.value },()=>{this.getData();}); }}
							>
								<MenuItem value="">
									<em>Semua</em>
								</MenuItem>
								<MenuItem value={0}>Tidak Aktif</MenuItem>
								<MenuItem value={1}>Aktif</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Link href="/machine/create">
						<Button variant="contained" color="primary" className={classes.margin}>
							Create
						</Button>
					</Link>
					<TableContainer component={Paper} style={{minHeight:'50px'}}>
						{
							(this.state.loading) ? 
							<Grid container justify="center">
								<Grid item xs={12}>
									<BarLoader
										height={5}
										width="100%"
										color={"#123abc"}
										loading={this.state.loading}
									/>
								</Grid>
							</Grid>
							:	
							<Table className={classes.table} size="small" style={{ minWidth: 650 }} aria-label="a dense table">
								<TableHead>
									<TableRow>
										<TableCell><b>Title</b></TableCell>
										<TableCell><b>Description</b></TableCell>
										<TableCell><b>Created at</b></TableCell>
										<TableCell><b>Action</b></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										(dataMachine.length==0) ? 
										<TableRow key={Math.random()}>
											<TableCell align="center" component="th" colSpan={4} scope="row">No Data</TableCell>
										</TableRow>
										:
										dataMachine.map((row) => (
											<TableRow key={Math.random()}>
												<TableCell component="th" scope="row">
													{row.title}
												</TableCell>
												<TableCell>{row.description}</TableCell>
												<TableCell>{row.created_at}</TableCell>
												<TableCell>
													<Link href={'/machine/' + row.id}>
														<Button variant="contained" color="primary">
															Edit
														</Button>
													</Link>
												</TableCell>
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
}
export default (withStyles(styles, { withTheme: true })(withRouter(List)));

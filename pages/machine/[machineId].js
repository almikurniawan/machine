import Head from 'next/head'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Navigasi from '../../component/navigasi';
import { useRouter, withRouter } from 'next/router';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import setting from '../../component/setting';

const styles = theme => ({
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
	formControl : {
		fullWidth : true
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	}
});

class Edit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: 'Edit Machine',
			form : {
				title : '',
				description : '',
				status : 1,
			}
		}
	}

	componentDidMount() {
		const self = this;
		fetch(setting.base_url+'machine/list', {
			method: 'POST',
			headers: new Headers({
				'Authorization': localStorage.getItem('token_machine')
			}),
			body: JSON.stringify({
				'machine_id' : self.props.router.query.machineId
			})
		})
		.then(res => res.json())
		.then(result => {
			if (result.message == 'Unauthorized access') {
				localStorage.removeItem('token');
				self.props.router.push('/login');
			} else {
				self.setState({
					form : result.data[0]
				});
			}
		});
	}

	simpan(){
		const self = this;
		fetch(setting.base_url+'machine/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
            body: JSON.stringify({
				"title": self.state.form.title,
				"description": self.state.form.description,
				"machine_status": self.state.form.status,
				"machine_id": self.props.router.query.machineId
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.message=='Unauthorized access') {
                    localStorage.removeItem('token_machine');
                    self.props.router.push('/login');
                } else {
                    self.props.router.push('/machine/list');
                }
            }).catch(error => {
            });
	}

	render() {
		const { classes } = this.props;
		console.log(this.state);
		return (
			<div className={classes.root}>
				<Navigasi />
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<h2>{this.state.title}</h2>
					<Container >
						<CardContent>
							<form noValidate autoComplete="off">
								<TextField
									required
									label="Title"
									defaultValue=""
									fullWidth
									value={this.state.form.title}
									onChange={(e) => this.setState({
										form :{
											...this.state.form,
											title : e.target.value
										}
									})}
								/>
								<TextField
									required
									label="Description"
									defaultValue=""
									fullWidth
									value={this.state.form.description}
									onChange={(e) => this.setState({
										form :{
											...this.state.form,
											description : e.target.value
										}
									})}
								/>
								<FormControl className={classes.formControl} fullWidth>
									<InputLabel>Status</InputLabel>
									<Select
										fullWidth
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={this.state.form.status}
										onChange={(e) => this.setState({
											form :{
												...this.state.form,
												status : e.target.value
											}
										})}
									>
										<MenuItem value={0}>Tidak Aktif</MenuItem>
										<MenuItem value={1}>Aktif</MenuItem>
									</Select>
								</FormControl>
							</form>
						</CardContent>
						<CardActions>
							<Button onClick={() => this.simpan()} variant="contained" color="primary">
								Save
                        </Button>
						</CardActions>
					</Container>
				</main>
			</div>
		);
	}
}
export default (withStyles(styles, { withTheme: true })(withRouter(Edit)));

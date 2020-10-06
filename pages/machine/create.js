import Head from 'next/head'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Navigasi from '../../component/navigasi';
import { withRouter } from 'next/router'

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
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	cardCreate: {
		marginTop: theme.spacing(1),
		padding: theme.spacing(1),

	}
});

class Create extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: 'Create Machine',
			namaMesin : '',
			descMesin : ''
		}
	}

	simpan(){
		const self = this;
		fetch('http://sikuat.com:8051/machine-counter/apiv1/machine/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                'title': self.state.namaMesin,
                'description': self.state.descMesin,
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.message=='Unauthorized access') {
                    localStorage.removeItem('token');
                    self.props.router.push('/login');
                } else {
                    self.props.router.push('/machine/list');
                }
            }).catch(error => {
            });
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Navigasi />
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<h2>{this.state.title}</h2>
					<Container >
						<form noValidate autoComplete="off">
							<TextField
								required
								label="Title"
								defaultValue=""
								fullWidth
								value={this.state.namaMesin}
								onChange={(e) => this.setState({namaMesin : e.target.value})}
							/>
							<TextField
								required
								label="Description"
								defaultValue=""
								fullWidth
								value={this.state.descMesin}
								onChange={(e) => this.setState({descMesin : e.target.value})}
							/>
						</form>
						<Button onClick={() => this.simpan()} variant="contained" color="primary">
							Save
                        </Button>
					</Container>
				</main>
			</div>
		);
	}
}
export default (withStyles(styles, { withTheme: true })(withRouter(Create)));

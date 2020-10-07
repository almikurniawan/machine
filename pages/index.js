import Head from 'next/head'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Navigasi from '../component/navigasi';

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
});

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: 'Selamat Datang'
		}
	}

	componentDidMount() {
		
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<Navigasi />
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<h2>{this.state.title}</h2>
				</main>
			</div>
		);
	}
}
export default withStyles(styles, { withTheme: true })(Home);

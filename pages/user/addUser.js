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
    margin: {
        marginTop: theme.spacing(2)
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
            title: 'Component Utama'
        }
    }

    componentDidMount() {
        this.setState({
            title: 'Add New User'
        });
        // fetch('https://', {
        // 	method: 'POST',
        // 	headers: new Headers({
        // 		'Authorization': `Bearer ${token}`
        // 	}),
        // 	body: formData
        // })
        // .then(res => res.json())
        // .then(result => {
        // 	self.setState(result);
        // });
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
                                label="Username"
                                defaultValue=""
                                fullWidth
                            // value={username}
                            // onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                required
                                label="Email"
                                type="email"
                                defaultValue=""
                                fullWidth
                            // value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                required
                                label="No Telp"
                                defaultValue=""
                                fullWidth
                            // value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                required
                                label="Password"
                                type="password"
                                defaultValue=""
                                fullWidth
                            // value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            />
                        </form>
                        <Button onClick={() => login()} variant="contained" color="primary" className={classes.margin}>
                            Save
                        </Button>
                    </Container>
                </main>
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(Create);

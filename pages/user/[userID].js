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
        const self = this;
        this.setState({
            title: 'Edit Profile'
        });
        fetch('http://sikuat.com:8051/machine-counter/apiv1/user/list', {
            method: 'POST',
            headers: new Headers({
                'Authorization': `Bearer ${token}`
            }),
            body: JSON.stringify({
                'userID': self.props.router.query.userID
            })
        })
            .then(res => res.json())
            .then(result => {
                self.setState({
                    form : result.data[0]
                });
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
                                label="Username"
                                defaultValue=""
                                fullWidth
                                value={this.state.form.username}
                                onChange={(e) => this.setState({
                                    form: {
                                        ...this.state.form,
                                        title: e.target.value
                                    }
                                })}
                            />
                            <TextField
                                required
                                label="Email"
                                type="email"
                                defaultValue=""
                                fullWidth
                                value={this.state.form.username}
                                onChange={(e) => this.setState({
                                    form: {
                                        ...this.state.form,
                                        title: e.target.value
                                    }
                                })}
                            />
                            <TextField
                                required
                                label="No Telp"
                                defaultValue=""
                                fullWidth
                                value={this.state.form.email}
                                onChange={(e) => this.setState({
                                    form: {
                                        ...this.state.form,
                                        title: e.target.value
                                    }
                                })}
                            />
                        </form>
                        <Button onClick={() => login()} variant="contained" color="primary">
                            Save
                        </Button>
                    </Container>
                </main>
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(Create);

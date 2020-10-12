import Head from 'next/head'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { useRouter, withRouter } from 'next/router';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Navigasi from '../../component/navigasi';
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
    formControl: {
        fullWidth: true
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
            title: 'Edit Profile',
            form: {
                password: '',
                email: '',
                notelp: '',
            }
        }
    }

    componentDidMount() {
        const self = this;
        this.setState({
            title: 'Edit Profile'
        });
        fetch(setting.base_url+'user/list', {
            method: 'POST',
            headers: new Headers({
                'Authorization': localStorage.getItem('token_machine')
            }),
            body: JSON.stringify({
                'userID': self.props.router.query.userID
            })
        })
            .then(res => res.json())
            .then(result => {
                self.setState({
                    form: result.data[0]
                });
            });
    }
    simpan() {
        const self = this;
        fetch(setting.base_url+'user/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token_machine')
            },
            body: JSON.stringify({
                "password": self.state.form.password,
                "email": self.state.form.email,
                "notelp": self.state.form.notelp,
                "userID": self.props.router.query.userID
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.message == 'Unauthorized access') {
                    localStorage.removeItem('token_machine');
                    self.props.router.push('/login');
                } else {
                    self.props.router.push('/user/listUser');
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
                    <Card>

                        <Container >
                            <CardContent>
                                <h2>{this.state.title}</h2>
                                <form noValidate autoComplete="off">
                                    <TextField
                                        required
                                        label="password"
                                        type="password"
                                        defaultValue=""
                                        fullWidth
                                        value={this.state.form.password}
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
                                        value={this.state.form.email}
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
                                        value={this.state.form.notelp}
                                        onChange={(e) => this.setState({
                                            form: {
                                                ...this.state.form,
                                                title: e.target.value
                                            }
                                        })}
                                    />
                                </form>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => this.simpan()} variant="contained" color="primary">
                                    Save
                        </Button>

                            </CardActions>
                        </Container>
                    </Card>
                </main>
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(withRouter(Edit));

// Utility Imports
import { useEffect, useState } from 'react';
import { navigate } from '@reach/router';

// @material-ui Imports
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progess: {
		position: 'absolute'
	}
});

const Login = (props) => {
    const { classes } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const changeHandler = e => {
        console.log(e.target.name + " was changed");
        if (e.target.name === "email"){
            setEmail(e.target.value);
        } 
        else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
	};
    
    const submitHandler = e => {
        e.preventDefault();
        console.log("SIGN IN was clicked");

        setLoading(true);
        const userData = { email, password };
        // attempt logging in with email/password

        // successful
        // localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
        localStorage.setItem('AuthToken', `TEMP`);
        setLoading(false);
        navigate(`/`);

        // unsuccessful
        // error handling..
    }


    return (<>
        <Container component="main" maxWidth="xs">
            <CssBaseline />

            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>

                <form className={classes.form} noValidate>
                    <TextField id="email" variant="outlined" margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus onChange={changeHandler} />
                    
                    <TextField id="password" variant="outlined" margin="normal" required fullWidth label="Password" name="password" type="password" autoComplete="current-password" onChange={changeHandler} />
                    
                    <Button type="submit"  variant="contained" fullWidth color="primary" className={classes.submit} onClick={submitHandler} disabled={loading || !email || !password} > Sign In {loading && <CircularProgress size={30} className={classes.progess} />}</Button>

                    <Grid container>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"First time? Sign Up!"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    </>);
};

export default withStyles(styles)(Login);
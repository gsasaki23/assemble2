// Utility Imports
import { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import { auth, provider, signInWithEmailAndPassword, signInWithPopup } from '../util/auth';
import { checkUIDExists } from '../util/firestore';

// @material-ui Imports
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import LockIcon from '@mui/icons-material/Lock';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleIcon from '@mui/icons-material/Google';
const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: "blue"
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

const Signin = (props) => {
    const { classes } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    // const [errors, setErrors] = useState([]);

    // Run every time component is rendered
    useEffect(()=>{
        console.log("Showing Signin Component");
        // console.log(props);
        if (localStorage.AssembleAuthToken && localStorage.AssembleAuthUID){
            console.log("       User is already signed in. Let them through!")
            navigate(`/`);
        } 
    }, [props]);

    // Update the email/password state when typing
    const changeHandler = e => {
        // console.log("       " + e.target.name + " was changed");
        if (e.target.name === "email"){
            setEmail(e.target.value);
        } 
        else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
	};
    
    // Verify the email/password when SIGN IN button is clicked
    const regularSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log("       SIGN IN was clicked");

        await signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                localStorage.setItem('AssembleAuthToken', result.user.accessToken);
                localStorage.setItem('AssembleAuthUID', result.user.uid);
                localStorage.setItem('AuthType', "EP");
                setLoading(false);
                navigate(`/`);
            })
            .catch((error) => {
                // TODO: Catch common errors
                window.alert(error.message);
                setLoading(false);
            });
    }

    // Show Google Sign-In Popup when SIGN IN WITH GOOGLE button is clicked
    const googleSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        signInWithPopup(auth, provider)
            .then(result => {
                checkUIDExists(result.user.uid)
                    .then(res => {
                        if (res.result === false) {
                            window.alert("TODO: If this is the first time signing in with google, please sign up!");
                            navigate(`/signup`);
                        }
                        else {
                            localStorage.setItem('AssembleAuthToken', result.user.accessToken);
                            localStorage.setItem('AssembleAuthUID', result.user.uid);
                            localStorage.setItem('AuthType', "Google");
                            setLoading(false);
                            navigate(`/`);
                        }
                    })
            })
            .catch((error) => {
                // TODO: Catch common errors
                window.alert(error.message);
                setLoading(false);
            });
    }

    return (<>
        <Container component="main" maxWidth="xs">
            <CssBaseline />

            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>

                <form className={classes.form} noValidate>
                    <TextField id="email" variant="outlined" margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus onChange={changeHandler} />
                    
                    <TextField id="password" variant="outlined" margin="normal" required fullWidth label="Password" name="password" type="password" autoComplete="current-password" onChange={changeHandler} />
                    
                    <Button type="submit"  variant="contained" fullWidth color="primary" className={classes.submit} onClick={regularSubmitHandler} disabled={loading || !email || !password} > Sign In {loading && <CircularProgress size={30} className={classes.progess} />}</Button>
                    
                    <Button type="submit"  variant="contained" fullWidth color="primary" className={classes.submit} onClick={googleSubmitHandler} hidden={loading && true}> 
                        <GoogleIcon/> &nbsp; Sign in with Google 
                    </Button>

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

export default withStyles(styles)(Signin);
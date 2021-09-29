// Utility Imports
import { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import { auth, provider, signInWithPopup, createUserWithEmailAndPassword } from '../util/auth';
import { createUser } from '../util/firestore';

// @material-ui Imports
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import withStyles from '@material-ui/core/styles/withStyles';
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
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	progess: {
		position: 'absolute'
	}
});

const Signup = (props) => {
    const { classes } = props;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setuserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Run every time component is rendered
    useEffect(()=>{
        console.log("Showing Signup Component");
        // console.log(props);
        if (localStorage.AssembleAuthToken && localStorage.AssembleAuthUID){
            console.log("       User is already signed in. Let them through!")
            navigate(`/`);
        } 
    }, [props]);

    // Update the respective state when typing
    const changeHandler = e => {
        // console.log(e.target.name + " was changed");
        if (e.target.name === "firstName"){
            setFirstName(e.target.value);
        } 
        else if (e.target.name === "lastName") {
            setLastName(e.target.value);
        }
        else if (e.target.name === "username") {
            setuserName(e.target.value);
        }
        else if (e.target.name === "email") {
            setEmail(e.target.value);
        }
        else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
        else if (e.target.name === "confirmPassword") {
            if (e.target.value !== password) {
                setErrors({confirmPassword:"Must match password above."})
            } else {
                setConfirmPassword(e.target.value);
            }
        }
	};
    
    // Verify the form info when SIGN UP button is clicked
    const regularSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log("SIGN UP was clicked");
        
        await createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const userUID = result.user.uid;
                const newUserData = { firstName, lastName, userName, authUID: userUID };
                createUser(newUserData)
                    .then(() => {
                        localStorage.setItem('AssembleAuthToken', result.user.accessToken);
                        localStorage.setItem('AssembleAuthUID', userUID);
                        setLoading(false);
                        navigate(`/`);
                    })
                    .catch((error) => {
                        // TODO: Catch common errors
                        window.alert(error.message);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                // TODO: Catch common errors
                window.alert(error.message);
                setLoading(false);
            });
    }
    
    //Show Google Sign-In Popup when SIGN IN WITH GOOGLE button is clicked
    const googleSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        signInWithPopup(auth, provider)
            .then(result => {
                console.log(result.user);

                const userUID = result.user.uid;
                const newUserData = { firstName, lastName, userName, authUID: userUID };
                createUser(newUserData)
                    .then(() => {
                        localStorage.setItem('AssembleAuthToken', result.user.accessToken);
                        localStorage.setItem('AssembleAuthUID', userUID);
                        setLoading(false);
                        navigate(`/`);
                    })
                    .catch((error) => {
                        // TODO: Catch common errors
                        window.alert(error.message);
                        setLoading(false);
                    });
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
                    Sign Up
                </Typography>

                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField id="firstName" variant="outlined" required fullWidth label="First Name" name="firstName" autoComplete="firstName" helperText={errors.firstName} error={errors.firstName ? true : false} onChange={changeHandler}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}> 
                            <TextField id="lastName" variant="outlined" required fullWidth label="Last Name" name="lastName" autoComplete="lastName" helperText={errors.lastName} error={errors.lastName ? true : false} onChange={changeHandler}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="username" variant="outlined" required fullWidth label="Username"  name="username" autoComplete="username" helperText={errors.username} error={errors.username ? true : false} onChange={changeHandler} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit"  variant="contained" fullWidth color="primary" className={classes.submit} onClick={googleSubmitHandler} disabled={loading || !firstName || !lastName || !userName }> 
                                <GoogleIcon/> &nbsp; Sign up with Google 
                                {loading && <CircularProgress size={30} className={classes.progess} />}
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="email" variant="outlined" required fullWidth label="Email Address" name="email" autoComplete="email" helperText={errors.email} error={errors.email ? true : false} onChange={changeHandler} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="password" variant="outlined" required fullWidth name="password" label="Password" type="password" autoComplete="current-password" helperText={errors.password} error={errors.password ? true : false} onChange={changeHandler} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="confirmPassword" variant="outlined" required fullWidth name="confirmPassword" label="Confirm Password" type="password" autoComplete="current-password" onChange={changeHandler} />
                        </Grid>
                    </Grid>

                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={regularSubmitHandler} disabled={loading || !firstName || !lastName || !userName || !email || !password || !confirmPassword }>
                        Sign Up
                        {loading && <CircularProgress size={30} className={classes.progess} />}
                    </Button>

                    

                    <Grid container>
                        <Grid item>
                            <Link href="/signin" variant="body2">
                                {"Already have an account? Sign in!"}
                            </Link>
                        </Grid>
                    </Grid>
            </form>
            </div>
        </Container>
    </>);
};

export default withStyles(styles)(Signup);
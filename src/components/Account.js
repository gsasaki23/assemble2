// Utility Imports
import { useEffect, useState } from 'react';

// @material-ui Imports
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

const styles = (theme) => ({
    accountTop:{
        margin: "10% 0% 0% 15%",
        textAlign: "center",
        border: "2px solid black",
    },
    form:{
        margin: "5% 0% 0% 15%",
        textAlign: "center"
    }
});

const Account = (props) => {
    const { classes, userData } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userDataChanged, setUserDataChanged] = useState(false);
    const [firstName, setFirstName] = useState(userData.firstName);
    const [lastName, setLastName] = useState(userData.lastName);
    const [userName, setuserName] = useState(userData.assembleUserName);
    const [email, setEmail] = useState("This won't change anything yet");
    const [password, setPassword] = useState("This won't change anything yet");
    const [errors, setErrors] = useState({});

    // Update the respective state when typing
    const changeHandler = e => {
        // console.log(e.target.name + " was changed");
        if (e.target.name === "firstName"){
            setFirstName(e.target.value);
        } 
        else if (e.target.name === "lastName") {
            setLastName(e.target.value);
        }
        else if (e.target.name === "userName") {
            setuserName(e.target.value);
        }
        else if (e.target.name === "email") {
            setEmail(e.target.value);
            if (e.target.value === "bs") {
                setErrors({'email':"bs"});
            }
        }
        else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
        setUserDataChanged(true);
	};

    // Overwrite firestore user record with current form
    const saveHandler = e => {
        e.preventDefault();
        console.log("saveHandler entered");
        setLoading(true);

        // TODO: Actual update call


        // After done..
        setLoading(false);
        setUserDataChanged(false);
    }

    useEffect(()=>{
        console.log("Showing Account Component");
        // console.log(userData);
        setUiLoading(false);
    }, [props, userData]);

    return uiLoading === true
    ? (<>
        <div>
            {uiLoading && <CircularProgress size={125} className={classes.uiProgess} />}
        </div>
    </>)
    : (<>
        <Container component="main">
            <CssBaseline />
            <h1 className={classes.accountTop}>Account Settings</h1>

            <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <h5>To make changes, type your new desired value and press "Update"!</h5>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField id="firstName" variant="outlined" fullWidth label="First Name" name="firstName" helperText={errors.firstName} error={errors.firstName ? true : false} onChange={changeHandler} value={firstName} />
                    </Grid>
                    <Grid item xs={12} sm={6}> 
                        <TextField id="lastName" variant="outlined" fullWidth label="Last Name" name="lastName" helperText={errors.lastName} error={errors.lastName ? true : false} onChange={changeHandler} value={lastName} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="userName" variant="outlined" fullWidth label="Username"  name="userName" helperText={errors.userName} error={errors.userName ? true : false} onChange={changeHandler} value={userName} />
                    </Grid>

                    <Grid item xs={12}></Grid>
                    {userData.authType === "email"&&(<>
                        <Grid item xs={12}>
                            <TextField id="email" variant="outlined" fullWidth label="Email Address" name="email" helperText={errors.email} error={errors.email ? true : false} onChange={changeHandler} value={email} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="password" variant="outlined" fullWidth name="password" label="Password" type="password" helperText={errors.password} error={errors.password ? true : false} onChange={changeHandler} value={password} />
                        </Grid>
                    </>)}

                    <Grid item xs={12}></Grid>
                    {userData.authType === "google"&&(<>
                        <Grid item xs={12}>
                            <h5>You are signed in through Google.</h5>
                        </Grid>
                    </>)}

                    <Grid item xs={12}></Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={saveHandler} disabled={!userDataChanged || loading || !firstName || !lastName || !userName }>
                            Update Account Settings
                            {loading && <CircularProgress size={30} className={classes.progess} />}
                        </Button>
                    </Grid>
                </Grid>

                
            </form>

        </Container>
    </>
    );
};

export default withStyles(styles)(Account);
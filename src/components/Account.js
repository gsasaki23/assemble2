// Utility Imports
import { useEffect, useState } from 'react';

// @material-ui Imports
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { Container } from 'react-bootstrap';

const styles = (theme) => ({
    accountTop:{
        margin: "10% 0% 0% 15%",
        backgroundColor: "red",
        textAlign: "center",
        border: "2px solid black",
    },
    form:{
        margin: "10% 0% 0% 15%",
        textAlign: "center"
    }
});

const Account = (props) => {
    const { classes, userData } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setuserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        else if (e.target.name === "username") {
            setuserName(e.target.value);
        }
        else if (e.target.name === "email") {
            setEmail(e.target.value);
        }
        else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
	};

    // Overwrite firestore user record with current form
    const saveHandler = e => {
        e.preventDefault();
        console.log("saveHandler entered");
        setLoading(true);


        // After done..
        setLoading(false);
    }

    useEffect(()=>{
        console.log("Showing Account Component");

        console.log(userData);
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
            <h1 className={classes.accountTop}>Account</h1>

            <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField id="firstName" variant="outlined" required fullWidth label="First Name" name="firstName" helperText={errors.firstName} error={errors.firstName ? true : false} onChange={changeHandler}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}> 
                        <TextField id="lastName" variant="outlined" required fullWidth label="Last Name" name="lastName" helperText={errors.lastName} error={errors.lastName ? true : false} onChange={changeHandler}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="username" variant="outlined" required fullWidth label="Username"  name="username" helperText={errors.username} error={errors.username ? true : false} onChange={changeHandler} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="email" variant="outlined" required fullWidth label="Email Address" name="email" autoComplete="email" helperText={errors.email} error={errors.email ? true : false} onChange={changeHandler} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="password" variant="outlined" required fullWidth name="password" label="Password" type="password" helperText={errors.password} error={errors.password ? true : false} onChange={changeHandler} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={saveHandler} disabled={loading || !firstName || !lastName || !userName || !email || !password }>
                            Update
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
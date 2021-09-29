// Utility Imports
import { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import { checkUIDExists } from '../util/firestore';

// Component Imports
import Account from '../components/Account';
import Todo from '../components/Todo';

// @material-ui Imports
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
const drawerWidth = "15%";

const styles = (theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '45%',
		top: '35%'
	},
    userName: {
        marginTop: "5%"
    },
	toolbar: theme.mixins.toolbar,
    logoutLabel: {
        marginLeft: 'auto'
    }
});

const Home = (props) => {
    const { classes } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [userData, setUserData] = useState({}); // firstName, lastName
    const [render, setRender] = useState(false);

    const loadAccountPage = e => {
        // e.preventDefault();
        setRender(true);
    }
    const loadTodoPage = e => {
        // e.preventDefault();
        setRender(false);
    }
    const logoutHandler = e => {
		localStorage.removeItem('AssembleAuthToken');
		localStorage.removeItem('AssembleAuthUID');
        navigate(`/signin`);
    }

    useEffect(()=>{
        console.log("Showing Home Component");
        const authToken = localStorage.getItem('AssembleAuthToken');
        const authUID = localStorage.getItem('AssembleAuthUID');

        // Bounce if both an AuthToken and AuthUID are NOT found
        if (!authToken || !authUID) {
            window.alert("Home.js: No auth info. Transferring to /signin");
            navigate(`/signin`);
        } 

        // Get user based on Auth UID. Bounce if NOT found
        checkUIDExists(authUID)
            .then(res => {
                if (res.result === false) {
                    window.alert("Home.js: No UID match. Transferring to /signin");
                    localStorage.removeItem('AssembleAuthToken');
                    localStorage.removeItem('AssembleAuthUID');
                    navigate(`/signin`);
                } 
                else {
                    setUserData(res.userDocument);
                    setUiLoading(false);
                }
            })
    }, [props]);

    return uiLoading === true
    ? (<>
        <div>
            {uiLoading && <CircularProgress size={125} className={classes.uiProgess} />}
        </div>
    </>)
    : (<>
        <CssBaseline />
        
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton size="medium" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        🔥 Assemble2 🔥
                    </Typography>

                    <Button color="inherit" className={classes.logoutLabel} onClick={logoutHandler}>Logout</Button>
                    <ExitToAppIcon onClick={logoutHandler}/>
                </Toolbar>
            </AppBar>
        </Box>

        {/* TODO: More Fancies https://mui.com/components/drawers/ */}
        <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
            <div className={classes.toolbar} />
            <Divider />
                <center>
                    <p className={classes.userName}>
                        {' '}
                        {userData.firstName} {userData.lastName}
                    </p>
                </center>
            <Divider />
            <List>
                <ListItem button key="Todo" onClick={loadTodoPage}>
                    <ListItemIcon>
                        {' '}
                        <NotesIcon />{' '}
                    </ListItemIcon>
                    <ListItemText primary="Todo" />
                </ListItem>

                <ListItem button key="Account" onClick={loadAccountPage}>
                    <ListItemIcon>
                        {' '}
                        <AccountBoxIcon />{' '}
                    </ListItemIcon>
                    <ListItemText primary="Account" />
                </ListItem>
            </List>
        </Drawer>

        <div>{render ? <Account /> : <Todo />}</div>
        
    </>
    );
};

export default withStyles(styles)(Home);
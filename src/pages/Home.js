import { useEffect, useState } from 'react';

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
	toolbar: theme.mixins.toolbar
});

const Home = (props) => {
    const { classes } = props;
    const [render, setRender] = useState(false);
    const [uiLoading, setUiLoading] = useState(false);
    const [imageLoading, setimageLoading] = useState(false);
    const [userData, setUserData] = useState({}); // firstName, lastName

    const loadAccountPage = e => {
        // e.preventDefault();
        setRender(true);
    }
    const loadTodoPage = e => {
        // e.preventDefault();
        setRender(false);
    }
    const logoutHandler = e => {
		// localStorage.removeItem('AuthToken');
		// props.history.push('/login');
    }

    useEffect(()=>{
        console.log("Showing Home Component");
        console.log(props);
        // authMiddleWare(this.props.history);
        // const authToken = localStorage.getItem('AuthToken');
		// TODO: Verify Token with firebase
        setUserData({firstName: "Tom", lastName: "Bradley"});
    }, [props]);

    return uiLoading === true
    ? (<>
        <div>
            {uiLoading && <CircularProgress size={125} className={classes.uiProgess} />}
        </div>
    </>)
    : (<>
        <CssBaseline />
        
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    🔥 Assemble2 🔥
                </Typography>
            </Toolbar>
        </AppBar>

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

                <ListItem button key="Logout" onClick={logoutHandler}>
                    <ListItemIcon>
                        {' '}
                        <ExitToAppIcon />{' '}
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Drawer>

        <div>{render ? <Account /> : <Todo />}</div>
    </>

    );
};

export default withStyles(styles)(Home);
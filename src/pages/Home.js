// Utility Imports
import { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import { checkUIDExists, getTeamDataByID } from '../util/firestore';

// Component Imports
import Account from '../components/Account';
import Dashboard from '../components/Dashboard';
import TeamTab from '../components/TeamTab';

// @material-ui Imports
import Drawer from '@mui/material/Drawer';
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
import GroupIcon from '@mui/icons-material/Group';

const styles = (theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: "15%",
		flexShrink: 0
	},
	drawerPaper: {
		width: "15%"
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
    const [userData, setUserData] = useState({});
    const [teamsData, setTeamsData] = useState([]);
    const [renderTab, setRenderTab] = useState("Dashboard");
    const [renderTeamData, setRenderTeamData] = useState({});
    const [hideDrawer, setHideDrawer] = useState(true);
    
    const loadAccountPage = e => {
        setRenderTab("Account");
    }
    const loadDashboardPage = e => {
        setRenderTab("Dashboard");
    }
    const toggleDrawer = e => {
        hideDrawer === true ? setHideDrawer(false) : setHideDrawer(true);
    }
    const selectTeamTab = e => {
        // setRenderTab(e.target.innerHTML);
        for (let team in teamsData) {
            if (teamsData[team].teamName === e.target.innerHTML) {
                setRenderTab(teamsData[team].teamName);
                console.log("tab changed to: " + teamsData[team].teamName);
                setRenderTeamData(teamsData[team]);
                console.log("tab data updated");
            }
        }
        toggleDrawer();
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
                    // Get every associated team's data
                    res.userDocument.teams.forEach(team => {
                        getTeamDataByID(team)
                            .then(res => {
                                if (res.result === false) {
                                    window.alert("Home.js: No Team ID match. Transferring to Dashboard");
                                    setRenderTab("Dashboard");
                                } 
                                else {
                                    let newTeamDocument = res.teamDocument;
                                    newTeamDocument.id = team;
                                    setTeamsData((teamsData)=>[...teamsData, newTeamDocument]);
                                }
                            })
                    })
                }
            })
        setUiLoading(false);
    }, [props]);

    return uiLoading === true
    ? (<>
        <div>
            {uiLoading && <CircularProgress size={125} className={classes.uiProgess} />}
        </div>
    </>)
    : (<>
        <CssBaseline />
        
        {/* Header */}
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton size="medium" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }} onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        🔥 Assemble2 🔥
                    </Typography>

                    <Button color="inherit" className={classes.logoutLabel} onClick={logoutHandler}>© 2021 by Gaku Sasaki &nbsp; &nbsp; Logout</Button>
                    <ExitToAppIcon onClick={logoutHandler}/>
                </Toolbar>
            </AppBar>
        </Box>

        {/* Sidebar */}
        <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }} hidden={hideDrawer} onClose={toggleDrawer}>
            <div className={classes.toolbar} />
            <Divider />
                <center>
                    <h5 className={classes.userName}>
                        {' '}
                        @{userData.assembleUserName}
                    </h5>
                    <p className={classes.userName}>
                        {' '}
                        {userData.firstName} {userData.lastName}
                    </p>
                </center>
            <Divider />
            <List>
                <ListItem button key="Account" onClick={loadAccountPage}>
                    <ListItemIcon>
                        {' '}
                        <AccountBoxIcon />{' '}
                    </ListItemIcon>
                    <ListItemText primary="Account" />
                </ListItem>

                <ListItem button key="Dashboard" onClick={loadDashboardPage}>
                    <ListItemIcon>
                        {' '}
                        <NotesIcon />{' '}
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>

                { teamsData.map((team,i) => (
                    <ListItem button key={i}>
                        <ListItemIcon>
                            {' '}
                            <GroupIcon />{' '}
                        </ListItemIcon>
                        <ListItemText primary={team.teamName} onClick={selectTeamTab}/>
                    </ListItem>
                ))}

            </List>
        </Drawer>

        <div>{ 
            renderTab === "Account" 
            ? <Account userData={userData} /> 
            : renderTab === "Dashboard"
                ? <Dashboard userData={userData}/>
                : <TeamTab userData={userData} renderTeamData={renderTeamData}/>
        }</div>
        
    </>
    );
};

export default withStyles(styles)(Home);
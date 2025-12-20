import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from "@mui/icons-material/Dashboard";
import LinkIcon from '@mui/icons-material/Link';
import { Divider } from '@mui/material';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { id: "projects", label: "Projelerim", icon: <DashboardIcon />, path: "/projects" },
        { id: "tasks", label: "Görevlerim", icon: <AssignmentIcon />, path: "/tasks" },
        { id: "connections", label: "Bağlantılarım", icon: <LinkIcon />, path: "/connections" },
    ];

    const [selected, setSelected] = useState("");

    useEffect(() => {
        const current = items.find((item) => location.pathname.startsWith(item.path));
        if (current) setSelected(current.id);
    }, [location.pathname]);

    return (
        <List
            sx={{ width: '100%', bgcolor: "#D6EAF8",height:"100%",minHeight:"100vh" }}
            component="nav"
            subheader={
                <ListSubheader sx={{bgcolor:"#D6EAF8"}} component="div">
                    Dashboard
                </ListSubheader>
            }
        >
            <Divider></Divider>
            {items.map((item) => (
                <ListItemButton
                    key={item.id}
                    selected={selected === item.id}
                    onClick={() => {
                        setSelected(item.id);
                        navigate(item.path);
                    }}
                    sx={{
                        borderRadius: 1,
                        "&.Mui-selected": {
                            backgroundColor: "primary.main",
                            color: "white",
                        },
                        "&.Mui-selected:hover": {
                            backgroundColor: "primary.dark",
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 30,
                            color: selected === item.id ? "white" : "inherit",
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>

                    <ListItemText primary={item.label} />
                </ListItemButton>
            ))}
        </List>
    );
}

export default Sidebar;

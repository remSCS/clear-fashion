import React, { useState } from "react";

import { Typography, AppBar,Button, Card, CardActions, CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container } from '@material-ui/core';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { makeStyles } from "@material-ui/core/styles";

const useStyles=makeStyles((theme)=>({
    
}));


const App = () => {
    // Permet de définir des styles 
    const classes = useStyles();
    // Variables d'états
    const [X, setX] = useState("");


    //Fonctions qui gèrent les changements
    const handleDelete = id => {
        // const updatedClients = [...clients]; 
        // const index = updatedClients.findIndex(client => client.id === id);

        // updatedClients.splice(index, 1);

        // setClients(updatedClients);
    };

    // Affichage HTML
    return (
        <>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6">Clothes</Typography>
                </Toolbar>
            </AppBar>
            <main>
                <div>
                    <Container maxWidth="sm">
                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>Clothes</Typography>

                    </Container>
                </div>
                <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="select-brand-label">Brand</InputLabel>
                        <Select
                            labelId="select-brand-label"
                            id="select-brand"
                            //value={age}
                            //onChange={handleChange}
                            label="Brand"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="select-sort-label">Sort</InputLabel>
                        <Select
                            labelId="select-sort-label"
                            id="select-sort"
                            //value={age}
                            //onChange={handleChange}
                            label="Sort"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"price-asc"}>Price Low-High</MenuItem>
                            <MenuItem value={"price-desc"}>Price High-Low</MenuItem>
                            <MenuItem value={"newest"}>Newest</MenuItem>
                            <MenuItem value={"oldest"}>Oldest</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <Grid container spacing={2} justify="center">
                        <Grid item>
                            <Button variant="contained" color="primary">

                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </main>
        </>
    )
}

export default App;
import React, { useState } from "react";

import { Typography, AppBar, Button, Card, CardActions, CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container } from '@mui/material';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import useStyles from "./styles";
import fetchProducts from "./products";



const App = () => {
    // Permet de définir des styles aux boutons, listes déroulantes ...
    const classes = useStyles();

    // Variables d'états
    const [productList, setProductList] = useState([]);    // la BDD avec tous les produits
    const [pageNumber, setPageNumber] = useState(0);       // le numéro de la page actuelle
    const [totalNbPages, setTotalNbPages] = useState(0);    // nombre total de page
    const [sortBy, setSortBy] = useState("");           // critère pour tri (prix ascendant/descendant, date de sortie)
    const [specificBrand, setSpecificBrand] = useState("");    // filtre par marque
    const [favoriteProducts, setFavoriteProducts] = useState([]);  // liste des produits favoris

    const getProducts=async ()=>{
        const products=await fetchProducts();
        console.log("final",products);
    }

    getProducts()

    

        


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
                <div className={classes.container}>
                    <Container maxWidth="sm">
                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>Clothes</Typography>

                    </Container>
                </div>
                <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }} >
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
                    <Container className={classes.cardGrid} >
                        <Grid container spacing={4}>
                            {
                                productList.map(product => (
                                    <Grid item xs={4}>
                                        <Card className={classes.card}>
                                            <CardMedia className={classes.cardMedia} image="https://source.unsplash.com/random" title="image_title" />
                                            <CardContent className={classes.cardContent}>
                                                <Typography gutterBottom variant="h5">Product link & name</Typography>
                                                <Typography variant="h6">Brand</Typography>
                                                <Typography variant="h7">Price €</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary">Add to favorite</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Container>
                </div>


            </main>
        </>
    )
}

export default App;
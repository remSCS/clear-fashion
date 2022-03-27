import React, { useState } from "react";

import {
  Typography,
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CssBaseline,
  Grid,
  Toolbar,
  Container,
  FormControlLabel,
  Pagination,
  Checkbox,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Link,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import useStyles from "./styles";
import fetchProducts from "./products";

import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

const App = () => {
  // Permet de définir des styles aux boutons, listes déroulantes ...
  const classes = useStyles();

  // Variables d'états
  const [productsList, setProductsList] = useState([]); // les produits affichés sur une page
  const [pageNumber, setPageNumber] = useState(0); // le numéro de la page actuelle
  const [totalNbPages, setTotalNbPages] = useState(1); // nombre total de pages
  const [nbProductsPerPage, setNbProductsPerPage] = useState(12); // Le nombre de produits affichés par page (12,24,48)
  const [sortBy, setSortBy] = useState(0); // critère pour tri (prix ascendant=1, descendant=-1, aucun tri=0)
  const [specificBrand, setSpecificBrand] = useState(""); // filtrer par marque
  const [favoriteProducts, setFavoriteProducts] = useState([]); // liste des produits favoris
  const [isLoaded, setIsLoaded] = useState(false); // permet de ne pas reinitialiser la liste des produits constamment
  const [displayFavProducts,setDisplayFavProducts]=useState(false); // permet de savoir si l'utilisateur veut afficher les produits favoris ou non


  const initializeProducts = async () => {
    if(!isLoaded){
      let products=[]
      if(displayFavProducts){
        products=[...favoriteProducts];
        if(specificBrand!="") products=products.filter(x=>x.brand==specificBrand)
        if(sortBy!=0){
          if(sortBy===1) products.sort((a,b)=>a.price-b.price)
          else if(sortBy===-1) products.sort((a,b)=>b.price-a.price)
        }
        setProductsList(products);
        setIsLoaded(true);
        console.log("page loaded - favorite products")
      }
      else{
        products = await fetchProducts();
        setProductsList(products);
        setIsLoaded(true);
        console.log("page loaded");
      }
    }
  };

  initializeProducts();

  const handlePageNumber = (event, pageNb) => {
    setPageNumber(pageNb);
  };

  const handleTotalNbPages = (event, total) => {
    setTotalNbPages(total);
  };

  const handleNbProductsPerPage = (event, nb) => {
    // OPERATIONNEL
    setNbProductsPerPage(nb);
  };

  const handleSortBy = (event) => {
    // OPERATIONNEL
    setSortBy(event.target.value);
    console.log(event.target.value);
  };

  const handleSpecificBrand = (event) => {
    // OPERATIONNEL
    setSpecificBrand(event.target.value);
  };

  const handleFavoriteProducts = (id) => {
    if (productIsFavorite(id)) {
      // Si le produits était dans les favoris, alors on le retire après le click
      handleDeleteFavoriteProducts(id);
    } // S'il ne l'était pas, alors on le rajoute aux favoris
    else {
      handleAddFavoriteProducts(id);
    }
  };

  const handleDeleteFavoriteProducts = (id) => {
    const newFavoriteProducts = [...favoriteProducts];
    setFavoriteProducts(newFavoriteProducts.filter((x) => x != id));
  };

  const handleAddFavoriteProducts = (id) => {
    const newFavoriteProducts = [...favoriteProducts];
    newFavoriteProducts.push(id);
    setFavoriteProducts(newFavoriteProducts);
  };

  const productIsFavorite = (id) => {
    let isFav = false;
    if (favoriteProducts.includes(id)) {
      isFav = true;
    }
    return isFav;
  };

  const handleDisplayFavProducts=(event)=>{
    setDisplayFavProducts(event.target.checked);
    setIsLoaded(false)
    
    if(event.target.checked){ // S'il est check, alors on affiche tous les produits favoris
      console.log("favorite")
    }
    else{                     // Sinon, on affiche tous les produits (affichage normal)
      console.log("normal")
    }
  }

  // --------------------- Affichage du site ---------------------

  return (
    <>
      <CssBaseline />
      <main>
        <div className={classes.container}>
          <Container maxWidth="sm">
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Products
            </Typography>
          </Container>
        </div>
        <div>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="select-brand-label">Brand</InputLabel>
            <Select
              labelId="select-brand-label"
              id="select-brand"
              value={specificBrand}
              onChange={handleSpecificBrand}
              label="Brand"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Adresse Paris">Adresse Paris</MenuItem>
              <MenuItem value="Dedicated">Dedicated</MenuItem>
              <MenuItem value="Loom">Loom</MenuItem>
              <MenuItem value="Montlimart">Montlimart</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="select-sort-label">Sort</InputLabel>
            <Select
              labelId="select-sort-label"
              id="select-sort"
              value={sortBy}
              onChange={handleSortBy}
              label="Sort"
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>Price Low-High</MenuItem>
              <MenuItem value={-1}>Price High-Low</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                sx={{ m: 1, "& .MuiSvgIcon-root": { fontSize: 32 } }}
                onChange={handleDisplayFavProducts}
              />
            }
            label="Favorite products"
          />

          <FormControl sx={{ m: 1, float: "right" }}>
            <ToggleButtonGroup
              color="primary"
              value={nbProductsPerPage}
              exclusive
              onChange={handleNbProductsPerPage}
            >
              <ToggleButton value={12}>12</ToggleButton>
              <ToggleButton value={24}>24</ToggleButton>
              <ToggleButton value={48}>48</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
          <FormControl sx={{ m: 1, float: "right" }}>
            <Typography variant="h8" marginTop={1.5}>
              Produits par page :
            </Typography>
          </FormControl>
        </div>
        <div>
          <Container className={classes.cardGrid}>
            <Grid container spacing={4}>
              {productsList.map((product) => (
                <Grid item xs={4} key={product._id}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={product.photo}
                      title="image_title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5">
                        {/* {product.name} */}
                        <Link href={product.link} underline="none">
                          {product.name}
                        </Link>
                      </Typography>
                      <Typography variant="h6">{product.brand}</Typography>
                      <Typography variant="h7">{product.price} €</Typography>
                    </CardContent>
                    <CardActions>
                      <Checkbox
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite />}
                        checked={productIsFavorite(product._id)}
                        onChange={() => {
                          handleFavoriteProducts(product._id);
                        }}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "30vh",
          }}
        >
          <Pagination className={classes.pagination} count={totalNbPages} />
        </div>
      </main>
    </>
  );
};

export default App;

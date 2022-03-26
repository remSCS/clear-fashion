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
  const [productList, setProductList] = useState([]); // les produits affichés sur une page
  const [pageNumber, setPageNumber] = useState(0); // le numéro de la page actuelle
  const [totalNbPages, setTotalNbPages] = useState(1); // nombre total de pages
  const [nbProductsPerPage, setNbProductsPerPage] = useState(12); // Le nombre de produits affichés par page (12,24,48)
  const [sortBy, setSortBy] = useState(0); // critère pour tri (prix ascendant=1, descendant=-1, aucun tri=0)
  const [specificBrand, setSpecificBrand] = useState(""); // filtrer par marque
  const [favoriteProducts, setFavoriteProducts] = useState([]); // liste des produits favoris
  const [isLoaded, setIsLoaded] = useState(false); // permet de ne pas reinitialiser la liste des produits constamment
  // const products=await fetchProducts();
  // setProductList(products);
  // console.log("final",products);

  const initializeProducts = async () => {
    if (!isLoaded) {
      const products = await fetchProducts();
      setProductList(products);
      setIsLoaded(true);
      //console.log(products[0]);
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

  const handleFavoriteProducts = (product) => {
    console.log(product);
  };

  //const handleDelete = (id) => {
  // const updatedClients = [...clients];
  // const index = updatedClients.findIndex(client => client.id === id);
  // updatedClients.splice(index, 1);
  // setClients(updatedClients);
  //};

  // Affichage HTML
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
              {productList.map((product) => (
                <Grid item xs={4} key={product._id}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={product.photo}
                      title="image_title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5">
                        {product.name}
                      </Typography>
                      <Typography variant="h6">{product.brand}</Typography>
                      <Typography variant="h7">{product.price} €</Typography>
                    </CardContent>
                    <CardActions>
                      <Checkbox
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite />}
                        onChange={()=>handleFavoriteProducts(product)}
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

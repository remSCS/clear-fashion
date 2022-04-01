import React, { useState } from "react";

import {
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CssBaseline,
  Grid,
  Container,
  FormControlLabel,
  Pagination,
  Checkbox,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Link,
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

  // ------------------- Variables d'états -------------------

  const [productsList, setProductsList] = useState([]); // les produits affichés sur une page
  const [pageNumber, setPageNumber] = useState(1); // le numéro de la page actuelle
  const [totalNbPages, setTotalNbPages] = useState(1); // nombre total de pages
  const [nbProductsPerPage, setNbProductsPerPage] = useState(12); // Le nombre de produits affichés par page (12,24,48)
  const [sortBy, setSortBy] = useState(0); // critère pour tri (prix ascendant=1, descendant=-1, aucun tri=0)
  const [specificBrand, setSpecificBrand] = useState(""); // filtrer par marque
  const [favoriteProducts, setFavoriteProducts] = useState([]); // liste des produits favoris
  const [isLoaded, setIsLoaded] = useState(false); // permet de ne pas reinitialiser la liste des produits constamment
  const [displayFavProducts, setDisplayFavProducts] = useState(false); // permet de savoir si l'utilisateur veut afficher les produits favoris ou non

  const[p50,setP50]=useState(0);
  const[p90,setP90]=useState(0);
  const[p95,setP95]=useState(0);

  // ----------------------- Fonctions -----------------------
  
  const initializeProducts = async () => {
    if (!isLoaded) {
      // S'il n'est pas encore loaded, alors on peut le load

      let products = [];
      let meta={};

      if (displayFavProducts) {
        // S'il s'agit d'afficher les produits favoris
        products = [...favoriteProducts];
        if (specificBrand !== "")
          products = products.filter((x) => x.brand === specificBrand); // Si l'utilisateur a selectionné une brand spécifique, alors on filtre
        if (sortBy !== 0) {
          // Si l'utilisateur a selectionné un sort par prix, alors on sort
          if (sortBy === 1) products.sort((a, b) => a.price - b.price);
          else if (sortBy === -1) products.sort((a, b) => b.price - a.price);
        }
        setProductsList(products);
        initializePValue(products);
        setIsLoaded(true);
        console.log("page loaded - favorite products");
      } else {
        // Afficher tous les produits (non favoris + favoris)
        let {products,meta} = await fetchProducts(pageNumber,nbProductsPerPage,specificBrand,sortBy);
        setProductsList(products);
        setTotalNbPages(meta.TotalNbPages);
        initializePValue(products);
        setIsLoaded(true);
        console.log("page loaded");
      }
    }
  };

  const initializePValue=(products)=>{
    if(products.length>0){// Si la liste des produits n'est pas nul, alors on peut calculer les p-value
      setP50(pValue(products,50))
      setP90(pValue(products,90))
      setP95(pValue(products,95))
    }
    else{ // Sinon, la liste est nulle, par exemple, lorsqu'il n'y a pas de produits favoris, et on definit les p-value à 0
      setP50(0);
      setP90(0);
      setP95(0);
    }
  }

  const pValue=(products,pval)=>{
    const prod=[...products];
    return prod.sort((a,b)=>a.price-b.price)[parseInt(prod.length*pval/100)].price
  };

  initializeProducts();

  const handlePageNumber = (event, pageNb) => {
    setPageNumber(pageNb);
    setIsLoaded(false);
  };

  const handleNbProductsPerPage = (event, nb) => {
    setNbProductsPerPage(nb);
    setIsLoaded(false);
  };

  const handleSortBy = (event) => {
    setSortBy(event.target.value);
    setPageNumber(1);
    setIsLoaded(false);
  };

  const handleSpecificBrand = (event) => {
    setSpecificBrand(event.target.value);
    setPageNumber(1);
    setIsLoaded(false);
  };

  const handleFavoriteProducts = (product) => {
    if (productIsFavorite(product)) {
      // Si le produits était dans les favoris, alors on le retire après le click
      console.log("remove from favorites");
      handleDeleteFavoriteProducts(product);
    } // S'il ne l'était pas, alors on le rajoute aux favoris
    else {
      console.log("add to favorites");
      handleAddFavoriteProducts(product);
    }
  };

  const handleDeleteFavoriteProducts = (product) => {
    let newFavoriteProducts = [...favoriteProducts];
    newFavoriteProducts=newFavoriteProducts.filter((x) => x._id !== product._id);
    setFavoriteProducts(newFavoriteProducts);
  };

  const handleAddFavoriteProducts = (product) => {
    const newFavoriteProducts = [...favoriteProducts];
    newFavoriteProducts.push(product);
    setFavoriteProducts(newFavoriteProducts);
  };

  const productIsFavorite = (product) => {
    let isFav = false;
    for(let x of favoriteProducts){
      if(x._id===product._id){
        isFav=true;
        break;
      }
    }
    return isFav;
  };

  const handleDisplayFavProducts = (event) => {
    setDisplayFavProducts(event.target.checked);
    setIsLoaded(false);
  };

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
          <FormControl sx={{ m: 1, float: "right" }}>
          <Typography variant="h8" marginTop={1.5}>
              p50 : <strong>{p50} €</strong> | p90 : <strong>{p90} €</strong> | p95 :<strong>{p95} €</strong> 
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
                        checked={productIsFavorite(product)}
                        onChange={() => {
                          handleFavoriteProducts(product);
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
          <Pagination className={classes.pagination} page={pageNumber} count={totalNbPages} onChange={handlePageNumber} />
        </div>
      </main>
    </>
  );
};

export default App;

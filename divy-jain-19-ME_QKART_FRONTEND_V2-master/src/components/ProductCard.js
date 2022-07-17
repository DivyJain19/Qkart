import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="250"
        image={product.image}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.category}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {`$${product.cost}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardActions>
      
        <Button onClick={()=>{return handleAddToCart()}} variant="contained"><AddShoppingCartOutlined />ADD TO CART</Button>
        
    </Card>
  );
};

export default ProductCard;

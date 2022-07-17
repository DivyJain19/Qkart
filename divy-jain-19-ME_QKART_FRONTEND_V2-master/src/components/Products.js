import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import Cart from './Cart';
import ProductCard from "./ProductCard";
import {generateCartItemsFrom} from './Cart';


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productDetails, setProductDetails]=useState([])
  const [isLoaded, setIsLoaded]= useState(false)
  const [isProductAvailable, setIsProductAvailable]=useState(true)
  const [debounceTimeout, setDebounceTimeout]=useState(500)
  const [cartDetails, setCartDetails]=useState([])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try{
      const response=await axios.get(`${config.endpoint}/products`)
      const productData= response.data
      setProductDetails(productData)
      setIsLoaded(true)
      
    }
    catch(err){
      if(err.response.status===404){ 
        setIsLoaded(false)
    }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try{
      const response=await axios.get(`${config.endpoint}/products/search?value=${text}`)
      const productData=  response.data
      setProductDetails(productData)
      setIsProductAvailable(true)
       
    }
    catch(err){
      if(err.response.status===404){
        setIsProductAvailable(false)
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   \]*
   */
  const debounceSearch = (event, debounceTimeout) => {
   
    if(debounceTimeout){
      clearTimeout(debounceTimeout)
    }
    const timeout=setTimeout(()=>{
      performSearch(event.target.value)
    },500)
      setDebounceTimeout(timeout)
  };

  
  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    const response=await axios.get(`${config.endpoint}/cart`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const cartItems=response.data
    setCartDetails(cartItems)
    
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false },
    isTriggeredFromProduct
  ) => {
      if(!token){
        enqueueSnackbar(
          "Login to add an item to the Cart",
          {
            variant: "warning",
          }
        );
        return
      }
      let data;
      if(options){
        data={
          productId: productId,
          qty: +qty + 1
        }  
      }
      else{
           data={
            productId: productId,
            qty: +qty - 1
        }
      }

      if(qty>0 && isTriggeredFromProduct){
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          {
            variant: "warning",
          }
        );
        return
      }
      try{
       const response=axios.post(`${config.endpoint}/cart`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        })
        const result=await response
        setCartDetails(result.data)
      }
      catch(e){
        console.log("failed",e)
      }

  };

  // addToCart(localStorage.getItem('token'),[],[],'upLK9JbQ4rMhTwt4',1,true)
  const quantityInCart=(id)=>{
    let quantity=0
    cartDetails.forEach((item)=>{
      if(item.productId==id){
        console.log(item.qty)
       quantity=item.qty
      }
    })
 return quantity
  }

  useEffect(()=>{
    performAPICall()
    fetchCart(localStorage.getItem('token'))
  },[])

  return (
    <div>
      <Header>
 {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
 <TextField
        className="search-desktop"
        size="small"
        InputProps={{
          className:"search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{
         debounceSearch(e, debounceTimeout)
        }}
      />

      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{
          debounceSearch(e, debounceTimeout)
         }}
      />
     
      <Grid container > 
        <Grid item md={localStorage.getItem('username')? 9 : 12}>
           <Grid container>
             <Grid item className="product-grid">
               <Box className="hero">
                <p className="hero-heading">
                  India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                  to your door step
                </p>
                </Box>
              </Grid>
            </Grid>

      { !isProductAvailable?   
        <Box className="loading" sx={{ margin: '0 auto'}}>
          <SentimentDissatisfied />
            <div>No products found</div>
        </Box>
         :
        <>
         {!isLoaded?
         <>
         <Box className="loading" sx={{ margin: '0 auto'}}>
          <CircularProgress />
            <div>Loading Products</div>
          </Box>
          </>
          :
          <Grid container sx={{ m: 2,}}  rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md:1 }} style={{paddingBottom:"1rem"}}>
              {productDetails.map((item)=>{
                return (
                <Grid key ={item.name} item xs={6} md={3} lg={3}>
                  <ProductCard product={item} handleAddToCart={()=>
                    addToCart(localStorage.getItem('token'),cartDetails,productDetails,item._id,quantityInCart(item._id),true,true)}/>
                </Grid>
              )
              })}
          </Grid>
          }
         </>
        }
        </Grid>

       { localStorage.getItem('username') ? 
      
        <Grid item md={3} xs={12} sx={{backgroundColor:"#E9F5E1" }} >
         <Cart cartProducts={cartDetails} products={productDetails} items={generateCartItemsFrom(cartDetails,productDetails)} handleQuantity={addToCart}/>
       </Grid>
       :
       <></>
       }
      </Grid>
        
      <Footer />
    </div>
  );
};

export default Products;

// import { Search, SentimentDissatisfied } from "@mui/icons-material";
// import {
//   CircularProgress,
//   Grid,
//   InputAdornment,
//   TextField,
// } from "@mui/material";
// import { Box } from "@mui/system";
// import Container from "@mui/material/Container";
// import axios from "axios";
// import { useSnackbar } from "notistack";
// import React, { useEffect, useState } from "react";
// import { config } from "../App";
// import Footer from "./Footer";
// import Header from "./Header";
// import "./Products.css";
// import ProductCard from "./ProductCard";
// import Cart from "./Cart";
// import {generateCartItemsFrom} from './Cart'
// // Definition of Data Structures used
// /**
//  * @typedef {Object} Product - Data on product available to buy
//  *
//  * @property {string} name - The name or title of the product

// /**
//  * @typedef {Object} CartItem -  - Data on product added to cart
//  *
//  * @property {string} name - The name or title of the product in cart
//  * @property {string} qty - The quantity of product added to cart
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} _id - Unique ID for the product
//  */

// const Products = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [productData, setProductData] = useState([]);
//   const [noProductsFound, setNoProductsFound] = useState(false);
//   const [debounceTimeout, setDebounceTimeout] = useState();
//   const [showCart, setShowCart] = useState(false);
//   const { enqueueSnackbar } = useSnackbar();
//     const [cartDetails, setCartDetails]=useState([])
//   useEffect(function () {
//     performAPICall();
//     if (localStorage.getItem("username")) {
//       setShowCart(true);
//       fetchCart(localStorage.getItem("token"));

//       console.log(test);
//     } else {
//       setShowCart(false);
//     }
//   }, []);
//   let test;
//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
//   /**
//    * Make API call to get the products list and store it to display the products
//    *
//    * @returns { Array.<Product> }
//    *      Array of objects with complete data on all available products
//    *
//    * API endpoint - "GET /products"
//    *
//    * Example for successful response from backend:
//    * HTTP 200
//    * [
//    *      {
//    *          "name": "iPhone XR",
//    *          "category": "Phones",
//    *          "cost": 100,
//    *          "rating": 4,
//    *          "image": "https://i.imgur.com/lulqWzW.jpg",
//    *          "_id": "v4sLtEcMpzabRyfx"
//    *      },
//    *      {
//    *          "name": "Basketball",
//    *          "category": "Sports",
//    *          "cost": 100,
//    *          "rating": 5,
//    *          "image": "https://i.imgur.com/lulqWzW.jpg",
//    *          "_id": "upLK9JbQ4rMhTwt4"
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 500
//    * {
//    *      "success": false,
//    *      "message": "Something went wrong. Check the backend console for more details"
//    * }
//    */

//   const performAPICall = async () => {
//     // const url = searchText
//     //     ? `${config.endpoint}/products`
//     //     :`${config.endpoint}/products/search?value=${searchText}`
//     return axios
//       .get(`${config.endpoint}/products`)
//       .then((res) => {
//         setIsLoading(false);
//         setProductData(res.data);
//         // console.log(res.data);
//       })
//       .catch((err) => {
//         if (err.response.status === 500) {
//           enqueueSnackbar(err.response.data.message);
//         } else {
//           enqueueSnackbar(
//             "Something went wrong. Check that the backend is running, reachable and returns valid JSON."
//           );
//         }
//       });
//   };

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
//   /**
//    * Definition for search handler
//    * This is the function that is called on adding new search keys
//    *
//    * @param {string} text
//    *    Text user types in the search bar. To filter the displayed products based on this text.
//    *
//    * @returns { Array.<Product> }
//    *      Array of objects with complete data on filtered set of products
//    *
//    * API endpoint - "GET /products/search?value=<search-query>"
//    *
//    */
//   const performSearch = async (text) => {
//     axios
//       .get(`${config.endpoint}/products/search?value=${text}`)
//       .then((res) => {
//         setProductData(res.data);
//         setNoProductsFound(false);
//       })
//       .catch((err) => {
//         if (err.response.status === 404) {
//           setNoProductsFound(true);
//         }
//       });
//   };

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
//   /**
//    * Definition for debounce handler
//    * With debounce, this is the function to be called whenever the user types text in the searchbar field
//    *
//    * @param {{ target: { value: string } }} event
//    *    JS event object emitted from the search input field
//    *
//    * @param {NodeJS.Timeout} debounceTimeout
//    *    Timer id set for the previous debounce call
//    *
//    */

//   // const debounce = (func) => {
//   //   let timer;
//   //   return function (...args) {
//   //     const context = this;
//   //     if (timer) clearTimeout(timer);
//   //     timer = setTimeout(() => {
//   //       timer = null;
//   //       func.apply(context, args);
//   //     }, 500);
//   //   };
//   // };

//   const debounceSearch = (event, debounceTimeout) => {
//     const value = event.target.value;

//     if (debounceTimeout) {
//       clearTimeout(debounceTimeout);
//     }

//     const timeout = setTimeout(() => {
//       performSearch(value);
//     }, 500);

//     setDebounceTimeout(timeout);
//   };

//   /**
//    * Perform the API call to fetch the user's cart and return the response
//    *
//    * @param {string} token - Authentication token returned on login
//    *
//    * @returns { Array.<{ productId: string, qty: number }> | null }
//    *    The response JSON object
//    *
//    * Example for successful response from backend:
//    * HTTP 200
//    * [
//    *      {
//    *          "productId": "KCRwjF7lN97HnEaY",
//    *          "qty": 3
//    *      },
//    *      {
//    *          "productId": "BW0jAAeDJmlZCF8i",
//    *          "qty": 1
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 401
//    * {
//    *      "success": false,
//    *      "message": "Protected route, Oauth2 Bearer token not found"
//    * }
//    */

//   const fetchCart = async (token) => {
//     if (!token) return;

//     try {
//       // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
//       const url = `${config.endpoint}/cart`;
//       const data = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log(data.data);
//       test = generateCartItemsFrom(itemData, prodData);
//       // console.log(prodData);
//       // console.log(test);
//       setItemData(data.data);
//     } catch (e) {
//       if (e.response && e.response.status === 400) {
//         enqueueSnackbar(e.response.data.message, { variant: "error" });
//       } else {
//         enqueueSnackbar(
//           "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
//           {
//             variant: "error",
//           }
//         );
//       }
//       return null;
//     }
//   };

//   // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
//   /**
//    * Return if a product already is present in the cart
//    *
//    * @param { Array.<{ productId: String, quantity: Number }> } items
//    *    Array of objects with productId and quantity of products in cart
//    * @param { String } productId
//    *    Id of a product to be checked
//    *
//    * @returns { Boolean }
//    *    Whether a product of given "productId" exists in the "items" array
//    *
//    */
//   const isItemInCart = (items, productId) => {};

//   /**
//    * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
//    *
//    * @param {string} token
//    *    Authentication token returned on login
//    * @param { Array.<{ productId: String, quantity: Number }> } items
//    *    Array of objects with productId and quantity of products in cart
//    * @param { Array.<Product> } products
//    *    Array of objects with complete data on all available products
//    * @param {string} productId
//    *    ID of the product that is to be added or updated in cart
//    * @param {number} qty
//    *    How many of the product should be in the cart
//    * @param {boolean} options
//    *    If this function was triggered from the product card's "Add to Cart" button
//    *
//    * Example for successful response from backend:
//    * HTTP 200 - Updated list of cart items
//    * [
//    *      {
//    *          "productId": "KCRwjF7lN97HnEaY",
//    *          "qty": 3
//    *      },
//    *      {
//    *          "productId": "BW0jAAeDJmlZCF8i",
//    *          "qty": 1
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 404 - On invalid productId
//    * {
//    *      "success": false,
//    *      "message": "Product doesn't exist"
//    * }
//    */
//   const addToCart = async (
//     token,
//     items,
//     products,
//     productId,
//     qty,
//     options = { preventDuplicate: false }
//   ) => {};

//   return (
//     <div>
//       <Header>
//         {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
//         <TextField
//           className="search-desktop"
//           size="small"
//           InputProps={{
//             className: "search",
//             endAdornment: (
//               <InputAdornment position="end">
//                 <Search color="primary" />
//               </InputAdornment>
//             ),
//           }}
//           placeholder="Search for items/categories"
//           name="search"
//           onChange={(e) => debounceSearch(e, debounceTimeout)}
//         />
//       </Header>

//       {/* Search view for mobiles */}
//       <TextField
//         className="search-mobile"
//         size="small"
//         fullWidth
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <Search color="primary" />
//             </InputAdornment>
//           ),
//         }}
//         placeholder="Search for items/categories"
//         name="search"
//         onChange={(e) => debounceSearch(e, debounceTimeout)}
//       />
//       <Grid container>
//         <Grid item className="product-grid">
//           <Box className="hero">
//             <p className="hero-heading">
//               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
//               to your door step
//             </p>
//           </Box>
//         </Grid>
//         {!noProductsFound ? (
//           <div>
//             {isLoading ? (
//               <Container>
//                 <CircularProgress /> <p>Loading Products...</p>
//               </Container>
//             ) : (
//               <Grid container spacing={1}>
//                 <Grid item md={showCart ? 9 : 12} sm={12}>
//                   <Grid
//                     container
//                     spacing={{ xs: 2, md: 4 }}
//                     columns={{ xs: 4, sm: 12, md: 12 }}
//                     className="cont"
//                   >
//                     {productData.map((product) => (
//                       <Grid
//                         item
//                         xs={2}
//                         sm={4}
//                         md={3}
//                         key={product._id}
//                         style={{ paddingBottom: "10px" }}
//                       >
//                         <ProductCard product={product} />
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Grid>
//                 {showCart && (
//                   <Grid item md={3} sm={12} xs={12}>
//                     <Cart items={test} products={prodData} />
//                   </Grid>
//                 )}
//               </Grid>
//             )}
//           </div>
//         ) : (
//           <div
//             style={{
//               width: "100%",
//               textAlign: "center",
//               paddingTop: "20%",
//               paddingBottom: "20%",
//             }}
//           >
//             <SentimentDissatisfied />
//             <p>No Products Found</p>
//           </div>
//         )}
//       </Grid>

//       <Footer />
//     </div>
//   );
// };

// export default Products;
// category: "Fashion"
// cost: 50
// image: "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/42d4d057-8704-4174-8d74-e5e9052677c6.png"
// name: "UNIFACTOR Mens Running Shoes"
// rating: 5
// _id: "BW0jAAeDJmlZCF8i"

// import { Search, SentimentDissatisfied } from "@mui/icons-material";
// import {
//   CircularProgress,
//   Grid,
//   InputAdornment,
//   TextField,
// } from "@mui/material";
// import { Box } from "@mui/system";
// import axios from "axios";
// import { useSnackbar } from "notistack";
// import React, { useEffect, useState } from "react";
// import { config } from "../App";
// import Footer from "./Footer";
// import Header from "./Header";
// import "./Products.css";
// import Cart from "./Cart";
// import ProductCard from "./ProductCard";
// import { generateCartItemsFrom } from "./Cart";

// /**
//  * @typedef {Object} CartItem -  - Data on product added to cart
//  *
//  * @property {string} name - The name or title of the product in cart
//  * @property {string} qty - The quantity of product added to cart
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} _id - Unique ID for the product
//  */

// const Products = () => {
//   const { enqueueSnackbar } = useSnackbar();
//   const [productDetails, setProductDetails] = useState([]);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [isProductAvailable, setIsProductAvailable] = useState(true);
//   const [debounceTimeout, setDebounceTimeout] = useState(500);
//   const [cartDetails, setCartDetails] = useState([]);

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
//   /**
//    * Make API call to get the products list and store it to display the products
//    *
//    * @returns { Array.<Product> }
//    *      Array of objects with complete data on all available products
//    *
//    * API endpoint - "GET /products"
//    *
//    * Example for successful response from backend:
//    * HTTP 200
//    * [
//    *      {
//    *          "name": "iPhone XR",
//    *          "category": "Phones",
//    *          "cost": 100,
//    *          "rating": 4,
//    *          "image": "https://i.imgur.com/lulqWzW.jpg",
//    *          "_id": "v4sLtEcMpzabRyfx"
//    *      },
//    *      {
//    *          "name": "Basketball",
//    *          "category": "Sports",
//    *          "cost": 100,
//    *          "rating": 5,
//    *          "image": "https://i.imgur.com/lulqWzW.jpg",
//    *          "_id": "upLK9JbQ4rMhTwt4"
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 500
//    * {
//    *      "success": false,
//    *      "message": "Something went wrong. Check the backend console for more details"
//    * }
//    */
//   const performAPICall = async () => {
//     try {
//       const response = await axios.get(`${config.endpoint}/products`);
//       const productData = response.data;
//       setProductDetails(productData);
//       setIsLoaded(true);
//     } catch (err) {
//       if (err.response.status === 404) {
//         setIsLoaded(false);
//       }
//     }
//   };

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
//   /**
//    * Definition for search handler
//    * This is the function that is called on adding new search keys
//    *
//    * @param {string} text
//    *    Text user types in the search bar. To filter the displayed products based on this text.
//    *
//    * @returns { Array.<Product> }
//    *      Array of objects with complete data on filtered set of products
//    *
//    * API endpoint - "GET /products/search?value=<search-query>"
//    *
//    */
//   const performSearch = async (text) => {
//     try {
//       const response = await axios.get(
//         `${config.endpoint}/products/search?value=${text}`
//       );
//       const productData = response.data;
//       setProductDetails(productData);
//       setIsProductAvailable(true);
//     } catch (err) {
//       if (err.response.status === 404) {
//         setIsProductAvailable(false);
//       }
//     }
//   };

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
//   /**
//    * Definition for debounce handler
//    * With debounce, this is the function to be called whenever the user types text in the searchbar field
//    *
//    * @param {{ target: { value: string } }} event
//    *    JS event object emitted from the search input field
//    *
//    * @param {NodeJS.Timeout} debounceTimeout
//    *    Timer id set for the previous debounce call
//    \]*
//    */
//   const debounceSearch = (event, debounceTimeout) => {

//     const value = event.target.value;

//     if (debounceTimeout) {
//       clearTimeout(debounceTimeout);
//     }

//     const timeout = setTimeout(() => {
//       performSearch(value);
//     }, 500);

//     setDebounceTimeout(timeout);

//   };

//   /**
//    * Perform the API call to fetch the user's cart and return the response
//    *
//    * @param {string} token - Authentication token returned on login
//    *
//    * @returns { Array.<{ productId: string, qty: number }> | null }
//    *    The response JSON object
//    *
//    * Example for successful response from backend:
//    * HTTP 200
//    * [
//    *      {
//    *          "productId": "KCRwjF7lN97HnEaY",
//    *          "qty": 3
//    *      },
//    *      {
//    *          "productId": "BW0jAAeDJmlZCF8i",
//    *          "qty": 1
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 401
//    * {
//    *      "success": false,
//    *      "message": "Protected route, Oauth2 Bearer token not found"
//    * }
//    */
//   const fetchCart = async (token) => {
//     if (!token) return;

//     try {
//       // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
//       const response = await axios.get(`${config.endpoint}/cart`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const cartItems = response.data;
//       setCartDetails(cartItems);
//     } catch (e) {
//       if (e.response && e.response.status === 400) {
//         enqueueSnackbar(e.response.data.message, { variant: "error" });
//       } else {
//         enqueueSnackbar(
//           "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
//           {
//             variant: "error",
//           }
//         );
//       }
//       return null;
//     }
//   };

//   // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
//   /**
//    * Return if a product already is present in the cart
//    *
//    * @param { Array.<{ productId: String, quantity: Number }> } items
//    *    Array of objects with productId and quantity of products in cart
//    * @param { String } productId
//    *    Id of a product to be checked
//    *
//    * @returns { Boolean }
//    *    Whether a product of given "productId" exists in the "items" array
//    *
//    */
//   const isItemInCart = (items, productId) => {};

//   /**
//    * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
//    *
//    * @param {string} token
//    *    Authentication token returned on login
//    * @param { Array.<{ productId: String, quantity: Number }> } items
//    *    Array of objects with productId and quantity of products in cart
//    * @param { Array.<Product> } products
//    *    Array of objects with complete data on all available products
//    * @param {string} productId
//    *    ID of the product that is to be added or updated in cart
//    * @param {number} qty
//    *    How many of the product should be in the cart
//    * @param {boolean} options
//    *    If this function was triggered from the product card's "Add to Cart" button
//    *
//    * Example for successful response from backend:
//    * HTTP 200 - Updated list of cart items
//    * [
//    *      {
//    *          "productId": "KCRwjF7lN97HnEaY",
//    *          "qty": 3
//    *      },
//    *      {
//    *          "productId": "BW0jAAeDJmlZCF8i",
//    *          "qty": 1
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 404 - On invalid productId
//    * {
//    *      "success": false,
//    *      "message": "Product doesn't exist"
//    * }
//    */
//   const addToCart = async (
//     token,
//     items,
//     products,
//     productId,
//     qty,
//     options = { preventDuplicate: false }
//   ) => {};

//   useEffect(() => {
//     performAPICall();
//     fetchCart(localStorage.getItem("token"));
//   }, []);

//   return (
//     <div>
//       <Header>
//         {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
//         <TextField
//           className="search-desktop"
//           size="small"
//           InputProps={{
//             className: "search",
//             endAdornment: (
//               <InputAdornment position="end">
//                 <Search color="primary" />
//               </InputAdornment>
//             ),
//           }}
//           placeholder="Search for items/categories"
//           name="search"
//           onChange={(e) => {
//             debounceSearch(e, debounceTimeout);
//           }}
//         />
//       </Header>

//       <TextField
//         className="search-mobile"
//         size="small"
//         fullWidth
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <Search color="primary" />
//             </InputAdornment>
//           ),
//         }}
//         placeholder="Search for items/categories"
//         name="search"
//         onChange={(e) => {
//           debounceSearch(e, debounceTimeout);
//         }}
//       />

//       <Grid container>
//         <Grid item md={localStorage.getItem("username") ? 9 : 12}>
//           <Grid container>
//             <Grid item className="product-grid">
//               <Box className="hero">
//                 <p className="hero-heading">
//                   India’s{" "}
//                   <span className="hero-highlight">FASTEST DELIVERY</span> to
//                   your door step
//                 </p>
//               </Box>
//             </Grid>
//           </Grid>

//           {!isProductAvailable ? (
//             <Box className="loading" sx={{ margin: "0 auto" }}>
//               <SentimentDissatisfied />
//               <div>No products found</div>
//             </Box>
//           ) : (
//             <>
//               {!isLoaded ? (
//                 <>
//                   <Box className="loading" sx={{ margin: "0 auto" }}>
//                     <CircularProgress />
//                     <div>Loading Products</div>
//                   </Box>
//                 </>
//               ) : (
//                 <Grid
//                   container
//                   sx={{ m: 2 }}
//                   rowSpacing={1}
//                   columnSpacing={{ xs: 1, sm: 1, md: 1 }}
//                   style={{ paddingBottom: "1rem" }}
//                 >
//                   {productDetails.map((item) => {
//                     return (
//                       <Grid key={item._id} item xs={6} md={3} lg={3}>
//                         <ProductCard product={item} />
//                       </Grid>
//                     );
//                   })}
//                 </Grid>
//               )}
//             </>
//           )}
//         </Grid>

//         {localStorage.getItem("username") ? (
//           <Grid item md={3} xs={12} sx={{ backgroundColor: "#E9F5E1" }}>
//             <Cart
//               products={productDetails}
//               items={generateCartItemsFrom(cartDetails, productDetails)}
//             />
//           </Grid>
//         ) : (
//           <div
//             style={{
//               width: "100%",
//               textAlign: "center",
//               paddingTop: "20%",
//               paddingBottom: "20%",
//             }}
//           >
//             <SentimentDissatisfied />
//             <p>No Products Found</p>
//           </div>
//         )}
//       </Grid>

//       <Footer />
//     </div>
//   );
// };

// export default Products;


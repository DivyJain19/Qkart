import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
// import Checkout from './Checkout';

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  
  const cartDetails=[]
  cartData.map((cartItem)=>{
   productsData.map((productItem)=>{
    if(cartItem.productId===productItem._id){
      productItem.qty=cartItem.qty
      cartDetails.push(productItem)
    }
   })
  })

  return cartDetails
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let totalValue=0;
  items.map((item)=>{
    totalValue+=item.cost*item.qty
  })
  return totalValue
};



// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  let totalItems=0;
  items.forEach((item)=>{
    totalItems+=item.qty;
  })
return totalItems;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {
 if (!isReadOnly){
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );}
else{
  return (  <Box padding="0.5rem" data-testid="item-qty">
  Qty: {value}
</Box>)
}

}


/**
 * Component to display the Cart view
 *  @param { Array.<Product> } cartProducts
 * Array of objects with complete data of cart products
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  cartProducts,
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {

  const history=useHistory()
 

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        

    {items.map((product)=>{
      if(product.qty>0){
        return (
  <Box key={product.name} display="flex" alignItems="flex-start" padding="1rem">
       <Box className="image-container">
       <img
           // Add product image
           src={product.image}
           // Add product name as alt eext
           alt={product.name}
           width="100%"
           height="100%"
       />
       </Box>
       <Box
       display="flex"
       flexDirection="column"
       justifyContent="space-between"
       height="6rem"
       paddingX="1rem"
   >
       <div>{product.name}</div>
       <Box
           display="flex"
           justifyContent="space-between"
           alignItems="center"
       >
       <ItemQuantity value={product.qty}
       handleAdd={()=>handleQuantity(localStorage.getItem('token'),cartProducts,products,product._id,product.qty,true,false)}
        handleDelete={()=>handleQuantity(localStorage.getItem('token'),cartProducts,products,product._id,product.qty,false,false)}
        isReadOnly={isReadOnly}
      //  Add required props by checking implementation
       />
       <Box padding="0.5rem" fontWeight="700">
           ${product.cost}
       </Box>
       </Box>
   </Box>
   </Box>)
      }
    })}
        <Box
          padding="0.3rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {!isReadOnly ?
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={()=>{
               history.push('/checkout')
            }}
          >
            Checkout
          </Button>
        </Box>
      :
   <></>
      }
      </Box>
     {isReadOnly?
        <Box className="cart">
          <Box padding="0.3rem">
          <h3 >Order Details</h3>
          </Box>
            <Box display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding="0.3rem"
              >
                <div>Products</div>
                <div>{getTotalItems(items)}</div>
            </Box>
         
          <Box display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding="0.3rem"
              >
                <div>Subtotal</div>
                <div>${getTotalCartValue(items)}</div>
            </Box>
            <Box display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding="0.3rem"
              >
                <div>Shipping Charges</div>
                <div>$0</div>
            </Box>
            <Box display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding="0.3rem"
              >
                <h3>Total</h3>
                <div>${getTotalCartValue(items)}</div>
            </Box>
        </Box>
        :
        <></>
      }
    </>

  );
};

export default Cart;

// import {
//   AddOutlined,
//   RemoveOutlined,
//   ShoppingCart,
//   ShoppingCartOutlined,
// } from "@mui/icons-material";
// import { Button, IconButton, Stack } from "@mui/material";
// import { Box } from "@mui/system";
// import React from "react";
// import { useHistory } from "react-router-dom";
// import "./Cart.css";
// // import Checkout from './Checkout';

// // Definition of Data Structures used
// /**
//  * @typedef {Object} Product - Data on product available to buy
//  *
//  * @property {string} name - The name or title of the product
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} _id - Unique ID for the product
//  */

// /**
//  * @typedef {Object} CartItem -  - Data on product added to cart
//  *
//  * @property {string} name - The name or title of the product in cart
//  * @property {string} qty - The quantity of product added to cart
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} productId - Unique ID for the product
//  */

// /**
//  * Returns the complete data on all products in cartData by searching in productsData
//  *
//  * @param { Array.<{ productId: String, qty: Number }> } cartData
//  *    Array of objects with productId and quantity of products in cart
//  *
//  * @param { Array.<Product> } productsData
//  *    Array of objects with complete data on all available products
//  *
//  * @returns { Array.<CartItem> }
//  *    Array of objects with complete data on products in cart
//  *
//  */
// export const generateCartItemsFrom = (cartData, productsData) => {
//   const cartDetails = [];
//   cartData.map((cartItem) => {
//     productsData.map((productItem) => {
//       if (cartItem.productId === productItem._id) {
//         productItem.qty = cartItem.qty;
//         cartDetails.push(productItem);
//       }
//     });
//   });

//   return cartDetails;
// };

// /**
//  * Get the total value of all products added to the cart
//  *
//  * @param { Array.<CartItem> } items
//  *    Array of objects with complete data on products added to the cart
//  *
//  * @returns { Number }
//  *    Value of all items in the cart
//  *
//  */
// export const getTotalCartValue = (items = []) => {
//   let totalValue = 0;
//   items.map((item) => {
//     totalValue += item.cost * item.qty;
//   });
//   return totalValue;
// };

// // TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
// /**
//  * Return the sum of quantities of all products added to the cart
//  *
//  * @param { Array.<CartItem> } items
//  *    Array of objects with complete data on products in cart
//  *
//  * @returns { Number }
//  *    Total quantity of products added to the cart
//  *
//  */
// export const getTotalItems = (items = []) => {
//   let totalValue = 0;
//   items.map((item) => {
//     totalValue += item.qty;
//   });
//   return totalValue;
// };

// // TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
// /**
//  * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
//  *
//  * @param {Number} value
//  *    Current quantity of product in cart
//  *
//  * @param {Function} handleAdd
//  *    Handler function which adds 1 more of a product to cart
//  *
//  * @param {Function} handleDelete
//  *    Handler function which reduces the quantity of a product in cart by 1
//  *
//  * @param {Boolean} isReadOnly
//  *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
//  *
//  */
// const ItemQuantity = ({ value, handleAdd, handleDelete, noAddButtons=false }) => {
//   if (noAddButtons) {
//     return (
//       <Stack direction="row" alignItems="center">
//         {/* <IconButton size="small" color="primary" onClick={handleDelete}>
//           <RemoveOutlined />
//         </IconButton> */}
//         <Box padding="0.5rem" data-testid="item-qty">
//           Qty: {value}
//         </Box>
//         {/* <IconButton size="small" color="primary" onClick={handleAdd}>
//           <AddOutlined />
//         </IconButton> */}
//       </Stack>
//     );
//   }
//   return (
//     <Stack direction="row" alignItems="center">
//       <IconButton size="small" color="primary" onClick={handleDelete}>
//         <RemoveOutlined />
//       </IconButton>
//       <Box padding="0.5rem" data-testid="item-qty">
//         {value}
//       </Box>
//       <IconButton size="small" color="primary" onClick={handleAdd}>
//         <AddOutlined />
//       </IconButton>
//     </Stack>
//   );
// };

// /**
//  * Component to display the Cart view
//  *
//  * @param { Array.<Product> } products
//  *    Array of objects with complete data of all available products
//  *
//  * @param { Array.<Product> } items
//  *    Array of objects with complete data on products in cart
//  *
//  * @param {Function} handleDelete
//  *    Current quantity of product in cart
//  *
//  *
//  */
// const Cart = ({ cartProducts, products, items = [], handleQuantity,isReadOnly = false }) => {
//   const history = useHistory();

//   if (!items.length) {
//     return (
//       <Box className="cart empty">
//         <ShoppingCartOutlined className="empty-cart-icon" />
//         <Box color="#aaa" textAlign="center">
//           Cart is empty. Add more items to the cart to checkout.
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Box className="cart">
//         {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

//         {items.map((product) => {
//           console.log(product);
//           if (product.qty > 0) {
//             return (
//               <Box
//                 key={product.name}
//                 display="flex"
//                 alignItems="flex-start"
//                 padding="1rem"
//               >
//                 <Box className="image-container">
//                   <img
//                     // Add product image
//                     src={product.image}
//                     // Add product name as alt eext
//                     alt={product.name}
//                     width="100%"
//                     height="100%"
//                   />
//                 </Box>
//                 <Box
//                   display="flex"
//                   flexDirection="column"
//                   justifyContent="space-between"
//                   height="6rem"
//                   paddingX="1rem"
//                 >
//                   <div>{product.name}</div>
//                   <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                   >
//                     {isReadOnly === true ? (
//                       <ItemQuantity value={product.qty} noAddButtons={true} />
//                     ) : (
//                       <ItemQuantity
//                         value={product.qty}
//                         handleAdd={() =>
//                           handleQuantity(
//                             localStorage.getItem("token"),
//                             cartProducts,
//                             products,
//                             product._id,
//                             product.qty,
//                             true,
//                             false
//                           )
//                         }
//                         handleDelete={() =>
//                           handleQuantity(
//                             localStorage.getItem("token"),
//                             cartProducts,
//                             products,
//                             product._id,
//                             product.qty,
//                             false,
//                             false
//                           )
//                         }
//                         //  Add required props by checking implementation
//                       />
//                     )}
//                     <Box padding="0.5rem" fontWeight="700">
//                       ${product.cost}
//                     </Box>
//                   </Box>
//                 </Box>
//               </Box>
//             );
//           }
//         })}
//         <Box
//           padding="1rem"
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Box color="#3C3C3C" alignSelf="center">
//             Order total
//           </Box>
//           <Box
//             color="#3C3C3C"
//             fontWeight="700"
//             fontSize="1.5rem"
//             alignSelf="center"
//             data-testid="cart-total"
//           >
//             ${getTotalCartValue(items)}
//           </Box>
//         </Box>

//         <Box display="flex" justifyContent="flex-end" className="cart-footer">
//           {!isReadOnly && (
//             <Button
//               color="primary"
//               variant="contained"
//               startIcon={<ShoppingCart />}
//               className="checkout-btn"
//               onClick={() => {
//                 history.push("/checkout");
//               }}
//             >
//               Checkout
//             </Button>
//           )}
//         </Box>
//       </Box>
//       <Box className="cart">
//           <Box padding="0.3rem">
//           <h3 >Order Details</h3>
//           </Box>
//             <Box display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               padding="0.3rem"
//               >
//                 <div>Products</div>
//                 <div>{getTotalItems(items)}</div>
//             </Box>
         
//           <Box display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               padding="0.3rem"
//               >
//                 <div>Subtotal</div>
//                 <div>${getTotalCartValue(items)}</div>
//             </Box>
//             <Box display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               padding="0.3rem"
//               >
//                 <div>Shipping Charges</div>
//                 <div>$0</div>
//             </Box>
//             <Box display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               padding="0.3rem"
//               >
//                 <h3>Total</h3>
//                 <div>${getTotalCartValue(items)}</div>
//             </Box>
//         </Box>
//     </>
//   );
// };

// export default Cart;

// [{"_id":"o_yI6WhuCOS1_HPy26qmK","address":"Test address\n12th street, Mumbai"},{"_id":"n2tcY7ULJXao1YLi2_9oj","address":"Test address\n13th street, India"}]

// import {
//   AddOutlined,
//   RemoveOutlined,
//   ShoppingCart,
//   ShoppingCartOutlined,
// } from "@mui/icons-material";
// import { Button, IconButton, Stack } from "@mui/material";
// import { Box } from "@mui/system";
// import React from "react";
// import { useHistory } from "react-router-dom";
// import "./Cart.css";

// // Definition of Data Structures used
// /**
//  * @typedef {Object} Product - Data on product available to buy
//  *
//  * @property {string} name - The name or title of the product
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} _id - Unique ID for the product
//  */

// /**
//  * @typedef {Object} CartItem -  - Data on product added to cart
//  *
//  * @property {string} name - The name or title of the product in cart
//  * @property {string} qty - The quantity of product added to cart
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} productId - Unique ID for the product
//  */

// /**
//  * Returns the complete data on all products in cartData by searching in productsData
//  *
//  * @param { Array.<{ productId: String, qty: Number }> } cartData
//  *    Array of objects with productId and quantity of products in cart
//  *
//  * @param { Array.<Product> } productsData
//  *    Array of objects with complete data on all available products
//  *
//  * @returns { Array.<CartItem> }
//  *    Array of objects with complete data on products in cart
//  *
//  */
// export const generateCartItemsFrom = (cartData, productsData) => {
//   const cartDetails = [];
//   cartData.map((cartItem) => {
//     productsData.map((productItem) => {
//       if (cartItem.productId === productItem._id) {
//         productItem.qty = cartItem.qty;
//         cartDetails.push(productItem);
//       }
//     });
//   });
//   console.log(cartDetails);
//   return cartDetails;
// };

// /**
//  * Get the total value of all products added to the cart
//  *
//  * @param { Array.<CartItem> } items
//  *    Array of objects with complete data on products added to the cart
//  *
//  * @returns { Number }
//  *    Value of all items in the cart
//  *
//  */
// export const getTotalCartValue = (items = []) => {
//   let totalValue = 0;
//   items.map((item) => {
//     totalValue += item.cost * item.qty;
//   });
//   return totalValue;
// };

// /**
//  * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
//  *
//  * @param {Number} value
//  *    Current quantity of product in cart
//  *
//  * @param {Function} handleAdd
//  *    Handler function which adds 1 more of a product to cart
//  *
//  * @param {Function} handleDelete
//  *    Handler function which reduces the quantity of a product in cart by 1
//  *
//  *
//  */
// const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
//   return (
//     <Stack direction="row" alignItems="center">
//       <IconButton size="small" color="primary" onClick={handleDelete}>
//         <RemoveOutlined />
//       </IconButton>
//       <Box padding="0.5rem" data-testid="item-qty">
//         {value}
//       </Box>
//       <IconButton size="small" color="primary" onClick={handleAdd}>
//         <AddOutlined />
//       </IconButton>
//     </Stack>
//   );
// };

// /**
//  * Component to display the Cart view
//  *
//  * @param { Array.<Product> } products
//  *    Array of objects with complete data of all available products
//  *
//  * @param { Array.<Product> } items
//  *    Array of objects with complete data on products in cart
//  *
//  * @param {Function} handleDelete
//  *    Current quantity of product in cart
//  *
//  *
//  */
// const Cart = ({ products, items = [], handleQuantity }) => {
//   if (!items.length) {
//     return (
//       <Box className="cart empty">
//         <ShoppingCartOutlined className="empty-cart-icon" />
//         <Box color="#aaa" textAlign="center">
//           Cart is empty. Add more items to the cart to checkout.
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Box className="cart">
//         {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
//         {items.map((prod) => {
//           return (
//             <Box
//               display="flex"
//               alignItems="flex-start"
//               padding="1rem"
//               key={prod._id}
//             >
//               <Box className="image-container">
//                 <img
//                   // Add product image
//                   src={prod.image}
//                   // Add product name as alt eext
//                   alt={prod.name}
//                   width="100%"
//                   height="100%"
//                 />
//               </Box>
//               <Box
//                 display="flex"
//                 flexDirection="column"
//                 justifyContent="space-between"
//                 height="6rem"
//                 paddingX="1rem"
//               >
//                 <div>{prod.name}</div>
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                 >
//                   <ItemQuantity
//                     // Add required props by checking implementation
//                     value={prod.qty}
//                     handleAdd={() => {
//                       prod.qty++;
//                     }}
//                     handleDelete={() => {
//                       prod.qty--;
//                     }}
//                   />
//                   <Box padding="0.5rem" fontWeight="700">
//                     ${prod.cost}
//                   </Box>
//                 </Box>
//               </Box>
//             </Box>
//           );
//         })}
//         <Box
//           padding="1rem"
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Box color="#3C3C3C" alignSelf="center">
//             Order total
//           </Box>
//           <Box
//             color="#3C3C3C"
//             fontWeight="700"
//             fontSize="1.5rem"
//             alignSelf="center"
//             data-testid="cart-total"
//           >
//             ${getTotalCartValue(items)}
//           </Box>
//         </Box>

//         <Box display="flex" justifyContent="flex-end" className="cart-footer">
//           <Button
//             color="primary"
//             variant="contained"
//             startIcon={<ShoppingCart />}
//             className="checkout-btn"
//           >
//             Checkout
//           </Button>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default Cart;
// // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxMjM0NSIsImlhdCI6MTY1NjQ4Nzk1OSwiZXhwIjoxNjU2NTA5NTU5fQ.rnBtDHGfQtKgcGNO8qB_yBx9A9BMVzevWasVLp_TPZ4

// // upLK9JbQ4rMhTwt4
// // z4sLtEcMpzabRyfx

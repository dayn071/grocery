import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext()

export const AppContextProvider = ({children}) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})


    //fetch seller status(whether its login or not)
    const fetchSeller = async () => {
        try {
            const {data} = await axios.get('/api/seller/is-auth')
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }

    //fetch User Status(whether its login or not) and cart items
    const fetchUser = async () => {
    try {
        const {data} = await axios.get('/api/user/is-auth')
        if(data.success){
            setUser(data.user)
            setCartItems(data.user.cartItems)
        } else {
            setUser(null)
            toast.error(data.message)
        }
    } catch (error) {
        setUser(null)
        toast.error(error.message)
    }
}
    // fetch products
    const fetchProducts = async () => {
       try {
         const {data} = await axios.get('/api/product/list')
         if(data.success){
            setProducts(data.products)
         }else{
            toast.error(data.message);
         }
       } catch (error) {
        toast.error(error.message);
       }
    }

// Add items to cart
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems)
        if (cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1
        }
        setCartItems(cartData)
        toast.success('Item added successfully')
    }
// Update cart item quantity
const updateCartItem = (itemId,quantity) => {
    let cartData = structuredClone(cartItems)
    cartData[itemId] = quantity
    setCartItems(cartData)
    toast.success("Cart updated")
}

// Remove Item from cart
const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems)
    if (cartData[itemId]){
        cartData[itemId] -= 1;
        if(cartData[itemId] === 0){
            delete cartData[itemId];
        }
    }
    toast.success("Item removed successfully")
    setCartItems(cartData)
}

//    cart items count
  const getCartCount = () => {
    let totalCount = 0;
    for(const item in cartItems){
        totalCount += cartItems[item]
    }
    return totalCount;
  }
//   get cart total amount
  const getCartAmount = () => {
    let totalAmount =0
    for(const items in cartItems){
        let itemInfo =  products.find((product) => product._id === items)
        if(cartItems[items] > 0){
       totalAmount += itemInfo.offerPrice * cartItems[items]
        }
    }
    return Math.floor(totalAmount * 100) / 100
  }

  // Profile Pic upload handler
const handleProfilePicUpload = async (file) => {
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = async () => {
    try {
      const { data } = await axios.post("/api/user/upload-profile-pic", {
        _Id: user._id,
        image: reader.result
      });

      if (data.success) {
        setUser({ ...user, profilePic: data.profilePic });
        toast.success("Profile picture updated!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
};


  useEffect(() => {
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])

    
    useEffect(() => {
        const updateCart = async () => {
            try {
                const {data} = await axios.post('/api/cart/update', {cartItems})
                if(!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        
        if(user){
            updateCart()
        }
    },[cartItems])


    const currency = import.meta.env.VITE_CURRENCY


    const value = {navigate,user,setUser,isSeller,setIsSeller,showUserLogin, setShowUserLogin,products, currency,addToCart,
        updateCartItem,removeFromCart,cartItems, setCartItems, searchQuery, setSearchQuery,getCartAmount,getCartCount,axios
    ,fetchProducts, handleProfilePicUpload
    }
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext)
}
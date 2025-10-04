import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = useState(false)

    const {user, setUser,setShowUserLogin,navigate,searchQuery, setSearchQuery,getCartCount,
        axios, handleProfilePicUpload} = useAppContext()

    const logout = async () => {
       try {
        const {data} = await axios.get('/api/user/logout')
        if(data.success){
            toast.success(data.message)
            setUser(null)
            navigate('/')
        }else{
            toast.error(data.message)
        }
       } catch (error) {
        toast.error(error.message)
       }
    }
    useEffect(() => {
        if(searchQuery.length > 0){
            navigate('/products')}
    }, [searchQuery])
       
    
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <Link to="/" onClick={() => setOpen(false)}>
                <img src={assets.logo} alt="logo" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <Link to="/">Home</Link>
                <Link to="/products">All Products</Link>
                <Link to="/">Contact</Link>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt="search icon" className='w-4 h-4'/>
                </div>

                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart icon" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ?
                (<button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    Login 
                </button>):
                    <div className="relative group">
  {/* Hidden file input */}
  <input
    type="file"
    id="profilePicInput"
    style={{ display: "none" }}
    accept="image/*"
    onChange={(e) => handleProfilePicUpload(e.target.files[0])}
  />

  {/* Clickable image opens file picker */}
  <label htmlFor="profilePicInput">
    <img
      src={user?.profilePic || assets.profile_icon}
      alt="Profile"
      className="w-10 h-10 cursor-pointer rounded-full object-cover"
    />
  </label>

  <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow-border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
    <li
      onClick={() => navigate("my-orders")}
      className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
    >
      my orders
    </li>
    <li
      onClick={logout}
      className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
    >
      logout
    </li>
  </ul>
</div>
}
            </div>
            <div className='flex items-center gap-6 sm:hidden'>
                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart icon" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                {/* Menu Icon SVG */}
                <img src={assets.menu_icon} alt="menu icon" />
                </button>
            </div>
            

            {/* Mobile Menu */}
            {open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <Link to="/" className="block" onClick={() => setOpen(false)}>Home</Link>
                <Link to="/products" className="block" onClick={() => setOpen(false)}>All Products</Link>
                {user &&
                <Link to="/" className="block" onClick={() => setOpen(false)}>my orders</Link>
                }
                <Link to="/" className="block" onClick={() => setOpen(false)}>Contact</Link>
                {!user?<button onClick={() => {setOpen(false);
                    setShowUserLogin(true)}}
                    className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    Login
                </button>:
                <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                    logout
                </button>}
            </div>
        )}

        </nav>
  )
}

export default Navbar
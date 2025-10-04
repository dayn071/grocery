import jwt from 'jsonwebtoken'


//Login Seller : /api/seller/login
export const sellerLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
    if(email=== process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD){
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "7d"});
    res.cookie('sellerToken', token, {
            httpOnly:true ,  //prevent javascript to access cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookie over https
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection
            maxAge: 7*24*60*60*1000 //=7 days after cookie will be expired
        });
        return res.json({success:true, message:"Logged In"})
    }else{
        return res.json({success:false, message:"Invalid Credentials"})
    }
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:   error.message})
    }
}

//Seller Auth : /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
    try {
        return res.json({success:true})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, message:   error.message})
    }
}

//Logout Seller : /api/seller/logout

export const sellerLogout = async (req, res) => {
   try {
    res.clearCookie('sellerToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    return res.json({success:true, message:"Logged out"})
   } catch (error) {
     console.log(error.message)
        res.json({success:false, message: error.message})
   }
}

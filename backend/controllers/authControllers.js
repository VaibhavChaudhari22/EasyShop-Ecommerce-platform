const adminModel = require('../models/adminModel');
const { responseReturn  } = require('../utiles/response');
const bcrypt = require('bcryptjs'); // Fixed typo from bcrpty to bcrypt
const { createToken } = require('../utiles/tokenCreate');

class authControllers {
    admin_login = async (req, res) => {
        const { email, password } = req.body;
        console.log(req.body); // Log the incoming request data
        console.log("Email being searched for:", email); // Log the email being searched
        try {
            const admin = await adminModel.findOne({ email }).select('+password');
            console.log("Found admin:", admin); 
            if (!admin) { // Check if admin is found
                return responseReturn (res, 404, { error: "Email not Found" }); // Moved this check here
            }
            const match = await bcrypt.compare(password, admin.password); // Fixed bcrypt variable
            if (match) {
                const token = await createToken({
                    id: admin.id,
                    role: admin.role 
                });
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
                responseReturn (res, 200, { token, message: "Login Success" });
            } else {
                responseReturn (res, 401, { error: "Password Wrong" }); // Changed status to 401 for unauthorized
            }
        } catch (error) {
            responseReturn (res, 500, { error: error.message });
        }
    }

     // End Method 
     getUser = async (req, res) => {
        const {id, role} = req;
        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id)
                responseReturn(res, 200, {userInfo : user})
            }else {
                console.log('Seller Info')
            }
            
        } catch (error) {
            console.log(error.message)
        }
    } // End getUser Method 

}
module.exports = new authControllers();




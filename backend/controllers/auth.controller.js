import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
 
const loginUser = async (req, res) => {
  try{
    const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email });
  if (!user || !password) return res.status(400).json({ msg: "credentials required" });
  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  // Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token, user: { id: user._id, email: user.email } });
}catch(error){
    throw error;
}
};

export default loginUser;
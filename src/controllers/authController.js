import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Registrar usuario
export const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Verificar si ya existe un usuario con el mismo username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario con username, password y role
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'student',
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body; // Cambiado a 'username' en lugar de 'email'

  try {
    const user = await User.findOne({ username }); // Buscando por 'username' ya que no usas 'email'
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Crear token JWT con el rol
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Devolver el token y el rol del usuario
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      role: user.role // Incluir el rol del usuario en la respuesta
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Verificar el refresh token
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Crear un nuevo access token
      const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing token', error: error.message });
  }
};


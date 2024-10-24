import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Team from '../models/teamModel.js';
import generateInvitationCode from '../utils/generateCode.js';

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
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
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
      role: user.role
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

export const registerAndCreateTeam = async (req, res) => {
  const { username, password, role, teamName } = req.body;

  try {
    // Verificar si ya existe un usuario con el mismo username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'student',
    });

    await newUser.save();

    // Generar código de invitación
    const codeInvitation = generateInvitationCode();

    // Crear equipo y asignar al usuario como líder
    const newTeam = new Team({
      name: teamName,
      codeInvitation,
      leader: newUser._id,
      users: [newUser._id],
    });

    await newTeam.save();

    newUser.team = newTeam._id;
    newUser.isLeader = true;
    await newUser.save();

    res.status(201).json({
      message: 'User and team created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
      team: {
        id: newTeam._id,
        name: newTeam.name,
        codeInvitation: newTeam.codeInvitation,
        leader: newUser._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user and creating team', error: error.message });
  }
};



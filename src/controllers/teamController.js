import Team from '../models/teamModel.js';
import User from '../models/userModel.js';
import generateInvitationCode from '../utils/generateCode.js';

// Create team
export const createTeam = async (req, res) => {
  const { name, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already belongs to a team
    if (user.team) {
      return res.status(400).json({ message: 'User already belongs to a team.' });
    }

    // Generate invitation code
    const invitationCode = generateInvitationCode();

    // Create team and assign the user as the leader
    const newTeam = new Team({
      name,
      invitationCode,
      leader: user._id,
      users: [user._id],
    });

    await newTeam.save();

    // Update the user to be the leader and assign the team
    user.team = newTeam._id;
    user.isLeader = true;
    await user.save();

    res.status(201).json({
      message: 'Team created successfully',
      team: newTeam,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating team' });
  }
};

// Join a team
export const joinTeam = async (req, res) => {
  const { invitationCode, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already belongs to a team
    if (user.team) {
      return res.status(400).json({ message: 'User already belongs to a team.' });
    }

    // Find the team by invitation code
    const team = await Team.findOne({ invitationCode });
    if (!team) {
      return res.status(404).json({ message: 'Invalid invitation code' });
    }

    // Add the user to the team
    team.users.push(user._id);
    await team.save();

    // Assign the team to the user
    user.team = team._id;
    await user.save();

    res.status(200).json({ message: 'Successfully joined the team' });
  } catch (error) {
    res.status(500).json({ message: 'Error joining the team' });
  }
};

// Delete team (only leader can delete it)
export const deleteTeam = async (req, res) => {
  const { teamId, userId } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if the user is the leader of the team
    if (team.leader.toString() !== userId) {
      return res.status(403).json({ message: 'Only the leader can delete the team' });
    }

    // Delete the team
    await Team.findByIdAndDelete(teamId);

    // Remove team relationship from users
    await User.updateMany(
      { team: teamId },
      { $unset: { team: '' }, $set: { isLeader: false } }
    );

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting the team' });
  }
};
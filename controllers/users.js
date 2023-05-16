import User from "../models/User.js";

class UserController {
  //get
  getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { $inc: { viewedProfile: 1 } },
        { new: true }
      );
      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        friends: user.friends,
        picturePath: user.picturePath,
        viewedProfile: user.viewedProfile,
        createdAt: user.createdAt,
        occupation: user.occupation,
        location: user.location,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  getUserFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const friendsRes = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return {
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
          };
        }
      );
      res.status(200).json(friendsRes);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  //update
  addOrRemoveFriend = async (req, res) => {
    try {
      const { friendId } = req.body;
      const id = req.user.id;
      const user = await User.findById(id);
      if (id !== friendId) {
        if (user.friends.includes(friendId)) {
          user.friends = user.friends.filter((id) => id !== friendId);
          await user.save();
          res.status(200).json(user.friends);
        } else {
          user.friends.push(friendId);
          await user.save();
          res.status(200).json(user.friends);
        }
      } else {
        res.status(400).json({ message: "You can`t do this" });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
}
export const userController = new UserController();

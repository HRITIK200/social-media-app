import User from "../models/user.model.js";

export const followUnfollowUser = async (req, res) => {
  try {
    const userToModify = await User.findById(
      req.params.id
    );

    const currentUser = await User.findById(
      req.user._id
    );

    // Check user exists
    if (!userToModify || !currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent self-follow
    if (
      userToModify._id.toString() ===
      currentUser._id.toString()
    ) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    // Already following?
    const isFollowing =
      currentUser.following.includes(userToModify._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following =
        currentUser.following.filter(
          (id) =>
            id.toString() !==
            userToModify._id.toString()
        );

      userToModify.followers =
        userToModify.followers.filter(
          (id) =>
            id.toString() !==
            currentUser._id.toString()
        );

      await currentUser.save();
      await userToModify.save();

      return res.status(200).json({
        message: "User unfollowed",
      });
    } else {
      // Follow
      currentUser.following.push(
        userToModify._id
      );

      userToModify.followers.push(
        currentUser._id
      );

      await currentUser.save();
      await userToModify.save();

      return res.status(200).json({
        message: "User followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    })
      .select("-password")
      .limit(5);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
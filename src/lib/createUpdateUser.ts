import admin from 'firebase-admin';

import User from '../models/User';

const createUpdateUser = async (authToken: string) => {
  // Decodes the auth token
  const decodedAuthToken = await admin.auth().verifyIdToken(authToken);

  // Destructures the decoded auth token to get user details
  const { uid, name, picture, phoneNumber, email } = decodedAuthToken;

  // If it finds a user with that uid it updates their details
  const user = await User.findById(uid);
  if (user) {
    user.name = name;
    user.picture = picture;
    user.phoneNumber = phoneNumber;
    user.email = email;

    await user.save();
    return user;
  }

  // If no user with that uid exists it creates a new one
  const newUser = new User({
    _id: uid,
    name,
    picture,
    phoneNumber,
    email,
  });

  await newUser.save();
  return newUser;
};

export default createUpdateUser;

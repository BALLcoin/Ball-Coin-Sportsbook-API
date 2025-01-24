import admin from 'firebase-admin';
import User from '../models/User';

const createUpdateUser = async (authToken: string) => {
  // Decodes the auth token
  const decodedAuthToken = await admin.auth().verifyIdToken(authToken);

  // Destructures the decoded auth token to get user details
  const {uid, name, picture, phone_number, email} = decodedAuthToken;

  // If it finds a user with that uid it updates their details
  let user = await User.findById(uid);

  if (user) {
    user.name = name;
    user.picture = picture;
    user.phone_number = phone_number;
    user.email = email;

    await user.save();
    return user;
  }

  // If no user with that uid exists it creates a new one
  const newUser = new User({
    _id: uid,
    name,
    picture,
    phone_number,
    email,
  });

  await newUser.save();
  return newUser;
};

export default createUpdateUser;

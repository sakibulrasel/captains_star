const User = require('../model/users');

exports.getAllReferralFriends = async(req, res) => {
  try{
    console.log('asdfasfa');
    let user = await User.find({ referralCode: 'ref'+req.params.id });
    res.status(200).json({ users: user });
  }catch(err){
    res.status(500).json({ error: 'Error fetching users' });
  }
}

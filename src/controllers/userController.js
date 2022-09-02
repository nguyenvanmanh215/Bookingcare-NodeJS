import userService from '../services/userService'


let handlelogin = async (req, res) => {
  let email = req.body.email;
  console.log('your Email: ' + email)
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: 'Missing inputs paramater',
    })
  }

  let userData = await userService.handelUserLogin(email, password)
  return res.status(200).json({
   
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {}
    
  })
}
let handleGetAllUsers = async(req, res) => {
  let id = req.query.id;
  if(!id){
    return res.status(200).json({
      errCode:1,
      errMessage:'Missing required parameters',
      users: []
    })
  }
  let users = await userService.getAllUsers(id);
  return res.status(200).json({
    errCode:0,
    errMessage:'ok',
    users
  })
} 
let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body)
  return res.status(200).json(message);
}
let handleEditUser = async (req, res) => {
  let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
}
let handleDeleteUser = async (req, res) => {
  if(!req.body.id){
    return res.status(200).json({
      errCode:1,
      errMessage:"delete"
    })
  }
  let message = await userService.deleteUser(req.body.id)
  return res.status(200).json(message);
}
let getAllCode = async (req, res) => {
  try{
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data); 

  }catch(e){
    console.log('get all code error: ', e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from serve'
    })
  }
}
module.exports = {
  handlelogin: handlelogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser:handleEditUser,
  handleDeleteUser:handleDeleteUser,
  getAllCode:getAllCode,

}

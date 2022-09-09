import db from '../models/index'
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10)

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashpassword = await bcrypt.hashSync(password, salt)
      resolve(hashpassword)
    } catch (e) {
      reject(e)
    }
  })
}

let handelUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {}
      let isExist = await checkUserEmail(email)
      if (isExist) {
        let user = await db.User.findOne({
          attributes: [
            'id',
            'email',
            'roleId',
            'password',
            'firstName',
            'lastName',
          ],
          where: { email: email },
          raw: true,
        })
        if (user) {
          //   //compare password
          let check = await bcrypt.compareSync(password, user.password)
          if (check) {
            userData.errCode = 0
            userData.errMessage = 'ok'
            delete user.password
            userData.user = user
          } else {
            userData.errCode = 3
            userData.errMessage = 'wrong password'
          }
        } else {
          userData.errCode = 2
          userData.errMessage = 'User not found'
        }
      } else {
        //return error
        userData.errCode = 1
        userData.errMessage = `your's Email isn't exist in your system.Plz try other email!`
      }
      resolve(userData)
    } catch (e) {
      reject(e)
    }
  })
}

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      })
      if (user) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (e) {
      reject(e)
    }
  })
}

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = ''
      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password'],
          },
        })
      }
      if (userId && userId !== 'ALL') {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ['password'],
          },
        })
      }
      resolve(users)
    } catch (e) {
      reject(e)
    }
  })
}

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email
      let check = await checkUserEmail(data.email)
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: 'your email is already in used,plz try another email',
        })
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password)
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.avatar,
        })
        resolve({
          errCode: 0,
          message: 'ok',
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let foundUser = await db.User.findOne({
      where: { id: userId },
    })
    if (!foundUser) {
      resolve({
        errCode: 2,
        errMessage: 'the user is not exits',
      })
    }

    await db.User.destroy({
      where: { id: userId },
    })
    resolve({
      errCode: 0,
      message: 'người dùng đã được xóa!',
    })
  })
}
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        resolve({
          errCode: 2,
          errMessage: 'missing required parameter!',
        })
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      })
      if (user) {
        user.email = data.email
        user.firstName = data.firstName
        user.lastName = data.lastName
        user.address = data.address
        user.roleId = data.roleId
        user.positionId = data.positionId
        user.gender = data.gender
        user.phoneNumber = data.phoneNumber
        if (data.avatar) {
          user.image = data.avatar
        }
        await user.save()
        resolve({
          errCode: 0,
          message: 'cập nhật thông tin người dùng thành công!',
        })
      } else {
        resolve({
          errCode: 1,
          errMessage: 'không tìm thấy thông tin người dùng!',
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters !',
        })
      } else {
        let res = {}
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        })
        res.errCode = 0
        res.data = allcode
        resolve(res)
      }
    } catch (e) {
      reject(e)
    }
  })
}
module.exports = {
  handelUserLogin: handelUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
}

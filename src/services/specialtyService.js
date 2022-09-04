const db = require('../models')

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter!',
        })
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
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

module.exports = { createSpecialty: createSpecialty }

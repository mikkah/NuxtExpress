const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const schema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,
    birthdate: Date,
    status: String
  },
  {
    timestamps: true
  }
)

schema.plugin(mongoosePaginate)

const model = mongoose.model('Users', schema)
module.exports = model

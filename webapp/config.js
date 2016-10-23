if(process.env.NODE_ENV === 'production'){
  module.exports.domain = 'https://enghub.io';
} else {
  module.exports.domain = 'http://localhost:8000';
}

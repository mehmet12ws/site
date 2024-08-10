module.exports.encode = (str) => Buffer.from(str).toString('base64');
module.exports.decode = (str) => Buffer.from(str, 'base64').toString('utf8');

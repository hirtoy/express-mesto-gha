function validateUrl(url) {
  const regex = /^https?:\/\/(www)?(([a-z0-9]*\.)|([a-z0-9][a-z0-9-]*[a-z0-9]\.))+[a-z0-9]{2,}(:\d+)?(\/[a-z0-9$_.+!*'(),;:@&=-]+)+#?$/;
  if (regex.test(url)) {
    return url;
  }
  throw new Error('Невалидная ссылка');
}

module.exports = { validateUrl };
const crypto = require('crypto');
const AccessToken = require('./../modules/user/accessToken');
const RefreshToken = require('./../modules/user/refreshToken');
const moment = require('moment');
const userSch = require('../modules/user/userSchema');

module.exports = async (user, permissions, companyDetails) => {
  const {accessToken, refreshToken} = await getUniqueToken();
  const currentDate = moment();
  const accessTokenLifeTime = moment(currentDate).add(process.env.ACCESS_TOKEN_LIFETIME, 'd');
  const refreshTokenLifeTime = moment(currentDate).add(process.env.REFRESH_TOKEN_LIFETIME, 'd');
  const aToken = new AccessToken({
    access_token_id: accessToken,
    user_id: user._id,
    expires_at: accessTokenLifeTime,
  });
  await aToken.save();
  if (aToken) {
    const rToken = new RefreshToken({
      refresh_token_id: refreshToken,
      access_token_id: aToken.access_token_id,
      user_id: user._id,
      expires_at: refreshTokenLifeTime,
    });
    await userSch.findOneAndUpdate({_id: user._id}, {$set: {active: true}});
    if (rToken) {
      await rToken.save();
      return {
        user,
        permissions,
        companyDetails,
        access_token: aToken.access_token_id,
        refresh_token: rToken.refresh_token_id,
        expires_at: accessToken.expires_at,
        token_type: 'Bearer',
      };
    }
  }
};

/**
 */
const getUniqueToken = async () => {
  const accessToken = crypto.randomBytes(32).toString('hex');
  const refreshToken = crypto.randomBytes(32).toString('hex');
  const aToken = await AccessToken.findOne({access_token_id: accessToken});
  const rToken = await RefreshToken.findOne({refresh_token_id: refreshToken});
  if (!aToken && !rToken) {
    return {
      accessToken,
      refreshToken,
    };
  } else {
    getUniqueToken();
  }
};
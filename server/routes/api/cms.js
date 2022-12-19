const cmsModule = require('./../../modules/cms/cmsController');
const validate = require('./../../modules/cms/cmsValidation');
const roleValidation = require('./../../helper/roleValidationHelper');
const clientAuth = require('../../middleware/clientAuth');


module.exports = (router, passport) => {
  //@desc POST: post cms details
  router.post(
    "/admin/addCms",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    validate.validateInput,
    cmsModule.addCms
  );

  //@desc GET: get cms list
  router.get(
    "/admin/list/Cms",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    cmsModule.listCms
  );

  //@desc GET: get cms details
  router.get(
    "/admin/details/cms/:cms_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    cmsModule.cmsDetails
  );

  //@desc PATCH: update cms details
  router.patch(
    "/admin/update/cms/:cms_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    validate.validateInput,
    cmsModule.updateCmsDetails
  );

  //@desc PATCH: update cms details
  router.delete(
    "/admin/delete/cms/:cms_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin"]),
    cmsModule.deleteContent
  );

  //@desc GET: get cms list to common user
  router.get("/user/list/Cms", cmsModule.listCms);

  //@desc GET: get cms details to common user
  router.get("/user/details/cms/:cms_id", cmsModule.cmsDetails);
}
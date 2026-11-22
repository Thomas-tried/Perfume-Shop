import express from "express";
const routerAdmin = express.Router();
import shopController from "./controllers/shop.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

/** Shop owner */
routerAdmin.get("/", shopController.goHome);

routerAdmin
  .get("/login", shopController.getLogin)
  .post("/login", shopController.processLogin);

routerAdmin
  .get("/signup", shopController.getSignup)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    shopController.processSignup,
  );
routerAdmin.get("/logout", shopController.logout);
routerAdmin.get("/check-me", shopController.checkAuthSession);

/** Product (perfumes) */
routerAdmin.get(
  "/product/all",
  shopController.verifyShopOwner,
  productController.getAllProducts,
);
routerAdmin.post(
  "/product/create",
  shopController.verifyShopOwner,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct,
);
routerAdmin.post(
  "/product/:id",
  shopController.verifyShopOwner,
  productController.updateChosenProduct,
);

/** User */
routerAdmin.get(
  "/user/all",
  shopController.verifyShopOwner,
  shopController.getUsers,
);
routerAdmin.post(
  "/user/edit",
  shopController.verifyShopOwner,
  shopController.updateChosenUser,
);

export default routerAdmin;

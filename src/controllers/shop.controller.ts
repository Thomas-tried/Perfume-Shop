import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Members.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { alertRedirect } from "../libs/utils/alert";

const memberService = new MemberService();

const shopController: T = {};

/******************** goHome ************************/

shopController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (err) {
    console.log("ERROR, goHome:", err);
    res.redirect("/admin");
  }
};

/******************** getSignup ************************/

shopController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (err) {
    console.log("ERROR, getSignup:", err);
    res.redirect("/admin");
  }
};

/******************** getLogin ************************/

shopController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("ERROR, getLogin:", err);
    res.redirect("/admin");
  }
};

/******************** processSignup ************************/

shopController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    const file = req.file;
    if (!file) throw new Errors(HttpCode.BAD_REQUEST, Message.IMAGE_REQUIRED);

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path;
    newMember.memberType = MemberType.SHOP_OWNER;
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("ERROR, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(alertRedirect(message, "/admin/signup", "error", "Signup failed"));
  }
};

/******************** processLogin ************************/

shopController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");

    const input: LoginInput = req.body;
    const result = await memberService.processLogin(input);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(alertRedirect(message, "/admin/login", "error", "Login failed"));
  }
};

/******************** logout ************************/

shopController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, logout:", err);
    res.redirect("/admin");
  }
};

/******************** getUsers ************************/

shopController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await memberService.getUsers();
    res.render("users", { users: result });
  } catch (err) {
    console.log("ERROR, getUsers:", err);
    res.redirect("/admin/login");
  }
};

/******************** updateChosenUser ************************/

shopController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser");
    const result = await memberService.updateChosenUser(req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("ERROR, updateChosenUser:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/******************** checkAuthSession ************************/

shopController.checkAuthSession = async (req: AdminRequest, res: Response) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member)
      res.send(
        alertRedirect(
          `Logged in as ${req.session.member.memberNick}`,
          "/admin",
          "info",
          "Session",
        ),
      );
    else
      res.send(
        alertRedirect(Message.NOT_AUTHENTICATED, "/admin/login", "warning"),
      );
  } catch (err) {
    console.log("Error, checkAuthSession:", err);
    res.redirect("/admin");
  }
};

/******************** verifyShopOwner ************************/

shopController.verifyShopOwner = (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.session?.member?.memberType === MemberType.SHOP_OWNER) {
    req.member = req.session.member;
    next();
  } else {
    res.send(
      alertRedirect(Message.NOT_AUTHENTICATED, "/admin/login", "warning"),
    );
  }
};

export default shopController;

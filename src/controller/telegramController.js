const { Telegraf, Extra } = require("telegraf");
import botTelegramService from "../services/botTelegramService";
import constant from "../constant/constant.js";
import helpers from "../helper/botHelpers";
const moment = require("moment");
const path = require("path");
const cron = require("node-cron");
const fs = require("fs");
require("dotenv").config();

const botTelegram = async (app) => {
  let isFetchingData = true;
  const bot = new Telegraf(process.env.BOT_TOKEN);

  const helpMessage = `
      Vui lòng soạn đúng cú pháp
    `;

  const helpAdmin = `
        /testform dùng để test form
  `;

  try {
    bot.use(async (ctx, next) => {
      // ctx.reply('U use bot');
      try {
        console.log("bot đã hoạt động");
        console.log("check group ID livestream", ctx);
        console.log("check ctx chat id", ctx.chat);

        if (isFetchingData) {
         
          if (!ctx?.message?.text) {
            isFetchingData = true;
            return;
          }

          if (ctx.update.message && ctx.update.message.new_chat_members) {
            for (let member of ctx.update.message.new_chat_members) {
              await ctx.reply(
                `Chào mừng thầy ${member.first_name} đến với nhóm! \n ${helpMessage}`
              );
              return;
            }
          }
          let input = ctx.message?.text?.split(" ");

          const checkNull = input[0]?.trim();
          console.log("check giá trị vào", checkNull);
          if (!checkNull) {
            await ctx.reply(helpMessage);
            isFetchingData = true;
            return;
          }

          await next(ctx); // nếu middleware thì cần await next trong mỗi ràng buộc
        }
      } catch (e) {
        console.log("check error", e);
        await ctx.reply(
          "Lỗi server bot, hãy liên hệ Khả Vy để được fix sớm nhất"
        );
        isFetchingData = true;
        return;
      }
    });

    bot.command("/addhv", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });

    bot.command("/removehv", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });

    bot.command("/deleteFile", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });

    bot.command("/createFile", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });

    bot.command("/autoReplace", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });

    bot.command("/autoInstall", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });

    bot.command("help", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });
  } catch (e) {
    // Gửi một tin nhắn
    bot.telegram
      .sendMessage(
        process.env.id_groupNLTB,
        "Lỗi nghiêm trọng, vui lòng đợi trong giây lát"
      )
      .then(() => {
        console.log("Đã gửi tin nhắn thành công");
      })
      .catch((error) => {
        console.log("Lỗi khi gửi tin nhắn:", error);
      });
    isFetchingData = true;
  }

  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
export default botTelegram;

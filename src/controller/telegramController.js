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

    bot.command("addhv", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        // if (ctx.update.message.from.id != process.env.id_admin) {
        //   await ctx.reply(
        //     "Tính năng này chỉ dành cho Admin. Hãy liên hệ Admin để truy cập kiểm tra."
        //   );
        //   isFetchingData = true;
        //   return;
        // }
        const input = ctx.message.text
          .replace(/^\/\S+/, "")
          .trim()
          .split(" ");
        console.log("input", input);
        if (!input) {
          await ctx.reply(helpMessage);
          isFetchingData = true;
          return;
        }

        const mhv = input[0]?.trim();
        if (!constant.regexMHV.test(mhv)) {
          await ctx.replyWithHTML(
            "<b>Bạn hãy coppy toàn bộ mã học viên trong /dat. Ví dụ cú pháp : /addhv 52001-12345678-123456</b>"
          );
          isFetchingData = true;
          return;
        }
        const notime = input.length == 2 ? input[1]?.trim() : null;
        const dataAdd = notime ? `\n${mhv},notime` : `\n${mhv}`;
        const getDataLink = await helpers.getDataInFileText(constant?.linkF);
        if (getDataLink && getDataLink.length) {
          const data = await helpers.getDataInFileText(getDataLink[0].trim());
          console.log("check data", data);
          if (data && data.length) {
            for (const e of data) {
              const dataInLine = e.split(",");
              if (dataInLine[0].trim() == mhv) {
                await ctx.replyWithHTML("Thông tin học viên trùng");
                isFetchingData = true;
                return;
              }
            }
            await fs.appendFile(getDataLink[0].trim(), dataAdd, async (err) => {
              if (err) {
                await ctx.replyWithHTML("Lỗi khi ghi thêm dữ liệu vào file");
              } else {
                await ctx.replyWithHTML("Ghi thông tin thành công");
              }
            });
          } else {
            await ctx.replyWithHTML("file dữ liệu trống");
          }
        } else {
          await ctx.replyWithHTML("File Link dữ liệu không tồn tại");
        }
      }
      isFetchingData = true;
      return;
    });

    bot.command("removehv", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        // if (ctx.update.message.from.id != process.env.id_admin) {
        //   await ctx.reply(
        //     "Tính năng này chỉ dành cho Admin. Hãy liên hệ Admin để truy cập kiểm tra."
        //   );
        //   isFetchingData = true;
        //   return;
        // }
        const input = ctx.message.text
          .replace(/^\/\S+/, "")
          .trim()
          .split(" ");
        console.log("input", input);
        if (!input) {
          await ctx.reply(helpMessage);
          isFetchingData = true;
          return;
        }

        const mhv = input[0]?.trim();
        if (!constant.regexMHV.test(mhv)) {
          await ctx.replyWithHTML(
            "<b>Bạn hãy coppy toàn bộ mã học viên trong /dat. Ví dụ cú pháp : /removehv 52001-12345678-123456</b>"
          );
          isFetchingData = true;
          return;
        }

        const getDataLink = await helpers.getDataInFileText(constant?.linkF);
        if (getDataLink && getDataLink.length) {
          const data = await helpers.getDataInFileText(getDataLink[0].trim());
          console.log("check data", data);
          if (data && data.length) {
            // Đọc nội dung của file
            await fs.readFile(
              getDataLink[0].trim(),
              "utf8",
              async (err, data) => {
                if (err) {
                  await ctx.replyWithHTML("Lỗi đọc file");
                  isFetchingData = true;
                  return;
                }

                // Tách nội dung thành các dòng
                const lines = data.split("\n");

                // Lọc ra các dòng không chứa chuỗi cần tìm kiếm
                const filteredLines = lines.filter(
                  (line) => !line.includes(mhv)
                );

                // Ghi lại nội dung mới vào file
                await fs.writeFile(
                  getDataLink[0].trim(),
                  filteredLines.join("\n"),
                  "utf8",
                  async (err) => {
                    if (err) {
                      await ctx.replyWithHTML("Xóa dữ liệu thất bại");
                    } else {
                      await ctx.replyWithHTML("Xóa dữ liệu thành công");
                    }
                  }
                );
              }
            );
          } else {
            console.log("file dữ liệu trống");
            await ctx.replyWithHTML("file dữ liệu trống");
          }
        } else {
          await ctx.replyWithHTML("File Link dữ liệu không tồn tại");
        }
      }
      isFetchingData = true;
      return;
    });

    bot.command("deletefile", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        // if (ctx.update.message.from.id != process.env.id_admin) {
        //   await ctx.reply(
        //     "Tính năng này chỉ dành cho Admin. Hãy liên hệ Admin để truy cập kiểm tra."
        //   );
        //   isFetchingData = true;
        //   return;
        // }
        const getDataLink = await helpers.getDataInFileText(constant?.linkF);
        if (getDataLink && getDataLink.length) {
          const data = await helpers.getDataInFileText(getDataLink[0].trim());
          console.log("check data", data);
          if (data && data.length) {
            // Ghi nội dung mới vào file
            await fs.truncate(getDataLink[0].trim(), 0, async (err) => {
              if (err) {
                await ctx.replyWithHTML("Xóa dữ liệu toàn bộ file thất bại");
              } else {
                await ctx.replyWithHTML("Xóa dữ liệu toàn bộ file thành công");
              }
            });
          } else {
            console.log("file dữ liệu trống");
            await ctx.replyWithHTML("file dữ liệu trống");
          }
        } else {
          await ctx.replyWithHTML("File Link dữ liệu không tồn tại");
        }
      }
      isFetchingData = true;
      return;
    });

    bot.command("createFile", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });

    bot.command("autoReplace", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });

    bot.command("autoInstall", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await ctx.reply(helpMessage);
        isFetchingData = true;
        return;
      }
      isFetchingData = true;
      return;
    });

    bot.command("quit", async (ctx) => {
      if (isFetchingData) {
        isFetchingData = false;
        await botTelegramService.turnOffVs();
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

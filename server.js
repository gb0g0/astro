const app = require("express")(); // For creating the server
const {
  Telegraf,
  session,
  Scenes: { Stage, WizardScene },
} = require("telegraf");
const dotenv = require("dotenv"); // For reading the .env file
dotenv.config({ path: "./config.env" }); // For reading the .env file
const bot = new Telegraf(process.env.BOT_TOKEN);
const twitter = require("./utils/twitter.js");
// const supabase = require("./utils/supabase.js");

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey);

let referral;

const applyForAirdrop = new WizardScene(
  "apply for airdrop",
  async (ctx) => {
    await ctx.replyWithHTML(
      `Hey ${ctx.chat.username}, Welcome again to <b>Astro Airdrop Bot</b>.\nComplete all steps to be eligbe.\nNote all information you provide will be verified manually`
    );
    await ctx.replyWithHTML(
      "Step 1: \n\nClick on the Link below to follow <b>Astro</b> on X (fka Twitter). \n\nFollow Astro: 👇 \nhttps://twitter.com/Astroecosystem",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Done ✅",
                callback_data: "Next",
              },
              {
                text: "Restart 🔁",
                callback_data: "Restart",
              },
            ],
          ],
        },
      }
    );
    ctx.wizard.cursor = 0;
    return ctx.wizard.next();
  },
  async (ctx, rs = false) => {
    if (rs == true) {
      //   ctx.answerCbQuery();
      ctx.reply("Please provide your X (fka Twitter) username:");
      ctx.wizard.cursor = 1;
      return ctx.wizard.next();
    } else {
      if (ctx.callbackQuery == undefined) {
        await ctx.reply("Incorrect input");
        await ctx.scene.leave();
        await ctx.scene.enter("apply for airdrop");
      } else if (ctx.callbackQuery.data == "Restart") {
        await ctx.reply("Restarting.....");
        await ctx.scene.leave();
        await ctx.scene.enter("apply for airdrop");
      } else if (ctx.callbackQuery.data == "Next") {
        ctx.answerCbQuery();
        ctx.reply("Please provide your X (fka Twitter) username:\n\nwithout @");
        ctx.wizard.cursor = 1;
        return ctx.wizard.next();
      }
    }
  },
  async (ctx) => {
    if (ctx.message.text) {
      const twitterUsername = ctx.message.text;
      ctx.wizard.state.twitterUsername = twitterUsername;
      await ctx.reply(`Your X (fka Twitter) Username is: ${twitterUsername}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Continue ✅",
                callback_data: "Continue",
              },
              {
                text: "Change ⚠",
                callback_data: "Change",
              },
            ],
          ],
        },
      });
      ctx.wizard.cursor = 2;
      return ctx.wizard.next();
    }
  },
  async (ctx, rs = false) => {
    const reply = () => {
      ctx.reply(
        "Step 2: \n\nClick on the Link below to Join Astro Telegram Group. \n\nJoin Telegram Group: 👇 \nhttps://t.me/Astrobrandglobalworldwide",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Done ✅",
                  callback_data: "Next",
                },
                {
                  text: "👈 Back",
                  callback_data: "Back",
                },
              ],
            ],
          },
        }
      );
    };
    if (rs == true) {
      await ctx.reply("Wrong Input ... ❌");
      reply();
      ctx.wizard.cursor = 3;
      return ctx.wizard.next();
    } else {
      if (ctx.callbackQuery == undefined) {
        await ctx.reply("Wrong Input...❌");
        return ctx.wizard.steps[1](ctx, true);
      } else if (ctx.callbackQuery.data == "Change") {
        return ctx.wizard.steps[1](ctx, true);
      } else {
        reply();
        ctx.wizard.cursor = 3;
        return ctx.wizard.next();
      }
    }

    // }
  },
  async (ctx, rs = false) => {
    if (ctx.callbackQuery == undefined) {
      return ctx.wizard.steps[3](ctx, true);
    } else if (ctx.callbackQuery.data == "Next") {
      ctx.answerCbQuery();
      ctx.replyWithHTML(
        "Step 3: \n\nClick on the Link below to Signup on Astro's Website as an affiliate \n\nSignup Here: 👇 \n<a href='https://astrobuxcoin.com/?ref=gbogo'>https://astrobuxcoin.com/</a>\n\nAfter then go to <b>REFERRAL PROGRAM</b> section to signup",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Done ✅",
                  callback_data: "Next",
                },
                {
                  text: "👈 Back",
                  callback_data: "Back",
                },
              ],
            ],
          },
        }
      );

      ctx.wizard.cursor = 4;
      return ctx.wizard.next();
    } else {
      ctx.answerCbQuery();

      return ctx.wizard.steps[0](ctx);
    }
  },
  async (ctx) => {
    if (ctx.callbackQuery == undefined) {
      await ctx.reply("Incorrect input");
      return ctx.wizard.steps[4](ctx);
    } else if (ctx.callbackQuery.data == "Back") {
      ctx.answerCbQuery();
      return ctx.wizard.steps[3](ctx);
    } else {
      ctx.answerCbQuery();
      ctx.reply("Please provide your Astro Username:");
      ctx.wizard.cursor = 5;
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (ctx.message.text) {
      const socratesId = ctx.message.text;
      ctx.wizard.state.socratesId = socratesId;
      await ctx.reply(`Your Astro Username is: ${socratesId}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Continue ✅",
                callback_data: "Continue",
              },
              {
                text: "Change ⚠",
                callback_data: "Change",
              },
            ],
          ],
        },
      });
      ctx.wizard.cursor = 6;
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    ctx.reply(
      "Step 4: \n\nThe Astro bux token is on the Cardano blockchain, so you may want to install a compatible wallet. \n\nInstall Yoroi - Light Wallet for Cardano\nhttps://yoroi-wallet.com/\n\nIf you already have it installed ignore.",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Done ✅",
                callback_data: "Next",
              },
              {
                text: "👈 Back",
                callback_data: "Back",
              },
            ],
          ],
        },
      }
    );
    ctx.wizard.cursor = 7;
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.callbackQuery == undefined) {
      await ctx.reply("Incorrect input");
      return ctx.wizard.steps[7](ctx);
    } else if (ctx.callbackQuery.data == "Back") {
      ctx.answerCbQuery();
      return ctx.wizard.steps[5](ctx);
    } else {
      ctx.answerCbQuery();
      ctx.reply(
        "Please provide your Email address:\n\nThis will be used to contact you later!"
      );
      ctx.wizard.cursor = 8;
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx.message.text.includes("@")) {
      await ctx.reply("Invalid Email Address");
      return ctx.wizard.steps[7](ctx);
    } else if (ctx.message.text) {
      const email = ctx.message.text;
      ctx.wizard.state.email = email;
      await ctx.reply(`Your Email is: ${email}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Continue ✅",
                callback_data: "Continue",
              },
              {
                text: "Change ⚠",
                callback_data: "Change",
              },
            ],
          ],
        },
      });
      ctx.wizard.cursor = 9;
      return ctx.wizard.next();
    }
  },

  async (ctx, rs = false) => {
    const reply = () => {
      ctx.reply(
        "Woohoo 🎉🥳, You are almost there \n\nPlease provide your Yoroi wallet address:"
      );
    };
    if (rs == true) {
      //   ctx.answerCbQuery();
      reply();
      ctx.wizard.cursor = 10;
      return ctx.wizard.next();
    } else {
      if (ctx.callbackQuery == undefined) {
        await ctx.reply("Incorrect input");
        return ctx.wizard.steps[9](ctx);
      } else if (ctx.callbackQuery.data == "Change") {
        return ctx.wizard.steps[8](ctx);
      } else {
        ctx.answerCbQuery();
        reply();
        ctx.wizard.cursor = 10;
        return ctx.wizard.next();
      }
    }
  },
  async (ctx) => {
    if (!ctx.message.text.includes("addr")) {
      await ctx.reply("Invalid Address");
      return ctx.wizard.steps[10](ctx, true);
    } else if (ctx.message.text) {
      const wallet = ctx.message.text;
      ctx.wizard.state.wallet = wallet;
      await ctx.reply(`Your Yoroi Wallet is: ${wallet}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Continue ✅",
                callback_data: "Continue",
              },
              {
                text: "Change ⚠",
                callback_data: "Change",
              },
            ],
          ],
        },
      });
      ctx.wizard.cursor = 11;
      return ctx.wizard.next();
    } else {
      await ctx.reply("Invalid input");
      return ctx.wizard.steps[10](ctx, true);
    }
  },
  async (ctx) => {
    const chat_id = ctx.chat.id;
    const user_name = ctx.chat.username;
    const twitter_handle = ctx.wizard.state.twitterUsername;
    const email_address = ctx.wizard.state.email;
    const wallet = ctx.wizard.state.wallet;
    const astro_id = ctx.wizard.state.socratesId;
    const code = referral;

    if (ctx.callbackQuery == undefined) {
      ctx.answerCbQuery();
      ctx.reply("Wrong Input.....");
      return ctx.wizard.steps[10](ctx);
    } else if (ctx.callbackQuery.data == "Change") {
      return ctx.wizard.steps[10](ctx);
    } else {
      ctx.answerCbQuery();

      const { data, error } = await supabase.from("user").insert([
        {
          chat_id,
          user_name,
          twitter_handle,
          wallet,
          email_address,
          astro_id,
        },
      ]);

      const { data: referralData, error: referralError } = await supabase
        .from("user")
        .select()
        .eq("chat_id", code);

      if (error) {
        console.log(error);
        ctx.reply("An error occured 😔, Please try again 🔁");
        await ctx.scene.leave();
        await ctx.scene.enter("apply for airdrop");
      } else {
        if (referralData != null) {
          const message = `ℹ You just Referred @${ctx.chat.username}\nYou Earned 500ABC = $1 🥳`;
          const ABC = referralData[0].ABC + 500;
          const referral_count = referralData[0].referral_count + 1;
          const { data, error } = await supabase
            .from("user")
            .update({ referral_count, ABC })
            .eq("chat_id", referralData[0].chat_id)
            .select();
          await bot.telegram.sendMessage(referralData[0].chat_id, message);
        }
        await ctx.reply(
          "Woohoo 🎉🥳,\nYou have been added to the list! 📝✅ \n\nWe will verifiy your information and get back to you \n\nAirdrop completed ✅: \n• Enter the drop telegram bot ✅ \n• Follow Astro social media ✅ \n• Register and Submit your wallet ✅\n\nGo to /profile to see your info"
        );

        // await ctx.reply(
        //   `Your Information: \n\n Username:${user_name} \n X handle: ${twitter_handle} \n Email address: ${email_address} \n Wallet: ${wallet}`
        // );
        ctx.scene.leave();
      }
    }
  }
);

// const menu = new WizardScene("menu options", async (ctx) => {
//   await ctx.reply(
//     "hey"

//   );
//   //   ctx.wizard.cursor = 0;
//   //   return ctx.wizard.next();
// });

session({
  property: "chatSession",
  getSessionKey: (ctx) => ctx.chat && ctx.chat.id,
});
bot.use(session());

const stage = new Stage([applyForAirdrop], { sessionName: "chatSession" });
bot.use(stage.middleware());
stage.register(applyForAirdrop);

// const menus = new Stage([menu], { sessionName: "chatSession" });
// bot.use(menus.middleware());
// menus.register(menu);

bot.command("start", async (ctx) => {
  const chat_id = ctx.chat.id;
  const referral_code = ctx.payload;
  const code = referral_code.replace(/r/g, "");
  const { data: userData, error } = await supabase
    .from("user")
    .select()
    .eq("chat_id", chat_id);
  if (userData.length == 0) {
    const { data: referralData, error } = await supabase
      .from("user")
      .select()
      .eq("chat_id", code);
    if (referralData != null) {
      await ctx.reply(`ℹ Referred by ${referralData[0].user_name}`);
      referral = code;
    }
    await ctx.scene.enter("apply for airdrop");
  } else {
    await ctx.reply(
      "We will verifiy your information and get back to you \n\nAirdrop completed ✅: \n• Enter the drop telegram bot ✅ \n• Follow Astro social media ✅ \n• Register and Submit your wallet ✅\n\nGo to /profile to see your info"
    );
  }
});
bot.command("profile", async (ctx) => {
  const chat_id = ctx.chat.id;

  const { data, error } = await supabase
    .from("user")
    .select()
    .eq("chat_id", chat_id)
    .single();
  console.log(data);
  if (data != null) {
    ctx.replyWithHTML(
      `<b>My Profile 🏆</b>\n\n$ABC Balance: ${data.ABC}ABC = $${
        data.ABC * 0.002
      }\n\nName: ${data.user_name}\nTwitter: ${data.twitter_handle}\nEmail: ${
        data.email_address
      }\nAstro id: ${data.astro_id}\nWallet:${
        data.wallet
      }\n\n<b>Referral</b>\nNo of Referrals: ${
        data.referral_count
      }\nReferral Code: https://t.me/astrobuxbot?start=r${
        data.chat_id
      }\n<i>Refer more friends and earn 500ABC = $1</i>`
    );
  } else {
    await ctx.scene.enter("apply for airdrop");
  }
});

bot.command("listingproof", async (ctx) => {
  const Bitmart =
    "https://ymdgochptxxzgedhddid.supabase.co/storage/v1/object/public/Astro/BitMart%20-%20Token%20Listing%20Agreement%20Addendum%20-%20ABC%202023%20SIGNED.pdf";
  const Coinstore =
    "https://ymdgochptxxzgedhddid.supabase.co/storage/v1/object/public/Astro/Coinstore%20Listing%20Agreement_ASTROBUX.docx.pdf";
  ctx.replyWithHTML("ℹ Here are the <b>Proof that we are Listing!!!🥳🎉</b> ⬇");
  ctx.replyWithDocument(Bitmart);
  ctx.replyWithDocument(Coinstore);
});
bot.launch();
// app.listen(3000, () => {
//   console.log("listening at 3000");
// });

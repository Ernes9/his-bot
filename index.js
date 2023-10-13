require("dotenv").config();
const Discord = require("discord.js");

const token = process.env.DISCORD_TOKEN;

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS],
});

client.once("ready", () => {
  console.log("¡El bot está en línea!");
});

client.on("guildMemberAdd", (member) => {
  const channelId = "1162515591073103896";
  const channel = member.guild.channels.cache.get(channelId); // El canal por defecto del servidor, usualmente #general o el primer canal.
  if (!channel) return; // Si no hay canal para enviar el mensaje, simplemente retornamos.
  channel.send(`¡Bienvenido, ${member}!`);
});

client.login(token);

import dotenv from "dotenv";

dotenv.config();

import { generarMensaje, resultados } from "./mensaje.js";
import { Client, Intents } from "discord.js";
import schedule from "node-schedule";
import moment from "moment-timezone";

const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
  ],
});

client.once("ready", () => {
  console.log("¡El bot está en línea!");

  const channelId = "1162515591073103896"; // Reemplaza con la ID de tu canal
  const channel = client.channels.cache.get(channelId);

  // Calcular el próximo momento a las 6 pm hora Argentina
  const next1730pm = moment
    .tz("America/Argentina/Buenos_Aires")
    .startOf("day")
    .add(17, "hours")
    .add(30, "minutes");
  if (moment.tz("America/Argentina/Buenos_Aires").isAfter(next1730pm)) {
    next1730pm.add(1, "day");
  }

  // Programa un mensaje para las 17 30 pm hora Argentina todos los días
  schedule.scheduleJob(next1730pm.toDate(), function () {
    const dayOfWeek = moment.tz("America/Argentina/Buenos_Aires").day();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      if (channel) channel.send(generarMensaje(resultados));
    }
  });

  const next14pm = moment
    .tz("America/Argentina/Buenos_Aires")
    .startOf("day")
    .add(14, "hours");
  if (moment.tz("America/Argentina/Buenos_Aires").isAfter(next14pm)) {
    next14pm.add(1, "day");
  }
  schedule.scheduleJob(next14pm.toDate(), function () {
    const dayOfWeek = moment.tz("America/Argentina/Buenos_Aires").day();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      if (channel)
        channel.send(`
        **Buenas @everyone!** Recuerden que si tuvieron alguna win deben comentarla en este canal :money_with_wings:
  
      Muchas gracias :ninja: 
      `);
    }
  });
});

client.on("guildMemberAdd", (member) => {
  const channelId = "1162515591073103896";
  const channel = member.guild.channels.cache.get(channelId); // El canal por defecto del servidor, usualmente #general o el primer canal.
  if (!channel) return; // Si no hay canal para enviar el mensaje, simplemente retornamos.
  channel.send(`
  :wave: **¡Hola ${member}!** ¡Bienvenido a la comunidad **HIS Academy Setters**! :ninja:
  
  :point_right: **Antes de empezar, te pedimos:**
  - Poner tu nombre y apellido.
  - Tener una foto con tu cara.
  - Dirigirte al canal de introducción y ver el primer video.
  
  :money_with_wings: **¡Exitoss!** :money_with_wings: 
  `);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!duda") {
    // Puedes cambiar '!authorize' por el comando que prefieras.
    const authURL = process.env.URL;
    await message.channel.send(
      `${message.author}, te envié un mensaje por privado!`
    );
    await message.author.send(`
:raised_hands: **¡Buenass!** :raised_hands:

:point_right: **¿Dudas sobre el Onboarding?**
- Puedes revisar nuestras **Preguntas Frecuentes** aquí: 
<https://www.google.com> :link: 

:point_right: **¿No encontraste lo que buscabas?**
- Agenda una llamada :telephone_receiver: con un miembro del staff:
<https://calendly.com/ignacio-high-income-skills-academy/onboarding-call> :calendar: 
`);
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === "!bienvenida") {
    // Puedes cambiar '!authorize' por el comando que prefieras.
    const authURL = process.env.URL;
    await message.channel.send(`
:wave: **¡Hola ${message.author}!** ¡Bienvenido a la comunidad **HIS Academy Setters**! :ninja:

:point_right: **Antes de empezar, te pedimos:**
- Poner tu nombre y apellido.
- Tener una foto con tu cara.
- Dirigirte al canal de introducción y ver el primer video.

:money_with_wings: **¡Exitoss!** :money_with_wings: 
`);
  }
});

client.login(token);

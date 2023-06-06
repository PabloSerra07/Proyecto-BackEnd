import nodemailer from "nodemailer";
import { logger } from "../config/winston_config.js";
import {
  smtp_port,
  admin_email,
  admin_password,
} from "../config/dotenv_config.js";

let transporter = nodemailer.createTransport({
  service: "gmail",
  port: smtp_port,
  auth: {
    user: admin_email,
    pass: admin_password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function Email_NewUser(user) {
  try {
    let html = `
            <div>
                <h2><strong>Nuevo usuario</strong></h2>
                <p style="text-decoration: underline;">Nuevo usuario registrado en E-commerce - Backend - coderhouse</p>
                <ul>
                    <li>Email del usuario: <strong>${user.email}</strong></li>
                    <li>Nombre del usuario: <strong>${user.username}</strong></li>
                    <li>Edad del usuario: <strong>${user.age}</strong></li>
                    <li>Dirección del usuario: <strong>${user.address}</strong></li>
                </ul>
            </div>
        `;

    const mailOptions = {
      from: `Sistema de registro - E-commerce <${admin_email}>`,
      to: admin_email,
      subject: "Aviso de nuevo usuario registrado",
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(
      `Error al enviar notificación (EMAIL) de nuevo registro: ${error}`
    );
  }
}

export async function Email_NewOrder(user, cart, orderID, orderTotal) {
  try {
    const prodList = `${cart.products
      .map(
        (prod) => `<li>${prod.brand} ${prod.title} | u$s ${prod.price} </li>`
      )
      .join("")}`;

    let html = `
        <div>
            <h2><strong>Nueva orden de compra</strong></h2>
            <p style="text-decoration: underline;">Nueva orden de compra en E-commerce - Backend - coderhouse</p>
            <p>Usuario:</p> 
            <ul>
                <li>${user.username}</li>
                <li>${user.age}</li>
                <li>${user.email}</li>
                <li>${user.phone_number}</li>
                <li>${user.address}</li>
                <li>ID de carrito: ${user.cartID}</li>
            </ul>
            <p>Cantidad de productos: ${cart.products.length}</p>
            <p>Total: u$s ${orderTotal}</p>
            <p>N° orden: ${orderID}</p>
            <ul>${prodList}</ul>
        </div>
    `;

    const mailOptions = {
      from: `Sistema de ordenes - E-commerce <${admin_email}>`,
      to: admin_email,
      subject: `Nueva orden de compra de usuario: ${user.username} <${user.email}>`,
      html: html,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    logger.error(
      `Error al enviar notificación (EMAIL) de nueva orden: ${error}`
    );
  }
}

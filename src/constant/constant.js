require("dotenv").config();

const config = {
  user: process.env.usernameDTB,
  password: process.env.passwordDTB,
  server: process.env.servernameDTB,
  database: process.env.databaseDTB,
  port: parseInt(process.env.portDTB),
  options: {
    encrypt: false, // Sử dụng giao thức không bảo mật (plaintext)
  },
};

const configLT = {
  user: process.env.usernameDTB_LT,
  password: process.env.passwordDTB_LT,
  server: process.env.servernameDTB_LT,
  database: process.env.databaseDTB_LT,
  port: parseInt(process.env.portDTB_LT),
  options: {
    encrypt: false, // Sử dụng giao thức không bảo mật (plaintext)
  },
};

const arrIPChildCpt = []

const linkF = `C:\\Users\\Admin\\Desktop\\Hkremote-master\\linkF\\linkF.txt`;

const regexMHV = /^\d{5}-\d{8}-\d{6}$/;

const regexLinkData = /^\\\\\d{1,3}(\.\d{1,3}){3}\\[^\\]+\\[^\\]+$/

module.exports = {
  config,
  configLT,
  arrIPChildCpt,
  linkF,
  regexMHV,
 regexLinkData

};

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSetup = require("../swagger.json");
const docentesRoutes = require("./routes/docentesRoutes");
const discentesRoutes = require("./routes/discentesRoutes");
const taeRoutes = require("./routes/taeRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const secretariaRoutes = require("./routes/secretariaRoutes");
const comissaoRoutes = require("./routes/comissaoRoutes");
const disciplinasRoutes = require("./routes/disciplinasRoutes");
const orientacaoRoutes = require("./routes/orientacaoRoutes");
const bancaRoutes = require("./routes/bancaRoutes");
const temasRoutes = require("./routes/temasRoutes");
const fichasRoutes = require("./routes/fichasRoutes");
const perguntasRoutes = require("./routes/perguntasRoutes");
const opcoesRoutes = require("./routes/opcoesRoutes");
const respostasRoutes = require("./routes/respostasRoutes");
const adminRoutes = require("./routes/adminRoutes");
const disciplinaHasDocentesRoutes = require("./routes/disciplinaHasDocentesRoutes");
const disciplinaHasDiscentesRoutes = require("./routes/disciplinaHasDiscentesRoutes");
const DocentesHasComissaoAutoavaliadorasRoutes = require("./routes/DocentesHasComissaoAutoavaliadorasRoutes");

require("./database");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));
app.use("/api/users/docentes", docentesRoutes);
app.use("/api/users/discentes", discentesRoutes);
app.use("/api/users/taes", taeRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/secretarias", secretariaRoutes);
app.use("/api/comissao", comissaoRoutes);
app.use("/api/disciplinas", disciplinasRoutes);
app.use("/api/disciplinaHasDocentes", disciplinaHasDocentesRoutes);
app.use("/api/disciplinaHasDiscentes", disciplinaHasDiscentesRoutes);
// app.use('/api/DocentesHasComissaoAutoavaliadoras', DocentesHasComissaoAutoavaliadorasRoutes);
app.use("/api/orientacao", orientacaoRoutes);
app.use("/api/banca", bancaRoutes);
app.use("/api/temas", temasRoutes);
app.use("/api/fichas", fichasRoutes);
app.use("/api/perguntas", perguntasRoutes);
app.use("/api/opcoes", opcoesRoutes);
app.use("/api/respostas", respostasRoutes);
app.use("/api/admin", adminRoutes);
app.use("/", (req, res) => {
  res.send("BEM VINDO!");
});

//error middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({
    message: error.message || "An unknown error occurred! (api routes) ",
  });
});

module.exports = app;

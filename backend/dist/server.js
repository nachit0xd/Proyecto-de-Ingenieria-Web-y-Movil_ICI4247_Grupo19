"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno
dotenv_1.default.config();
const auth_1 = __importDefault(require("./routes/auth"));
const comunidad_1 = __importDefault(require("./routes/comunidad"));
const eventos_1 = __importDefault(require("./routes/eventos"));
const fondos_1 = __importDefault(require("./routes/fondos"));
const transparencia_1 = __importDefault(require("./routes/transparencia"));
const fichas_1 = __importDefault(require("./routes/fichas"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
// Crear la aplicación Express
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Ruta de prueba
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});
// Registrar rutas
app.use('/api/auth', auth_1.default);
app.use('/api/comunidad', comunidad_1.default);
app.use('/api/eventos', eventos_1.default);
app.use('/api/fondos', fondos_1.default);
app.use('/api/transparencia', transparencia_1.default);
app.use('/api/fichas', fichas_1.default);
app.use('/api/dashboard', dashboard_1.default);
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

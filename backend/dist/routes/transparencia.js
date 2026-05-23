"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /api/transparencia/kpis: Obtener KPIs de transparencia
router.get('/kpis', async (req, res) => {
    try {
        // En un contexto real, estos datos vendrían de la base de datos o de un servicio externo (POR IMPLEMENTAR)
        const kpis = {
            ejecucionPresupuestaria: "85%",
            ejecucionMeta: "Meta: 90%",
            tasaAprobacion: "65%",
            tasaAprobacionMeta: "Meta: 70%",
            tiempoRespuesta: "12 días",
            tiempoRespuestaMeta: "Meta: < 15 días",
            participacionCiudadana: "+2,450",
            participacionMeta: "Votos este mes"
        };
        res.json(kpis);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener KPIs' });
    }
});
exports.default = router;

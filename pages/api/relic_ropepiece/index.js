import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        if (req.query.action === "get-relic-sets") {
            const [rows] = await pool.query("SELECT id, rope FROM Relic_Set");
            res.status(200).json(rows);
        } else {
            const [rows] = await pool.query("SELECT * FROM Relic_Linkrope");
            res.status(200).json(rows);
        }
        break;

      case "POST":
        const { id, main_stat, main_stat_num, substat_1, substat_1_num, substat_2, substat_2_num, substat_3, substat_3_num, substat_4, substat_4_num, Relic_Set_id } = req.body;
        await pool.query("INSERT INTO Relic_Linkrope VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
          id, main_stat, main_stat_num, substat_1, substat_1_num, substat_2, substat_2_num, substat_3, substat_3_num, substat_4, substat_4_num, Relic_Set_id
        ]);
        res.status(201).json({ message: "Relic Linkrope added successfully" });
        break;

      case "PUT":
        const { id: updateId } = req.body;
        await pool.query(
          "UPDATE Relic_Linkrope SET main_stat=?, main_stat_num=?, substat_1=?, substat_1_num=?, substat_2=?, substat_2_num=?, substat_3=?, substat_3_num=?, substat_4=?, substat_4_num=?, Relic_Set_id=? WHERE id=?",
          [req.body.main_stat, req.body.main_stat_num, req.body.substat_1, req.body.substat_1_num, req.body.substat_2, req.body.substat_2_num, req.body.substat_3, req.body.substat_3_num, req.body.substat_4, req.body.substat_4_num, req.body.Relic_Set_id, updateId]
        );
        res.status(200).json({ message: "Relic Linkrope updated successfully" });
        break;

      case "DELETE":
        const { id: deleteId } = req.query;
        await pool.query("DELETE FROM Relic_Linkrope WHERE id=?", [deleteId]);
        res.status(200).json({ message: "Relic Linkrope deleted successfully" });
        break;

      default:
        res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
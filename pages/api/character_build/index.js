import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        if (req.query.action === "get-characters") {
          const [characters] = await pool.query("SELECT id, name FROM Playable_Characters");
          res.status(200).json(characters);
        } else if (req.query.action === "get-relics") {
          const relics = {};
          const relicTables = [
            { key: "headpieces", table: "Relic_Headpiece" },
            { key: "handpieces", table: "Relic_Handpiece" },
            { key: "bodypieces", table: "Relic_Bodypiece" },
            { key: "feetpieces", table: "Relic_Feetpiece" },
            { key: "planarspheres", table: "Relic_Planarsphere" },
            { key: "linkropes", table: "Relic_Linkrope" },
          ];

          for (const { key, table } of relicTables) {
            const [rows] = await pool.query(`
              SELECT 
                ${table}.id, 
                Relic_Set.head AS relic_set_name,
                ${table}.main_stat, 
                ${table}.main_stat_num, 
                ${table}.substat_1, 
                ${table}.substat_1_num, 
                ${table}.substat_2, 
                ${table}.substat_2_num, 
                ${table}.substat_3, 
                ${table}.substat_3_num, 
                ${table}.substat_4, 
                ${table}.substat_4_num
              FROM ${table}
              LEFT JOIN Relic_Set 
              ON ${table}.Relic_Set_id = Relic_Set.id
            `);
            relics[key] = rows.map((relic) => ({
              id: relic.id,
              name: relic.relic_set_name,
              details: {
                mainStat: relic.main_stat,
                mainStatNum: relic.main_stat_num,
                substats: [
                  { name: relic.substat_1, value: relic.substat_1_num },
                  { name: relic.substat_2, value: relic.substat_2_num },
                  { name: relic.substat_3, value: relic.substat_3_num },
                  { name: relic.substat_4, value: relic.substat_4_num },
                ].filter((substat) => substat.name), // Exclude empty substats
              },
            }));
          }

          console.log("Relics response:", relics);
          res.status(200).json(relics);
        }
        break;

      case "POST":
        const {
          id,
          Playable_Characters_id,
          Relic_Headpiece_id,
          Relic_Handpiece_id,
          Relic_Bodypiece_id,
          Relic_Feetpiece_id,
          Relic_Planarsphere_id,
          Relic_Linkrope_id,
        } = req.body;
        await pool.query(
          "INSERT INTO Character_Build VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            id,
            Playable_Characters_id,
            Relic_Headpiece_id,
            Relic_Handpiece_id,
            Relic_Bodypiece_id,
            Relic_Feetpiece_id,
            Relic_Planarsphere_id,
            Relic_Linkrope_id,
          ]
        );
        res.status(201).json({ message: "Character Build added successfully" });
        break;

      case "PUT":
        const { id: updateId } = req.body;
        await pool.query(
          `UPDATE Character_Build SET 
            Playable_Characters_id=?,
            Relic_Headpiece_id=?,
            Relic_Handpiece_id=?,
            Relic_Bodypiece_id=?,
            Relic_Feetpiece_id=?,
            Relic_Planarsphere_id=?,
            Relic_Linkrope_id=? 
          WHERE id=?`,
          [
            req.body.Playable_Characters_id,
            req.body.Relic_Headpiece_id,
            req.body.Relic_Handpiece_id,
            req.body.Relic_Bodypiece_id,
            req.body.Relic_Feetpiece_id,
            req.body.Relic_Planarsphere_id,
            req.body.Relic_Linkrope_id,
            updateId,
          ]
        );
        res.status(200).json({ message: "Character Build updated successfully" });
        break;

      case "DELETE":
        const { id: deleteId } = req.query;
        await pool.query("DELETE FROM Character_Build WHERE id=?", [deleteId]);
        res.status(200).json({ message: "Character Build deleted successfully" });
        break;

      default:
        res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

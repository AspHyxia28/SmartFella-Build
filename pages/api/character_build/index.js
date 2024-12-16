import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "relic",
});

async function getCharacterBuilds(req, res) {
  const query = `
    SELECT 
      cb.id,
      pc.id AS Playable_Characters_id,
      pc.name AS character_name,
      cb.Relic_Headpiece_id,
      rh.main_stat AS headpiece_stat,
      cb.Relic_Handpiece_id,
      rha.main_stat AS handpiece_stat,
      cb.Relic_Bodypiece_id,
      rb.main_stat AS bodypiece_stat,
      cb.Relic_Feetpiece_id,
      rf.main_stat AS feetpiece_stat,
      cb.Relic_Planarsphere_id,
      rp.main_stat AS planarsphere_stat,
      cb.Relic_Linkrope_id,
      rl.main_stat AS linkrope_stat
    FROM Character_Build cb
    LEFT JOIN Playable_Characters pc ON cb.Playable_Characters_id = pc.id
    LEFT JOIN Relic_Headpiece rh ON cb.Relic_Headpiece_id = rh.id
    LEFT JOIN Relic_Handpiece rha ON cb.Relic_Handpiece_id = rha.id
    LEFT JOIN Relic_Bodypiece rb ON cb.Relic_Bodypiece_id = rb.id
    LEFT JOIN Relic_Feetpiece rf ON cb.Relic_Feetpiece_id = rf.id
    LEFT JOIN Relic_Planarsphere rp ON cb.Relic_Planarsphere_id = rp.id
    LEFT JOIN Relic_Linkrope rl ON cb.Relic_Linkrope_id = rl.id
  `;

  try {
    const [rows] = await pool.query(query);
    console.log("Fetched Character Builds:", rows); // Debug log
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching character builds:", error);
    res.status(500).json({ message: "Failed to fetch character builds" });
  }
}

// Fetch Characters
async function getCharacters(req, res) {
  const [rows] = await pool.query(`SELECT id, name FROM Playable_Characters`);
  res.status(200).json(rows);
}

// Fetch Relics grouped by type
async function getRelics(req, res) {
  const relicTypes = [
    "Relic_Headpiece",
    "Relic_Handpiece",
    "Relic_Bodypiece",
    "Relic_Feetpiece",
    "Relic_Planarsphere",
    "Relic_Linkrope",
  ];

  const relics = {};
  for (const type of relicTypes) {
    const [rows] = await pool.query(
      `SELECT * FROM ${type} LEFT JOIN Relic_Set ON ${type}.Relic_Set_id = Relic_Set.id`
    );
    relics[`${type.toLowerCase()}s`] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      details: {
        mainStat: row.main_stat,
        mainStatNum: row.main_stat_num,
        substats: [
          { name: row.substat_1, value: row.substat_1_num },
          { name: row.substat_2, value: row.substat_2_num },
          { name: row.substat_3, value: row.substat_3_num },
          { name: row.substat_4, value: row.substat_4_num },
        ],
      },
    }));
  }
  res.status(200).json(relics);
}

// Create or Update Character Build
async function saveCharacterBuild(req, res) {
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

  try {
    if (req.method === "POST") {
      await pool.query(
        `INSERT INTO Character_Build (Playable_Characters_id, Relic_Headpiece_id, Relic_Handpiece_id, Relic_Bodypiece_id, Relic_Feetpiece_id, Relic_Planarsphere_id, Relic_Linkrope_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          Playable_Characters_id,
          Relic_Headpiece_id || null,
          Relic_Handpiece_id || null,
          Relic_Bodypiece_id || null,
          Relic_Feetpiece_id || null,
          Relic_Planarsphere_id || null,
          Relic_Linkrope_id || null,
        ]
      );
      res.status(201).json({ message: "Character build created successfully" });
    } else if (req.method === "PUT") {
      await pool.query(
        `UPDATE Character_Build SET Playable_Characters_id = ?, Relic_Headpiece_id = ?, Relic_Handpiece_id = ?, Relic_Bodypiece_id = ?, Relic_Feetpiece_id = ?, Relic_Planarsphere_id = ?, Relic_Linkrope_id = ? 
        WHERE id = ?`,
        [
          Playable_Characters_id,
          Relic_Headpiece_id || null,
          Relic_Handpiece_id || null,
          Relic_Bodypiece_id || null,
          Relic_Feetpiece_id || null,
          Relic_Planarsphere_id || null,
          Relic_Linkrope_id || null,
          id,
        ]
      );
      res.status(200).json({ message: "Character build updated successfully" });
    }
  } catch (error) {
    console.error("Error saving character build:", error);
    res.status(500).json({ message: "Failed to save character build" });
  }
}

// Delete Character Build
async function deleteCharacterBuild(req, res) {
  const { id } = req.query;
  try {
    await pool.query(`DELETE FROM Character_Build WHERE id = ?`, [id]);
    res.status(200).json({ message: "Character build deleted successfully" });
  } catch (error) {
    console.error("Error deleting character build:", error);
    res.status(500).json({ message: "Failed to delete character build" });
  }
}

// API Handler
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const action = req.query.action;
      if (action === "get-characters") {
        await getCharacters(req, res);
      } else if (action === "get-relics") {
        await getRelics(req, res);
      } else {
        await getCharacterBuilds(req, res);
      }
    } else if (req.method === "POST" || req.method === "PUT") {
      await saveCharacterBuild(req, res);
    } else if (req.method === "DELETE") {
      await deleteCharacterBuild(req, res);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
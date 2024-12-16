import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      const [rows] = await pool.query("SELECT * FROM Relic_Set");
      res.status(200).json(rows);
      break;

    case "POST":
      const { id, name, head, hands, body, feet, sphere, rope } = req.body;
      await pool.query("INSERT INTO Relic_Set VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
        id, name, head, hands, body, feet, sphere, rope,
      ]);
      res.status(201).json({ message: "Relic Set added successfully" });
      break;

    case "PUT":
      const { id: updateId } = req.body;
      await pool.query(
        "UPDATE Relic_Set SET name=?, head=?, hands=?, body=?, feet=?, sphere=?, rope=? WHERE id=?",
        [req.body.name, req.body.head, req.body.hands, req.body.body, req.body.feet, req.body.sphere, req.body.rope, updateId]
      );
      res.status(200).json({ message: "Relic Set updated successfully" });
      break;

    case "DELETE":
      const { id: deleteId } = req.query;
      await pool.query("DELETE FROM Relic_Set WHERE id=?", [deleteId]);
      res.status(200).json({ message: "Relic Set deleted successfully" });
      break;

    default:
      res.status(405).json({ message: `Method ${method} not allowed` });
  }
}

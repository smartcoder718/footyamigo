function upsertPeakOdds(fields = [], items = []) {
  //fields.sort()
  const insert_sql = fields.join(",");
  const value_items = items.map(item => {
    const values = [];
    fields.forEach(field => {
      values.push(item[field] || "NULL");
    });
    return `(${values.join(",")})`;
  });
  const values_sql = value_items.join(",");
  const safe_fields = fields.filter(x => x != "id" && x != "fixture_id");
  const update_items = safe_fields.map(field => {
    return `${field} = GREATEST(
      COALESCE(${field}, 0),
      VALUES(${field})
    )`;
  });
  const items_sql = update_items.join(",");
  const query = `
  INSERT INTO odds (
      ${insert_sql}
    )
  VALUES ${values_sql} ON DUPLICATE KEY
  UPDATE ${items_sql}
  `;
  //const odds = await sequelize.query(query);
  return query;
}

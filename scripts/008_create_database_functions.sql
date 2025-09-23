-- Function to execute raw SQL (for creating tables dynamically)
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to rename tables
CREATE OR REPLACE FUNCTION rename_table(old_name TEXT, new_name TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I RENAME TO %I', old_name, new_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to drop table if exists
CREATE OR REPLACE FUNCTION drop_table_if_exists(table_name TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if table exists
CREATE OR REPLACE FUNCTION table_exists(table_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

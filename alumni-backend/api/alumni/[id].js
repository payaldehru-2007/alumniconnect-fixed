const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://uzgzetsuxbwwibcklpea.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Z3pldHN1eGJ3d2liY2tscGVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDAyMzU4OSwiZXhwIjoyMDk1NTk5NTg5fQ.XOqVUGBV1T9Mp6MsUsVqy8PpoMqldv3XQsFoES5aFEI'
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('alumni')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ message: 'Alumni not found' });
    return res.json({ alumni: data });
  }

  if (req.method === 'PUT') {
    const { data, error } = await supabase
      .from('alumni')
      .update(req.body)
      .eq('id', id);

    if (error) return res.status(400).json({ message: error.message });
    return res.json({ message: 'Alumni updated!' });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('alumni')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ message: error.message });
    return res.json({ message: 'Alumni deleted!' });
  }

  res.status(405).json({ message: 'Method not allowed' });
};
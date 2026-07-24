import supabase from '../supabase.js';

export async function salvarMemoria(memoria) {
  const { data, error } = await supabase
    .from('memoria_cliente')
    .insert([memoria])
    .select()
    .single();

  if (error) throw error;

  return data;
}


export async function buscarMemorias(cliente_id) {
  const { data, error } = await supabase
    .from('memoria_cliente')
    .select('*')
    .eq('cliente_id', cliente_id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}
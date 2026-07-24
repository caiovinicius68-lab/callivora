import supabase from '../supabase.js';


export async function salvarConversa(conversa) {
  const { data, error } = await supabase
    .from('conversas')
    .insert([conversa])
    .select()
    .single();

  if (error) throw error;

  return data;
}


export async function buscarConversas(cliente_id) {
  const { data, error } = await supabase
    .from('conversas')
    .select('*')
    .eq('cliente_id', cliente_id)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data;
}
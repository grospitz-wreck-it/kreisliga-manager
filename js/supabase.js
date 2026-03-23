// =========================
// 🔌 SUPABASE CLIENT (SAFE GLOBAL)
// =========================

if(!window.supabaseClient){

  const SUPABASE_URL = "https://kckwxggzoenybssryaqr.supabase.co";
  const SUPABASE_KEY = "sb_publishable_SJS03utwmfMRDO2kISTv3A_vIIk6DsSYY";

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  console.log("✅ Supabase Client erstellt");

} else {
  console.log("ℹ️ Supabase bereits vorhanden");
}

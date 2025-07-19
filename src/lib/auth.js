import supabase from "./supabase";

// SIGN UP
export async function signUpUser(email, password, username = "") {
  let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  console.log('Auth signup successful:', data);

  if (data?.user) {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData?.session) {
      console.log('No active session yet - profile will be created on first sign in');
      return data;
    }

    const displayName = username || email.split("@")[0];

    // ✅ Use upsert to avoid duplicate key error
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: data.user.id,
        username: displayName,
        avatar_url: null
      }, {
        onConflict: ['id']
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError);
    } else {
      console.log("Profile created successfully", profileData);
    }
  }

  return data;
}

// SIGN IN
export async function signInUser(email, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) throw error;

  if (data?.user) {
    try {
      const profile = await getUserProfile(data.user.id);
      return { ...data, profile };
    } catch (profileError) {
      console.error('Error with profile during signin:', profileError);
      throw profileError;
    }
  }

  return data;
}

// GET OR CREATE USER PROFILE
export async function getUserProfile(userId) {
  const { data: sessionData } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from('users')
    .select("*")
    .eq("id", userId)
    .single();

  // if user doesn't exist, create a new one
  if (error && error.code === "PGRST116") {
    console.log('No profile found, attempting to create one for user:', userId);

    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user.email;
    const defaultUsername = email ? email.split("@")[0] : `user_${Date.now()}`;

    // ✅ Use upsert to avoid duplicate key error
    const { data: newProfile, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        username: defaultUsername,
        avatar_url: null
      }, {
        onConflict: ['id']
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError);
      throw profileError;
    } else {
      console.log("Profile created successfully", newProfile);
    }

    return newProfile;
  }

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data;
}

// AUTH STATE CHANGE LISTENER
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null, event);
  });

  return () => data.subscription.unsubscribe();
}

// SIGN OUT
export async function signOut() {
  await supabase.auth.signOut();
}

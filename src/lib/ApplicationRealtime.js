// lib/ApplicationRealtime.js
import { useEffect } from 'react';
import supabase from './supabase';
import toast from 'react-hot-toast';

const useApplicationRealtime = ({ onNewApplication }) => {
  useEffect(() => {
    if (!onNewApplication) return;

    const subscription = supabase
      .channel('applications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'applications',
        },
        async (payload) => {
          // Fetch complete application data with job and user details
          const { data, error } = await supabase
            .from('applications')
            .select(`
              *,
              job:jobs(*),
              user:users(*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            onNewApplication(data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [onNewApplication]);
};

export default useApplicationRealtime;
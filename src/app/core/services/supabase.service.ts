import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { environment } from "src/environments/environment";
import { Profile } from 'src/app/core/models/profile.model';
import { Box } from '../models/box.model';
import { Search } from '../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseClient: SupabaseClient

  constructor() { 
    this.supabaseClient = createClient(environment.supabaseUrl, environment.supbaseKey);
  }

  get user() {
    return this.supabaseClient.auth.user();
  }

  get session() {
    return this.supabaseClient.auth.session();
  }

  get profile() {
    return this.supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', this.user?.id)
      .single();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabaseClient.auth.onAuthStateChange(callback);
  }

  signUp(email: string, password: string) {
    return this.supabaseClient.auth.signUp({ email, password });
  }

  signIn(email: string, password: string) {
    return this.supabaseClient.auth.signIn({ email, password });
  }

  signOut() {
    return this.supabaseClient.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      id: this.user?.id,
      updated_at: new Date()
    }

    return this.supabaseClient.from('profiles').upsert(update, {
      returning: 'minimal'
    });
  }

  searchBoxes(search: Search) {
    return this.supabaseClient
      .rpc('search_boxes', {
        hasimage: search.hasImage,
        minamount: search.minAmount,
        maxamount: search.maxAmount,
        minwidth: search.minWidth,
        maxwidth: search.maxWidth,
        minheight: search.minHeight,
        maxheight: search.maxHeight,
        minlength: search.minLength,
        maxlength: search.maxLength,
        lat: search.lat, 
        lng: search.lng, 
        radius: search.radius 
      });
  }
  
  addBox(box: Box) {
    const update = {
      ...box,
      updated_at: new Date(),
      created_at: new Date(),
    }

    return this.supabaseClient.from('boxes').upsert(update, {
      returning: 'minimal'
    });
  }

  uploadBoxImage(filePath: string, file: File) {
    return this.supabaseClient
      .storage
      .from('boxes')
      .upload(filePath, file);
  }

  downloadBoxImage(path: string) {
    return this.supabaseClient.storage.from('boxes').download(path);
  }
}

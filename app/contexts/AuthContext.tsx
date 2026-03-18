import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

const BYPASS_SOCIAL_AUTH = !isSupabaseConfigured;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleConfigured, setGoogleConfigured] = useState(false);

  useEffect(() => {
    if (BYPASS_SOCIAL_AUTH) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      const { session } = data;
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setMockSession = (provider: 'apple' | 'google') => {
    const now = Math.floor(Date.now() / 1000);
    const mock = {
      access_token: `mock-${provider}-${now}`,
      token_type: 'bearer',
      expires_in: 60 * 60 * 24 * 365,
      expires_at: now + 60 * 60 * 24 * 365,
      refresh_token: `mock-refresh-${provider}-${now}`,
      user: {
        id: `mock-${provider}-user`,
        aud: 'authenticated',
        role: 'authenticated',
        email: `mock-${provider}@example.com`,
        app_metadata: { provider, providers: [provider] },
        user_metadata: { full_name: `Mock ${provider} user` },
        created_at: new Date().toISOString(),
      },
    } as unknown as Session;
    setSession(mock);
  };

  const signInWithGoogle = async () => {
    if (BYPASS_SOCIAL_AUTH) {
      setMockSession('google');
      return;
    }
    try {
      // Lazy-load Google Sign-In. Importing it in Expo Go will crash because
      // the native module isn't present unless you're using a dev build.
      // We only require it when real auth is enabled.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { GoogleSignin } = require('@react-native-google-signin/google-signin') as any;

      if (!googleConfigured) {
        GoogleSignin.configure({
          iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
        });
        setGoogleConfigured(true);
      }

      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token from Google Sign-In');
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;
    } catch (error: any) {
      // Don't throw if user cancelled
      if (error?.code === 'SIGN_IN_CANCELLED') return;
      throw error;
    }
  };

  const signInWithApple = async () => {
    if (BYPASS_SOCIAL_AUTH) {
      setMockSession('apple');
      return;
    }
    const nonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Crypto.getRandomBytes(32).toString()
    );

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce,
    });

    if (!credential.identityToken) {
      throw new Error('No identity token from Apple Sign-In');
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
      nonce,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    if (BYPASS_SOCIAL_AUTH) {
      setSession(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signInWithGoogle,
        signInWithApple,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

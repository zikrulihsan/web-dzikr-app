# Gmail Authentication Setup Guide

This guide will help you set up Gmail (Google) authentication for the Web Dzikr App.

## Overview

The app uses **NextAuth.js** with Google OAuth provider to enable users to sign in with their Gmail accounts.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Web Dzikr App")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" as the User Type
3. Click "Create"
4. Fill in the required information:
   - **App name**: Web Dzikr App
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click "Save and Continue"
6. On the Scopes page, click "Save and Continue" (default scopes are fine)
7. On Test users page, add your email if in testing mode
8. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Enter a name (e.g., "Web Dzikr App Client")
5. Add Authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: Your production URL (e.g., `https://your-domain.com`)
6. Add Authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://your-domain.com/api/auth/callback/google`
7. Click "Create"
8. **Copy the Client ID and Client Secret** (you'll need these next)

## Step 5: Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Update the following variables with your credentials:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-from-step-4
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-4
```

### Generating NEXTAUTH_SECRET

Generate a secure random string for `NEXTAUTH_SECRET` using one of these methods:

**Option 1: Using OpenSSL (Linux/Mac)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
Visit [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

## Step 6: Update NEXTAUTH_URL for Production

When deploying to production, update the `NEXTAUTH_URL` in your environment variables:

- **Netlify**: Set environment variables in Site settings > Build & deploy > Environment
- **Vercel**: Set environment variables in Project Settings > Environment Variables

```env
NEXTAUTH_URL=https://your-production-domain.com
```

## Step 7: Test the Authentication

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)
3. Click the "Sign in with Google" button
4. Sign in with your Google account
5. You should be redirected back to the app and see your profile information

## Troubleshooting

### "redirect_uri_mismatch" Error

This means your redirect URI doesn't match what's configured in Google Cloud Console.

**Solution**: Make sure the redirect URI in Google Cloud Console exactly matches:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain.com/api/auth/callback/google`

### "invalid_client" Error

This means your Client ID or Client Secret is incorrect.

**Solution**: Double-check that you copied the credentials correctly from Google Cloud Console to `.env.local`

### App Not Loading / NextAuth Error

**Solution**: Make sure:
1. You've set `NEXTAUTH_SECRET` in `.env.local`
2. Your `.env.local` file is in the project root
3. You've restarted the dev server after adding environment variables

### Sign In Button Not Working

**Solution**: Check the browser console for errors. Common issues:
- Missing environment variables
- Google OAuth credentials not configured properly
- Network issues

## Security Notes

1. **Never commit `.env.local`** to version control (it's already in `.gitignore`)
2. **Keep your Client Secret private** - don't share it publicly
3. **Use different credentials** for development and production
4. **Regularly rotate** your NEXTAUTH_SECRET and OAuth credentials

## Features

Once authenticated, users can:
- Sign in with their Gmail account
- See their profile picture and name in the header
- Sign out when done
- Their session persists across page refreshes

## Next Steps

Consider adding these features:
- Sync user progress to a database (Firebase, Supabase, PostgreSQL)
- Add protected routes that require authentication
- Store user preferences in the cloud
- Enable social features (sharing progress, leaderboards, etc.)

## Support

For issues with:
- **NextAuth**: [NextAuth.js Documentation](https://next-auth.js.org/)
- **Google OAuth**: [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

---

Built with NextAuth.js and Google OAuth 2.0

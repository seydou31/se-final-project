# Environment Setup Guide

This guide explains how to set up environment variables for both the frontend and backend of the BaeQuest application.

## ⚠️ Security Warning

**NEVER commit `.env` files to git!** These files contain sensitive credentials and API keys.

Both frontend and backend have `.gitignore` files configured to exclude `.env` files from version control.

---

## Frontend Environment Setup

### Location
`baequest/.env`

### Required Variables

```bash
# Google OAuth Configuration
# Get from: https://console.cloud.google.com/apis/credentials
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Google Analytics (optional)
VITE_GA_TRACKING_ID=your_google_analytics_tracking_id_here
```

### Setup Steps

1. **Copy the example file:**
   ```bash
   cd baequest
   cp .env.example .env
   ```

2. **Get Google OAuth Client ID:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Select your project (or create a new one)
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)
   - Copy the Client ID and paste it into `.env`

3. **Get Google Analytics ID (optional):**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a property for your app
   - Copy the Measurement ID (starts with G-) and paste it into `.env`

4. **Verify the file is ignored:**
   ```bash
   git status  # Should NOT show .env file
   ```

---

## Backend Environment Setup

### Location
`baequest-server/.env`

### Required Variables

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/baequest

# JWT Secret (generate a strong random string)
JWT_SECRET=your_jwt_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@baequests.com

# AWS S3 (for profile pictures)
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=baequest-profile-pictures

# Frontend URL (for CORS and password reset links)
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=3001

# Node Environment
NODE_ENV=development
```

### Setup Steps

1. **JWT Secret:**
   Generate a strong random secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output and use it as `JWT_SECRET`

2. **Google Places API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/library)
   - Enable "Places API" and "Geocoding API"
   - Go to [Credentials](https://console.cloud.google.com/apis/credentials)
   - Create an API Key
   - Restrict the key to only Places API and Geocoding API
   - Copy the key and paste it as `GOOGLE_PLACES_API_KEY`

3. **SendGrid:**
   - Sign up at [SendGrid](https://sendgrid.com/)
   - Create an API key
   - Verify a sender email address
   - Set `SENDGRID_API_KEY` and `FROM_EMAIL`

4. **AWS S3:**
   - Create an S3 bucket for profile pictures
   - Create an IAM user with S3 access
   - Generate access keys
   - Set the AWS credentials in `.env`

5. **MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` with your connection string

---

## Production Environment

### Security Best Practices

1. **Use Environment-Specific Files:**
   - `.env.development` - local development
   - `.env.production` - production deployment
   - Never commit any of these to git

2. **Rotate Credentials Regularly:**
   - JWT secrets should be rotated periodically
   - API keys should be rotated if compromised
   - Use different credentials for development and production

3. **Use Strong Secrets:**
   - JWT secrets should be at least 64 characters
   - Use cryptographically secure random generation
   - Never use simple passwords or predictable strings

4. **Restrict API Keys:**
   - Google API keys should have IP/domain restrictions
   - AWS IAM users should have minimal permissions
   - SendGrid keys should have limited scopes

5. **Environment Variables in Production:**
   - Use your hosting provider's environment variable settings
   - Examples:
     - **Vercel/Netlify**: Project Settings → Environment Variables
     - **Heroku**: Config Vars
     - **AWS**: Parameter Store or Secrets Manager
     - **Docker**: Use `--env-file` or orchestration secrets

---

## Verification

### Frontend
```bash
cd baequest
npm run dev
# Should start without errors
# Google OAuth login should work
```

### Backend
```bash
cd baequest-server
npm start
# Should connect to MongoDB
# Should not show any "undefined" environment variable warnings
```

---

## Troubleshooting

### "VITE_GOOGLE_CLIENT_ID is undefined"
- Make sure your `.env` file exists in the `baequest/` directory
- Make sure variable names start with `VITE_`
- Restart the dev server after creating/modifying `.env`

### "JWT_SECRET is not defined"
- Make sure `.env` file exists in `baequest-server/` directory
- Check that there are no spaces around the `=` sign
- Restart the backend server

### "Google OAuth not working"
- Verify the Client ID is correct
- Check that localhost:5173 is in authorized JavaScript origins
- Clear browser cache and cookies
- Make sure you're using the web application credentials, not mobile/desktop

### ".env file showing in git status"
- Make sure `.gitignore` includes `.env`
- Run `git rm --cached .env` to untrack it
- Commit the `.gitignore` change

---

## What NOT to Do

❌ **Don't commit `.env` files** - They contain secrets
❌ **Don't share `.env` files** - Even in private messages
❌ **Don't hardcode credentials** - Always use environment variables
❌ **Don't use the same credentials** - Use different keys for dev/prod
❌ **Don't commit API keys in code** - They should only be in `.env`

## What TO Do

✅ **Use `.env.example`** - Commit this as a template (without real values)
✅ **Document required variables** - List them in this guide
✅ **Use strong secrets** - Generate them cryptographically
✅ **Restrict API keys** - Limit permissions and access
✅ **Rotate credentials** - Change them periodically and when compromised

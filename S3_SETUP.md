# S3 Storage Setup Guide

## Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory and fill in your Hitachi S3 credentials:

```bash
PORT=3001

# S3 Configuration (Hitachi Storage)
S3_ENDPOINT=https://your-hitachi-endpoint.com
S3_ACCESS_KEY=your-access-key-here
S3_SECRET_KEY=your-secret-key-here
S3_BUCKET=kulkas-images
S3_REGION=us-east-1
# Optional - only needed if public URL differs from endpoint
# S3_PUBLIC_URL=https://your-public-url.com
```

**Note**: `S3_PUBLIC_URL` is optional. Jika tidak diisi, akan otomatis menggunakan `S3_ENDPOINT`.

## How It Works

### File Upload Flow
1. User selects file in Admin Dashboard
2. File is uploaded to backend `/api/upload/file`
3. Backend uploads to S3 using AWS SDK
4. S3 URL is returned and saved to database

### URL Upload Flow
1. User enters image URL in Admin Dashboard
2. URL is sent to backend `/api/upload/url`
3. Backend downloads the image
4. Backend uploads to S3
5. S3 URL is returned and saved to database

## Testing

1. **Create `.env` file** in `backend/` with your credentials
2. **Restart backend**: `npm run dev`
3. **Open Admin Dashboard**: Click top-left corner, password `admin123`
4. **Test File Upload**: Choose "Upload" mode, select an image
5. **Test URL Upload**: Choose "URL" mode, paste an image URL

All images will be stored in your Hitachi S3 bucket!

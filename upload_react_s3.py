import os
import subprocess
import mimetypes

bucket = 'spb-tickets-ru'
dist_dir = 'dist'

print(f"Uploading React App dist/ to S3 bucket {bucket}...")
for root, dirs, files in os.walk(dist_dir):
    for f in files:
        full_path = os.path.join(root, f)
        rel_path = os.path.relpath(full_path, dist_dir).replace('\\', '/')
        s3_key = rel_path
        
        content_type, _ = mimetypes.guess_type(full_path)
        if not content_type:
            if f.endswith('.woff2'): content_type = 'font/woff2'
            elif f.endswith('.woff'): content_type = 'font/woff'
            elif f.endswith('.js'): content_type = 'application/javascript'
            elif f.endswith('.css'): content_type = 'text/css'
            elif f.endswith('.html'): content_type = 'text/html; charset=utf-8'
            else: content_type = 'application/octet-stream'
        elif content_type.startswith('text/') or 'javascript' in content_type:
            content_type += '; charset=utf-8'

        cache_control = 'no-cache, no-store, must-revalidate'
        if rel_path.startswith('assets/'):
            cache_control = 'public, max-age=31536000, immutable'

        cmd = [
            'yc', 'storage', 's3api', 'put-object',
            '--bucket', bucket,
            '--key', s3_key,
            '--body', full_path,
            '--content-type', content_type,
            '--cache-control', cache_control
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error uploading {s3_key}: {res.stderr}")
        else:
            print(f"Uploaded: {s3_key} (cache: {cache_control})")

print("React app uploaded to S3 successfully with cache-control headers!")

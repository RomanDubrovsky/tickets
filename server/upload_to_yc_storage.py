import os
import mimetypes
import boto3
from dotenv import load_dotenv

load_dotenv('c:/Prevention_V3/.env')

access_key = os.getenv('YC_STORAGE_ACCESS_KEY')
secret_key = os.getenv('YC_STORAGE_SECRET_KEY')
bucket_name = 'spb-tickets-ru'

session = boto3.session.Session()
s3 = session.client(
    service_name='s3',
    endpoint_url='https://storage.yandexcloud.net',
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)

dist_dir = 'c:/Ships/dist'

for root, dirs, files in os.walk(dist_dir):
    for file in files:
        full_path = os.path.join(root, file)
        rel_path = os.path.relpath(full_path, dist_dir).replace('\\', '/')
        content_type, _ = mimetypes.guess_type(full_path)
        if not content_type:
            if file.endswith('.js'):
                content_type = 'application/javascript'
            elif file.endswith('.css'):
                content_type = 'text/css'
            elif file.endswith('.html'):
                content_type = 'text/html'
            else:
                content_type = 'application/octet-stream'

        print(f"Uploading {rel_path} -> s3://{bucket_name}/{rel_path} ({content_type})")
        with open(full_path, 'rb') as data:
            s3.put_object(
                Bucket=bucket_name,
                Key=rel_path,
                Body=data,
                ContentType=content_type,
                ACL='public-read'
            )

print("\n--- Upload to Yandex Object Storage Completed! ---")

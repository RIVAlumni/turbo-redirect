export GCP_REGION="asia-southeast1"
export PROJECT_NAME="turboredirect"
export PROJECT_ID=$(gcloud config get-value project)

export IMAGE_NAME="server-service"
export IMAGE_TAG="latest"

gcloud services enable \
  run.googleapis.com \
  storage.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com

gcloud config set run/region $GCP_REGION
gcloud config set artifact/location $GCP_REGION

gcloud builds submit --tag ${GCP_REGION}-docker.pkg.dev/${PROJECT_ID}/${PROJECT_NAME}/${IMAGE_NAME}:${IMAGE_TAG}
gcloud run deploy $PROJECT_NAME \
  --cpu 2 \
  --memory 1024Mi \
  --platform managed \
  --concurrency 1000 \
  --min-instances 0 \
  --max-instances 2 \
  --timeout 60 \
  --use-http2 \
  --allow-unauthenticated \
  --region $GCP_REGION \
  --image ${GCP_REGION}-docker.pkg.dev/${PROJECT_ID}/${PROJECT_NAME}/${IMAGE_NAME}:${IMAGE_TAG}

gcloud run services list \
  --platform managed \
  --region $GCP_REGION

export RUN_URL=$(gcloud run services describe $PROJECT_NAME --platform managed --region $GCP_REGION --format="value(status.url)")

curl -vN --http2 $RUN_URL
# Change to the project directory
Set-Location -Path "C:\Users\vansh\Documents\stock-analysis-demo"

# Apply database Kubernetes files
# kubectl apply -f .\k8\database\databse_pvc.yaml  

# # Apply backend Kubernetes files
# kubectl apply -f .\k8\backend\backend.yaml

# helm install db .\k8Byhelm\db

helm install backend .\k8Byhelm\backend

# Apply frontend Kubernetes files
helm install frontend .\k8Byhelm\frontend

# Apply Prometheus and Alertmanager files if needed
helm install prometheus .\k8Byhelm\prometheus

# # apply grafana:
helm install grafana .\k8Byhelm\grafana

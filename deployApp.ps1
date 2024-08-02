# Change to the project directory
Set-Location -Path "C:\Users\vansh\Documents\stock-analysis-demo"

# Apply backend Kubernetes files
kubectl apply -f .\k8\backend\backend.yaml
# Apply database Kubernetes files
kubectl apply -f .\k8\database\databse_pvc.yaml  

# Apply frontend Kubernetes files
kubectl apply -f .\k8\frontend\frontend.yaml

#changeK8directory
cd k8
# Apply Prometheus and Alertmanager files if needed
helm install Prometheus1 prometheus

# apply grafana:
helm install grafana1 grafana

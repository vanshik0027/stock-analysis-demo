# Change to the project directory
Set-Location -Path "C:\Users\vansh\Documents\techincal stcok analysis demo"

# Apply backend Kubernetes files
kubectl apply -f .\k8\backend\backend.yaml
# Apply database Kubernetes files
kubectl apply -f .\k8\database\databse_pvc.yaml  

# Apply frontend Kubernetes files
kubectl apply -f .\k8\frontend\frontend.yaml

# Apply Prometheus and Alertmanager files if needed
helm install Prometheus prometheus-community/prometheus
helm install Alertmanager prometheus-community/alertmanager

# apply grafana:
helm install grafana grafana/grafana

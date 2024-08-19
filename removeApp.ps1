#Change to the project directory
Set-Location -Path "C:\Users\vansh\Documents\stock-analysis-demo"

# Delete backend Kubernetes resources
# kubectl delete -f .\k8\backend\backend.yaml
# # Delete database Kubernetes resources
# kubectl delete -f .\k8\database\databse_pvc.yaml  

# Delete frontend Kubernetes resources
helm uninstall frontend

helm uninstall backend

# helm uninstall db
# Uninstall Prometheus and Alertmanager
helm uninstall prometheus

# # Uninstall Grafana
helm uninstall grafana

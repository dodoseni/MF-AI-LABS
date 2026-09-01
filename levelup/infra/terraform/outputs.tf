output "search_endpoint" {
  value = "https://${azurerm_search_service.main.name}.search.windows.net"
}

output "search_admin_key" {
  value     = azurerm_search_service.main.primary_key
  sensitive = true
}

output "storage_account_name" {
  value = azurerm_storage_account.main.name
}

output "openai_endpoint" {
  value = "https://${azurerm_cognitive_account.openai.name}.openai.azure.com/"
}

output "openai_account_name" {
  value = azurerm_cognitive_account.openai.name
}

output "entra_client_id" {
  value = azuread_application.levelup.application_id
}

output "entra_client_secret" {
  value     = azuread_application_password.levelup.value
  sensitive = true
}

output "entra_tenant_id" {
  value = data.azurerm_client_config.current.tenant_id
}

data "azurerm_client_config" "current" {}

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }
}

provider "azurerm" {
  features {}
}

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

# ---------- Azure AI Search ----------

resource "azurerm_search_service" "main" {
  name                = var.search_service_name
  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location
  sku                 = "basic"
  partition_count     = 1
  replica_count       = 1
}

# ---------- Azure Blob Storage ----------

resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = data.azurerm_resource_group.main.name
  location                 = data.azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "documents" {
  name                  = "levelup-documents"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}

# ---------- Azure OpenAI ----------

resource "azurerm_cognitive_account" "openai" {
  name                = var.openai_account_name
  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location
  kind                = "OpenAI"
  sku_name            = "S0"
}

# ---------- Microsoft Entra ID App Registration ----------

resource "azuread_application" "levelup" {
  display_name = "LevelUp AI Assistant"
  sign_in_audience = "AzureADMyOrg"

  web {
    redirect_uris = ["${var.app_url}/auth/callback"]

    implicit_grant {
      id_token_issuance_enabled     = true
      access_token_issuance_enabled = true
    }
  }

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph

    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d" # User.Read
      type = "Scope"
    }
  }
}

resource "azuread_service_principal" "levelup" {
  application_id = azuread_application.levelup.application_id
}

resource "azuread_application_password" "levelup" {
  application_object_id = azuread_application.levelup.object_id
  display_name          = "LevelUp Secret"
  end_date              = "2027-12-31T00:00:00Z"
}

# ---------- Role assignments ----------

resource "azurerm_role_assignment" "search_indexer" {
  scope                = azurerm_storage_account.main.id
  role_definition_name = "Storage Blob Data Reader"
  principal_id         = azuread_service_principal.levelup.object_id
}

resource "azurerm_role_assignment" "search_contributor" {
  scope                = azurerm_search_service.main.id
  role_definition_name = "Search Index Data Contributor"
  principal_id         = azuread_service_principal.levelup.object_id
}
